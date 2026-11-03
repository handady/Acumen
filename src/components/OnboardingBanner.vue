<template>
  <div
    v-if="settingsStore.showOnboardingBanner"
    class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-apricot-50 via-rose-50/80 to-pink-50 border border-rose-200/80 p-4 sm:p-5 shadow-fluffy-sm transition-all duration-300"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-start space-x-3.5">
        <div class="mt-0.5 p-2 rounded-2xl bg-rose-500/10 text-rose-600 flex-shrink-0">
          <Heart class="w-5 h-5 text-rose-400 fill-rose-300" />
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="text-sm font-semibold text-theme-text-main">
              🌸 30 秒温暖手札体验：三步写就生活印记
            </h3>
            <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-white/80 text-rose-600 border border-rose-200/80 font-sans">
              免配置 · 开箱随享
            </span>
          </div>

          <div class="mt-2.5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-theme-text-muted">
            <div class="flex items-start space-x-2.5 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-rose-100 shadow-[0_1px_3px_rgba(225,120,115,0.03)]">
              <span class="flex-shrink-0 w-5 h-5 rounded-full bg-rose-400 text-white flex items-center justify-center font-mono text-[11px] font-bold">1</span>
              <span><strong>挑一篇心法</strong>：在手札卡片点「随身携带」放入探针小布袋。</span>
            </div>

            <div class="flex items-start space-x-2.5 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-rose-100 shadow-[0_1px_3px_rgba(225,120,115,0.03)]">
              <span class="flex-shrink-0 w-5 h-5 rounded-full bg-rose-400 text-white flex items-center justify-center font-mono text-[11px] font-bold">2</span>
              <span><strong>邀探针漫步</strong>：点击飘窗上的「⚡ 5秒快速漫步」，让心法在真实生活中碰撞。</span>
            </div>

            <div class="flex items-start space-x-2.5 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-rose-100 shadow-[0_1px_3px_rgba(225,120,115,0.03)]">
              <span class="flex-shrink-0 w-5 h-5 rounded-full bg-rose-400 text-white flex items-center justify-center font-mono text-[11px] font-bold">3</span>
              <span><strong>翻开生活手札</strong>：阅读见闻切片，将生活感悟轻轻留存在这篇心法里。</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center space-x-1 flex-shrink-0">
        <button
          @click="dismissOnce"
          class="p-1.5 rounded-xl text-theme-text-dim hover:text-theme-text-main hover:bg-rose-100/60 transition-colors"
          title="暂时收起"
        >
          <ChevronUp class="w-4 h-4" />
        </button>
        <button
          @click="dismissPermanently"
          class="p-1.5 rounded-xl text-theme-text-dim hover:text-rose-600 hover:bg-rose-100/60 transition-colors"
          title="不再提示"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Heart, ChevronUp, X } from 'lucide-vue-next';
import { useSettingsStore } from '../stores/settingsStore';

const settingsStore = useSettingsStore();

function dismissOnce() {
  settingsStore.showOnboardingBanner = false;
}

function dismissPermanently() {
  settingsStore.setOnboardingBanner(false);
}
</script>
