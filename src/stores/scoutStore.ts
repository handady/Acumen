import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';
import { ScoutSessionState, ScoutSceneTheme, WildEventItem } from '../types';
import { initialScenes } from '../data/initialScenes';
import { initialWildEvents } from '../data/wildEventsPool';
import { useRuleStore } from './ruleStore';
import { useSettingsStore } from './settingsStore';
import { callLlmDiagnostic } from '../utils/aiClient';
import { parseDiagnosticOutput } from '../utils/parser';
import { fetchScenesApi, createSceneApi, deleteSceneApi, settleScoutSessionApi } from '../utils/api';

export const useScoutStore = defineStore('scout', () => {
  const ruleStore = useRuleStore();
  const settingsStore = useSettingsStore();

  // 场景列表持久化（清理旧版庞大 Base64 缓存，开箱即初始化为标准轻量列表）
  const savedScenes = localStorage.getItem('acumen_scout_scenes_v1');
  const hasHeavyBase64 = savedScenes && (savedScenes.includes('data:image') || savedScenes.length > 50000);
  const needsReset = !savedScenes || hasHeavyBase64 || savedScenes.includes('photo-1518495973542-4542c06a5843') || !savedScenes.includes('scene-study-desk');
  
  if (hasHeavyBase64) {
    console.log('[scoutStore] 检测到旧版本地巨大 Base64 场景缓存，已彻底清理释放空间！');
  }

  const scenes = ref<ScoutSceneTheme[]>(needsReset ? initialScenes : JSON.parse(savedScenes));
  if (needsReset) {
    localStorage.setItem('acumen_scout_scenes_v1', JSON.stringify(initialScenes));
  }

  function persistScenes() {
    localStorage.setItem('acumen_scout_scenes_v1', JSON.stringify(scenes.value));
  }

  // 异步从 SQLite 数据库拉取最新场景列表
  async function initScenesFromBackend() {
    try {
      const backendScenes = await fetchScenesApi();
      if (backendScenes && backendScenes.length > 0) {
        scenes.value = backendScenes;
        persistScenes();
      }
    } catch (err) {
      console.warn('[scoutStore] 从后端拉取场景失败:', err);
    }
  }

  initScenesFromBackend();

  // 每次派出是否随机挑选场景
  const randomSceneOnLaunch = ref<boolean>(
    localStorage.getItem('acumen_random_scene') !== 'false'
  );

  function setRandomScene(val: boolean) {
    randomSceneOnLaunch.value = val;
    localStorage.setItem('acumen_random_scene', val ? 'true' : 'false');
  }

  // 探针会话持久化
  const savedSession = localStorage.getItem('acumen_scout_session_v1');
  const session = ref<ScoutSessionState>(
    savedSession
      ? JSON.parse(savedSession)
      : {
          status: 'IDLE',
          equippedRuleIds: ['#001'],
          sceneThemeId: initialScenes[0].id,
          durationMinutes: 45
        }
  );

  function persistSession() {
    localStorage.setItem('acumen_scout_session_v1', JSON.stringify(session.value));
  }

  // 检查探针是否已到期（应对关闭网页重新打开）
  function checkExpiry() {
    if (isSettling.value) return; // 正在等待大模型返回时，绝不重复触发
    if (session.value.status === 'SCOUTING' && session.value.endTime) {
      if (Date.now() >= session.value.endTime) {
        completeScouting();
      }
    }
  }

  // 当前激活的场景对象
  const activeScene = computed<ScoutSceneTheme>(() => {
    const found = scenes.value.find(s => s.id === session.value.sceneThemeId);
    return found || scenes.value[0] || initialScenes[0];
  });

  // 行囊中携带的完整规则对象列表（漫游采风单心法专注模式：有且仅有 1 张）
  const equippedRules = computed(() => {
    return session.value.equippedRuleIds
      .map(id => ruleStore.getRuleById(id))
      .filter((r): r is NonNullable<typeof r> => Boolean(r));
  });

  // 当前探针漫游专注探寻的主力心法
  const focusRule = computed(() => {
    return equippedRules.value[0] || ruleStore.rules[0] || null;
  });

  // 规则装填/切换（单心法专注修行：点击直接切换为当前采风目标）
  function toggleEquipRule(ruleId: string) {
    if (session.value.equippedRuleIds.includes(ruleId)) {
      // 若已是当前唯一专注心法，且库中有其他心法，允许保留；若点击则不重复操作
      return;
    }
    // 单选模式：切换为该心法
    session.value.equippedRuleIds = [ruleId];
    persistSession();
  }

  function isEquipped(ruleId: string): boolean {
    return session.value.equippedRuleIds.includes(ruleId);
  }

  // 派出探针采风
  function launchScout(durationMinutes: number, specifiedSceneId?: string) {
    if (session.value.equippedRuleIds.length === 0) {
      // 默认装载第一张规则
      if (ruleStore.rules.length > 0) {
        session.value.equippedRuleIds = [ruleStore.rules[0].id];
      }
    }

    let sceneId = specifiedSceneId || session.value.sceneThemeId;
    if (randomSceneOnLaunch.value && scenes.value.length > 0) {
      const randIdx = Math.floor(Math.random() * scenes.value.length);
      sceneId = scenes.value[randIdx].id;
    }

    const now = Date.now();
    const durationMs = durationMinutes * 60 * 1000;

    session.value.status = 'SCOUTING';
    session.value.durationMinutes = durationMinutes;
    session.value.startTime = now;
    session.value.endTime = now + durationMs;
    session.value.sceneThemeId = sceneId;
    session.value.lootEvent = undefined;
    session.value.lootAnalysisRaw = undefined;

    persistSession();
  }

  // 立即召回 / 极速完成
  function recallNow() {
    if (session.value.status === 'SCOUTING') {
      session.value.endTime = Date.now();
      completeScouting();
    }
  }

  // 是否正在与后端/大模型结算
  const isSettling = ref(false);

  // 结算探针采风：抓取真实互联网实时热点 + 由后端代发 DeepSeek 碰撞研判（彻底消除前端 CORS 跨域问题）
  async function completeScouting() {
    if (isSettling.value) return; // 防重入保护：已在向大模型请求中，禁止重复发起
    isSettling.value = true;

    try {
      const serverResult = await settleScoutSessionApi({
        equippedRules: equippedRules.value,
        apiKey: settingsStore.apiKey,
        baseUrl: settingsStore.baseUrl,
        model: settingsStore.model
      });

      if (serverResult && serverResult.success && serverResult.lootEvent) {
        session.value.status = 'READY_TO_CLAIM';
        session.value.lootEvent = serverResult.lootEvent;
        session.value.lootAnalysisRaw = serverResult.lootAnalysisRaw;
        session.value.isLiveAI = Boolean(serverResult.isLiveAI);
        session.value.aiError = serverResult.aiError;
        persistSession();
        isSettling.value = false;
        return;
      }
    } catch (e: any) {
      console.warn('[scoutStore] 调取服务端探针结算失败，将启动本地兜底:', e);
      session.value.isLiveAI = false;
      session.value.aiError = `请求异常: ${e?.message || '无法连接后端'}`;
    }

    // 离线备用降级
    const pool = initialWildEvents;
    const randomEvent = pool[Math.floor(Math.random() * pool.length)];
    session.value.status = 'READY_TO_CLAIM';
    session.value.lootEvent = randomEvent;
    session.value.lootAnalysisRaw = randomEvent.precomputedResult || '';
    session.value.isLiveAI = false;
    session.value.aiError = '未能连通后端服务，已切换为经典离线切片';
    persistSession();
    isSettling.value = false;
  }

  // 一键将战利品判例收录进对应规则卡片
  function claimLootAndMount(): { mountedCount: number; gainedExp: number } {
    if (!session.value.lootEvent || !session.value.lootAnalysisRaw) {
      session.value.status = 'IDLE';
      persistSession();
      return { mountedCount: 0, gainedExp: 0 };
    }

    const parsed = parseDiagnosticOutput(session.value.lootAnalysisRaw);
    let mountedCount = 0;
    let gainedExp = 0;

    const eventText = session.value.lootEvent.content;
    const cause = parsed.event?.cause || '其他';
    const causeSupplement = parsed.event?.causeSupplement || '';
    const evidence = parsed.event?.evidence || session.value.lootEvent.title;

    // 挂载 APPLY 条目
    parsed.applyList.forEach(item => {
      ruleStore.addCaseToRule(item.ruleId, {
        rawEventText: eventText,
        eventCause: cause,
        eventCauseSupplement: causeSupplement,
        eventEvidence: evidence,
        matchType: 'APPLY',
        reasoning: item.detail,
        sourceType: 'AUTO_SCOUT',
        author: settingsStore.authorName
      });
      mountedCount++;
      gainedExp += 2;
    });

    // 挂载 NEAR-MISS 条目
    parsed.nearMissList.forEach(item => {
      ruleStore.addCaseToRule(item.ruleId, {
        rawEventText: eventText,
        eventCause: cause,
        eventCauseSupplement: causeSupplement,
        eventEvidence: evidence,
        matchType: 'NEAR-MISS',
        reasoning: item.detail,
        sourceType: 'AUTO_SCOUT',
        author: settingsStore.authorName
      });
      mountedCount++;
      gainedExp += 3;
    });

    // 挂载 UNCERTAIN 条目
    parsed.uncertainList.forEach(item => {
      ruleStore.addCaseToRule(item.ruleId, {
        rawEventText: eventText,
        eventCause: cause,
        eventCauseSupplement: causeSupplement,
        eventEvidence: evidence,
        matchType: 'UNCERTAIN',
        reasoning: item.detail,
        sourceType: 'AUTO_SCOUT',
        author: settingsStore.authorName
      });
      mountedCount++;
      gainedExp += 1;
    });

    // 重置探针状态回到 IDLE
    session.value.status = 'IDLE';
    session.value.startTime = undefined;
    session.value.endTime = undefined;
    session.value.lootEvent = undefined;
    session.value.lootAnalysisRaw = undefined;
    persistSession();

    return { mountedCount, gainedExp };
  }

  // 放弃/跳过本次见闻，释放探针回到待机状态
  function discardLoot() {
    session.value.status = 'IDLE';
    session.value.startTime = undefined;
    session.value.endTime = undefined;
    session.value.lootEvent = undefined;
    session.value.lootAnalysisRaw = undefined;
    persistSession();
  }

  // 场景管理：添加场景（同时持久化到 SQLite）
  function addScene(theme: Omit<ScoutSceneTheme, 'id'>) {
    const newTheme: ScoutSceneTheme = {
      ...theme,
      id: `scene-${Date.now()}`
    };
    scenes.value.push(newTheme);
    persistScenes();
    createSceneApi(newTheme);
    return newTheme;
  }

  // 删除场景（同时触发 SQLite 记录与磁盘大图物理清理）
  function deleteScene(id: string) {
    if (scenes.value.length <= 1) return; // 至少保留 1 个
    scenes.value = scenes.value.filter(s => s.id !== id);
    if (session.value.sceneThemeId === id) {
      session.value.sceneThemeId = scenes.value[0].id;
      persistSession();
    }
    persistScenes();
    deleteSceneApi(id);
  }

  // 恢复默认场景
  function resetScenesToDefault() {
    scenes.value = JSON.parse(JSON.stringify(initialScenes));
    session.value.sceneThemeId = initialScenes[0].id;
    persistScenes();
    persistSession();
  }

  return {
    scenes,
    session,
    isSettling,
    randomSceneOnLaunch,
    activeScene,
    equippedRules,
    focusRule,
    checkExpiry,
    setRandomScene,
    toggleEquipRule,
    isEquipped,
    launchScout,
    recallNow,
    completeScouting,
    claimLootAndMount,
    discardLoot,
    addScene,
    deleteScene,
    resetScenesToDefault
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useScoutStore, import.meta.hot));
}
