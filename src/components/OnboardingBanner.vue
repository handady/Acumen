<template>
  <div
    v-if="settingsStore.showOnboardingBanner"
    class="relative overflow-hidden mb-6 rounded-2xl bg-gradient-to-r from-rose-50 via-rose-100/50 to-pink-50 border border-rose-200/80 p-4 shadow-fluffy-sm transition-all duration-300"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-start space-x-3">
        <div class="mt-0.5 p-2 rounded-xl bg-rose-500/10 text-rose-600 flex-shrink-0">
          <Sparkles class="w-5 h-5 text-rose-500" />
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="text-sm font-semibold text-theme-text-main">
              🌸 30 秒上手认知判例库：三步实战升级
            </h3>
            <span class="text-[11px] px-2 py-0.2 rounded-full bg-rose-200 text-rose-700 font-mono">免 API 开箱即玩</span>
          </div>

          <div class="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-theme-text-muted">
            <div class="flex items-start space-x-2 bg-white/70 backdrop-blur-sm p-2 rounded-xl border border-rose-100">
              <span class="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-mono text-[10px] font-bold">1</span>
              <span><strong>装填探针</strong>：在卡片图鉴挑选 1~3 张规则，点击「📡 装入采风行囊」。</span>
            </div>

            <div class="flex items-start space-x-2 bg-white/70 backdrop-blur-sm p-2 rounded-xl border border-rose-100">
              <span class="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-mono text-[10px] font-bold">2</span>
              <span><strong>极速巡逻</strong>：点击探针面板上的「⚡ 5秒极速测试」，触发真实世界事件碰撞。</span>
            </div>

            <div class="flex items-start space-x-2 bg-white/70 backdrop-blur-sm p-2 rounded-xl border border-rose-100">
              <span class="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-mono text-[10px] font-bold">3</span>
              <span><strong>拆开收菜</strong>：检阅《采风遭遇战报告》，点击「一键收录」升级卡片等级！</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center space-x-1 flex-shrink-0">
        <button
          @click="dismissOnce"
          class="p-1.5 rounded-lg text-theme-text-dim hover:text-theme-text-main hover:bg-rose-100 transition-colors"
          title="暂时收起"
        >
          <ChevronUp class="w-4 h-4" />
        </button>
        <button
          @click="dismissPermanently"
          class="p-1.5 rounded-lg text-theme-text-dim hover:text-rose-600 hover:bg-rose-100 transition-colors"
          title="不再提示"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sparkles, ChevronUp, X } from 'lucide-vue-next';
import { useSettingsStore } from '../stores/settingsStore';

const settingsStore = useSettingsStore();

function dismissOnce() {
  settingsStore.showOnboardingBanner = false;
}

function dismissPermanently() {
  settingsStore.setOnboardingBanner(false);
}
</script>
