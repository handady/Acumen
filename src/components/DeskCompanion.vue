<template>
  <div class="relative flex items-end select-none">
    <!-- 案头温润实木托盘底座 (真实物理感桌面托台与接触阴影) -->
    <div class="relative flex items-end space-x-2 sm:space-x-3 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-gradient-to-b from-[#fdf7f3]/90 via-[#faeee4]/85 to-[#f2dfd1]/90 border border-[#e8cebc]/70 shadow-[0_8px_20px_rgba(140,80,60,0.09),inset_0_1px_1px_rgba(255,255,255,0.8)] backdrop-blur-sm">
      
      <!-- 桌面摆件 1：手绘白瓷热茶杯 (带立体高光、袅袅蒸汽、温热茶汤与添茶心语) -->
      <div
        class="relative group cursor-pointer"
        @click="triggerTeaCup"
        title="点击喝口温润热茶 · 善待自己"
      >
        <!-- 升腾的轻柔蒸汽微粒 (双缕升腾微动) -->
        <div class="absolute -top-5 left-1/2 -translate-x-1/2 w-6 h-7 pointer-events-none overflow-visible z-10">
          <div class="steam steam-1"></div>
          <div class="steam steam-2"></div>
          <div class="steam steam-3"></div>
        </div>

        <!-- 白瓷杯实物容器与接触面深沉投影 -->
        <div class="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transform group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
          <svg viewBox="0 0 44 44" class="w-11 h-11 sm:w-12 sm:h-12 filter drop-shadow-[0_5px_7px_rgba(95,50,45,0.18)]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 木托盘上的杯底深阴影 -->
            <ellipse cx="21" cy="38" rx="15" ry="3" fill="rgba(85,45,35,0.22)" />
            <ellipse cx="21" cy="37.5" rx="12" ry="2" fill="rgba(65,30,25,0.3)" />

            <!-- 白瓷杯耳把手 -->
            <path d="M31 16C37 16 38 22 38 26C38 30 34 32 30 32" stroke="#e8b8b0" stroke-width="3" stroke-linecap="round" />
            <path d="M31 16C37 16 38 22 38 26C38 30 34 32 30 32" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />

            <!-- 杯身白瓷圆润轮廓 (带手绘微粉暖白釉色) -->
            <path d="M10 14C10 11.5 12 9 22 9C32 9 34 11.5 34 14V27C34 33 29 35.5 22 35.5C15 35.5 10 33 10 27V14Z" fill="url(#ceramic-body-grad)" />
            <path d="M10 14C10 11.5 12 9 22 9C32 9 34 11.5 34 14V27C34 33 29 35.5 22 35.5C15 35.5 10 33 10 27V14Z" stroke="#f0c2bb" stroke-width="0.9" />

            <!-- 杯身立体釉面高光与折射弧线 -->
            <path d="M13.5 15V27C13.5 30 15 32 18 32.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="2 3" opacity="0.9" />
            <path d="M17 14V28" stroke="white" stroke-width="0.8" stroke-linecap="round" opacity="0.4" />

            <!-- 杯口内圈与碧螺春清润茶汤水面 -->
            <ellipse cx="22" cy="13.5" rx="10" ry="3.8" fill="#e89e95" opacity="0.28" />
            <ellipse cx="22" cy="14" rx="9" ry="3" fill="url(#real-tea-surface)" />
            
            <!-- 茶汤波光反光点与小茶叶瓣 -->
            <ellipse cx="19" cy="13.5" rx="3" ry="1" fill="white" opacity="0.75" />
            <path d="M25 14C24 13.5 23.5 14.5 25 14Z" fill="#38704a" />

            <defs>
              <linearGradient id="ceramic-body-grad" x1="10" y1="9" x2="34" y2="35.5" gradientUnits="userSpaceOnUse">
                <stop stop-color="#ffffff" />
                <stop offset="0.45" stop-color="#fff8f6" />
                <stop offset="0.85" stop-color="#fbece8" />
                <stop offset="1" stop-color="#f5ded8" />
              </linearGradient>
              <linearGradient id="real-tea-surface" x1="13" y1="14" x2="31" y2="14" gradientUnits="userSpaceOnUse">
                <stop stop-color="#78ba92" />
                <stop offset="0.6" stop-color="#5fa579" />
                <stop offset="1" stop-color="#42875b" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <!-- 桌面摆件 2：粗陶花盆多肉绿植 (带立体陶盆、粗陶颗粒、饱满粉绿多肉与晶莹晨露) -->
      <div
        class="relative group cursor-pointer"
        @click="triggerSucculent"
        title="点击轻拂多肉绿植 · 感受生机静定"
      >
        <div :class="['relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transform group-hover:scale-105 transition-all duration-300', isSucculentWobbling ? 'animate-wobble' : '']">
          <svg viewBox="0 0 44 44" class="w-11 h-11 sm:w-12 sm:h-12 filter drop-shadow-[0_5px_7px_rgba(95,50,45,0.18)]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 盆底落地接触深投影 -->
            <ellipse cx="22" cy="38" rx="13" ry="2.8" fill="rgba(85,45,35,0.22)" />
            <ellipse cx="22" cy="37.5" rx="10" ry="1.8" fill="rgba(65,30,25,0.3)" />

            <!-- 红陶花盆盆身 (手工陶土温润粗砂质感) -->
            <path d="M13 23L16 36C16.3 37 18 37.8 22 37.8C26 37.8 27.7 37 28 36L31 23H13Z" fill="url(#real-terracotta)" />
            <path d="M13 23L16 36C16.3 37 18 37.8 22 37.8C26 37.8 27.7 37 28 36L31 23H13Z" stroke="#9e4933" stroke-width="0.9" />

            <!-- 红陶盆卷沿厚唇口 -->
            <rect x="11.5" y="20" width="21" height="3.8" rx="1.9" fill="#e27c60" stroke="#9e4933" stroke-width="0.9" />
            <rect x="12" y="20.5" width="20" height="1.2" rx="0.6" fill="#f4a38d" opacity="0.8" />

            <!-- 盆内深褐肥沃泥土面 -->
            <ellipse cx="22" cy="20.8" rx="8.5" ry="2.2" fill="#4d2f21" />

            <!-- 肉嘟嘟粉绿多肉饱满叶片 (自下而上层层叠放) -->
            <!-- 底部外展叶片 -->
            <path d="M22 19C17 18 14 14.5 16 12C18.5 9.5 22 15 22 19Z" fill="url(#succ-leaf-left)" />
            <path d="M22 19C27 18 30 14.5 28 12C25.5 9.5 22 15 22 19Z" fill="url(#succ-leaf-right)" />
            <!-- 中层挺立叶片 -->
            <path d="M22 18C18 14.5 18 9.5 21 8.5C23.5 7.5 23.5 13.5 22 18Z" fill="#9cd6b0" />
            <path d="M22 18C26 14.5 26 9.5 23 8.5C20.5 7.5 20.5 13.5 22 18Z" fill="#b4e4c4" />
            
            <!-- 顶端嫩粉心叶与晶莹高光晨露 -->
            <circle cx="22" cy="13" r="3.6" fill="url(#succ-heart-grad)" />
            <circle cx="21" cy="12" r="0.9" fill="white" opacity="0.9" />

            <defs>
              <linearGradient id="real-terracotta" x1="13" y1="23" x2="31" y2="37.8" gradientUnits="userSpaceOnUse">
                <stop stop-color="#e37b5f" />
                <stop offset="0.7" stop-color="#be5d41" />
                <stop offset="1" stop-color="#9a432b" />
              </linearGradient>
              <linearGradient id="succ-leaf-left" x1="15" y1="11" x2="22" y2="19" gradientUnits="userSpaceOnUse">
                <stop stop-color="#fda4af" />
                <stop offset="0.35" stop-color="#84c89a" />
                <stop offset="1" stop-color="#4f9a69" />
              </linearGradient>
              <linearGradient id="succ-leaf-right" x1="29" y1="11" x2="22" y2="19" gradientUnits="userSpaceOnUse">
                <stop stop-color="#fda4af" />
                <stop offset="0.35" stop-color="#92cfab" />
                <stop offset="1" stop-color="#4f9a69" />
              </linearGradient>
              <radialGradient id="succ-heart-grad" cx="0.5" cy="0.4" r="0.6">
                <stop stop-color="#fca5a5" />
                <stop offset="0.65" stop-color="#a3dab6" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      <!-- 分隔微点 -->
      <div class="h-6 w-[1px] bg-[#d9b8a3]/50 my-auto"></div>

      <!-- 桌面摆件 3：手绘毛绒质感守护神兽（🐯 萌虎寅宝 / 🦁 金狮莱恩） -->
      <div class="relative flex items-center">
        <button
          type="button"
          @click="petCompanion"
          class="relative flex items-center space-x-1.5 sm:space-x-2 py-0.5 px-1 sm:px-1.5 rounded-xl hover:bg-white/50 transition-all duration-300 transform active:scale-95 group"
          title="点击摸摸小神兽 · 听听温暖心声"
        >
          <!-- 实物小兽插画形象 (呼吸微动动效) -->
          <div class="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center animate-breathe">
            
            <!-- 🐯 萌虎寅宝手绘实物矢量 -->
            <svg v-if="activeCompanion === 'tiger'" viewBox="0 0 44 44" class="w-11 h-11 sm:w-12 sm:h-12 filter drop-shadow-[0_5px_7px_rgba(95,50,45,0.22)]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 木托盘软影 -->
              <ellipse cx="22" cy="38" rx="16" ry="3.5" fill="rgba(85,45,35,0.24)" />
              <ellipse cx="22" cy="37.5" rx="13" ry="2.2" fill="rgba(65,30,25,0.32)" />

              <!-- 趴着的圆滚滚身体与肉肉后腿 -->
              <ellipse cx="22" cy="27" rx="16" ry="11" fill="url(#tiger-fur-real)" />
              <!-- 小肚皮软毛 -->
              <ellipse cx="22" cy="29" rx="10" ry="7" fill="#fff9ee" />

              <!-- 两只毛茸茸圆耳朵 -->
              <circle cx="12" cy="14" r="5.5" fill="#f89e47" stroke="#dc7118" stroke-width="0.9" />
              <circle cx="12" cy="14" r="3.2" fill="#fca5a5" />
              <circle cx="32" cy="14" r="5.5" fill="#f89e47" stroke="#dc7118" stroke-width="0.9" />
              <circle cx="32" cy="14" r="3.2" fill="#fca5a5" />

              <!-- 圆萌虎头 -->
              <ellipse cx="22" cy="21" rx="13" ry="11" fill="url(#tiger-fur-real)" stroke="#dc7118" stroke-width="0.9" />

              <!-- 额头王字花纹与腮边斑纹 -->
              <path d="M19 13H25M20.5 15.5H23.5M22 12V16.5" stroke="#873f15" stroke-width="1.3" stroke-linecap="round" />
              <path d="M10 20L13.5 21M10 23L13.5 23" stroke="#a7501b" stroke-width="1.1" stroke-linecap="round" />
              <path d="M34 20L30.5 21M34 23L30.5 23" stroke="#a7501b" stroke-width="1.1" stroke-linecap="round" />

              <!-- 眯眼安详睡意 ⌒ ⌒ -->
              <path d="M16 21C17 19.5 18.8 19.5 20 21" stroke="#4a2211" stroke-width="1.4" stroke-linecap="round" />
              <path d="M24 21C25.2 19.5 27 19.5 28 21" stroke="#4a2211" stroke-width="1.4" stroke-linecap="round" />

              <!-- 粉嫩小鼻子与腮红 -->
              <ellipse cx="15.5" cy="23" rx="2.2" ry="1.4" fill="#fca5a5" opacity="0.85" />
              <ellipse cx="28.5" cy="23" rx="2.2" ry="1.4" fill="#fca5a5" opacity="0.85" />
              <path d="M21.2 23H22.8L22 24.3L21.2 23Z" fill="#e11d48" />

              <!-- 前爪搭在下巴前 -->
              <ellipse cx="16.5" cy="33" rx="4" ry="2.5" fill="#fff9ee" stroke="#f6a35c" stroke-width="0.9" />
              <ellipse cx="27.5" cy="33" rx="4" ry="2.5" fill="#fff9ee" stroke="#f6a35c" stroke-width="0.9" />

              <defs>
                <linearGradient id="tiger-fur-real" x1="10" y1="10" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#ffb76b" />
                  <stop offset="0.6" stop-color="#f99b45" />
                  <stop offset="1" stop-color="#ea7e26" />
                </linearGradient>
              </defs>
            </svg>

            <!-- 🦁 金狮莱恩手绘实物矢量 -->
            <svg v-else viewBox="0 0 44 44" class="w-11 h-11 sm:w-12 sm:h-12 filter drop-shadow-[0_5px_7px_rgba(95,50,45,0.22)]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 木托盘投影 -->
              <ellipse cx="22" cy="38" rx="16" ry="3.5" fill="rgba(85,45,35,0.24)" />
              <ellipse cx="22" cy="37.5" rx="13" ry="2.2" fill="rgba(65,30,25,0.32)" />

              <!-- 蓬松金棕色鬃毛外圈 (棉花糖向日葵绒毛) -->
              <circle cx="22" cy="22" r="16" fill="url(#lion-mane-real)" />
              <circle cx="10" cy="15" r="5.5" fill="#f59e0b" opacity="0.55" />
              <circle cx="34" cy="15" r="5.5" fill="#f59e0b" opacity="0.55" />
              <circle cx="9" cy="26" r="5.5" fill="#f59e0b" opacity="0.55" />
              <circle cx="35" cy="26" r="5.5" fill="#f59e0b" opacity="0.55" />

              <!-- 金黄小狮脸庞 -->
              <circle cx="22" cy="22" r="10.5" fill="url(#lion-face-real)" stroke="#d97706" stroke-width="0.9" />

              <!-- 小圆耳朵 -->
              <circle cx="14" cy="14" r="3.5" fill="#fbbf24" stroke="#d97706" stroke-width="0.9" />
              <circle cx="14" cy="14" r="2" fill="#fcd34d" />
              <circle cx="30" cy="14" r="3.5" fill="#fbbf24" stroke="#d97706" stroke-width="0.9" />
              <circle cx="30" cy="14" r="2" fill="#fcd34d" />

              <!-- 眯眼晒暖阳 ^ ^ -->
              <path d="M17 21L18.5 19.5L20 21" stroke="#5c2e0b" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M24 21L25.5 19.5L27 21" stroke="#5c2e0b" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />

              <!-- 粉嫩腮红与鼻头 -->
              <ellipse cx="15.5" cy="24" rx="2.2" ry="1.4" fill="#fda4af" opacity="0.85" />
              <ellipse cx="28.5" cy="24" rx="2.2" ry="1.4" fill="#fda4af" opacity="0.85" />
              <ellipse cx="22" cy="23.5" rx="1.6" ry="1.1" fill="#78350f" />
              <path d="M20.8 25C21.5 26 22.5 26 23.2 25" stroke="#78350f" stroke-width="1.1" stroke-linecap="round" />

              <!-- 软萌前爪 -->
              <ellipse cx="17.5" cy="33" rx="4" ry="2.5" fill="#fef3c7" stroke="#f59e0b" stroke-width="0.9" />
              <ellipse cx="26.5" cy="33" rx="4" ry="2.5" fill="#fef3c7" stroke="#f59e0b" stroke-width="0.9" />

              <defs>
                <radialGradient id="lion-mane-real" cx="0.5" cy="0.4" r="0.6">
                  <stop stop-color="#fcd34d" />
                  <stop offset="0.7" stop-color="#f59e0b" />
                  <stop offset="1" stop-color="#d97706" />
                </radialGradient>
                <linearGradient id="lion-face-real" x1="12" y1="12" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#fffbeb" />
                  <stop offset="0.6" stop-color="#fef3c7" />
                  <stop offset="1" stop-color="#fde68a" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <!-- 摆件状态微标 -->
          <div class="text-left hidden md:block">
            <div class="flex items-center space-x-1">
              <span class="text-xs font-bold text-theme-text-main font-sans">
                {{ activeCompanion === 'tiger' ? '守护萌虎 · 寅宝' : '从容金狮 · 莱恩' }}
              </span>
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <span class="text-[10px] text-theme-text-muted block">
              打盹陪伴中 · 点击听心声
            </span>
          </div>

          <!-- 切换摆件微钮 -->
          <div
            @click.stop="toggleCompanion"
            class="p-1 rounded-lg hover:bg-white/80 text-rose-400 hover:text-rose-600 transition-all ml-0.5"
            title="换另一只神兽摆件陪伴"
          >
            <RefreshCw class="w-3.5 h-3.5 transform group-hover:rotate-180 transition-transform duration-500" />
          </div>
        </button>

        <!-- 弹出式心声便签气泡 -->
        <Transition name="bubble-pop">
          <div
            v-if="showWhisper"
            class="absolute bottom-16 right-0 z-40 w-64 p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-rose-200 shadow-fluffy-lg text-xs space-y-1.5 pointer-events-auto"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium text-rose-600 flex items-center space-x-1">
                <span>{{ whisperTitle }}</span>
              </span>
              <button
                @click="showWhisper = false"
                class="text-theme-text-dim hover:text-theme-text-main p-0.5 rounded-lg hover:bg-rose-50"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </div>
            <p class="text-theme-text-main text-[11px] leading-relaxed font-sans">
              {{ currentWhisper }}
            </p>
            <div class="text-[9px] text-rose-400 text-right pt-0.5 font-mono">
              ~ 你的专属书房案头陪伴摆件 ~
            </div>
          </div>
        </Transition>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RefreshCw, X } from 'lucide-vue-next';

