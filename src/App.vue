<template>
  <div class="min-h-screen bg-theme-primary text-theme-text-main flex flex-col relative selection:bg-rose-100 selection:text-rose-800">
    <!-- 全景沉浸式插画背景 (100% 清晰纯净，不加雾化与厚重遮罩，与环境融为一体) -->
    <div
      class="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 pointer-events-none"
      :style="{ backgroundImage: `url(${currentBackground})` }"
    >
      <!-- 极轻透环境微光：仅给整屏一层极淡柔光，绝不模糊遮挡插画的精美细节与景深 -->
      <div class="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/15 pointer-events-none"></div>
    </div>

    <!-- 背景柔和光晕 (Ambient Warm Soft Peach Glow) -->
    <div class="ambient-glow"></div>

    <!-- 全屏大背景轻柔微风落樱 (覆盖整个视口，随大环境舒缓飘落) -->
    <GlobalPetalRain />

    <!-- 顶部全局导航栏 -->
    <HeaderNav
      :active-tab="activeTab"
      @change-tab="activeTab = $event"
      @open-onboarding="showManualDrawer = true"
      @open-scenes="showSceneModal = true"
      @open-manual="showManualDrawer = true"
      @open-settings="showSettingsModal = true"
    />

    <!-- 主体容器 -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 space-y-7">
      <!-- 工作区切换：慢调温润手帐阻尼淡入淡出 -->
      <Transition name="journal-fade" mode="out-in">
        <!-- 工作区 A：规则图鉴与探针漫步大厅 -->
        <div v-if="activeTab === 'deck'" key="deck" class="space-y-6">
          <!-- 顶层主舞台：严格等高对齐 (items-stretch)，左右协调统一且完全消除高低差 -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
            <!-- 左侧：治愈书房心境案头 (与右侧等高平齐·充实温暖) -->
            <div class="xl:col-span-7 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white/75 backdrop-blur-sm border border-white/80 shadow-[0_12px_36px_rgba(225,120,115,0.07)] hover:shadow-[0_16px_42px_rgba(225,120,115,0.1)] transition-all duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] space-y-4">
              <!-- 上部：问候语与标题 -->
              <div class="space-y-3.5">
                <div class="flex items-center space-x-2 text-rose-500 text-xs font-medium">
                  <span>{{ timeGreeting.icon }}</span>
                  <span>{{ timeGreeting.text }}</span>
                </div>
                <h1 class="text-xl sm:text-2xl font-bold text-theme-text-main tracking-tight font-sans">
                  If-Then 认知心法手札
                </h1>
                <p class="text-xs text-theme-text-muted leading-relaxed">
                  每一条心法都经受过真实生活的印证 · 拒绝未经省察的自欺与虚妄
                </p>

                <!-- 🎒 探针专注漫游心法 (单心法聚焦模式：全网定向搜索与研判 100% 围绕此篇展开) -->
                <div class="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50/90 via-amber-50/40 to-pink-50/40 border border-rose-100/90 shadow-sm space-y-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-1.5">
                      <span class="text-sm">🎯</span>
                      <span class="text-xs font-bold text-rose-700 font-sans">当前漫游专注心法</span>
                      <span class="px-2 py-0.2 rounded-full text-[10px] font-mono font-semibold bg-rose-100 text-rose-700">
                        单篇精修
                      </span>
                    </div>

                    <span class="text-[10px] text-theme-text-dim">
                      全网定向搜寻与研判将 100% 聚焦于此
                    </span>
                  </div>

                  <!-- 专注心法卡片展示 -->
                  <div v-if="scoutStore.focusRule" class="flex items-center justify-between p-2.5 rounded-xl bg-white/95 border border-rose-200/80 shadow-2xs">
                    <div
                      @click="openRuleDetail(scoutStore.focusRule.id)"
                      class="flex items-center space-x-2 cursor-pointer group flex-1 min-w-0 pr-2"
                      :title="`点击查看 ${scoutStore.focusRule.id} 详情`"
                    >
                      <span class="font-mono text-rose-600 font-bold text-xs shrink-0">{{ scoutStore.focusRule.id }}</span>
                      <span class="px-1.5 py-0.2 rounded text-[10px] bg-rose-50 text-rose-600 border border-rose-100 shrink-0 font-medium">
                        {{ scoutStore.focusRule.scenario || '通用认知' }}
                      </span>
                      <span class="text-[11px] text-stone-700 truncate font-sans">
                        {{ scoutStore.focusRule.ifCondition }}
                      </span>
                    </div>

                    <span class="text-[10px] text-rose-500 font-medium shrink-0">
                      ✓ 采风锁定中
                    </span>
                  </div>

                  <!-- 未装载时的温馨提示 -->
                  <div v-else class="text-[11px] text-theme-text-dim py-1 flex items-center space-x-1.5 italic">
                    <span>暂无心法 · 在下方心法卡片点击「随身采风」，指定探针聚焦目标！</span>
                  </div>
                </div>

                <!-- 案头近期待印证心法速览 (充实案头内容，消灭视觉空白，与右侧采风舱天然等高) -->
                <div
                  v-if="featuredRule"
                  @click="openRuleDetail(featuredRule.id)"
                  class="p-3.5 rounded-2xl bg-white/90 hover:bg-white border border-rose-100 hover:border-rose-300/80 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group space-y-1.5"
                  title="点击翻阅此条待印证心法的生活详情"
                >
                  <div class="flex items-center justify-between">
                    <span class="inline-flex items-center space-x-1.5 text-[11px] font-medium text-rose-600">
                      <span>🌱</span>
                      <span>近期待印证心法 · <strong class="font-mono">{{ featuredRule.id }}</strong></span>
                    </span>
                    <span class="text-[10px] text-theme-text-dim px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 font-sans group-hover:text-rose-600 transition-colors">
                      {{ featuredRule.scenario || '认知习惯' }} ➔
                    </span>
                  </div>
                  <div class="space-y-1 text-xs">
                    <p class="text-theme-text-main font-medium line-clamp-1">
                      <span class="text-rose-500 font-bold">IF：</span>{{ featuredRule.ifCondition }}
                    </p>
                    <p class="text-theme-text-muted text-[11px] line-clamp-1">
                      <span class="text-sage-600 font-bold">THEN：</span>{{ featuredRule.thenAction }}
                    </p>
                  </div>
                </div>

                <!-- 诗意温和的生活小结条 (告别冰冷数字大方框) -->
                <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-rose-50/80 border border-rose-100 text-rose-700">
                    <span>📖</span>
                    <span><strong>{{ ruleStore.totalRulesCount }}</strong> 篇珍藏心法</span>
                  </span>

                  <span class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-sage-50/80 border border-sage-100 text-sage-700">
                    <span>🌱</span>
                    <span><strong>{{ ruleStore.totalCasesCount }}</strong> 次生活映照</span>
                  </span>

                  <span class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-apricot-50/80 border border-apricot-100 text-apricot-700">
                    <span>🕊️</span>
                    <span>探针采风 {{ ruleStore.scoutCasesCount }} / 随笔 {{ ruleStore.manualCasesCount }}</span>
                  </span>
                </div>
              </div>

              <!-- 下部：快捷操作栏 (纯净轻快按钮组) -->
              <div class="flex flex-wrap items-center gap-2 pt-3 border-t border-rose-100/60">
                <button
                  type="button"
                  @click="openCreateRuleModal"
                  class="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-400 via-rose-500 to-pink-500 text-white font-medium text-xs shadow-fluffy-sm hover:from-rose-500 hover:to-pink-600 flex items-center space-x-1.5 transition-all duration-[350ms] transform hover:scale-[1.02] active:scale-95"
                >
                  <Plus class="w-4 h-4" />
                  <span>记录一条新心法</span>
                </button>

                <button
                  type="button"
                  @click="showNotionModal = true"
                  class="px-3.5 py-2 rounded-2xl bg-white border border-rose-200/80 text-rose-600 hover:bg-rose-50 font-medium text-xs flex items-center space-x-1.5 shadow-sm transition-all duration-[350ms] transform hover:scale-[1.02] active:scale-95"
                >
                  <ClipboardList class="w-4 h-4" />
                  <span>Notion 批量导入</span>
                </button>

                <button
                  type="button"
                  @click="handleExportBackup"
                  class="px-3.5 py-2 rounded-2xl bg-white/80 border border-rose-100 text-theme-text-muted hover:text-theme-text-main hover:bg-rose-50 font-medium text-xs flex items-center space-x-1.5 transition-all duration-[350ms] transform hover:scale-[1.02] active:scale-95"
                >
                  <Download class="w-3.5 h-3.5" />
                  <span>备份手札</span>
                </button>
              </div>
            </div>

            <!-- 右侧：WorkBuddy 风格轻灵采风舱 (占 5 列，与左侧严格等高对齐) -->
            <div class="xl:col-span-5 flex flex-col justify-between">
              <ScoutWidget
                @open-scenes="showSceneModal = true"
                @open-report="showReportModal = true"
              />
            </div>
          </div>

          <!-- 下层：规则卡片图鉴墙 (Grid 瀑布流网格与手帐翻阅中枢) -->
          <div class="space-y-4 pt-4">
            <!-- 手帐翻阅控制中枢：左侧图鉴标签 + 右侧场景胶囊与翻寻搜索框 + 【白瓷热茶 🍵】+ 【粗陶多肉 🌱】 (100% 清晰·绝对不被裁剪) -->
            <div class="relative z-30 p-3 sm:px-5 sm:py-3.5 rounded-3xl bg-white/85 backdrop-blur-md border border-white/95 shadow-[0_6px_24px_rgba(225,120,115,0.06)] flex flex-col lg:flex-row lg:items-center justify-between gap-3 overflow-visible">
              <!-- 左侧：图鉴纸签与说明 -->
              <div class="flex items-center space-x-3">
                <div class="flex items-center space-x-2">
                  <span class="text-base">📖</span>
                  <h2 class="text-xs sm:text-sm font-bold text-theme-text-main font-sans">心法手札图鉴</h2>
                  <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-rose-50 text-rose-600 border border-rose-200/80">
                    {{ filteredRules.length }} 篇
                  </span>
                </div>
                <span class="hidden sm:inline text-rose-200">|</span>
                <p class="hidden sm:inline text-[11px] text-theme-text-muted font-sans">
                  点击卡片翻阅现实照见与辨思
                </p>
              </div>

              <!-- 右侧：场景分类小胶囊 + 紧凑搜索框 + 【案头白瓷热茶 🍵】+ 【粗陶多肉 🌱】 -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 overflow-visible">
                <!-- 场景分类标签栏 -->
                <div class="flex items-center space-x-1 overflow-x-auto pb-0.5 text-xs">
                  <button
                    type="button"
                    @click="selectedScenario = 'ALL'"
                    :class="[
                      'px-2.5 py-1 rounded-xl whitespace-nowrap transition-all duration-[250ms] font-medium text-xs',
                      selectedScenario === 'ALL'
                        ? 'bg-rose-500 text-white shadow-fluffy-sm'
                        : 'bg-rose-50/70 text-theme-text-muted hover:bg-rose-100 hover:text-rose-700'
                    ]"
                  >
                    全部 ({{ ruleStore.rules.length }})
                  </button>
                  <button
                    v-for="sc in ruleStore.allScenarios"
                    :key="sc"
                    @click="selectedScenario = sc"
                    :class="[
                      'px-2.5 py-1 rounded-xl whitespace-nowrap transition-all duration-[250ms] font-medium text-xs',
                      selectedScenario === sc
                        ? 'bg-rose-500 text-white shadow-fluffy-sm'
                        : 'bg-rose-50/70 text-theme-text-muted hover:bg-rose-100 hover:text-rose-700'
                    ]"
                  >
                    {{ sc }}
                  </button>
                </div>

                <!-- 紧凑搜索框 -->
                <div class="relative min-w-[190px] sm:w-44 lg:w-52">
                  <Search class="w-3.5 h-3.5 text-theme-text-dim absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="轻轻翻寻心法..."
                    class="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white/90 border border-rose-100 text-xs focus:outline-none focus:ring-2 focus:ring-rose-300 font-sans text-theme-text-main placeholder:text-theme-text-dim/80 transition-all"
                  />
                  <button
                    v-if="searchQuery"
                    @click="searchQuery = ''"
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 text-theme-text-dim hover:text-theme-text-main"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </div>

                <!-- 案头雅致生活摆件区 (白瓷热茶与粗陶多肉，在温润乳白纸托上清晰可见，弹窗绝对不被裁剪) -->
                <div class="flex items-center space-x-2 pl-1 self-end sm:self-auto overflow-visible">
                  <div class="h-5 w-[1px] bg-rose-200/70 hidden sm:block"></div>
                  <!-- 🍵 白瓷热茶 -->
                  <DeskTeacup />
                  <!-- 🌱 粗陶多肉 -->
                  <WindowSucculent />
                </div>
              </div>
            </div>

            <!-- 卡片网格：1100px (md) 优雅排布为 2 列，1280px+ (xl) 排布为 3 列，彻底告别挤扁 -->
            <div
              v-if="filteredRules.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              <RuleCard
                v-for="rule in filteredRules"
                :key="rule.id"
                :rule="rule"
                @open-detail="openRuleDetail"
                @edit-rule="handleEditRule"
              />
            </div>

            <!-- 无匹配结果 -->
            <div
              v-else
              class="py-16 text-center rounded-3xl bg-white border border-rose-100 shadow-fluffy-sm space-y-3"
            >
              <div class="text-3xl">🕊️</div>
              <p class="text-xs text-theme-text-muted">没有找到符合筛选条件的心法便签</p>
              <button
                type="button"
                @click="resetFilter"
                class="px-4 py-1.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-medium hover:bg-rose-100"
              >
                清除翻寻条件
              </button>
            </div>
          </div>
        </div>

        <!-- 工作区 B：主动事件诊断沙盒 -->
        <div v-else-if="activeTab === 'sandbox'" key="sandbox">
          <DiagnosticSandbox />
        </div>
      </Transition>
    </main>

    <!-- 右下角案头守护神兽常驻托台 (趴卧打盹呼吸 · 点击听心声 · 整合玩法手册入口) -->
    <GuardianCompanion @open-manual="showManualDrawer = true" />

    <!-- 各模块弹窗与抽屉 -->
    <RuleDetailDrawer
      :rule="activeDetailRule"
      @close="activeDetailRule = null"
      @edit-rule="handleEditRule"
    />

    <RuleEditModal
      :is-open="showRuleEditModal"
      :edit-rule="editingRule"
      @close="showRuleEditModal = false"
    />

    <NotionImportModal
      :is-open="showNotionModal"
      @close="showNotionModal = false"
    />

    <SceneManagerModal
      :is-open="showSceneModal"
      @close="showSceneModal = false"
    />

    <ScoutReportModal
      :is-open="showReportModal"
      @close="showReportModal = false"
    />

    <SettingsModal
      :is-open="showSettingsModal"
      @close="showSettingsModal = false"
    />

    <OnboardingDrawer
      :is-open="showManualDrawer"
      @close="showManualDrawer = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Feather,
  Plus,
  ClipboardList,
  Download,
  Search,
  X,
  BookOpen
} from 'lucide-vue-next';
import HeaderNav from './components/HeaderNav.vue';
import OnboardingDrawer from './components/OnboardingDrawer.vue';
import SettingsModal from './components/SettingsModal.vue';
import ScoutWidget from './components/ScoutWidget.vue';
import ScoutReportModal from './components/ScoutReportModal.vue';
import SceneManagerModal from './components/SceneManagerModal.vue';
import RuleCard from './components/RuleCard.vue';
import RuleDetailDrawer from './components/RuleDetailDrawer.vue';
import RuleEditModal from './components/RuleEditModal.vue';
import NotionImportModal from './components/NotionImportModal.vue';
import DiagnosticSandbox from './components/DiagnosticSandbox.vue';
import DeskTeacup from './components/DeskTeacup.vue';
import WindowSucculent from './components/WindowSucculent.vue';
import GuardianCompanion from './components/GuardianCompanion.vue';
import GlobalPetalRain from './components/GlobalPetalRain.vue';
import studyBg from './assets/images/study-bg.png';

