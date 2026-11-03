<template>
  <div class="relative w-full h-full rounded-3xl overflow-hidden bg-white border border-rose-200/70 shadow-fluffy-sm hover:shadow-fluffy-md flex flex-col justify-between transition-all">
    <!-- 上半区：温润采风飘窗（微缩视窗） -->
    <div class="relative w-full aspect-[16/9] bg-[#2a1b1d] overflow-hidden flex items-center justify-center select-none group">
      <!-- 1. 场景背景图 -->
      <img
        v-if="scoutStore.activeScene.backgroundUrl"
        :src="scoutStore.activeScene.backgroundUrl"
        alt="Scene Background"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-[0.92]"
      />

      <!-- 2. 无图保底：温暖柔光声呐脉冲 -->
      <div v-else class="absolute inset-0 bg-gradient-to-br from-[#2f1c20] via-[#3a2227] to-[#1c1013] flex items-center justify-center">
        <!-- 柔和环圈 -->
        <div class="absolute w-56 h-56 rounded-full border border-rose-400/20"></div>
        <div class="absolute w-40 h-40 rounded-full border border-rose-400/25"></div>
        <div class="absolute w-24 h-24 rounded-full border border-rose-400/35"></div>

        <!-- 柔光微扫描 -->
        <div class="absolute w-56 h-56 rounded-full animate-radar origin-center pointer-events-none">
          <div class="w-1/2 h-1/2 bg-gradient-to-br from-rose-300/25 to-transparent rounded-tl-full"></div>
        </div>

        <!-- 温暖小光点 -->
        <div class="relative w-3.5 h-3.5 rounded-full bg-rose-300 shadow-[0_0_18px_#fca5a5] animate-ping"></div>
        <div class="absolute w-2.5 h-2.5 rounded-full bg-white"></div>
      </div>

      <!-- 3. 前景独立角色（呼吸浮动） -->
      <div v-if="scoutStore.activeScene.characterUrl" class="absolute z-10 animate-float">
        <img :src="scoutStore.activeScene.characterUrl" alt="Scout Avatar" class="w-20 h-20 object-contain drop-shadow-md" />
      </div>

      <!-- 3.5 飘窗微风：轻缓落樱花瓣与暖目光斑 (GPU合成，仅在视窗内舒展) -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div class="absolute -top-3 left-[18%] w-3.5 h-3.5 text-rose-300/70 petal-drift-1" style="animation-delay: 0s;">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9 6 6 10 6 14c0 4 3 7 6 8 3-1 6-4 6-8 0-4-3-8-6-12z"/></svg>
        </div>
        <div class="absolute -top-3 left-[48%] w-2.5 h-2.5 text-pink-200/80 petal-drift-2" style="animation-delay: 2.3s;">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9 6 6 10 6 14c0 4 3 7 6 8 3-1 6-4 6-8 0-4-3-8-6-12z"/></svg>
        </div>
        <div class="absolute -top-3 left-[78%] w-3 h-3 text-rose-200/60 petal-drift-3" style="animation-delay: 4.8s;">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9 6 6 10 6 14c0 4 3 7 6 8 3-1 6-4 6-8 0-4-3-8-6-12z"/></svg>
        </div>
        <div class="absolute -top-3 left-[32%] w-2 h-2 text-apricot-200/70 petal-drift-1" style="animation-delay: 6.2s;">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9 6 6 10 6 14c0 4 3 7 6 8 3-1 6-4 6-8 0-4-3-8-6-12z"/></svg>
        </div>
        <div class="absolute -top-3 left-[62%] w-2.5 h-2.5 text-rose-300/65 petal-drift-2" style="animation-delay: 3.5s;">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9 6 6 10 6 14c0 4 3 7 6 8 3-1 6-4 6-8 0-4-3-8-6-12z"/></svg>
        </div>
      </div>

      <!-- 4. 右上角：更换场景微件 -->
      <button
        @click="$emit('open-scenes')"
        class="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-black/35 hover:bg-black/55 text-white/95 text-xs backdrop-blur-md border border-white/20 flex items-center space-x-1.5 transition-all shadow-sm"
        title="更换或管理采风飘窗风景"
      >
        <Sparkles class="w-3.5 h-3.5 text-rose-300" />
        <span class="font-sans text-[11px]">{{ scoutStore.activeScene.name }}</span>
      </button>

      <!-- 5. 飘窗底部柔和遮罩与治愈文案 -->
      <div class="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/35 to-transparent pt-10 pb-3 px-4 text-center">
        <p class="text-white/95 text-xs sm:text-sm font-medium tracking-wide drop-shadow-sm">
          <span v-if="scoutStore.session.status === 'SCOUTING'">
            {{ scoutStore.activeScene.statusText }}
          </span>
          <span v-else-if="scoutStore.session.status === 'READY_TO_CLAIM'" class="text-amber-200 flex items-center justify-center space-x-1 font-medium">
            <Heart class="w-4 h-4 inline text-rose-300 fill-rose-300" />
            <span>漫步归来 · 探针带回了 1 篇生活见闻手札</span>
          </span>
          <span v-else class="text-rose-100">
            探针在窗前静候 · 挑 1~3 篇想印证的心法装入行囊吧
          </span>
        </p>
      </div>
    </div>

    <!-- 下半区：手帐便签式温润面板 -->
    <div class="p-5 flex-1 flex flex-col justify-between space-y-4 bg-gradient-to-b from-white via-rose-50/20 to-rose-50/40">
      <!-- 状态 A：待机装填 (IDLE) -->
      <div v-if="scoutStore.session.status === 'IDLE'" class="space-y-4">
        <!-- 随身心法布袋槽位 -->
        <div>
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="font-medium text-theme-text-main flex items-center space-x-1.5">
              <Compass class="w-4 h-4 text-rose-500" />
              <span>探针随身布袋 (最多携带 3 篇心法)</span>
            </span>
            <span class="font-mono text-xs text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/80">
              {{ scoutStore.session.equippedRuleIds.length }} / 3
            </span>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="slotIdx in [0, 1, 2]"
              :key="slotIdx"
              :class="[
                'p-2.5 rounded-2xl border text-xs min-h-[58px] flex flex-col justify-center transition-all',
                scoutStore.equippedRules[slotIdx]
                  ? 'bg-rose-50/90 border-rose-200 shadow-sm'
                  : 'bg-white/80 border-dashed border-rose-200/70 text-theme-text-dim text-center'
              ]"
            >
              <div v-if="scoutStore.equippedRules[slotIdx]" class="relative group">
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-rose-600 text-[11px]">
                    {{ scoutStore.equippedRules[slotIdx].id }}
                  </span>
                  <button
                    @click="scoutStore.toggleEquipRule(scoutStore.equippedRules[slotIdx].id)"
                    class="text-rose-300 hover:text-rose-600 transition-colors p-0.5"
                    title="移出布袋"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </div>
                <p class="truncate text-[10px] text-theme-text-muted mt-0.5">
                  {{ scoutStore.equippedRules[slotIdx].ifCondition }}
                </p>
              </div>
              <div v-else class="text-[11px] text-theme-text-dim/80">
                卡片点「随身携带」
              </div>
            </div>
          </div>
        </div>

        <!-- 漫步时长选择 -->
        <div>
          <label class="block text-xs font-medium text-theme-text-muted mb-1.5">漫步节奏</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              @click="selectedDuration = 0.0833"
              :class="[
                'py-2 px-1 rounded-xl border text-xs font-medium text-center transition-all',
                selectedDuration === 0.0833
                  ? 'bg-gradient-to-r from-rose-400 to-rose-500 text-white border-rose-400 shadow-fluffy-sm'
                  : 'bg-white border-rose-200/70 text-theme-text-main hover:bg-rose-50/50'
              ]"
            >
              ⚡ 5秒快速漫步
            </button>
            <button
              type="button"
              @click="selectedDuration = 45"
              :class="[
                'py-2 px-1 rounded-xl border text-xs font-medium text-center transition-all',
                selectedDuration === 45
                  ? 'bg-gradient-to-r from-rose-400 to-rose-500 text-white border-rose-400 shadow-fluffy-sm'
                  : 'bg-white border-rose-200/70 text-theme-text-main hover:bg-rose-50/50'
              ]"
            >
              45分钟 (番茄小憩)
            </button>
            <button
              type="button"
              @click="selectedDuration = 180"
              :class="[
                'py-2 px-1 rounded-xl border text-xs font-medium text-center transition-all',
                selectedDuration === 180
                  ? 'bg-gradient-to-r from-rose-400 to-rose-500 text-white border-rose-400 shadow-fluffy-sm'
                  : 'bg-white border-rose-200/70 text-theme-text-main hover:bg-rose-50/50'
              ]"
            >
              3小时 (半日漫游)
            </button>
          </div>
        </div>

        <!-- 启动按钮 -->
        <button
          type="button"
          @click="startScouting"
          :disabled="scoutStore.session.equippedRuleIds.length === 0"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-400 via-rose-500 to-pink-500 text-white font-medium text-xs sm:text-sm shadow-fluffy-md hover:from-rose-500 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99]"
        >
          <Send class="w-4 h-4" />
          <span>🌸 邀探针出门漫步采风</span>
        </button>
      </div>

      <!-- 状态 B：采风挂机中 (SCOUTING) -->
      <div v-else-if="scoutStore.session.status === 'SCOUTING'" class="space-y-4 py-2 text-center">
        <!-- 倒计时面板 -->
        <div class="flex flex-col items-center">
          <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-medium border border-rose-200/60">
            <Radio class="w-3 h-3 animate-pulse text-rose-400" />
            <span>探针正在慢速漫步 · 预计归家</span>
          </span>

          <div class="mt-2 text-3xl sm:text-4xl font-extrabold font-mono text-rose-600 tracking-wider">
            {{ remainingTimeString }}
          </div>
        </div>

        <!-- 轮播提示与行囊提示 -->
        <div class="p-3 rounded-2xl bg-white/90 border border-rose-100 text-xs text-theme-text-muted text-center shadow-sm">
          <span>正带着 </span>
          <span class="text-rose-600 font-mono font-medium">
            {{ scoutStore.equippedRules.map(r => r.id).join('、') }}
          </span>
          <span> 在现实琐事中体悟边界...</span>
        </div>

        <!-- 提前唤回按钮 -->
        <div class="pt-1">
          <button
            type="button"
            @click="scoutStore.recallNow()"
            class="w-full py-2.5 rounded-xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50/70 text-xs font-medium flex items-center justify-center space-x-1.5 transition-all shadow-sm"
          >
            <Coffee class="w-3.5 h-3.5 text-apricot-500" />
            <span>☕ 唤它早些回家品茶</span>
          </button>
        </div>
      </div>

      <!-- 状态 C：归来收菜 (READY_TO_CLAIM) - 彻底告别刺眼绿，采用温润甜桃杏色 -->
      <div v-else-if="scoutStore.session.status === 'READY_TO_CLAIM'" class="space-y-4 py-2 text-center">
        <div class="p-4 rounded-2xl bg-gradient-to-r from-apricot-50 via-rose-50 to-pink-50 border border-rose-200/80 shadow-sm space-y-1">
          <div class="flex items-center justify-center space-x-1.5 text-rose-700 font-semibold text-xs sm:text-sm">
            <Heart class="w-4 h-4 text-rose-400 fill-rose-300" />
            <span>🕊️ 漫步归来 · 探针带回了 1 页生活小记</span>
          </div>
          <p class="text-xs text-theme-text-main font-medium truncate pt-1">
            {{ scoutStore.session.lootEvent?.title || '一则真实的生活对话' }}
          </p>
        </div>

        <!-- 温暖的拆信按钮（桃粉柔光） -->
        <button
          type="button"
          @click="$emit('open-report')"
          class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-400 via-rose-500 to-pink-500 text-white font-medium text-xs sm:text-sm shadow-fluffy-md hover:from-rose-500 hover:to-pink-600 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99]"
        >
          <BookOpen class="w-4 h-4 text-rose-100" />
          <span>📖 翻开这页生活手札 (感悟照见)</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  Sparkles,
  Compass,
  X,
  Send,
  Radio,
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
const selectedDuration = ref<number>(0.0833);

// 倒计时逻辑
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
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

function startScouting() {
  scoutStore.launchScout(selectedDuration.value);
}
</script>
