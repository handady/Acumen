<template>
  <!-- WorkBuddy 风格轻灵采风舱 (去压迫感 · 探针探头萌伴 · 留白呼吸感) -->
  <div class="relative w-full h-full rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_12px_36px_rgba(225,120,115,0.07)] hover:shadow-[0_16px_42px_rgba(225,120,115,0.1)] p-5 sm:p-6 flex flex-col justify-between transition-all duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
    
    <!-- 顶部突破卡片边缘的纯真小柴犬探伴 (软萌肉爪扒在边缘 · 纯真大眼无眼镜 · 治愈呼吸) -->
    <div class="absolute -top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
      <div class="relative flex flex-col items-center animate-float">
        <!-- 治愈纯真小柴犬手绘实物矢量 -->
        <svg viewBox="0 0 68 56" class="w-16 h-13 filter drop-shadow-[0_6px_12px_rgba(180,90,50,0.22)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- 旅行小背包 (背在身后) -->
          <rect x="10" y="18" width="12" height="18" rx="4" fill="#6ba27e" stroke="#487859" stroke-width="1.2" />
          <path d="M12 24H20M12 28H20" stroke="#3b6248" stroke-width="1" stroke-linecap="round" />

          <!-- 两只软萌立耳 (暖金橙外耳与粉嫩内耳) -->
          <path d="M18 20L23 5C24 2 28 3 29 7L31 20H18Z" fill="#ea8f3d" stroke="#ca7225" stroke-width="1.2" stroke-linejoin="round" />
          <path d="M21 18L24 8C24.5 6.5 26.5 6.5 27 8L28.5 18H21Z" fill="#fda4af" />
          
          <path d="M49 20L44 5C43 2 39 3 38 7L36 20H49Z" fill="#ea8f3d" stroke="#ca7225" stroke-width="1.2" stroke-linejoin="round" />
          <path d="M46 18L43 8C42.5 6.5 40.5 6.5 40 8L38.5 18H46Z" fill="#fda4af" />

          <!-- 圆嘟嘟柴犬小脑袋 (暖金毛色) -->
          <ellipse cx="34" cy="27" rx="17" ry="15" fill="url(#shiba-fur-grad)" stroke="#ca7225" stroke-width="1.2" />

          <!-- 柴犬两颊白肉与鼻梁奶白腮斑 (标志性白脸纹) -->
          <path d="M20 28C20 37 27 40 34 40C41 40 48 37 48 28C48 25 43 27 34 27C25 27 20 25 20 28Z" fill="#fffaf2" />
          <path d="M30 18C30 16 38 16 38 18C38 23 30 23 30 18Z" fill="#fffaf2" opacity="0.9" />

          <!-- 额头两颗标志性的白色小眉豆 -->
          <ellipse cx="27" cy="18" rx="2" ry="2.5" fill="#ffffff" />
          <ellipse cx="41" cy="18" rx="2" ry="2.5" fill="#ffffff" />

          <!-- 纯真清澈的大黑葡萄圆眼 (无任何眼镜、无护目镜、自带水润高光) -->
          <circle cx="27" cy="24" r="3.2" fill="#2d170b" />
          <circle cx="26" cy="23" r="1.1" fill="#ffffff" />
          <circle cx="28.2" cy="25" r="0.6" fill="#ffffff" />

          <circle cx="41" cy="24" r="3.2" fill="#2d170b" />
          <circle cx="40" cy="23" r="1.1" fill="#ffffff" />
          <circle cx="42.2" cy="25" r="0.6" fill="#ffffff" />

          <!-- 软萌粉嫩小腮红 -->
          <ellipse cx="21" cy="29" rx="2.5" ry="1.6" fill="#fca5a5" opacity="0.85" />
          <ellipse cx="47" cy="29" rx="2.5" ry="1.6" fill="#fca5a5" opacity="0.85" />

          <!-- 湿漉漉小黑鼻 -->
          <ellipse cx="34" cy="28.5" rx="2.2" ry="1.5" fill="#24140e" />

          <!-- 微笑小三瓣嘴与探出的一点点粉嫩小舌尖 -->
          <path d="M32 31C33 32 34 32 34 31C34 32 35 32 36 31" stroke="#4a2613" stroke-width="1.2" stroke-linecap="round" />
          <path d="M33 32C33 34 35 34 35 32H33Z" fill="#fb7185" />

          <!-- 探险暖橙小领巾 -->
          <path d="M24 39C29 42 39 42 44 39L41 45C37 47 31 47 27 45L24 39Z" fill="#f97316" stroke="#c2410c" stroke-width="1" />
          <circle cx="34" cy="42" r="1.5" fill="#fef08a" />

          <!-- 两只软乎乎白前爪 (扒在卡片边缘上) -->
          <ellipse cx="23" cy="46" rx="4.5" ry="3.2" fill="#ffffff" stroke="#e0b89b" stroke-width="1" />
          <ellipse cx="45" cy="46" rx="4.5" ry="3.2" fill="#ffffff" stroke="#e0b89b" stroke-width="1" />
          <!-- 爪瓣微纹 -->
          <path d="M22 47V48M24 47V48" stroke="#ca7225" stroke-width="0.8" stroke-linecap="round" />
          <path d="M44 47V48M46 47V48" stroke="#ca7225" stroke-width="0.8" stroke-linecap="round" />

          <defs>
            <linearGradient id="shiba-fur-grad" x1="18" y1="12" x2="50" y2="40" gradientUnits="userSpaceOnUse">
              <stop stop-color="#fca954" />
              <stop offset="0.6" stop-color="#f09038" />
              <stop offset="1" stop-color="#dc7720" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>

    <!-- 上部：卡片标题与轻灵指引文案 (WorkBuddy 极简呼吸感) -->
    <div class="pt-2 text-center space-y-1">
      <div class="flex items-center justify-between">
        <!-- 左侧幽默轻巧的小标记 -->
        <span class="text-[11px] font-mono text-rose-500 font-medium px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100">
          探针采风舱
        </span>

        <h3 class="text-sm font-bold text-theme-text-main font-sans tracking-tight">
          想让小柴今天去哪里逛逛？
        </h3>

        <!-- 右侧切换场景小按钮 -->
        <button
          @click="$emit('open-scenes')"
          class="p-1 rounded-lg text-theme-text-dim hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="更换漫步场景"
        >
          <Sparkles class="w-3.5 h-3.5 text-rose-400" />
        </button>
      </div>
    </div>

    <!-- 中部：纯净治愈的 16:9 风景视窗 (WorkBuddy 视窗轮廓) -->
    <div class="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-sm border border-rose-100/80 my-3 group select-none">
      <!-- 场景背景图 -->
      <img
        v-if="scoutStore.activeScene.backgroundUrl"
        :src="scoutStore.activeScene.backgroundUrl"
        alt="Scene"
        class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-[0.94]"
      />
      <!-- 无图保底 -->
      <div v-else class="w-full h-full bg-gradient-to-br from-rose-100 via-apricot-100 to-amber-100 flex items-center justify-center">
        <Sparkles class="w-8 h-8 text-rose-400 animate-pulse" />
      </div>

      <!-- 视窗左上角风景胶囊标签 -->
      <div class="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium flex items-center space-x-1">
        <span>📍</span>
        <span>{{ scoutStore.activeScene.name }}</span>
      </div>

      <!-- 视窗状态底部温和浮条 -->
      <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent pt-6 pb-2.5 px-3 text-center">
        <p class="text-white/95 text-xs font-medium tracking-wide drop-shadow-sm truncate">
          <span v-if="scoutStore.session.status === 'SCOUTING'">
            {{ scoutStore.activeScene.statusText }}
          </span>
          <span v-else-if="scoutStore.session.status === 'READY_TO_CLAIM'" class="text-amber-200">
            ✨ 探针漫步归来 · 带回了 1 篇生活见闻手札！
          </span>
          <span v-else class="text-rose-100">
            预计漫步约 30 分钟 · 记得稍后来看看它
          </span>
        </p>
      </div>
    </div>

    <!-- 下部：极简温暖状态与大圆角胶囊操作按钮 (WorkBuddy 风格核心) -->
    <div class="space-y-3">
      <!-- 状态 A：待机 (IDLE) - 极简出行确认 -->
      <div v-if="scoutStore.session.status === 'IDLE'" class="space-y-2.5">
        <div class="flex items-center justify-between text-[11px] text-theme-text-muted px-1">
          <span>随身携带了 {{ scoutStore.session.equippedRuleIds.length }} 篇心法</span>
          <span class="text-rose-500 font-medium">⚡ 5秒快速采风</span>
        </div>

        <button
          type="button"
          @click="startScouting"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white font-medium text-xs sm:text-sm shadow-fluffy-sm hover:from-rose-600 hover:to-pink-700 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01] active:scale-95"
        >
          <Send class="w-4 h-4" />
          <span>确定派出探针 · 漫步采风</span>
        </button>
      </div>

      <!-- 状态 B：采风中 (SCOUTING) - 沉静陪伴感倒计时 -->
      <div v-else-if="scoutStore.session.status === 'SCOUTING'" class="space-y-2.5 text-center">
        <div class="flex items-center justify-between text-xs px-1">
          <span class="text-rose-600 flex items-center space-x-1.5 font-medium">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>漫步中，剩余约</span>
          </span>
          <span class="font-mono font-bold text-rose-600 text-base">
            {{ remainingTimeString }}
          </span>
        </div>

        <button
          type="button"
          @click="scoutStore.recallNow()"
          class="w-full py-2.5 rounded-2xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all active:scale-95"
        >
          <Coffee class="w-3.5 h-3.5 text-rose-400" />
          <span>唤它早些回家喝茶 (立即完成)</span>
        </button>
      </div>

      <!-- 状态 C：归来收菜 (READY_TO_CLAIM) - 欢快收信感 -->
      <div v-else-if="scoutStore.session.status === 'READY_TO_CLAIM'" class="space-y-2">
        <div class="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-center">
          <span class="text-[11px] text-amber-800 font-medium truncate block">
            💌 探针带回了：{{ scoutStore.session.lootEvent?.title || '一则真实的生活切片' }}
          </span>
        </div>

        <button
          type="button"
          @click="$emit('open-report')"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white font-medium text-xs sm:text-sm shadow-fluffy-md hover:from-rose-600 hover:to-pink-700 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01] active:scale-95"
        >
          <BookOpen class="w-4 h-4 text-white" />
          <span>翻开生活手札 (感悟照见)</span>
        </button>
      </div>

      <!-- 底部温暖小脚注 -->
      <p class="text-[10px] text-theme-text-dim text-center font-sans">
        在琐事中捕捉行为偏差 · 让心法真正落地扎根
      </p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  Sparkles,
  Send,
  Coffee,
  Heart,
  BookOpen
} from 'lucide-vue-next';
import { useScoutStore } from '../stores/scoutStore';

defineEmits<{
  (e: 'open-scenes'): void;
  (e: 'open-report'): void;
}>();

const scoutStore = useScoutStore();

// 默认 5 秒极速快速测试体验
const currentTime = ref(Date.now());
let timerInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  scoutStore.checkExpiry();
  timerInterval = setInterval(() => {
    currentTime.value = Date.now();
    scoutStore.checkExpiry();
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

const remainingSeconds = computed(() => {
  if (scoutStore.session.status !== 'SCOUTING' || !scoutStore.session.endTime) return 0;
  return Math.max(0, Math.floor((scoutStore.session.endTime - currentTime.value) / 1000));
});

const remainingTimeString = computed(() => {
  const total = remainingSeconds.value;
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

function startScouting() {
  scoutStore.launchScout(0.0833);
}
</script>
