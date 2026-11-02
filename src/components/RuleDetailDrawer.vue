<template>
  <div v-if="rule" class="fixed inset-0 z-50 overflow-hidden">
    <!-- 遮罩 -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-2xl bg-white shadow-fluffy-lg border-l border-rose-100 flex flex-col">
        <!-- 抽屉头部 -->
        <div class="px-6 py-4 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="font-mono font-extrabold text-xl text-rose-600">{{ rule.id }}</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
              {{ rule.scenario }}
            </span>
            <span
              v-if="levelInfo"
              :class="['px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border', levelInfo.badgeClass]"
            >
              {{ levelInfo.label }} ({{ levelInfo.exp }} EXP)
            </span>
          </div>

          <div class="flex items-center space-x-2">
            <!-- 导出分享图按钮 -->
            <button
              type="button"
              @click="exportCardImage"
              :disabled="isExporting"
              class="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center space-x-1 shadow-sm transition-all"
            >
              <Camera class="w-3.5 h-3.5" />
              <span>{{ isExporting ? '生成中...' : '导出高清卡片图' }}</span>
            </button>

            <button
              @click="$emit('close')"
              class="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-rose-100 transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- 抽屉内容区（可滚动） -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- 规则卡片快照区（用于直接展示及 html-to-image 截图捕获） -->
          <div id="rule-snapshot-container" class="p-6 rounded-3xl bg-gradient-to-b from-rose-50/70 to-white border border-rose-200/80 shadow-sm space-y-4">
            <!-- 规则核心 -->
            <div>
              <div class="text-xs font-mono font-bold text-rose-500 uppercase tracking-wider mb-1">
                IF（触发条件）
              </div>
              <p class="text-sm font-semibold text-theme-text-main">
                {{ rule.ifCondition }}
              </p>
            </div>

            <div>
              <div class="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider mb-1">
                THEN（执行动作 / 认知定位）
              </div>
              <p class="text-xs text-theme-text-muted leading-relaxed">
                {{ rule.thenAction }}
              </p>
            </div>

            <div class="p-3 rounded-2xl bg-white border border-rose-100 text-xs space-y-1">
              <div class="text-theme-text-muted">
                <strong>底层机制：</strong>{{ rule.whyMechanism }}
              </div>
              <div class="flex items-center justify-between text-[11px] text-theme-text-dim pt-1 border-t border-rose-50">
                <span>置信度: {{ rule.probability }}</span>
                <span>创作者: @{{ rule.author }}</span>
              </div>
            </div>

            <!-- 水印标签（仅在截图生成时显示或作为版权标识） -->
            <div class="text-[10px] text-rose-400 font-mono text-right flex items-center justify-end space-x-1">
              <Sparkles class="w-3 h-3 text-rose-400" />
              <span>Acumen · If-Then 认知判例库与自动采风探针</span>
            </div>
          </div>

          <!-- 判例统计与筛选栏 -->
          <div class="flex items-center justify-between pt-2">
            <h3 class="text-xs font-bold text-theme-text-main uppercase tracking-wider flex items-center space-x-1.5">
              <FileText class="w-4 h-4 text-rose-500" />
              <span>已挂载真实世界判例 ({{ rule.cases.length }})</span>
            </h3>

            <!-- 筛选标签 -->
            <div class="flex items-center space-x-1 text-xs">
              <button
                type="button"
                @click="filterType = 'ALL'"
                :class="[
                  'px-2.5 py-1 rounded-lg transition-all',
                  filterType === 'ALL' ? 'bg-rose-500 text-white font-medium' : 'text-theme-text-muted hover:bg-rose-50'
                ]"
              >
                全部
              </button>
              <button
                type="button"
                @click="filterType = 'APPLY'"
                :class="[
                  'px-2.5 py-1 rounded-lg transition-all',
                  filterType === 'APPLY' ? 'bg-emerald-500 text-white font-medium' : 'text-emerald-700 hover:bg-emerald-50'
                ]"
              >
                APPLY ({{ applyList.length }})
              </button>
              <button
                type="button"
                @click="filterType = 'NEAR-MISS'"
                :class="[
                  'px-2.5 py-1 rounded-lg transition-all',
                  filterType === 'NEAR-MISS' ? 'bg-amber-500 text-white font-medium' : 'text-amber-700 hover:bg-amber-50'
                ]"
              >
                NEAR-MISS ({{ nearMissList.length }})
              </button>
              <button
                type="button"
                @click="filterType = 'UNCERTAIN'"
                :class="[
                  'px-2.5 py-1 rounded-lg transition-all',
                  filterType === 'UNCERTAIN' ? 'bg-zinc-500 text-white font-medium' : 'text-zinc-600 hover:bg-zinc-100'
                ]"
              >
                UNCERTAIN ({{ uncertainList.length }})
              </button>
            </div>
          </div>

          <!-- 判例列表 -->
          <div v-if="filteredCases.length > 0" class="space-y-3">
            <div
              v-for="c in filteredCases"
              :key="c.id"
              :class="[
                'p-4 rounded-2xl border text-xs space-y-2 relative group transition-all',
                c.matchType === 'APPLY' ? 'bg-emerald-50/40 border-emerald-200' :
                c.matchType === 'NEAR-MISS' ? 'bg-amber-50/40 border-amber-200' :
                'bg-zinc-50/60 border-zinc-200'
              ]"
            >
              <!-- 顶部标签与时间 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full font-mono text-[10px] font-bold',
                      c.matchType === 'APPLY' ? 'bg-emerald-100 text-emerald-800' :
                      c.matchType === 'NEAR-MISS' ? 'bg-amber-100 text-amber-800' :
                      'bg-zinc-200 text-zinc-700'
                    ]"
                  >
                    {{ c.matchType }}
                  </span>
                  <span class="text-[11px] px-2 py-0.2 rounded-full bg-white/80 border border-rose-100 text-theme-text-muted">
                    {{ c.sourceType === 'AUTO_SCOUT' ? '📡 采风捕获' : '✍️ 手动录入' }}
                  </span>
                  <span class="text-[11px] text-theme-text-dim font-mono">{{ c.createdAt }}</span>
                </div>

                <button
                  type="button"
                  @click="deleteCase(c.id)"
                  class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                  title="删除该判例"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>

              <!-- 原始事件文本 -->
              <div class="bg-white/80 p-3 rounded-xl border border-rose-50 text-theme-text-main leading-relaxed">
                {{ c.rawEventText }}
              </div>

              <!-- EVENT 定性与依据 -->
              <div class="text-[11px] text-theme-text-muted space-y-0.5">
                <div>
                  <strong>EVENT 前因定性：</strong>{{ c.eventCause }}
                  <span v-if="c.eventCauseSupplement">({{ c.eventCauseSupplement }})</span>
                </div>
                <div>
                  <strong>依据细节：</strong>{{ c.eventEvidence }}
                </div>
              </div>

              <!-- 详细触发理由 / 反例机制 -->
              <div class="pt-1 text-[11px] text-theme-text-main font-medium border-t border-rose-100/50">
                <strong>判定分析：</strong>{{ c.reasoning }}
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-xs text-theme-text-dim">
            暂无符合条件的判例记录，可通过【采风探针】或【主动诊断沙盒】收录！
          </div>

          <!-- 手动添加判例折叠表单 -->
          <details class="p-4 rounded-2xl bg-white border border-rose-200/80 text-xs space-y-3">
            <summary class="font-bold text-rose-600 cursor-pointer hover:text-rose-700 flex items-center space-x-1">
              <Plus class="w-4 h-4" />
              <span>手动向此卡片挂载一条新真实判例</span>
            </summary>

            <div class="space-y-3 pt-3">
              <div>
                <label class="block text-theme-text-muted mb-1">真实发生的事件全文</label>
                <textarea
                  v-model="manualForm.rawEventText"
                  rows="3"
                  placeholder="包含具体动作或原话的真实事件..."
                  class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 text-xs focus:ring-2 focus:ring-rose-300"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-theme-text-muted mb-1">EVENT 前因分类</label>
                  <select
                    v-model="manualForm.eventCause"
                    class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 text-xs"
                  >
                    <option value="有明确任务被卡住">有明确任务被卡住</option>
                    <option value="任务没有收敛条件">任务没有收敛条件</option>
                    <option value="外部打断">外部打断</option>
                    <option value="情绪触发">情绪触发</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label class="block text-theme-text-muted mb-1">匹配类型</label>
                  <select
                    v-model="manualForm.matchType"
                    class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 text-xs"
                  >
                    <option value="APPLY">APPLY (完全命中 +2 EXP)</option>
                    <option value="NEAR-MISS">NEAR-MISS (机制不符反例 +3 EXP)</option>
                    <option value="UNCERTAIN">UNCERTAIN (信息不足待定 +1 EXP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-theme-text-muted mb-1">支持定性的依据细节</label>
                <input
                  v-model="manualForm.eventEvidence"
                  type="text"
                  placeholder="事件里的哪个具体细节支持该判断..."
                  class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 text-xs"
                />
              </div>

              <div>
                <label class="block text-theme-text-muted mb-1">判定理由 / 机制分析</label>
                <textarea
                  v-model="manualForm.reasoning"
                  rows="2"
                  placeholder="具体触发细节 / 表面哪里像但哪个条件不成立..."
                  class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 text-xs"
                ></textarea>
              </div>

              <div class="flex justify-end">
                <button
                  type="button"
                  @click="handleManualAddCase"
                  class="px-4 py-2 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition-all shadow-sm"
                >
                  保存并挂载判例
                </button>
              </div>
            </div>
          </details>
        </div>

        <!-- 抽屉底部 -->
        <div class="px-6 py-4 bg-gray-50/50 border-t border-rose-100 flex items-center justify-between">
          <button
            type="button"
            @click="deleteRuleCard"
            class="text-xs text-red-500 hover:text-red-700 underline"
          >
            删除整张规则卡片
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="px-5 py-2 rounded-xl bg-rose-500 text-white text-xs font-medium shadow-fluffy-sm hover:bg-rose-600"
          >
            关闭详情
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { X, Camera, Sparkles, FileText, Trash2, Plus } from 'lucide-vue-next';
import { toPng } from 'html-to-image';
import { IfThenRule, CaseMatchType, EventCauseType } from '../types';
import { calculateRuleLevel, useRuleStore } from '../stores/ruleStore';
import { useSettingsStore } from '../stores/settingsStore';

const props = defineProps<{
  rule: IfThenRule | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const ruleStore = useRuleStore();
const settingsStore = useSettingsStore();

const isExporting = ref(false);
const filterType = ref<'ALL' | CaseMatchType>('ALL');

const levelInfo = computed(() => (props.rule ? calculateRuleLevel(props.rule) : null));

const applyList = computed(() => props.rule?.cases.filter(c => c.matchType === 'APPLY') || []);
const nearMissList = computed(() => props.rule?.cases.filter(c => c.matchType === 'NEAR-MISS') || []);
const uncertainList = computed(() => props.rule?.cases.filter(c => c.matchType === 'UNCERTAIN') || []);

const filteredCases = computed(() => {
  if (!props.rule) return [];
  if (filterType.value === 'ALL') return props.rule.cases;
  return props.rule.cases.filter(c => c.matchType === filterType.value);
});

// 手动录入表单
const manualForm = reactive({
  rawEventText: '',
  eventCause: '有明确任务被卡住' as EventCauseType,
  eventEvidence: '',
  matchType: 'APPLY' as CaseMatchType,
  reasoning: ''
});

function handleManualAddCase() {
  if (!props.rule || !manualForm.rawEventText) {
    alert('请填写事件文本');
    return;
  }
  ruleStore.addCaseToRule(props.rule.id, {
    rawEventText: manualForm.rawEventText,
    eventCause: manualForm.eventCause,
    eventEvidence: manualForm.eventEvidence || '用户手动指定依据',
    matchType: manualForm.matchType,
    reasoning: manualForm.reasoning || '手动经验校准',
    sourceType: 'MANUAL',
    author: settingsStore.authorName
  });

  manualForm.rawEventText = '';
  manualForm.eventEvidence = '';
  manualForm.reasoning = '';
  alert('判例挂载成功，经验值已提升！');
}

function deleteCase(caseId: string) {
  if (!props.rule) return;
  if (confirm('确认删除该判例？')) {
    ruleStore.deleteCase(props.rule.id, caseId);
  }
}

function deleteRuleCard() {
  if (!props.rule) return;
  if (confirm(`确认删除规则 ${props.rule.id} 及其挂载的全部判例吗？此操作无法撤销。`)) {
    ruleStore.deleteRule(props.rule.id);
    emit('close');
  }
}

// 导出高清长图
async function exportCardImage() {
  const node = document.getElementById('rule-snapshot-container');
  if (!node || !props.rule) return;

  isExporting.value = true;
  try {
    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      backgroundColor: '#fffafa'
    });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Acumen-Rule-${props.rule.id.replace('#', '')}.png`;
    a.click();
  } catch (err) {
    console.error('Snapshot failed:', err);
    alert('导出快照失败，请稍后重试。');
  } finally {
    isExporting.value = false;
  }
}
</script>
