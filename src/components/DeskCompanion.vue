<template>
  <div class="relative flex items-center space-x-3 select-none">
    <!-- 桌面摆件 1：冒着袅袅茶气的手绘陶瓷杯 -->
    <div class="relative group cursor-pointer" @click="triggerSteamHeart" title="一杯温润热茶 · 记得常喝水">
      <!-- 升腾的轻柔蒸汽微动 (纯CSS GPU合成) -->
      <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-5 pointer-events-none overflow-visible">
        <div class="steam steam-1"></div>
        <div class="steam steam-2"></div>
      </div>

      <!-- 陶瓷马克杯 SVG -->
      <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-apricot-100 to-rose-100 border border-rose-200/80 flex items-center justify-center shadow-sm transform group-hover:scale-105 transition-transform duration-300">
        <span class="text-xs">🍵</span>
      </div>
    </div>

    <!-- 桌面摆件 2：治愈多肉小绿植 -->
    <div class="relative group cursor-pointer" title="窗台边静静生长的多肉小绿植">
      <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-sage-100 to-emerald-100 border border-sage-200/80 flex items-center justify-center shadow-sm transform group-hover:rotate-6 transition-transform duration-300">
        <span class="text-xs">🪴</span>
      </div>
    </div>

    <!-- 桌面摆件 3：守护神兽（萌虎 🐯 / 金狮 🦁） -->
    <div class="relative">
      <!-- 陪伴小生灵交互实体 -->
      <button
        type="button"
        @click="petCompanion"
        :class="[
          'relative p-1 rounded-2xl border transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center space-x-1.5 shadow-sm transform active:scale-95 group',
          activeCompanion === 'tiger'
            ? 'bg-gradient-to-r from-apricot-50 via-rose-50 to-amber-50 border-apricot-200/90 hover:border-apricot-300'
            : 'bg-gradient-to-r from-amber-50 via-yellow-50 to-rose-50 border-amber-200/90 hover:border-amber-300'
        ]"
        title="点击摸摸小神兽 · 听听它的小心声"
      >
        <!-- 神兽头像插画与微动 -->
        <div class="relative w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center text-lg animate-float">
          <span v-if="activeCompanion === 'tiger'" class="filter drop-shadow-sm">🐯</span>
          <span v-else class="filter drop-shadow-sm">🦁</span>
        </div>

        <div class="text-left pr-1.5 hidden sm:block">
          <div class="flex items-center space-x-1">
            <span class="text-[11px] font-bold text-theme-text-main">
              {{ activeCompanion === 'tiger' ? '守护萌虎 · 寅宝' : '从容金狮 · 莱恩' }}
            </span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <span class="text-[10px] text-theme-text-dim block">
            {{ isSleeping ? '打盹中 · 护你安宁' : '轻声陪伴中' }}
          </span>
        </div>

        <!-- 切换神兽小标签 -->
        <div
          @click.stop="toggleCompanion"
          class="p-1 rounded-lg hover:bg-white/90 text-theme-text-dim hover:text-rose-600 transition-colors"
          title="换另一只神兽陪伴"
        >
          <RefreshCw class="w-3 h-3 transform group-hover:rotate-180 transition-transform duration-500" />
        </div>
      </button>

      <!-- 弹出式心声气泡 (Whisper Popover) -->
      <Transition name="bubble-pop">
        <div
          v-if="showWhisper"
          class="absolute top-12 right-0 z-30 w-64 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-200 shadow-fluffy-md text-xs space-y-1.5 pointer-events-auto"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium text-rose-600 flex items-center space-x-1">
              <span>{{ activeCompanion === 'tiger' ? '🐯 寅宝悄悄说：' : '🦁 莱恩轻声说：' }}</span>
            </span>
            <button
              @click="showWhisper = false"
              class="text-theme-text-dim hover:text-theme-text-main p-0.5"
            >
              <X class="w-3 h-3" />
            </button>
          </div>
          <p class="text-theme-text-main text-[11px] leading-relaxed font-sans">
            {{ currentWhisper }}
          </p>
          <div class="text-[9px] text-rose-400 text-right pt-0.5 font-mono">
            ~ 你的专属书房守护兽 ~
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RefreshCw, X } from 'lucide-vue-next';

const activeCompanion = ref<'tiger' | 'lion'>(
  (localStorage.getItem('acumen_active_companion') as 'tiger' | 'lion') || 'tiger'
);

const isSleeping = ref(false);
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

function triggerSteamHeart() {
  currentWhisper.value = '“茶香正浓，水温正好。记得在认真思考的同时，善待自己一口温水哦 🍵”';
  showWhisper.value = true;
  if (whisperTimer) clearTimeout(whisperTimer);
  whisperTimer = setTimeout(() => {
    showWhisper.value = false;
  }, 5000);
}
</script>

<style scoped>
/* 轻柔升腾的蒸汽动效 */
.steam {
  position: absolute;
  bottom: 0;
  width: 2px;
  height: 12px;
  background: linear-gradient(to top, rgba(248, 113, 113, 0.4), transparent);
  border-radius: 9999px;
  opacity: 0;
}

.steam-1 {
  left: 3px;
  animation: steam-rise 3.2s ease-out infinite;
}

.steam-2 {
  left: 9px;
  animation: steam-rise 3.5s ease-out 1.2s infinite;
}

@keyframes steam-rise {
  0% {
    transform: translateY(0) scaleX(1);
    opacity: 0;
  }
  30% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-16px) scaleX(2.2);
    opacity: 0;
  }
}

/* 气泡弹跳动画 */
.bubble-pop-enter-active,
.bubble-pop-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.bubble-pop-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.92);
}

.bubble-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.94);
}
</style>
