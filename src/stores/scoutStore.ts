import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ScoutSessionState, ScoutSceneTheme, WildEventItem } from '../types';
import { initialScenes } from '../data/initialScenes';
import { initialWildEvents } from '../data/wildEventsPool';
import { useRuleStore } from './ruleStore';
import { useSettingsStore } from './settingsStore';
import { callLlmDiagnostic } from '../utils/aiClient';
import { parseDiagnosticOutput } from '../utils/parser';

export const useScoutStore = defineStore('scout', () => {
  const ruleStore = useRuleStore();
  const settingsStore = useSettingsStore();

  // 场景列表持久化
  const savedScenes = localStorage.getItem('acumen_scout_scenes_v1');
  const scenes = ref<ScoutSceneTheme[]>(savedScenes ? JSON.parse(savedScenes) : initialScenes);

  function persistScenes() {
    localStorage.setItem('acumen_scout_scenes_v1', JSON.stringify(scenes.value));
  }

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

  // 行囊中携带的完整规则对象列表
  const equippedRules = computed(() => {
    return session.value.equippedRuleIds
      .map(id => ruleStore.getRuleById(id))
      .filter((r): r is NonNullable<typeof r> => Boolean(r));
  });

  // 规则装填/卸载（最多 3 张）
  function toggleEquipRule(ruleId: string) {
    const idx = session.value.equippedRuleIds.indexOf(ruleId);
    if (idx !== -1) {
      session.value.equippedRuleIds.splice(idx, 1);
    } else {
      if (session.value.equippedRuleIds.length >= 3) {
        // 最多 3 张，替换最早进入的一张
        session.value.equippedRuleIds.shift();
      }
      session.value.equippedRuleIds.push(ruleId);
    }
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

  // 结算探针采风，生成野生事件战利品
  async function completeScouting() {
    session.value.status = 'READY_TO_CLAIM';

    // 从真实事件池随机挑选一个野生事件
    const pool = initialWildEvents;
    const randomEvent = pool[Math.floor(Math.random() * pool.length)];
    session.value.lootEvent = randomEvent;

    // 碰撞分析生成
    if (settingsStore.isConfigured) {
      // 尝试调用用户配置的大模型
      try {
        const rawOutput = await callLlmDiagnostic({
          baseUrl: settingsStore.baseUrl,
          apiKey: settingsStore.apiKey,
          model: settingsStore.model,
          rules: equippedRules.value,
          eventText: randomEvent.content
        });
        session.value.lootAnalysisRaw = rawOutput;
      } catch (err) {
        console.warn('API 直连诊断失败，自动回退至高质量预计算结果:', err);
        session.value.lootAnalysisRaw = randomEvent.precomputedResult || '';
      }
    } else {
      // 零 API 模式：使用高质量预计算结果
      session.value.lootAnalysisRaw = randomEvent.precomputedResult || '';
    }

    persistSession();
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

  // 场景管理：添加场景
  function addScene(theme: Omit<ScoutSceneTheme, 'id'>) {
    const newTheme: ScoutSceneTheme = {
      ...theme,
      id: `scene-${Date.now()}`
    };
    scenes.value.push(newTheme);
    persistScenes();
    return newTheme;
  }

  // 删除场景
  function deleteScene(id: string) {
    if (scenes.value.length <= 1) return; // 至少保留 1 个
    scenes.value = scenes.value.filter(s => s.id !== id);
    if (session.value.sceneThemeId === id) {
      session.value.sceneThemeId = scenes.value[0].id;
      persistSession();
    }
    persistScenes();
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
    randomSceneOnLaunch,
    activeScene,
    equippedRules,
    checkExpiry,
    setRandomScene,
    toggleEquipRule,
    isEquipped,
    launchScout,
    recallNow,
    completeScouting,
    claimLootAndMount,
    addScene,
    deleteScene,
    resetScenesToDefault
  };
});
