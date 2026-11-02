<template>
  <div class="space-y-6">
    <!-- 头部说明 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-theme-text-main flex items-center space-x-2">
          <span>🔬 主动事件诊断沙盒 (Manual Linter Sandbox)</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-mono">10条硬约束引擎</span>
        </h2>
        <p class="text-xs text-theme-text-muted mt-1">
          手动丢入今天发生的真实事件，与当前规则库进行碰撞。支持一键复制 Prompt 外部运行或直连 API 自动诊断。
        </p>
      </div>

      <!-- 快速填入样例事件按钮 -->
      <div class="flex items-center space-x-2 text-xs">
        <span class="text-theme-text-dim hidden sm:inline">快速试用真实切片：</span>
        <button
          type="button"
          @click="loadSampleEvent(0)"
          class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
        >
          职场切屏摸鱼
        </button>
        <button
          type="button"
          @click="loadSampleEvent(1)"
          class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
        >
          全员信取消福利
        </button>
        <button
          type="button"
          @click="loadSampleEvent(2)"
          class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
        >
          客户发飙长文反驳
        </button>
      </div>
    </div>

    <!-- 双栏主操作区 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- 左栏：事件输入与诊断执行 (占 5 列) -->
      <div class="lg:col-span-5 space-y-4">
        <div class="p-5 rounded-3xl bg-white border border-rose-100 shadow-fluffy-sm space-y-4">
          <!-- 1. 事件输入 -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold text-theme-text-main">
                今天发生的真实事件描述
              </label>
              <span class="text-[11px] text-theme-text-dim">
                必须包含具体动作或原话
              </span>
            </div>
            <textarea
              v-model="eventText"
              rows="5"
              placeholder="例如：下午两点半打开代码编辑器准备重构老系统登录模块，看到涉及 5 个老旧文件的耦合，还没改一行代码就切去刷技术论坛，一刷就是 40 分钟。"
              class="w-full px-3.5 py-2.5 rounded-2xl bg-theme-secondary border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 leading-relaxed font-sans"
            ></textarea>
          </div>

          <!-- 2. 选择比对的规则范围 -->
          <div>
            <div class="flex items-center justify-between mb-1.5 text-xs">
              <label class="font-bold text-theme-text-main">比对规则范围</label>
              <div class="flex items-center space-x-2 text-[11px]">
                <button type="button" @click="selectAllRules" class="text-rose-500 hover:underline">全选</button>
                <span class="text-zinc-300">|</span>
                <button type="button" @click="clearRuleSelection" class="text-theme-text-muted hover:underline">仅当前行囊</button>
              </div>
            </div>

            <div class="max-h-36 overflow-y-auto space-y-1 p-2 rounded-xl bg-theme-secondary/80 border border-rose-100 text-xs">
              <label
                v-for="r in ruleStore.rules"
                :key="r.id"
                class="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  :value="r.id"
                  v-model="selectedRuleIds"
                  class="rounded text-rose-500 focus:ring-rose-400"
                />
                <span class="font-mono font-bold text-rose-600">{{ r.id }}</span>
                <span class="truncate text-theme-text-muted text-[11px]">{{ r.ifCondition }}</span>
              </label>
            </div>
            <p class="text-[10px] text-theme-text-dim mt-1">
              已选 {{ selectedRuleIds.length }} / {{ ruleStore.rules.length }} 张规则卡参与碰撞
            </p>
          </div>

          <!-- 3. 操作模式按钮组 -->
          <div class="space-y-2 pt-2 border-t border-rose-100">
            <!-- 模式 B：直接调用 API 运行 -->
            <button
              type="button"
              @click="runApiDiagnostic"
              :disabled="isLoading || !eventText.trim() || selectedRuleIds.length === 0"
              class="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 text-white font-medium text-xs shadow-fluffy-sm hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
            >
              <Play class="w-4 h-4" v-if="!isLoading" />
              <Loader2 class="w-4 h-4 animate-spin" v-else />
              <span>{{ isLoading ? 'AI 严格硬约束碰撞演算中...' : '模式 B：直接运行 API 诊断' }}</span>
            </button>

            <!-- 模式 A：一键复制严格 Prompt -->
            <button
              type="button"
              @click="handleCopyPrompt"
              :disabled="!eventText.trim() || selectedRuleIds.length === 0"
              class="w-full py-2.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm"
            >
              <Copy class="w-4 h-4" />
              <span>{{ copyStatus || '模式 A：一键复制严格诊断 Prompt（零成本）' }}</span>
            </button>
          </div>

          <!-- 回贴诊断结果区域（零成本外部跑完粘贴回来） -->
          <details class="text-xs pt-1">
            <summary class="font-semibold text-rose-500 hover:text-rose-600 cursor-pointer">
              粘贴外部大模型返回的诊断文本
            </summary>
            <div class="mt-2 space-y-2">
              <textarea
                v-model="manualResultInput"
                rows="4"
                placeholder="将 ChatGPT / Claude / 外部大模型按 4 段式格式输出的文本粘贴到这里，右侧将自动解析高亮！"
                class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 font-mono text-[11px] leading-relaxed"
                @input="applyManualInput"
              ></textarea>
            </div>
          </details>
        </div>
      </div>

      <!-- 右栏：解析高亮与一键挂载 (占 7 列) -->
      <div class="lg:col-span-7 space-y-4">
        <div class="p-5 rounded-3xl bg-white border border-rose-100 shadow-fluffy-sm min-h-[480px] flex flex-col justify-between">
          <div class="space-y-4">
            <!-- 头部 -->
            <div class="flex items-center justify-between pb-3 border-b border-rose-100">
              <h3 class="text-xs font-bold text-theme-text-main uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 class="w-4 h-4 text-emerald-500" />
                <span>可视化诊断解析结果</span>
              </h3>
              <span v-if="parsedResult.event || parsedResult.applyList.length || parsedResult.nearMissList.length" class="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                解析成功
              </span>
              <span v-else class="text-[11px] text-theme-text-dim">
                等待诊断输出...
              </span>
            </div>

            <!-- 空白提示 -->
            <div
              v-if="!parsedResult.event && parsedResult.applyList.length === 0 && parsedResult.nearMissList.length === 0 && parsedResult.uncertainList.length === 0"
              class="py-16 text-center text-xs text-theme-text-dim space-y-2"
            >
              <FlaskConical class="w-8 h-8 text-rose-200 mx-auto" />
              <p>在左侧输入真实事件并运行，或点击上方快速试用切片</p>
            </div>

            <!-- 1. EVENT 前因定性块 -->
            <div
              v-if="parsedResult.event"
              class="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-1.5"
            >
              <div class="font-bold text-purple-800 flex items-center justify-between">
                <span class="flex items-center space-x-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span>EVENT 定性：{{ parsedResult.event.cause }}</span>
                </span>
                <span v-if="parsedResult.event.causeSupplement" class="text-purple-600 font-normal">
                  {{ parsedResult.event.causeSupplement }}
                </span>
              </div>
              <p class="text-purple-900/80 text-[11px] leading-relaxed pl-4">
                <strong>依据细节：</strong>{{ parsedResult.event.evidence }}
              </p>
            </div>

            <!-- 2. APPLY 完全命中列表 -->
            <div v-if="parsedResult.applyList.length > 0" class="space-y-2">
              <span class="text-xs font-semibold text-emerald-700 flex items-center space-x-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>APPLY 命中项（规则适用，可收录挂载）</span>
              </span>
              <div
                v-for="(item, idx) in parsedResult.applyList"
                :key="idx"
                class="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs flex items-start justify-between gap-3"
              >
                <div class="space-y-1 flex-1">
                  <div class="font-mono font-bold text-emerald-700 flex items-center space-x-2">
                    <span>{{ item.ruleId }}</span>
                    <span v-if="item.quoteSnippet" class="text-[11px] font-sans text-emerald-800/80">
                      「{{ item.quoteSnippet }}」
                    </span>
                  </div>
                  <p class="text-emerald-900 text-[11px] leading-relaxed">{{ item.detail }}</p>
                </div>

                <button
                  type="button"
                  @click="mountCase(item, 'APPLY')"
                  class="flex-shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-medium text-[11px] hover:bg-emerald-700 shadow-sm transition-all"
                >
                  + 挂载到卡片 (+2 EXP)
                </button>
              </div>
            </div>

            <!-- 3. NEAR-MISS 近似误判列表 -->
            <div v-if="parsedResult.nearMissList.length > 0" class="space-y-2">
              <span class="text-xs font-semibold text-amber-700 flex items-center space-x-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>NEAR-MISS 近似误判（表面相似但机制不符 · 高价值反例）</span>
              </span>
              <div
                v-for="(item, idx) in parsedResult.nearMissList"
                :key="idx"
                class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs flex items-start justify-between gap-3"
              >
                <div class="space-y-1 flex-1">
                  <div class="font-mono font-bold text-amber-700 flex items-center space-x-2">
                    <span>{{ item.ruleId }}</span>
                    <span v-if="item.quoteSnippet" class="text-[11px] font-sans text-amber-800/80">
                      「{{ item.quoteSnippet }}」
                    </span>
                  </div>
                  <p class="text-amber-900 text-[11px] leading-relaxed">{{ item.detail }}</p>
                </div>

                <button
                  type="button"
                  @click="mountCase(item, 'NEAR-MISS')"
                  class="flex-shrink-0 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-medium text-[11px] hover:bg-amber-700 shadow-sm transition-all"
                >
                  + 挂载到卡片 (+3 EXP)
                </button>
              </div>
            </div>

            <!-- 4. UNCERTAIN 待定列表 -->
            <div v-if="parsedResult.uncertainList.length > 0" class="space-y-2">
              <span class="text-xs font-semibold text-zinc-600 flex items-center space-x-1.5">
                <span class="w-2 h-2 rounded-full bg-zinc-400"></span>
                <span>UNCERTAIN 待定项</span>
              </span>
              <div
                v-for="(item, idx) in parsedResult.uncertainList"
                :key="idx"
                class="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs flex items-start justify-between gap-3"
              >
                <div class="space-y-1 flex-1">
                  <div class="font-mono font-bold text-zinc-700 flex items-center space-x-2">
                    <span>{{ item.ruleId }}</span>
                    <span v-if="item.quoteSnippet" class="text-[11px] font-sans text-zinc-600">
                      「{{ item.quoteSnippet }}」
                    </span>
                  </div>
                  <p class="text-zinc-600 text-[11px] leading-relaxed">{{ item.detail }}</p>
                </div>

                <button
                  type="button"
                  @click="mountCase(item, 'UNCERTAIN')"
                  class="flex-shrink-0 px-3 py-1.5 rounded-xl bg-zinc-600 text-white font-medium text-[11px] hover:bg-zinc-700 shadow-sm transition-all"
                >
                  + 挂载到卡片 (+1 EXP)
                </button>
              </div>
            </div>
          </div>

          <!-- 底部原始文本折叠 -->
          <div v-if="rawDiagnosticText" class="pt-3 border-t border-rose-50 text-[11px] text-theme-text-dim">
            <details>
              <summary class="cursor-pointer hover:text-theme-text-main">查看诊断返回原始文本</summary>
              <pre class="mt-1 p-2.5 rounded-xl bg-zinc-900 text-zinc-200 font-mono text-[10px] whitespace-pre-wrap">{{ rawDiagnosticText }}</pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Play,
  Loader2,
  Copy,
  CheckCircle2,
  FlaskConical
} from 'lucide-vue-next';
import confetti from 'canvas-confetti';
import { useRuleStore } from '../stores/ruleStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useScoutStore } from '../stores/scoutStore';
import { initialWildEvents } from '../data/wildEventsPool';
import { buildDiagnosticPrompt, callLlmDiagnostic } from '../utils/aiClient';
import { parseDiagnosticOutput } from '../utils/parser';
import { CaseMatchType, ParsedMatchItem } from '../types';

