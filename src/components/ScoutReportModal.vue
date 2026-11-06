<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-black/35 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-fluffy-lg border border-rose-100 overflow-hidden z-10 flex flex-col max-h-[90vh]">
      <!-- 头部：手帐封套风 -->
      <div class="px-6 py-4 bg-gradient-to-r from-apricot-50 via-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-400 to-pink-400 text-white flex items-center justify-center shadow-sm">
            <BookOpen class="w-4 h-4" />
          </div>
          <div>
            <h2 class="text-base font-bold text-theme-text-main">生活切片见闻札记</h2>
            <p class="text-xs text-theme-text-muted">探针漫步时拾得的真实生活故事与认知对照</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-rose-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 报告主体（便签长卷） -->
      <div class="p-6 space-y-5 overflow-y-auto flex-1">
        <!-- 1. 遭遇的野生事件切片 -->
        <div class="p-4 rounded-2xl bg-[#fef8f6] border border-rose-100 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-semibold text-rose-600 flex items-center space-x-1.5">
                <span>🕊️</span>
                <span>漫步拾遗 · {{ scoutStore.session.lootEvent?.category || '真实情境' }}</span>
              </span>
              <span
                v-if="(scoutStore.session.lootEvent as any)?.source === 'DEEPSEEK_WEB_SEARCH'"
                class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center space-x-1"
                title="由 DeepSeek 官方自研搜索引擎围绕心法关键词定向全网检索"
              >
                <span>🔍 DeepSeek 官方全网定向搜索</span>
              </span>
              <span
                v-else-if="(scoutStore.session.lootEvent as any)?.source === 'LIVE_WEB_HOTLIST'"
                class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80"
              >
                🌐 网络实时真实热点
              </span>
              <span
                v-else
                class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200/80"
              >
                📖 真实生活切片
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <a
                v-if="(scoutStore.session.lootEvent as any)?.url"
                :href="(scoutStore.session.lootEvent as any).url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[11px] text-blue-500 hover:text-blue-700 hover:underline flex items-center space-x-0.5"
                title="前往查看原网页"
              >
                <span>查看原帖</span>
                <span class="text-[10px]">↗</span>
              </a>
              <span class="text-[11px] font-mono text-theme-text-dim">
                {{ scoutStore.session.lootEvent?.id }}
              </span>
            </div>
          </div>
          <h3 class="text-sm font-bold text-theme-text-main flex items-center space-x-1.5">
            <span>{{ scoutStore.session.lootEvent?.title }}</span>
          </h3>
          <div class="text-xs text-theme-text-muted leading-relaxed bg-white/90 p-3 rounded-xl border border-rose-100 font-sans max-h-56 overflow-y-auto whitespace-pre-wrap selection:bg-rose-100">
            {{ scoutStore.session.lootEvent?.content }}
          </div>
        </div>

        <!-- 2. 心法印照与对照解析 -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <h4 class="text-xs font-bold text-theme-text-main uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles class="w-4 h-4 text-rose-400" />
                <span>心法照见结果</span>
              </h4>

              <!-- 真实研判成功徽标 -->
              <span
                v-if="scoutStore.session.isLiveAI"
                class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center space-x-1"
                title="已连通 DeepSeek 依据 10 条硬约束完成真实碰撞研判"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>✨ DeepSeek 实时研判</span>
              </span>

              <!-- 离线或报错徽标（100%客观真实呈现，绝不虚假宣传） -->
              <span
                v-else
                class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1"
                :title="scoutStore.session.aiError || '未连通大模型'"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>⚠️ 离线降级 (未连通大模型)</span>
              </span>
            </div>
            <button
              type="button"
              @click="copyPrompt"
              class="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors flex items-center space-x-1"
            >
              <Copy class="w-3.5 h-3.5" />
              <span>{{ copyStatus || '复制诊断 Prompt' }}</span>
            </button>
          </div>

          <!-- 离线/异常提示条 -->
          <div
            v-if="!scoutStore.session.isLiveAI"
            class="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-800 space-y-1"
          >
            <div class="flex items-center space-x-1.5 font-bold">
              <AlertCircle class="w-4 h-4 text-amber-600" />
              <span>大模型未成功执行碰撞研判</span>
            </div>
            <p class="text-[11px] text-amber-700 pl-5">
              原因：{{ scoutStore.session.aiError || '未配置 API Key 或网络连通失败' }}。
              <span class="text-theme-text-dim">当前展示为兜底记录，未强行伪造吻合项。可前往顶部「⚙️ 设置与数据中心」配置并测试 API 连通性。</span>
            </p>
          </div>

          <!-- EVENT 定性：温和紫调 -->
          <div v-if="parsedResult.event" class="p-3.5 rounded-2xl bg-[#fbf7fd] border border-[#ebdcf5] text-xs space-y-1">
            <div class="font-bold text-[#7b5294] flex items-center space-x-1.5">
              <span class="w-2 h-2 rounded-full bg-[#9a6ebd]"></span>
              <span>前因定性：{{ parsedResult.event.cause }}</span>
              <span v-if="parsedResult.event.causeSupplement" class="text-[#7b5294]/80 font-normal">
                ({{ parsedResult.event.causeSupplement }})
              </span>
            </div>
            <p class="text-[#59396e] text-[11px] pl-3.5 leading-relaxed">
              <strong>细节依据：</strong>{{ parsedResult.event.evidence }}
            </p>
          </div>

          <!-- APPLY 吻合项：鼠尾草浅绿 -->
          <div v-if="parsedResult.applyList.length > 0" class="space-y-2">
            <span class="text-xs font-medium text-sage-600 flex items-center space-x-1">
              <span class="w-2 h-2 rounded-full bg-sage-500"></span>
              <span>吻合心法（完全适用）</span>
            </span>
            <div
              v-for="(item, idx) in parsedResult.applyList"
              :key="idx"
              class="p-3.5 rounded-2xl bg-sage-50 border border-sage-200/80 text-xs space-y-1"
            >
              <div class="font-mono font-bold text-sage-700 flex items-center justify-between">
                <span>{{ item.ruleId }}</span>
                <span class="text-[10px] bg-white text-sage-700 border border-sage-200 px-2 py-0.5 rounded-full font-sans">
                  完全吻合
                </span>
              </div>
              <p class="text-sage-800 text-[11px] leading-relaxed">{{ item.detail }}</p>
            </div>
          </div>

          <!-- NEAR-MISS 辨思项：蜜桃杏橙 -->
          <div v-if="parsedResult.nearMissList.length > 0" class="space-y-2">
            <span class="text-xs font-medium text-apricot-600 flex items-center space-x-1">
              <span class="w-2 h-2 rounded-full bg-apricot-500"></span>
              <span>辨思反例（表面相似但机理不符 · 珍贵边界）</span>
            </span>
            <div
              v-for="(item, idx) in parsedResult.nearMissList"
              :key="idx"
              class="p-3.5 rounded-2xl bg-apricot-50 border border-apricot-200/80 text-xs space-y-1"
            >
              <div class="font-mono font-bold text-apricot-700 flex items-center justify-between">
                <span>{{ item.ruleId }}</span>
                <span class="text-[10px] bg-white text-apricot-700 border border-apricot-200 px-2 py-0.5 rounded-full font-sans">
                  机理辨析
                </span>
              </div>
              <p class="text-apricot-800 text-[11px] leading-relaxed">{{ item.detail }}</p>
            </div>
          </div>

          <!-- UNCERTAIN 待定项：柔雾灰紫 -->
          <div v-if="parsedResult.uncertainList.length > 0" class="space-y-2">
            <span class="text-xs font-medium text-stone-600 flex items-center space-x-1">
              <span class="w-2 h-2 rounded-full bg-stone-400"></span>
              <span>留白待定（信息不足）</span>
            </span>
            <div
              v-for="(item, idx) in parsedResult.uncertainList"
              :key="idx"
              class="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1"
            >
              <div class="font-mono font-bold text-stone-700">
                {{ item.ruleId }}
              </div>
              <p class="text-stone-600 text-[11px] leading-relaxed">{{ item.detail }}</p>
            </div>
          </div>

          <!-- 原始文本折叠 -->
          <details class="text-[11px] text-theme-text-dim pt-1">
            <summary class="cursor-pointer hover:text-theme-text-main">
              查看诊断原始 Markdown 文本
            </summary>
            <pre class="mt-2 p-3 rounded-2xl bg-[#2a1d20] text-rose-100 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto">{{ scoutStore.session.lootAnalysisRaw }}</pre>
          </details>
        </div>
      </div>

      <!-- 底部收录按钮：温暖桃粉 -->
      <div class="px-6 py-4 bg-rose-50/30 border-t border-rose-100 flex items-center justify-between">
        <div class="text-xs text-theme-text-muted">
          可收获
          <span class="font-medium text-rose-600">{{ totalMountedCount }} 条生活印记</span>
        </div>

        <div class="flex items-center space-x-3">
          <button
            type="button"
            @click="handleDiscard"
            class="px-4 py-2 rounded-xl text-xs font-medium text-theme-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="放弃收录此篇见闻，探针重置回待机状态"
          >
            暂不收录 (跳过)
          </button>
          <button
            type="button"
            @click="handleClaim"
            class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-400 via-rose-500 to-pink-500 text-white text-xs font-medium shadow-fluffy-sm hover:from-rose-500 hover:to-pink-600 flex items-center space-x-1.5 transition-all transform active:scale-95"
          >
            <Heart class="w-4 h-4 fill-white/80" />
            <span>记入心法手札 (留存印记)</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { BookOpen, X, Sparkles, Copy, Heart, AlertCircle } from 'lucide-vue-next';
import confetti from 'canvas-confetti';
import { useScoutStore } from '../stores/scoutStore';
import { useSettingsStore } from '../stores/settingsStore';
import { parseDiagnosticOutput } from '../utils/parser';
import { buildDiagnosticPrompt } from '../utils/aiClient';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const scoutStore = useScoutStore();
const settingsStore = useSettingsStore();
const copyStatus = ref('');

const parsedResult = computed(() => {
  return parseDiagnosticOutput(scoutStore.session.lootAnalysisRaw || '');
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
  // 柔和马卡龙色纸屑
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#fca5a5', '#fde68a', '#a7f3d0', '#ddd6fe', '#fbcfe8']
  });

  scoutStore.claimLootAndMount();
  emit('close');
}

function handleDiscard() {
  scoutStore.discardLoot();
  emit('close');
}
</script>
