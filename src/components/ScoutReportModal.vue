<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-fluffy-lg border border-rose-100 overflow-hidden z-10 flex flex-col max-h-[90vh]">
      <!-- 头部 -->
      <div class="px-6 py-4 bg-gradient-to-r from-emerald-50 via-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
            <Compass class="w-4 h-4" />
          </div>
          <div>
            <h2 class="text-base font-bold text-theme-text-main">采风遭遇战报告</h2>
            <p class="text-xs text-theme-text-muted">探针外出巡逻碰撞所得的野生真实事件切片</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-rose-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 报告主体 -->
      <div class="p-6 space-y-5 overflow-y-auto flex-1">
        <!-- 1. 遭遇的野生事件切片 -->
        <div class="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-rose-600 flex items-center space-x-1">
              <Sparkles class="w-3.5 h-3.5" />
              <span>野生捕获 · {{ scoutStore.session.lootEvent?.category || '真实世界困境' }}</span>
            </span>
            <span class="text-[11px] font-mono text-theme-text-dim">
              {{ scoutStore.session.lootEvent?.id }}
            </span>
          </div>
          <h3 class="text-sm font-bold text-theme-text-main">
            {{ scoutStore.session.lootEvent?.title }}
          </h3>
          <p class="text-xs text-theme-text-muted leading-relaxed bg-white/80 p-3 rounded-xl border border-rose-100 font-sans">
            {{ scoutStore.session.lootEvent?.content }}
          </p>
        </div>

        <!-- 2. 规则碰撞与诊断结果可视化 -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-theme-text-main uppercase tracking-wider flex items-center space-x-1.5">
              <FileCheck class="w-4 h-4 text-emerald-500" />
              <span>10条硬约束碰撞诊断结果</span>
            </h4>
            <button
              type="button"
              @click="copyPrompt"
              class="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors flex items-center space-x-1"
            >
              <Copy class="w-3.5 h-3.5" />
              <span>{{ copyStatus || '复制本次遭遇战 Prompt' }}</span>
            </button>
          </div>

          <!-- 解析出的 EVENT 前因定性 -->
          <div v-if="parsedResult.event" class="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs space-y-1">
            <div class="font-bold text-purple-700 flex items-center space-x-1.5">
              <span class="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>EVENT 定性：{{ parsedResult.event.cause }}</span>
              <span v-if="parsedResult.event.causeSupplement" class="text-purple-600 font-normal">
                ({{ parsedResult.event.causeSupplement }})
              </span>
            </div>
            <p class="text-purple-900/80 text-[11px] pl-3.5">
              <strong>依据：</strong>{{ parsedResult.event.evidence }}
            </p>
          </div>

          <!-- 解析出的 APPLY 命中项 -->
          <div v-if="parsedResult.applyList.length > 0" class="space-y-2">
            <span class="text-xs font-semibold text-emerald-700 flex items-center space-x-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>APPLY 命中判例 (每条 +2 EXP)</span>
            </span>
            <div
              v-for="(item, idx) in parsedResult.applyList"
              :key="idx"
              class="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1"
            >
              <div class="font-mono font-bold text-emerald-700 flex items-center justify-between">
                <span>{{ item.ruleId }}</span>
                <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-sans">
                  完全命中
                </span>
              </div>
              <p class="text-emerald-900/90 text-[11px]">{{ item.detail }}</p>
            </div>
          </div>

          <!-- 解析出的 NEAR-MISS 近似误判项 -->
          <div v-if="parsedResult.nearMissList.length > 0" class="space-y-2">
            <span class="text-xs font-semibold text-amber-700 flex items-center space-x-1">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>NEAR-MISS 近似误判 (机制不符，每条 +3 EXP 边界奖励)</span>
            </span>
            <div
              v-for="(item, idx) in parsedResult.nearMissList"
              :key="idx"
              class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1"
            >
              <div class="font-mono font-bold text-amber-700 flex items-center justify-between">
                <span>{{ item.ruleId }}</span>
                <span class="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-sans">
                  高精度反例
                </span>
              </div>
              <p class="text-amber-900/90 text-[11px]">{{ item.detail }}</p>
            </div>
          </div>

          <!-- 解析出的 UNCERTAIN 待定项 -->
          <div v-if="parsedResult.uncertainList.length > 0" class="space-y-2">
            <span class="text-xs font-semibold text-zinc-600 flex items-center space-x-1">
              <span class="w-2 h-2 rounded-full bg-zinc-400"></span>
              <span>UNCERTAIN 待定 (每条 +1 EXP)</span>
            </span>
            <div
              v-for="(item, idx) in parsedResult.uncertainList"
              :key="idx"
              class="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1"
            >
              <div class="font-mono font-bold text-zinc-700">
                {{ item.ruleId }}
              </div>
              <p class="text-zinc-600 text-[11px]">{{ item.detail }}</p>
            </div>
          </div>

          <!-- 诊断原始文本折叠查看 -->
          <details class="text-[11px] text-theme-text-dim pt-1">
            <summary class="cursor-pointer hover:text-theme-text-main">
              查看诊断原始 Markdown 文本
            </summary>
            <pre class="mt-2 p-3 rounded-xl bg-zinc-900 text-zinc-200 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto">{{ scoutStore.session.lootAnalysisRaw }}</pre>
          </details>
        </div>
      </div>

      <!-- 底部收菜按钮 -->
      <div class="px-6 py-4 bg-gray-50/80 border-t border-rose-100 flex items-center justify-between">
        <div class="text-xs text-theme-text-muted">
          预计升级收获：
          <span class="font-mono font-bold text-emerald-600">+{{ totalExpEarned }} EXP</span>
          （{{ totalMountedCount }} 个真实判例）
        </div>

        <div class="flex items-center space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl text-xs font-medium text-theme-text-muted hover:text-theme-text-main"
          >
            暂不收录
          </button>
          <button
            type="button"
            @click="handleClaim"
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-fluffy-sm hover:from-emerald-600 hover:to-teal-700 flex items-center space-x-1.5 transition-all transform active:scale-95"
          >
            <Sparkles class="w-4 h-4" />
            <span>一键收录至对应卡片 (EXP +{{ totalExpEarned }})</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Compass, X, Sparkles, FileCheck, Copy } from 'lucide-vue-next';