const ruleStore = useRuleStore();
const settingsStore = useSettingsStore();
const scoutStore = useScoutStore();

const eventText = ref('');
const selectedRuleIds = ref<string[]>(ruleStore.rules.map(r => r.id));
const isLoading = ref(false);
const copyStatus = ref('');
const rawDiagnosticText = ref('');
const manualResultInput = ref('');

// 选中的规则对象列表
const targetRules = computed(() => {
  return selectedRuleIds.value
    .map(id => ruleStore.getRuleById(id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
});

const parsedResult = computed(() => {
  return parseDiagnosticOutput(rawDiagnosticText.value);
});

function selectAllRules() {
  selectedRuleIds.value = ruleStore.rules.map(r => r.id);
}

function clearRuleSelection() {
  selectedRuleIds.value = [...scoutStore.session.equippedRuleIds];
}

// 快速填入样本
function loadSampleEvent(index: number) {
  const sample = initialWildEvents[index];
  if (sample) {
    eventText.value = sample.content;
    if (sample.precomputedResult) {
      rawDiagnosticText.value = sample.precomputedResult;
    }
  }
}

// 模式 A：复制 Prompt
async function handleCopyPrompt() {
  if (!eventText.value.trim()) return;
  const prompt = buildDiagnosticPrompt(targetRules.value, eventText.value);
  try {
    await navigator.clipboard.writeText(prompt);
    copyStatus.value = '已复制完整 Prompt 到剪贴板！';
    setTimeout(() => {
      copyStatus.value = '';
    }, 2500);
  } catch {
    copyStatus.value = '复制失败，请手动选取';
  }
}

// 模式 B：直接运行 API
async function runApiDiagnostic() {
  if (!settingsStore.isConfigured) {
    alert('请先在右上角【设置】中填入 API Key！或者可使用「模式 A：一键复制 Prompt」零成本在外部运行。');
    return;
  }

  isLoading.value = true;
  try {
    const output = await callLlmDiagnostic({
      baseUrl: settingsStore.baseUrl,
      apiKey: settingsStore.apiKey,
      model: settingsStore.model,
      rules: targetRules.value,
      eventText: eventText.value
    });
    rawDiagnosticText.value = output;
  } catch (err: any) {
    alert(`诊断调用出错: ${err?.message || err}`);
  } finally {
    isLoading.value = false;
  }
}

function applyManualInput() {
  if (manualResultInput.value.trim()) {
    rawDiagnosticText.value = manualResultInput.value;
  }
}

// 一键将单条判例挂载到对应卡片
function mountCase(item: ParsedMatchItem, matchType: CaseMatchType) {
  const cause = parsedResult.value.event?.cause || '其他';
  const causeSupplement = parsedResult.value.event?.causeSupplement || '';
  const evidence = parsedResult.value.event?.evidence || '手动沙盒诊断';

  const res = ruleStore.addCaseToRule(item.ruleId, {
    rawEventText: eventText.value,
    eventCause: cause,
    eventCauseSupplement: causeSupplement,
    eventEvidence: evidence,
    matchType,
    reasoning: item.detail,
    sourceType: 'MANUAL',
    author: settingsStore.authorName
  });

  if (res) {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
    alert(`已成功挂载到卡片 ${item.ruleId}！卡片经验已提升。`);
  } else {
    alert(`未找到对应编号为 ${item.ruleId} 的规则卡片`);
  }
}
</script>