import { useRuleStore } from './stores/ruleStore';
import { useSettingsStore } from './stores/settingsStore';
import { useScoutStore } from './stores/scoutStore';
import { IfThenRule } from './types';

const ruleStore = useRuleStore();
const settingsStore = useSettingsStore();
const scoutStore = useScoutStore();

// 当前随身采风行囊中装载的心法规则列表
const equippedRules = computed(() => {
  return scoutStore.session.equippedRuleIds
    .map(id => ruleStore.getRuleById(id))
    .filter((r): r is IfThenRule => Boolean(r));
});

// 100% 本地直出全景背景：优先使用用户在设置中自定义的背景，默认直接使用本地 study-bg.png
const currentBackground = computed(() => {
  return settingsStore.globalBackgroundUrl || studyBg;
});

// 今日认知心境箴言便签（温润如初，消除空洞白斑）
const dailyMotto = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return '“遇境时先深吸一口清晨微光，把模糊的不安拆解为清晰的具体行动。”';
  } else if (hour >= 12 && hour < 18) {
    return '“真正的定力，是敢于在纷扰的催促中，从容反手给出一个明确的备选项。”';
  } else {
    return '“暮色降临，不必苛求把所有问题一次解完，接纳局限本身，心境便能自愈。”';
  }
});

// 案头近期待印证心法（优先推荐印记较少的心法，充实案头，天然填补等高空白）
const featuredRule = computed(() => {
  if (ruleStore.rules.length === 0) return null;
  const sorted = [...ruleStore.rules].sort((a, b) => a.cases.length - b.cases.length);
  return sorted[0];
});