const activeCompanion = ref<'tiger' | 'lion'>(
  (localStorage.getItem('acumen_active_companion') as 'tiger' | 'lion') || 'tiger'
);

const isSucculentWobbling = ref(false);
const showWhisper = ref(false);
const whisperTitle = ref('🐯 寅宝悄悄说：');
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
  whisperTitle.value = activeCompanion.value === 'tiger' ? '🐯 寅宝悄悄说：' : '🦁 莱恩轻声说：';
  const pool = activeCompanion.value === 'tiger' ? TIGER_WHISPERS : LION_WHISPERS;
  const randIdx = Math.floor(Math.random() * pool.length);
  currentWhisper.value = pool[randIdx];
  showWhisper.value = true;

  if (whisperTimer) clearTimeout(whisperTimer);
  whisperTimer = setTimeout(() => {
    showWhisper.value = false;
  }, 6000);
}

function triggerTeaCup() {
  whisperTitle.value = '🍵 案头温润热茶：';
  currentWhisper.value = '“茶香正浓，水温正好。记得在认真思考的同时，善待自己喝口温水哦。”';
  showWhisper.value = true;
  if (whisperTimer) clearTimeout(whisperTimer);
  whisperTimer = setTimeout(() => {
    showWhisper.value = false;
  }, 5000);
}

function triggerSucculent() {
  isSucculentWobbling.value = true;
  setTimeout(() => {
    isSucculentWobbling.value = false;
  }, 600);

  whisperTitle.value = '🌱 窗前多肉盆栽：';
  currentWhisper.value = '“阳光穿透叶尖，多肉又长厚了一点点。你也正在安静而扎实地向下生根呢。”';
  showWhisper.value = true;
  if (whisperTimer) clearTimeout(whisperTimer);
  whisperTimer = setTimeout(() => {
    showWhisper.value = false;
  }, 5000);
}
</script>

<style scoped>
/* 柔和升腾的真实水汽微动 */
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

/* 摆件呼吸动效 */
@keyframes soft-breathe {
  0%, 100% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.025) translateY(-1px);
  }
}

.animate-breathe {
  animation: soft-breathe 4s ease-in-out infinite;
}

/* 多肉轻拂轻晃 */
@keyframes succulent-wobble {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-6deg) scale(1.04);
  }
  75% {
    transform: rotate(6deg) scale(1.04);
  }
}

.animate-wobble {
  animation: succulent-wobble 0.6s ease-in-out;
}

/* 气泡弹跳动画 */
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