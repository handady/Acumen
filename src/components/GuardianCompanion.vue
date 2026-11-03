<template>
  <!-- 屏幕右下角案头守护神兽托台 (常驻陪伴 · 拟物温润 · 零压迫感) -->
  <aside aria-label="案头守护伙伴" class="fixed bottom-5 right-5 z-40 flex items-center space-x-2 select-none">
    <!-- 玩法手册轻量胶囊入口 -->
    <button
      type="button"
      @click="$emit('open-manual')"
      class="px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-theme-text-main border border-white/90 shadow-[0_4px_16px_rgba(225,120,115,0.1)] hover:shadow-fluffy-md font-medium text-xs flex items-center space-x-1.5 transition-all transform hover:scale-105 active:scale-95 backdrop-blur-md"
      title="翻开认知心法手札玩法手册"
    >
      <BookOpen class="w-3.5 h-3.5 text-rose-500" />
      <span class="font-sans">玩法指南</span>
    </button>

    <!-- 守护神兽实木小托台 -->
    <div class="relative flex items-center p-1.5 rounded-2xl bg-gradient-to-b from-[#fdf7f3]/95 via-[#faeee4]/90 to-[#f2dfd1]/95 border border-[#e8cebc]/80 shadow-[0_8px_24px_rgba(140,80,60,0.14)] backdrop-blur-md">
      <!-- 摸摸神兽主按钮 -->
      <button
        type="button"
        @click="petCompanion"
        class="relative flex items-center space-x-1.5 p-1 rounded-xl hover:bg-white/60 transition-all transform active:scale-95 group"
        title="点击摸摸小神兽 · 听听它的小心声"
      >
        <!-- 呼吸浮动的小神兽形象 -->
        <div class="relative w-11 h-11 flex items-center justify-center animate-breathe">
          <!-- 🐯 萌虎寅宝手绘实物矢量 -->
          <svg v-if="activeCompanion === 'tiger'" viewBox="0 0 44 44" class="w-11 h-11 filter drop-shadow-[0_4px_6px_rgba(85,45,35,0.22)]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="22" cy="38" rx="16" ry="3.5" fill="rgba(85,45,35,0.24)" />
            <ellipse cx="22" cy="37.5" rx="13" ry="2.2" fill="rgba(65,30,25,0.32)" />
            <ellipse cx="22" cy="27" rx="16" ry="11" fill="url(#guard-tiger-fur)" />
            <ellipse cx="22" cy="29" rx="10" ry="7" fill="#fff9ee" />
            <circle cx="12" cy="14" r="5.5" fill="#f89e47" stroke="#dc7118" stroke-width="0.9" />
            <circle cx="12" cy="14" r="3.2" fill="#fca5a5" />
            <circle cx="32" cy="14" r="5.5" fill="#f89e47" stroke="#dc7118" stroke-width="0.9" />
            <circle cx="32" cy="14" r="3.2" fill="#fca5a5" />
            <ellipse cx="22" cy="21" rx="13" ry="11" fill="url(#guard-tiger-fur)" stroke="#dc7118" stroke-width="0.9" />
            <path d="M19 13H25M20.5 15.5H23.5M22 12V16.5" stroke="#873f15" stroke-width="1.3" stroke-linecap="round" />
            <path d="M10 20L13.5 21M10 23L13.5 23" stroke="#a7501b" stroke-width="1.1" stroke-linecap="round" />
            <path d="M34 20L30.5 21M34 23L30.5 23" stroke="#a7501b" stroke-width="1.1" stroke-linecap="round" />
            <path d="M16 21C17 19.5 18.8 19.5 20 21" stroke="#4a2211" stroke-width="1.4" stroke-linecap="round" />
            <path d="M24 21C25.2 19.5 27 19.5 28 21" stroke="#4a2211" stroke-width="1.4" stroke-linecap="round" />
            <ellipse cx="15.5" cy="23" rx="2.2" ry="1.4" fill="#fca5a5" opacity="0.85" />
            <ellipse cx="28.5" cy="23" rx="2.2" ry="1.4" fill="#fca5a5" opacity="0.85" />
            <path d="M21.2 23H22.8L22 24.3L21.2 23Z" fill="#e11d48" />
            <ellipse cx="16.5" cy="33" rx="4" ry="2.5" fill="#fff9ee" stroke="#f6a35c" stroke-width="0.9" />
            <ellipse cx="27.5" cy="33" rx="4" ry="2.5" fill="#fff9ee" stroke="#f6a35c" stroke-width="0.9" />
            <defs>
              <linearGradient id="guard-tiger-fur" x1="10" y1="10" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                <stop stop-color="#ffb76b" />
                <stop offset="0.6" stop-color="#f99b45" />
                <stop offset="1" stop-color="#ea7e26" />
              </linearGradient>
            </defs>
          </svg>

          <!-- 🦁 金狮莱恩手绘实物矢量 -->
          <svg v-else viewBox="0 0 44 44" class="w-11 h-11 filter drop-shadow-[0_4px_6px_rgba(85,45,35,0.22)]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="22" cy="38" rx="16" ry="3.5" fill="rgba(85,45,35,0.24)" />
            <ellipse cx="22" cy="37.5" rx="13" ry="2.2" fill="rgba(65,30,25,0.32)" />
            <circle cx="22" cy="22" r="16" fill="url(#guard-lion-mane)" />
            <circle cx="10" cy="15" r="5.5" fill="#f59e0b" opacity="0.55" />
            <circle cx="34" cy="15" r="5.5" fill="#f59e0b" opacity="0.55" />
            <circle cx="9" cy="26" r="5.5" fill="#f59e0b" opacity="0.55" />
            <circle cx="35" cy="26" r="5.5" fill="#f59e0b" opacity="0.55" />
            <circle cx="22" cy="22" r="10.5" fill="url(#guard-lion-face)" stroke="#d97706" stroke-width="0.9" />
            <circle cx="14" cy="14" r="3.5" fill="#fbbf24" stroke="#d97706" stroke-width="0.9" />
            <circle cx="14" cy="14" r="2" fill="#fcd34d" />
            <circle cx="30" cy="14" r="3.5" fill="#fbbf24" stroke="#d97706" stroke-width="0.9" />
            <circle cx="30" cy="14" r="2" fill="#fcd34d" />
            <path d="M17 21L18.5 19.5L20 21" stroke="#5c2e0b" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M24 21L25.5 19.5L27 21" stroke="#5c2e0b" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            <ellipse cx="15.5" cy="24" rx="2.2" ry="1.4" fill="#fda4af" opacity="0.85" />
            <ellipse cx="28.5" cy="24" rx="2.2" ry="1.4" fill="#fda4af" opacity="0.85" />
            <ellipse cx="22" cy="23.5" rx="1.6" ry="1.1" fill="#78350f" />
            <path d="M20.8 25C21.5 26 22.5 26 23.2 25" stroke="#78350f" stroke-width="1.1" stroke-linecap="round" />
            <ellipse cx="17.5" cy="33" rx="4" ry="2.5" fill="#fef3c7" stroke="#f59e0b" stroke-width="0.9" />
            <ellipse cx="26.5" cy="33" rx="4" ry="2.5" fill="#fef3c7" stroke="#f59e0b" stroke-width="0.9" />
            <defs>
              <radialGradient id="guard-lion-mane" cx="0.5" cy="0.4" r="0.6">
                <stop stop-color="#fcd34d" />
                <stop offset="0.7" stop-color="#f59e0b" />
                <stop offset="1" stop-color="#d97706" />
              </radialGradient>
              <linearGradient id="guard-lion-face" x1="12" y1="12" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stop-color="#fffbeb" />
                <stop offset="0.6" stop-color="#fef3c7" />
                <stop offset="1" stop-color="#fde68a" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div class="text-left hidden sm:block pr-1">
          <div class="flex items-center space-x-1">
            <span class="text-xs font-bold text-theme-text-main font-sans">
              {{ activeCompanion === 'tiger' ? '寅宝' : '莱恩' }}
            </span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <span class="text-[9px] text-theme-text-muted block">
            打盹陪伴中
          </span>
        </div>
      </button>

      <!-- 切换神兽微钮 -->
      <button
        type="button"
        @click.stop="toggleCompanion"
        class="p-1.5 rounded-lg hover:bg-white/80 text-rose-400 hover:text-rose-600 transition-all"
        title="换另一只神兽摆件陪伴"
      >
        <RefreshCw class="w-3.5 h-3.5 transform hover:rotate-180 transition-transform duration-500" />
      </button>

      <!-- 弹出式心声便签气泡 -->
      <Transition name="bubble-pop">
        <div
          v-if="showWhisper"
          class="absolute bottom-16 right-0 z-50 w-64 p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-rose-200 shadow-fluffy-lg text-xs space-y-1.5 pointer-events-auto"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium text-rose-600 flex items-center space-x-1">
              <span>{{ activeCompanion === 'tiger' ? '🐯 寅宝悄悄说：' : '🦁 莱恩轻声说：' }}</span>
            </span>
            <button @click="showWhisper = false" class="text-theme-text-dim hover:text-theme-text-main p-0.5 rounded-lg hover:bg-rose-50">
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
          <p class="text-theme-text-main text-[11px] leading-relaxed font-sans">
            {{ currentWhisper }}
          </p>
          <div class="text-[9px] text-rose-400 text-right pt-0.5 font-mono">
            ~ 你的专属书房案头守护伙伴 ~
          </div>
        </div>
      </Transition>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BookOpen, RefreshCw, X } from 'lucide-vue-next';

