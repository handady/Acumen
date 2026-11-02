<template>
  <header class="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-theme-border shadow-fluffy-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- 品牌 Logo 与标题 -->
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-400 to-rose-500 flex items-center justify-center text-white shadow-fluffy-md">
          <Sparkles class="w-5 h-5" />
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <span class="font-bold text-lg text-theme-text-main tracking-tight font-mono">Acumen</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 font-medium">v2.0 治愈粉</span>
          </div>
          <p class="text-xs text-theme-text-muted hidden sm:block">If-Then 认知判例库与自动采风探针</p>
        </div>
      </div>

      <!-- 中间核心工作区 Tab 切换 -->
      <nav class="flex items-center space-x-1 p-1 bg-theme-secondary rounded-xl border border-theme-border">
        <button
          @click="$emit('change-tab', 'deck')"
          :class="[
            'flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
            activeTab === 'deck'
              ? 'bg-white text-rose-600 shadow-fluffy-sm'
              : 'text-theme-text-muted hover:text-theme-text-main'
          ]"
        >
          <Layers class="w-4 h-4" />
          <span>🎴 规则图鉴与探针</span>
        </button>

        <button
          @click="$emit('change-tab', 'sandbox')"
          :class="[
            'flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
            activeTab === 'sandbox'
              ? 'bg-white text-rose-600 shadow-fluffy-sm'
              : 'text-theme-text-muted hover:text-theme-text-main'
          ]"
        >
          <FlaskConical class="w-4 h-4" />
          <span>🔬 主动诊断沙盒</span>
        </button>
      </nav>

      <!-- 右侧功能入口 -->
      <div class="flex items-center space-x-2">
        <button
          @click="$emit('open-scenes')"
          title="更换/管理采风场景"
          class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-theme-text-muted hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
        >
          <Image class="w-4 h-4 text-rose-400" />
          <span class="hidden md:inline">场景工坊</span>
        </button>

        <button
          @click="$emit('open-manual')"
          title="新手玩法手册"
          class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-theme-text-muted hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
        >
          <HelpCircle class="w-4 h-4 text-rose-400" />
          <span class="hidden md:inline">玩法手册</span>
        </button>

        <button
          @click="$emit('open-settings')"
          title="API 与安全设置"
          class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-theme-text-muted hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
        >
          <Settings class="w-4 h-4 text-theme-text-muted" />
          <span class="hidden md:inline">设置</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Sparkles, Layers, FlaskConical, Image, HelpCircle, Settings } from 'lucide-vue-next';

defineProps<{
  activeTab: 'deck' | 'sandbox';
}>();

defineEmits<{
  (e: 'change-tab', tab: 'deck' | 'sandbox'): void;
  (e: 'open-scenes'): void;
  (e: 'open-manual'): void;
  (e: 'open-settings'): void;
}>();
</script>
