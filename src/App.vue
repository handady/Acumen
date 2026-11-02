<template>
  <div class="min-h-screen bg-theme-primary text-theme-text-main flex flex-col relative selection:bg-rose-200 selection:text-rose-900">
    <!-- 背景柔和光晕 (Ambient Warm Soft Pink Glow) -->
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
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10">
      <!-- 顶部 30 秒上手无侵入式指引横幅 -->
      <OnboardingBanner />

      <!-- 工作区 A：规则图鉴与探针巡逻大厅 -->
      <div v-if="activeTab === 'deck'" class="space-y-8">
        <!-- 顶层并排分栏：左侧数据与快捷操作 + 右侧 16:9 采风探针视窗 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- 左侧：认知资产看板与快捷工具 (占 7 列) -->
          <div class="lg:col-span-7 space-y-4">
            <!-- 资产看板卡片 -->
            <div class="p-6 rounded-3xl bg-white border border-rose-100 shadow-fluffy-sm space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h1 class="text-xl sm:text-2xl font-bold text-theme-text-main tracking-tight font-sans">
                    If-Then 认知判例库
                  </h1>
                  <p class="text-xs text-theme-text-muted mt-1">
                    卡片等级与置信度由真实世界判例铸就 · 拒绝未经实测的空想假设
                  </p>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-sm">
                  <Shield class="w-6 h-6" />
                </div>
              </div>

              <!-- 数据统计指标 -->
              <div class="grid grid-cols-3 gap-3 pt-2 text-xs">
                <div class="p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
                  <span class="text-theme-text-dim block">总规则档案</span>
                  <div class="text-xl sm:text-2xl font-extrabold font-mono text-rose-600 mt-0.5">
                    {{ ruleStore.totalRulesCount }}
                  </div>
                </div>

                <div class="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <span class="text-theme-text-dim block">已实测判例总数</span>
                  <div class="text-xl sm:text-2xl font-extrabold font-mono text-emerald-600 mt-0.5">
                    {{ ruleStore.totalCasesCount }}
                  </div>
                </div>

                <div class="p-3 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <span class="text-theme-text-dim block">探针带回 / 手动</span>
                  <div class="text-base sm:text-lg font-bold font-mono text-amber-700 mt-1">
                    {{ ruleStore.scoutCasesCount }} / {{ ruleStore.manualCasesCount }}
                  </div>
                </div>
              </div>

              <!-- 快捷操作按钮组 -->
              <div class="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  @click="openCreateRuleModal"
                  class="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 text-white font-medium text-xs shadow-fluffy-sm hover:from-rose-500 hover:to-rose-600 flex items-center space-x-1.5 transition-all"
                >
                  <Plus class="w-4 h-4" />
                  <span>新增规则档案卡</span>
                </button>

                <button
                  type="button"
                  @click="showNotionModal = true"
                  class="px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium text-xs flex items-center space-x-1.5 shadow-sm transition-all"
                >
                  <ClipboardList class="w-4 h-4" />
                  <span>Notion 批量粘贴导入</span>
                </button>

                <button
                  type="button"
                  @click="handleExportBackup"
                  class="px-3.5 py-2 rounded-xl bg-theme-secondary border border-rose-100 text-theme-text-muted hover:text-theme-text-main hover:bg-rose-50 font-medium text-xs flex items-center space-x-1.5 transition-all"
                >
                  <Download class="w-3.5 h-3.5" />
                  <span>备份导出</span>
                </button>
              </div>
            </div>

            <!-- 搜索与场景分类过滤器 -->
            <div class="p-4 rounded-2xl bg-white border border-rose-100 shadow-fluffy-sm space-y-3">
              <div class="flex items-center space-x-3">
                <!-- 搜索输入框 -->
                <div class="relative flex-1">
                  <Search class="w-4 h-4 text-theme-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="搜索规则编号、条件、动作或底层机制..."
                    class="w-full pl-9 pr-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 text-xs focus:outline-none focus:ring-2 focus:ring-rose-300 font-sans"
                  />
                  <button
                    v-if="searchQuery"
                    @click="searchQuery = ''"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-dim hover:text-theme-text-main"
                  >
                    <X class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- 场景分类标签栏 -->
              <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  @click="selectedScenario = 'ALL'"
                  :class="[
                    'px-3 py-1 rounded-xl whitespace-nowrap transition-all font-medium',
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
                    'px-3 py-1 rounded-xl whitespace-nowrap transition-all font-medium',
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

          <!-- 右侧：旗帜级 16:9 采风探针视窗组件 (占 5 列) -->
          <div class="lg:col-span-5">
            <ScoutWidget
              @open-scenes="showSceneModal = true"
              @open-report="showReportModal = true"
            />
          </div>
        </div>

        <!-- 下层：规则卡片图鉴墙 (Grid 瀑布流网格) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-theme-text-main uppercase tracking-wider flex items-center space-x-1.5">
              <Layers class="w-4 h-4 text-rose-500" />
              <span>规则卡片图鉴墙 ({{ filteredRules.length }})</span>
            </h2>
            <span class="text-xs text-theme-text-dim">
              点击卡片任意区域展开判例实证与导出
            </span>
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

          <!-- 无匹配规则 -->
          <div
            v-else
            class="py-16 text-center rounded-3xl bg-white border border-rose-100 shadow-fluffy-sm space-y-3"
          >
            <FileQuestion class="w-10 h-10 text-rose-300 mx-auto" />
            <p class="text-xs text-theme-text-muted">没有找到符合筛选条件的规则卡片</p>
            <button
              type="button"
              @click="resetFilter"
              class="px-4 py-1.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-medium hover:bg-rose-100"
            >
              清除筛选条件
            </button>
          </div>
        </div>
      </div>

      <!-- 工作区 B：主动事件诊断沙盒 -->
      <div v-else-if="activeTab === 'sandbox'">
        <DiagnosticSandbox />
      </div>
    </main>

    <!-- 右下角常驻轻量「玩法速查手册」浮动胶囊 -->
    <div class="fixed bottom-6 right-6 z-30">
      <button
        type="button"
        @click="showManualDrawer = true"
        class="px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-rose-200 text-rose-600 font-medium text-xs shadow-fluffy-md hover:bg-rose-50 hover:border-rose-300 flex items-center space-x-2 transition-all transform hover:scale-105"
        title="打开新手玩法手册与规则说明"
      >
        <HelpCircle class="w-4 h-4 text-rose-500" />
        <span>💡 玩法手册</span>
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
  Shield,
  Plus,
  ClipboardList,
  Download,
  Search,
  X,
  Layers,
  FileQuestion,
  HelpCircle
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

import { useRuleStore } from './stores/ruleStore';
import { IfThenRule } from './types';

const ruleStore = useRuleStore();

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
  a.download = `Acumen-Backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>
