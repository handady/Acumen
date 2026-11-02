<template>
  <div class="relative w-full rounded-3xl overflow-hidden bg-white border border-rose-200/80 shadow-fluffy-md flex flex-col transition-all">
    <!-- 上半区：16:9 沉浸式视窗 -->
    <div class="relative w-full aspect-[16/9] bg-slate-900 overflow-hidden flex items-center justify-center select-none">
      <!-- 1. 背景图（若有 backgroundUrl） -->
      <img
        v-if="scoutStore.activeScene.backgroundUrl"
        :src="scoutStore.activeScene.backgroundUrl"
        alt="Scene Background"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
      />

      <!-- 2. 若无图片，纯 CSS 动态声呐雷达 / 像素光斑科技视效 -->
      <div v-else class="absolute inset-0 bg-gradient-to-br from-[#1a0f12] via-[#241316] to-[#0f0709] flex items-center justify-center">
        <!-- 环形网格 -->
        <div class="absolute w-64 h-64 rounded-full border border-rose-500/20"></div>
        <div class="absolute w-48 h-48 rounded-full border border-rose-500/30"></div>
        <div class="absolute w-32 h-32 rounded-full border border-rose-500/40"></div>
        <div class="absolute w-16 h-16 rounded-full border border-rose-500/50"></div>

        <!-- 扫描雷达指针 -->
        <div class="absolute w-64 h-64 rounded-full animate-radar origin-center pointer-events-none">
          <div class="w-1/2 h-1/2 bg-gradient-to-br from-rose-500/30 to-transparent rounded-tl-full"></div>
        </div>

        <!-- 中心信标光点 -->
        <div class="relative w-4 h-4 rounded-full bg-rose-400 shadow-[0_0_16px_#f87171] animate-ping"></div>
        <div class="absolute w-3 h-3 rounded-full bg-white"></div>
      </div>

      <!-- 3. 前景独立角色（可选，呼吸浮动动画） -->
      <div v-if="scoutStore.activeScene.characterUrl" class="absolute z-10 animate-float">
        <img :src="scoutStore.activeScene.characterUrl" alt="Scout Avatar" class="w-20 h-20 object-contain drop-shadow-lg" />
      </div>

      <!-- 4. 右上角：更换场景快捷按钮 -->
      <button
        @click="$emit('open-scenes')"
        class="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/40 hover:bg-black/60 text-white/90 text-xs backdrop-blur-md border border-white/20 flex items-center space-x-1.5 transition-all shadow-sm"
        title="更换/管理采风场景"
      >
        <Image class="w-3.5 h-3.5 text-rose-300" />
        <span class="font-sans text-[11px]">{{ scoutStore.activeScene.name }}</span>
      </button>

      <!-- 5. 底部渐变遮罩与状态文案 -->
      <div class="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-12 pb-3 px-4 text-center">
        <p class="text-white text-xs sm:text-sm font-semibold tracking-wide drop-shadow-md">
          <span v-if="scoutStore.session.status === 'SCOUTING'">
            {{ scoutStore.activeScene.statusText }}
          </span>
          <span v-else-if="scoutStore.session.status === 'READY_TO_CLAIM'" class="text-emerald-300 flex items-center justify-center space-x-1">
            <CheckCircle2 class="w-4 h-4 inline" />
            <span>采风巡逻完成！探针已满载野生事件归来</span>
          </span>
          <span v-else class="text-rose-200">
            探针已就绪 · 请挑选 1~3 张规则卡装入行囊
          </span>
        </p>
      </div>
    </div>

    <!-- 下半区：纯白/浅粉极简信息面板 -->
    <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 bg-gradient-to-b from-white to-rose-50/30">
      <!-- 状态 A：待机装填 (IDLE) -->
      <div v-if="scoutStore.session.status === 'IDLE'" class="space-y-4">
        <!-- 行囊卡槽 -->
        <div>
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="font-medium text-theme-text-main flex items-center space-x-1">
              <Briefcase class="w-3.5 h-3.5 text-rose-500" />
              <span>探针行囊 (最多装载 3 张)</span>
            </span>
            <span class="font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              {{ scoutStore.session.equippedRuleIds.length }}/3
            </span>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <!-- 槽位 1, 2, 3 -->
            <div
              v-for="slotIdx in [0, 1, 2]"
              :key="slotIdx"
              :class="[
                'p-2 rounded-xl border text-xs min-h-[52px] flex flex-col justify-center transition-all',
                scoutStore.equippedRules[slotIdx]
                  ? 'bg-rose-50/80 border-rose-300 shadow-sm'
                  : 'bg-white border-dashed border-rose-200 text-theme-text-dim text-center'
              ]"
            >
              <div v-if="scoutStore.equippedRules[slotIdx]" class="relative group">
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-rose-600 text-[11px]">
                    {{ scoutStore.equippedRules[slotIdx].id }}
                  </span>
                  <button
                    @click="scoutStore.toggleEquipRule(scoutStore.equippedRules[slotIdx].id)"
                    class="text-rose-400 hover:text-rose-700"
                    title="卸下规则"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </div>
                <p class="truncate text-[10px] text-theme-text-muted mt-0.5">
                  {{ scoutStore.equippedRules[slotIdx].ifCondition }}
                </p>
              </div>
              <div v-else class="text-[11px]">
                点击卡片上「装入行囊」
              </div>
            </div>
          </div>
        </div>

        <!-- 采风时长选择 -->
        <div>
          <label class="block text-xs font-medium text-theme-text-muted mb-1.5">巡逻时长模式</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              @click="selectedDuration = 0.0833"
              :class="[
                'py-2 px-1 rounded-xl border text-xs font-medium text-center transition-all',
                selectedDuration === 0.0833
                  ? 'bg-rose-500 text-white border-rose-500 shadow-fluffy-sm'
                  : 'bg-white border-rose-200 text-theme-text-main hover:bg-rose-50'
              ]"
            >
              ⚡ 5秒极速测
            </button>
            <button
              type="button"
              @click="selectedDuration = 45"
              :class="[
                'py-2 px-1 rounded-xl border text-xs font-medium text-center transition-all',
                selectedDuration === 45
                  ? 'bg-rose-500 text-white border-rose-500 shadow-fluffy-sm'
                  : 'bg-white border-rose-200 text-theme-text-main hover:bg-rose-50'
              ]"
            >
              45分钟 (番茄)
            </button>
            <button
              type="button"
              @click="selectedDuration = 180"
              :class="[
                'py-2 px-1 rounded-xl border text-xs font-medium text-center transition-all',
                selectedDuration === 180
                  ? 'bg-rose-500 text-white border-rose-500 shadow-fluffy-sm'
                  : 'bg-white border-rose-200 text-theme-text-main hover:bg-rose-50'
              ]"
            >
              3小时 (沉浸)
            </button>
          </div>
        </div>

        <!-- 启动按钮 -->
        <button
          type="button"
          @click="startScouting"
          :disabled="scoutStore.session.equippedRuleIds.length === 0"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 text-white font-semibold text-sm shadow-fluffy-md hover:from-rose-500 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99]"
        >
          <Send class="w-4 h-4" />
          <span>派出探测器采风巡逻</span>
        </button>
      </div>

      <!-- 状态 B：采风挂机中 (SCOUTING) -->
      <div v-else-if="scoutStore.session.status === 'SCOUTING'" class="space-y-4 py-1 text-center">
        <!-- 倒计时面板 -->
        <div class="flex flex-col items-center">
          <span class="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-medium">
            <Radio class="w-3 h-3 animate-pulse text-rose-500" />
            <span>距离回家</span>
          </span>

          <div class="mt-2 text-3xl sm:text-4xl font-extrabold font-mono text-rose-600 tracking-wider">
            {{ remainingTimeString }}
          </div>
        </div>

        <!-- 轮播提示与行囊提示 -->
        <div class="p-2 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-theme-text-muted text-center truncate">
          <span class="text-rose-500 font-mono font-medium">
            已装载 {{ scoutStore.equippedRules.map(r => r.id).join('、') }}
          </span>
          <span> · 正在野生事件池中搜寻边界反例...</span>
        </div>

        <!-- 提前召回/加速完成按钮 -->
        <div class="flex items-center space-x-2 pt-1">
          <button
            type="button"
            @click="scoutStore.recallNow()"
            class="w-full py-2.5 rounded-xl border border-rose-300 bg-white text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center justify-center space-x-1.5 transition-all shadow-sm"
          >
            <Zap class="w-3.5 h-3.5 text-amber-500" />
            <span>立即召回 / 极速完成结算</span>
          </button>
        </div>
      </div>

      <!-- 状态 C：归来收菜 (READY_TO_CLAIM) -->
      <div v-else-if="scoutStore.session.status === 'READY_TO_CLAIM'" class="space-y-4 py-2 text-center">
        <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-rose-50 to-emerald-50 border border-emerald-200 shadow-sm animate-pulse">
          <div class="flex items-center justify-center space-x-1.5 text-emerald-700 font-semibold text-sm">
            <Gift class="w-5 h-5 text-emerald-600" />
            <span>📦 采风归来！捕获 1 个高价值野生事件</span>
          </div>
          <p class="text-xs text-theme-text-muted mt-1 truncate">
            {{ scoutStore.session.lootEvent?.title || '发现未知冲突切片' }}
          </p>
        </div>

        <button
          type="button"
          @click="$emit('open-report')"
          class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600 text-white font-bold text-sm shadow-fluffy-md hover:from-emerald-500 hover:to-teal-700 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99]"
        >
          <Sparkles class="w-4 h-4" />
          <span>✨ 拆开采风遭遇战报告与收菜</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  Image,
  Briefcase,
  X,
  Send,
  Radio,
  Zap,
  Gift,
  Sparkles,
  CheckCircle2
} from 'lucide-vue-next';
import { useScoutStore } from '../stores/scoutStore';

defineEmits<{
  (e: 'open-scenes'): void;
  (e: 'open-report'): void;
}>();

const scoutStore = useScoutStore();
const selectedDuration = ref<number>(0.0833); // 默认 5 秒极速测试

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
  const diff = Math.max(0, Math.floor((scoutStore.session.endTime - currentTime.value) / 1000));
  return diff;
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