defineEmits<{
  (e: 'open-manual'): void;
}>();

const activeCompanion = ref<'tiger' | 'lion'>(
  (localStorage.getItem('acumen_active_companion') as 'tiger' | 'lion') || 'tiger'
);

const showWhisper = ref(false);
const currentWhisper = ref('');
let whisperTimer: ReturnType<typeof setTimeout> | null = null;

const TIGER_WHISPERS = [
  '“有我替你守着呢，那些没边界的打扰休想冲散你的专注。”',
  '“感觉被外界信息消耗了？合上屏幕去吃块小点心吧，我陪你。”',
  '“慢慢写，真正的定力都是安静生长出来的。”',
  '“谁敢模糊你的界限，我就替你朝他奶凶嗷呜一声！”',
  '“深呼吸三次，先把手从键盘移开，理智马上就回到你身边啦。”'
];

const LION_WHISPERS = [
  '“你已经做得非常棒了，别被别人的评价乱了内心的节奏。”',
  '“阳光正好，把底线大大方方亮出来，世界反而会对你更温柔。”',
  '“伸个大懒腰，我们从容不迫，今天没什么大不了的事。”',
  '“心定了，脚下的步子就稳。我会一直为你照亮前路。”',
  '“遇到模糊的要求？反手给他们两个明确的选项，底气给足你！”'
];

function toggleCompanion() {
  activeCompanion.value = activeCompanion.value === 'tiger' ? 'lion' : 'tiger';
  localStorage.setItem('acumen_active_companion', activeCompanion.value);
  petCompanion();
}

function petCompanion() {
  const pool = activeCompanion.value === 'tiger' ? TIGER_WHISPERS : LION_WHISPERS;
  const randIdx = Math.floor(Math.random() * pool.length);
  currentWhisper.value = pool[randIdx];
  showWhisper.value = true;

  if (whisperTimer) clearTimeout(whisperTimer);
  whisperTimer = setTimeout(() => {
    showWhisper.value = false;
  }, 6000);
}
</script>

<style scoped>
@keyframes soft-breathe {
  0%, 100% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.03) translateY(-1px);
  }
}

.animate-breathe {
  animation: soft-breathe 4s ease-in-out infinite;
}

.bubble-pop-enter-active,
.bubble-pop-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.bubble-pop-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.92);
}

.bubble-pop-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.94);
}
</style>
