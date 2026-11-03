<template>
  <div class="min-h-screen bg-theme-primary text-theme-text-main flex flex-col relative selection:bg-rose-100 selection:text-rose-800">
    <!-- 背景柔和光晕 (Ambient Warm Soft Peach Glow) -->
    <div class="ambient-glow"></div>

    <!-- 顶部全局导航栏 -->
    <HeaderNav
      :active-tab="activeTab"
      @change-tab="activeTab = $event"
      @open-scenes="showSceneModal = true"
      @open-manual="showManualDrawer = true"
      @open-settings="showSettingsModal = true"
    />

    <!-- 主体容器 -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 space-y-7">
      <!-- 顶部 30 秒上手指引卡（轻量温润，可随时收起） -->
      <OnboardingBanner />

      <!-- 工作区切换：慢调温润手帐阻尼淡入淡出 -->
      <Transition name="journal-fade" mode="out-in">
        <!-- 工作区 A：规则图鉴与探针漫步大厅 -->
        <div v-if="activeTab === 'deck'" key="deck" class="space-y-8">
          <!-- 顶层主舞台：左右严格等高对齐 (items-stretch) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <!-- 左侧：治愈书房心境与随思总览 (占 7 列，高度自适应与右侧飘窗拉齐) -->
            <div class="lg:col-span-7 flex flex-col justify-between p-6 rounded-3xl bg-white border border-rose-200/70 shadow-fluffy-sm hover:shadow-[0_12px_30px_rgba(225,120,115,0.06)] transition-all duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] space-y-5">
              <!-- 上部：问候语与生活总览 -->
              <div class="space-y-4">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="flex items-center space-x-2 text-rose-500 text-xs font-medium mb-1">
                      <span>{{ timeGreeting.icon }}</span>
                      <span>{{ timeGreeting.text }}</span>
                    </div>
                    <h1 class="text-xl sm:text-2xl font-bold text-theme-text-main tracking-tight font-sans">
                      If-Then 认知心法手札
                    </h1>
                    <p class="text-xs text-theme-text-muted mt-1 leading-relaxed">
                      每一条心法都经受过真实生活的印证 · 拒绝未经省察的自欺与虚妄
                    </p>
                  </div>

                  <!-- 桌面拟物生活摆件与守护神兽（热茶、绿植、小萌虎/小金狮） -->
                  <DeskCompanion />
                </div>

                <!-- 诗意温和的生活小结条 (告别冰冷数字大方框) -->
                <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-rose-50/70 border border-rose-100 text-rose-700">
                    <span>📖</span>
                    <span><strong>{{ ruleStore.totalRulesCount }}</strong> 篇珍藏心法</span>
                  </span>

                  <span class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-sage-50 border border-sage-100 text-sage-700">
                    <span>🌱</span>
                    <span><strong>{{ ruleStore.totalCasesCount }}</strong> 次生活映照</span>
                  </span>

                  <span class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-apricot-50 border border-apricot-100 text-apricot-700">
                    <span>🕊️</span>
                    <span>探针采风 {{ ruleStore.scoutCasesCount }} / 随笔 {{ ruleStore.manualCasesCount }}</span>
                  </span>
                </div>

                <!-- 快捷操作栏 -->
                <div class="flex flex-wrap items-center gap-2 pt-1">
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
                    class="px-3.5 py-2 rounded-2xl bg-theme-secondary border border-rose-100 text-theme-text-muted hover:text-theme-text-main hover:bg-rose-50 font-medium text-xs flex items-center space-x-1.5 transition-all duration-[350ms] transform hover:scale-[1.02] active:scale-95"
                  >
                    <Download class="w-3.5 h-3.5" />
                    <span>备份手札</span>
                  </button>
                </div>
              </div>

              <!-- 下部：内嵌搜索栏与场景分类胶囊 -->
              <div class="pt-4 border-t border-rose-100/70 space-y-3">
                <!-- 搜索框 -->
                <div class="relative">
                  <Search class="w-4 h-4 text-theme-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="轻轻翻寻某条心法、困惑、或是生活解法..."
                    class="w-full pl-9 pr-8 py-2 rounded-2xl bg-theme-secondary/90 border border-rose-100/80 text-xs focus:outline-none focus:ring-2 focus:ring-rose-300 font-sans text-theme-text-main placeholder:text-theme-text-dim/80 transition-all duration-[300ms]"
                  />
                  <button
                    v-if="searchQuery"
                    @click="searchQuery = ''"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-dim hover:text-theme-text-main transition-colors"
                  >
                    <X class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- 场景分类标签栏 -->
                <div class="flex items-center space-x-1.5 overflow-x-auto pb-0.5 text-xs">
                  <button
                    type="button"
                    @click="selectedScenario = 'ALL'"
                    :class="[
                      'px-3 py-1 rounded-xl whitespace-nowrap transition-all duration-[300ms] font-medium text-xs',
                      selectedScenario === 'ALL'
                        ? 'bg-rose-500 text-white shadow-fluffy-sm'
                        : 'bg-theme-secondary text-theme-text-muted hover:bg-rose-50 hover:text-rose-600'
                    ]"
                  >
                    全部场景 ({{ ruleStore.rules.length }})
                  </button>
                  <button
                    v-for="sc in ruleStore.allScenarios"
                    :key="sc"
                    @click="selectedScenario = sc"
                    :class="[
                      'px-3 py-1 rounded-xl whitespace-nowrap transition-all duration-[300ms] font-medium text-xs',
                      selectedScenario === sc
                        ? 'bg-rose-500 text-white shadow-fluffy-sm'
                        : 'bg-theme-secondary text-theme-text-muted hover:bg-rose-50 hover:text-rose-600'
                    ]"
                  >
                    {{ sc }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 右侧：采风飘窗组件 (占 5 列，与左侧面板高度精确拉齐) -->
            <div class="lg:col-span-5 flex flex-col justify-between">
              <ScoutWidget
                @open-scenes="showSceneModal = true"
                @open-report="showReportModal = true"
              />
            </div>
          </div>

          <!-- 下层：规则卡片图鉴墙 (Grid 瀑布流网格) -->
          <div class="space-y-4 pt-2">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-sm font-bold text-theme-text-main uppercase tracking-wider flex items-center space-x-2">
                  <span>📖 心法手札图鉴 ({{ filteredRules.length }})</span>
                </h2>
                <p class="text-xs text-theme-text-dim mt-0.5">
                  点击卡片任意区域，翻阅它在现实生活中的真实照见与辨思
                </p>
              </div>
            </div>

            <div
              v-if="filteredRules.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <RuleCard
                v-for="rule in filteredRules"
                :key="rule.id"
                :rule="rule"
                @open-detail="openRuleDetail"
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

    <!-- 右下角常驻轻量「玩法速查手册」浮动胶囊 -->
    <div class="fixed bottom-6 right-6 z-30">
      <button
        type="button"
        @click="showManualDrawer = true"
        class="px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-rose-200/90 text-rose-600 font-medium text-xs shadow-fluffy-md hover:bg-rose-50 hover:border-rose-300 flex items-center space-x-2 transition-all transform hover:scale-105"
        title="翻开玩法与心法手札手册"
      >
        <BookOpen class="w-4 h-4 text-rose-400" />
        <span>💡 玩法与心法指引</span>
      </button>
    </div>

    <!-- 各模块弹窗与抽屉 -->
    <RuleDetailDrawer
      :rule="activeDetailRule"
      @close="activeDetailRule = null"
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
import OnboardingBanner from './components/OnboardingBanner.vue';
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
import DeskCompanion from './components/DeskCompanion.vue';

import { useRuleStore } from './stores/ruleStore';
import { IfThenRule } from './types';

const ruleStore = useRuleStore();

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
