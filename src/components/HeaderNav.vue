<template>
  <header class="sticky top-0 z-40 w-full bg-[#fdf8f7]/85 backdrop-blur-md border-b border-rose-200/60 shadow-fluffy-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- 品牌 Logo 与标题 -->
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 via-rose-500 to-pink-500 flex items-center justify-center text-white shadow-fluffy-sm">
          <Heart class="w-5 h-5 fill-white/90" />
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <span class="font-bold text-lg text-theme-text-main tracking-tight font-sans">Acumen</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-rose-100/80 text-rose-700 font-sans font-medium">温暖手札</span>
            <span
              v-if="ruleStore.isServerOnline"
              class="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80"
              title="已连接本地 SQLite 单文件数据库 (server/data/acumen.db)"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>SQLite 已联机</span>
            </span>
          </div>
          <p class="text-[11px] text-theme-text-muted hidden sm:block">If-Then 认知手札与生活漫步采风</p>
        </div>
      </div>

      <!-- 中间核心工作区 Tab 切换 -->
      <nav class="flex items-center space-x-1 p-1 bg-white/80 rounded-2xl border border-rose-200/70 shadow-sm">
        <button
          @click="$emit('change-tab', 'deck')"
          :class="[
            'flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200',
            activeTab === 'deck'
              ? 'bg-rose-500 text-white shadow-fluffy-sm'
              : 'text-theme-text-muted hover:text-theme-text-main hover:bg-rose-50/50'
          ]"
        >
          <BookOpen class="w-4 h-4" />
          <span>📖 心法手札与漫步</span>
        </button>

        <button
          @click="$emit('change-tab', 'sandbox')"
          :class="[
            'flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200',
            activeTab === 'sandbox'
              ? 'bg-rose-500 text-white shadow-fluffy-sm'
              : 'text-theme-text-muted hover:text-theme-text-main hover:bg-rose-50/50'
          ]"
        >
          <Sparkles class="w-4 h-4" />
          <span>🔬 主动心智沙盒</span>
        </button>
      </nav>

      <!-- 右侧功能入口 -->
      <div class="flex items-center space-x-1.5 sm:space-x-2">
        <button
          @click="$emit('open-onboarding')"
          title="30秒手札上手体验速览"
          class="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-700 bg-rose-50/90 hover:bg-rose-100 border border-rose-200/80 transition-all shadow-sm"
        >
          <Sparkles class="w-3.5 h-3.5 text-rose-500" />
          <span>30s 速览</span>
        </button>

        <button
          @click="$emit('open-scenes')"
          title="更换/管理采风飘窗风景"
          class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-theme-text-muted hover:text-rose-600 hover:bg-rose-50/80 border border-transparent hover:border-rose-200 transition-all"
        >
          <Compass class="w-4 h-4 text-rose-400" />
          <span class="hidden md:inline">飘窗风景</span>
        </button>

        <button
          @click="$emit('open-manual')"
          title="玩法与心智指引"
          class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-theme-text-muted hover:text-rose-600 hover:bg-rose-50/80 border border-transparent hover:border-rose-200 transition-all"
        >
          <BookOpen class="w-4 h-4 text-rose-400" />
          <span class="hidden md:inline">心法指南</span>
        </button>

        <button
          @click="$emit('open-settings')"
          title="设置与安全备份"
          class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-theme-text-muted hover:text-rose-600 hover:bg-rose-50/80 border border-transparent hover:border-rose-200 transition-all"
        >
          <Settings class="w-4 h-4 text-theme-text-muted" />
          <span class="hidden md:inline">设置</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Heart, BookOpen, Sparkles, Compass, Settings } from 'lucide-vue-next';
import { useRuleStore } from '../stores/ruleStore';

const ruleStore = useRuleStore();

defineProps<{
  activeTab: 'deck' | 'sandbox';
}>();

defineEmits<{
  (e: 'change-tab', tab: 'deck' | 'sandbox'): void;
  (e: 'open-onboarding'): void;
  (e: 'open-scenes'): void;
  (e: 'open-manual'): void;
  (e: 'open-settings'): void;
}>();
</script>
