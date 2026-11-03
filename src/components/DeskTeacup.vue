<template>
  <!-- 书桌案头白瓷热茶摆件 (伴书静心 · 真实光影与水汽微动) -->
  <div class="relative inline-flex items-center select-none">
    <div
      class="relative group cursor-pointer"
      @click="triggerTeaCup"
      title="案头一杯温润热茶 · 记得常喝温水"
    >
      <!-- 升腾的轻柔蒸汽微粒 (双缕升腾微动) -->
      <div class="absolute -top-5 left-1/2 -translate-x-1/2 w-6 h-7 pointer-events-none overflow-visible z-10">
        <div class="steam steam-1"></div>
        <div class="steam steam-2"></div>
        <div class="steam steam-3"></div>
      </div>

      <!-- 实物白瓷杯容器与深沉投影 -->
      <div class="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transform group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
        <svg viewBox="0 0 44 44" class="w-11 h-11 sm:w-12 sm:h-12 filter drop-shadow-[0_5px_8px_rgba(95,50,45,0.18)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- 桌面上杯底深阴影 -->
          <ellipse cx="21" cy="38" rx="15" ry="3" fill="rgba(85,45,35,0.2)" />
          <ellipse cx="21" cy="37.5" rx="12" ry="2" fill="rgba(65,30,25,0.28)" />

          <!-- 白瓷杯耳把手 -->
          <path d="M31 16C37 16 38 22 38 26C38 30 34 32 30 32" stroke="#e8b8b0" stroke-width="3" stroke-linecap="round" />
          <path d="M31 16C37 16 38 22 38 26C38 30 34 32 30 32" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />

          <!-- 杯身白瓷圆润轮廓 (带手绘微粉暖白釉色) -->
          <path d="M10 14C10 11.5 12 9 22 9C32 9 34 11.5 34 14V27C34 33 29 35.5 22 35.5C15 35.5 10 33 10 27V14Z" fill="url(#teacup-ceramic-grad)" />
          <path d="M10 14C10 11.5 12 9 22 9C32 9 34 11.5 34 14V27C34 33 29 35.5 22 35.5C15 35.5 10 33 10 27V14Z" stroke="#f0c2bb" stroke-width="0.9" />

          <!-- 杯身立体釉面高光与折射弧线 -->
          <path d="M13.5 15V27C13.5 30 15 32 18 32.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="2 3" opacity="0.9" />
          <path d="M17 14V28" stroke="white" stroke-width="0.8" stroke-linecap="round" opacity="0.4" />

          <!-- 杯口内圈与碧螺春清润茶汤水面 -->
          <ellipse cx="22" cy="13.5" rx="10" ry="3.8" fill="#e89e95" opacity="0.28" />
          <ellipse cx="22" cy="14" rx="9" ry="3" fill="url(#teacup-water-grad)" />

          <!-- 茶汤波光反光点与小茶叶瓣 -->
          <ellipse cx="19" cy="13.5" rx="3" ry="1" fill="white" opacity="0.75" />
          <path d="M25 14C24 13.5 23.5 14.5 25 14Z" fill="#38704a" />

          <defs>
            <linearGradient id="teacup-ceramic-grad" x1="10" y1="9" x2="34" y2="35.5" gradientUnits="userSpaceOnUse">
              <stop stop-color="#ffffff" />
              <stop offset="0.45" stop-color="#fff8f6" />
              <stop offset="0.85" stop-color="#fbece8" />
              <stop offset="1" stop-color="#f5ded8" />
            </linearGradient>
            <linearGradient id="teacup-water-grad" x1="13" y1="14" x2="31" y2="14" gradientUnits="userSpaceOnUse">
              <stop stop-color="#78ba92" />
              <stop offset="0.6" stop-color="#5fa579" />
              <stop offset="1" stop-color="#42875b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <!-- 温馨气泡便签 -->
      <Transition name="bubble-pop">
        <div
          v-if="showWhisper"
          class="absolute bottom-14 left-1/2 -translate-x-1/2 z-40 w-56 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-200 shadow-fluffy-md text-xs space-y-1 pointer-events-auto"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium text-rose-600 flex items-center space-x-1">
              <span>🍵 温润热茶：</span>
            </span>
            <button @click="showWhisper = false" class="text-theme-text-dim hover:text-theme-text-main p-0.5 rounded">
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
          <p class="text-theme-text-main text-[11px] leading-relaxed">
            茶香正浓，水温正好。认真思考心法时，也别忘了喝口温水润润嗓子哦。
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';

const showWhisper = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

function triggerTeaCup() {
  showWhisper.value = true;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    showWhisper.value = false;
  }, 4500);
}
</script>

<style scoped>
.steam {
  position: absolute;
  bottom: 0;
  width: 2.5px;
  height: 14px;
  background: linear-gradient(to top, rgba(248, 113, 113, 0.5), transparent);
  border-radius: 9999px;
  opacity: 0;
}

.steam-1 {
  left: 4px;
  animation: steam-rise 3.2s ease-out infinite;
}

.steam-2 {
  left: 11px;
  animation: steam-rise 3.6s ease-out 1.1s infinite;
}

.steam-3 {
  left: 17px;
  animation: steam-rise 3s ease-out 2.2s infinite;
}

@keyframes steam-rise {
  0% {
    transform: translateY(0) scaleX(1);
    opacity: 0;
  }
  30% {
    opacity: 0.65;
  }
  100% {
    transform: translateY(-20px) scaleX(2.5);
    opacity: 0;
  }
}

.bubble-pop-enter-active,
.bubble-pop-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.bubble-pop-enter-from {
  opacity: 0;
  transform: translate(-50%, 8px) scale(0.92);
}

.bubble-pop-leave-to {
  opacity: 0;
  transform: translate(-50%, 6px) scale(0.94);
}
</style>