import confetti from 'canvas-confetti';
import { useScoutStore } from '../stores/scoutStore';
import { parseDiagnosticOutput } from '../utils/parser';
import { buildDiagnosticPrompt } from '../utils/aiClient';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const scoutStore = useScoutStore();
const copyStatus = ref('');

const parsedResult = computed(() => {
  return parseDiagnosticOutput(scoutStore.session.lootAnalysisRaw || '');
});

const totalExpEarned = computed(() => {
  const applyExp = parsedResult.value.applyList.length * 2;
  const nearMissExp = parsedResult.value.nearMissList.length * 3;
  const uncertainExp = parsedResult.value.uncertainList.length * 1;
  return applyExp + nearMissExp + uncertainExp;
});

const totalMountedCount = computed(() => {
  return (
    parsedResult.value.applyList.length +
    parsedResult.value.nearMissList.length +
    parsedResult.value.uncertainList.length
  );
});

async function copyPrompt() {
  if (!scoutStore.session.lootEvent) return;
  const prompt = buildDiagnosticPrompt(
    scoutStore.equippedRules,
    scoutStore.session.lootEvent.content
  );
  try {
    await navigator.clipboard.writeText(prompt);
    copyStatus.value = '已复制 Prompt！';
    setTimeout(() => {
      copyStatus.value = '';
    }, 2000);
  } catch {
    copyStatus.value = '复制失败，请手动选取';
  }
}

function handleClaim() {
  // 触发全屏五彩纸屑庆祝动画
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f87171', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6']
  });

  const { mountedCount, gainedExp } = scoutStore.claimLootAndMount();
  emit('close');
}
</script>
