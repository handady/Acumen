<template>
  <!-- 飘窗边上的粗陶多肉盆栽 (迎窗晒暖阳 · 露珠轻晃) -->
  <div class="relative inline-flex items-center select-none">
    <div
      class="relative group cursor-pointer"
      @click="triggerSucculent"
      title="窗台多肉小绿植 · 点击轻触生机"
    >
      <div :class="['relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center transform group-hover:scale-105 transition-all duration-300', isWobbling ? 'animate-wobble' : '']">
        <svg viewBox="0 0 44 44" class="w-10 h-10 sm:w-11 sm:h-11 filter drop-shadow-[0_4px_6px_rgba(40,25,20,0.25)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- 窗台接触投影 -->
          <ellipse cx="22" cy="38" rx="13" ry="2.8" fill="rgba(30,15,10,0.3)" />

          <!-- 红陶花盆身 -->
          <path d="M13 23L16 36C16.3 37 18 37.8 22 37.8C26 37.8 27.7 37 28 36L31 23H13Z" fill="url(#window-terracotta)" />
          <path d="M13 23L16 36C16.3 37 18 37.8 22 37.8C26 37.8 27.7 37 28 36L31 23H13Z" stroke="#9e4933" stroke-width="0.9" />

          <!-- 红陶盆卷沿厚唇口 -->
          <rect x="11.5" y="20" width="21" height="3.8" rx="1.9" fill="#e27c60" stroke="#9e4933" stroke-width="0.9" />
          <rect x="12" y="20.5" width="20" height="1.2" rx="0.6" fill="#f4a38d" opacity="0.8" />

          <!-- 盆内深褐肥沃泥土面 -->
          <ellipse cx="22" cy="20.8" rx="8.5" ry="2.2" fill="#4d2f21" />

          <!-- 饱满多肉叶片 (渐变抹茶粉绿带晶莹朝露) -->
          <path d="M22 19C17 18 14 14.5 16 12C18.5 9.5 22 15 22 19Z" fill="url(#window-succ-left)" />
          <path d="M22 19C27 18 30 14.5 28 12C25.5 9.5 22 15 22 19Z" fill="url(#window-succ-right)" />
          <path d="M22 18C18 14.5 18 9.5 21 8.5C23.5 7.5 23.5 13.5 22 18Z" fill="#9cd6b0" />
          <path d="M22 18C26 14.5 26 9.5 23 8.5C20.5 7.5 20.5 13.5 22 18Z" fill="#b4e4c4" />
          
          <!-- 顶端嫩粉心叶与高光晨露 -->
          <circle cx="22" cy="13" r="3.6" fill="url(#window-succ-heart)" />
          <circle cx="21" cy="12" r="0.9" fill="white" opacity="0.9" />

          <defs>
            <linearGradient id="window-terracotta" x1="13" y1="23" x2="31" y2="37.8" gradientUnits="userSpaceOnUse">
              <stop stop-color="#e37b5f" />
              <stop offset="0.7" stop-color="#be5d41" />
              <stop offset="1" stop-color="#9a432b" />
            </linearGradient>
            <linearGradient id="window-succ-left" x1="15" y1="11" x2="22" y2="19" gradientUnits="userSpaceOnUse">
              <stop stop-color="#fda4af" />
              <stop offset="0.35" stop-color="#84c89a" />
              <stop offset="1" stop-color="#4f9a69" />
            </linearGradient>
            <linearGradient id="window-succ-right" x1="29" y1="11" x2="22" y2="19" gradientUnits="userSpaceOnUse">
              <stop stop-color="#fda4af" />
              <stop offset="0.35" stop-color="#92cfab" />
              <stop offset="1" stop-color="#4f9a69" />
            </linearGradient>
            <radialGradient id="window-succ-heart" cx="0.5" cy="0.4" r="0.6">
              <stop stop-color="#fca5a5" />
              <stop offset="0.65" stop-color="#a3dab6" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <!-- 弹出微语气泡 (向上优雅展开，确保绝不被任何容器截断) -->
      <Transition name="bubble-pop">
        <div
          v-if="showWhisper"
          class="absolute bottom-14 right-0 z-50 w-60 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-200 shadow-fluffy-lg text-xs space-y-1 pointer-events-auto"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium text-emerald-700 flex items-center space-x-1">
              <span>🌱 案头多肉：</span>
            </span>
            <button @click="showWhisper = false" class="text-theme-text-dim hover:text-theme-text-main p-0.5 rounded">
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
          <p class="text-theme-text-main text-[11px] leading-relaxed">
            阳光穿透叶尖，多肉又长厚了一点点。你也正在安静而扎实地向下生根呢。
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';

const isWobbling = ref(false);
const showWhisper = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

function triggerSucculent() {
  isWobbling.value = true;
  setTimeout(() => {
    isWobbling.value = false;
  }, 600);

  showWhisper.value = true;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    showWhisper.value = false;
  }, 4500);
}
</script>

<style scoped>
@keyframes succulent-wobble {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-6deg) scale(1.05);
  }
  75% {
    transform: rotate(6deg) scale(1.05);
  }
}

.animate-wobble {
  animation: succulent-wobble 0.6s ease-in-out;
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