// 时序温情环境问候
const timeGreeting = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) {
    return { icon: '🌅', text: '清晨微光 · 煮一壶热茶，静心写下今日心法' };
  } else if (hour >= 11 && hour < 17) {
    return { icon: '☀️', text: '午后暖阳 · 窗外微风正好，小守护兽在身旁陪伴' };
  } else if (hour >= 17 && hour < 21) {
    return { icon: '🌇', text: '黄昏暮色 · 卸下一天的纷扰，复盘今日生活印记' };
  } else {
    return { icon: '🌙', text: '夜深灯温 · 守护神兽在身旁打盹，写完就早些安歇吧' };
  }
});

// 导航选项卡
const activeTab = ref<'deck' | 'sandbox'>('deck');

// 过滤与搜索
const searchQuery = ref('');
const selectedScenario = ref('ALL');

// 弹窗与抽屉可见性状态
const showSceneModal = ref(false);
const showReportModal = ref(false);
const showSettingsModal = ref(false);
const showManualDrawer = ref(false);
const showNotionModal = ref(false);
const showRuleEditModal = ref(false);

const editingRule = ref<IfThenRule | null>(null);
const activeDetailRule = ref<IfThenRule | null>(null);

// 过滤规则卡片
const filteredRules = computed(() => {
  return ruleStore.rules.filter(rule => {
    // 场景筛选
    if (selectedScenario.value !== 'ALL' && rule.scenario !== selectedScenario.value) {
      return false;
    }
    // 关键词搜索
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase();
      const matchId = rule.id.toLowerCase().includes(q);
      const matchIf = rule.ifCondition.toLowerCase().includes(q);
      const matchThen = rule.thenAction.toLowerCase().includes(q);
      const matchWhy = rule.whyMechanism.toLowerCase().includes(q);
      const matchScenario = rule.scenario.toLowerCase().includes(q);
      return matchId || matchIf || matchThen || matchWhy || matchScenario;
    }
    return true;
  });
});

function resetFilter() {
  searchQuery.value = '';
  selectedScenario.value = 'ALL';
}

function openCreateRuleModal() {
  editingRule.value = null;
  showRuleEditModal.value = true;
}

function openRuleDetail(ruleId: string) {
  const found = ruleStore.getRuleById(ruleId);
  if (found) {
    activeDetailRule.value = found;
  }
}

function handleEditRule(ruleId: string) {
  activeDetailRule.value = null;
  const found = ruleStore.getRuleById(ruleId);
  if (found) {
    editingRule.value = found;
    showRuleEditModal.value = true;
  }
}

function handleExportBackup() {
  const jsonStr = ruleStore.exportJsonBackup();
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Acumen-Rules-Backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>
