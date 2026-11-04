<template>
  <div v-if="rule" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
    <!-- 遮罩 -->
    <div class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- 居中手札弹窗 -->
    <div class="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-fluffy-lg border border-rose-100 flex flex-col overflow-hidden z-10">
      <!-- 弹窗头部 -->
      <div class="px-6 py-4 bg-gradient-to-r from-apricot-50 via-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <span class="font-mono font-bold text-xl text-rose-600">{{ rule.id }}</span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100/80 text-rose-700 border border-rose-200/60">
            {{ rule.scenario }}
          </span>
          <span
            v-if="levelInfo"
            :class="['px-2.5 py-0.5 rounded-full text-xs font-sans font-medium border', levelInfo.badgeClass]"
          >
            {{ levelInfo.label }}
          </span>
        </div>

        <div class="flex items-center space-x-2">
          <!-- 导出分享图按钮 -->
          <button
            type="button"
            @click="exportCardImage"
            :disabled="isExporting"
            class="px-3 py-1.5 rounded-2xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Camera class="w-3.5 h-3.5" />
            <span>{{ isExporting ? '生成中...' : '生成手札卡片图' }}</span>
          </button>

          <button
            @click="$emit('close')"
            class="p-1.5 rounded-xl text-theme-text-muted hover:text-theme-text-main hover:bg-rose-100 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- 弹窗内容区（可滚动） -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- 规则卡片快照区（用于直接展示及 html-to-image 截图捕获） -->
        <div id="rule-snapshot-container" class="p-6 rounded-3xl bg-gradient-to-b from-[#fef8f6] to-white border border-rose-200/80 shadow-sm space-y-4">
          <!-- 拍立得生活封面（若存在） -->
          <div v-if="rule.coverImage" class="w-full h-44 rounded-2xl overflow-hidden border border-rose-100 shadow-xs">
            <img :src="rule.coverImage" :alt="rule.id" class="w-full h-full object-cover" />
          </div>

          <!-- 遇境之时 -->
          <div class="space-y-1">
            <div class="text-xs font-medium text-rose-600 tracking-wider flex items-center space-x-1">
              <span>🌱</span>
              <span>遇境之时 (IF)</span>
            </div>
            <p class="text-sm font-semibold text-theme-text-main leading-relaxed">
              {{ rule.ifCondition }}
            </p>
          </div>

            <!-- 心定处 -->
            <div class="space-y-1">
              <div class="text-xs font-medium text-sage-600 tracking-wider flex items-center space-x-1">
                <span>🍵</span>
                <span>心定处 (THEN)</span>
              </div>
              <p class="text-xs text-theme-text-muted leading-relaxed">
                {{ rule.thenAction }}
              </p>
            </div>

            <div class="p-3.5 rounded-2xl bg-white border border-rose-100/80 text-xs space-y-1.5 shadow-sm">
              <div class="text-theme-text-muted leading-relaxed">
                <strong>底蕴机理：</strong>{{ rule.whyMechanism }}
              </div>
              <div class="flex items-center justify-between text-[11px] text-theme-text-dim pt-1 border-t border-rose-50">
                <span>置信度: {{ rule.probability }}</span>
                <span>作者: @{{ rule.author }}</span>
              </div>
            </div>

            <!-- 水印标识 -->
            <div class="text-[11px] text-rose-400 font-sans text-right flex items-center justify-end space-x-1 pt-1">
              <Heart class="w-3.5 h-3.5 fill-rose-300" />
              <span>Acumen · 认知心法手札与生活漫步</span>
            </div>
          </div>

          <!-- 判例统计与筛选栏 -->
          <div class="flex items-center justify-between pt-1">
            <h3 class="text-xs font-bold text-theme-text-main uppercase tracking-wider flex items-center space-x-1.5">
              <span>留存的生活真实印照 ({{ rule.cases.length }})</span>
            </h3>

            <!-- 筛选标签 -->
            <div class="flex items-center space-x-1 text-xs">
              <button
                type="button"
                @click="filterType = 'ALL'"
                :class="[
                  'px-2.5 py-1 rounded-xl transition-all',
                  filterType === 'ALL' ? 'bg-rose-500 text-white font-medium shadow-sm' : 'text-theme-text-muted hover:bg-rose-50'
                ]"
              >
                全部
              </button>
              <button
                type="button"
                @click="filterType = 'APPLY'"
                :class="[
                  'px-2.5 py-1 rounded-xl transition-all',
                  filterType === 'APPLY' ? 'bg-sage-600 text-white font-medium shadow-sm' : 'text-sage-700 hover:bg-sage-50'
                ]"
              >
                完全吻合 ({{ applyList.length }})
              </button>
              <button
                type="button"
                @click="filterType = 'NEAR-MISS'"
                :class="[
                  'px-2.5 py-1 rounded-xl transition-all',
                  filterType === 'NEAR-MISS' ? 'bg-apricot-600 text-white font-medium shadow-sm' : 'text-apricot-700 hover:bg-apricot-50'
                ]"
              >
                机理辨思 ({{ nearMissList.length }})
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
                c.matchType === 'APPLY' ? 'bg-sage-50/50 border-sage-200' :
                c.matchType === 'NEAR-MISS' ? 'bg-apricot-50/50 border-apricot-200' :
                'bg-stone-50/70 border-stone-200'
              ]"
            >
              <!-- 顶部标签与时间 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span
                    :class="[
                      'px-2.5 py-0.5 rounded-full text-[10px] font-medium',
                      c.matchType === 'APPLY' ? 'bg-white text-sage-800 border border-sage-200' :
                      c.matchType === 'NEAR-MISS' ? 'bg-white text-apricot-800 border border-apricot-200' :
                      'bg-white text-stone-700 border border-stone-200'
                    ]"
                  >
                    {{ c.matchType === 'APPLY' ? '完全吻合' : c.matchType === 'NEAR-MISS' ? '机理辨思' : '待定探寻' }}
                  </span>
                  <span class="text-[11px] px-2 py-0.2 rounded-full bg-white/80 border border-rose-100 text-theme-text-muted">
                    {{ c.sourceType === 'AUTO_SCOUT' ? '🕊️ 探针带回' : '✍️ 随手留存' }}
                  </span>
                  <span class="text-[11px] text-theme-text-dim font-mono">{{ c.createdAt }}</span>
                </div>

                <button
                  type="button"
                  @click="deleteCase(c.id)"
                  class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1"
                  title="移除该条印记"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>

              <!-- 原始事件文本 -->
              <div class="bg-white/90 p-3 rounded-xl border border-rose-100/60 text-theme-text-main leading-relaxed">
                {{ c.rawEventText }}
              </div>

              <!-- EVENT 定性与依据 -->
              <div class="text-[11px] text-theme-text-muted space-y-0.5">
                <div>
                  <strong>前因定性：</strong>{{ c.eventCause }}
                  <span v-if="c.eventCauseSupplement">({{ c.eventCauseSupplement }})</span>
                </div>
                <div>
                  <strong>依据细节：</strong>{{ c.eventEvidence }}
                </div>
              </div>

              <!-- 详细触发理由 / 反例机制 -->
              <div class="pt-1.5 text-[11px] text-theme-text-main font-medium border-t border-rose-100/50">
                <strong>映照体悟：</strong>{{ c.reasoning }}
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-xs text-theme-text-dim">
            暂无符合条件的生活印记，可由探针外出漫步或手动写就！
          </div>

          <!-- 手动添加判例折叠表单 -->
          <details class="p-4 rounded-2xl bg-white border border-rose-200/80 text-xs space-y-3">
            <summary class="font-medium text-rose-600 cursor-pointer hover:text-rose-700 flex items-center space-x-1.5">
              <Plus class="w-4 h-4" />
              <span>在此心法下留存一则生活随感</span>
            </summary>

            <div class="space-y-3 pt-3">
              <div>
                <label class="block text-theme-text-muted mb-1">经历的具体事实与原话</label>
                <textarea
                  v-model="manualForm.rawEventText"
                  rows="3"
                  placeholder="记录今天经历的可观察细节..."
                  class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 text-xs focus:ring-2 focus:ring-rose-300"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-theme-text-muted mb-1">前因定性</label>
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
                  <label class="block text-theme-text-muted mb-1">对照归类</label>
                  <select
                    v-model="manualForm.matchType"
                    class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 text-xs"
                  >
                    <option value="APPLY">完全吻合 (APPLY)</option>
                    <option value="NEAR-MISS">机理辨思 (NEAR-MISS)</option>
                    <option value="UNCERTAIN">留白待定 (UNCERTAIN)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-theme-text-muted mb-1">依据细节</label>
                <input
                  v-model="manualForm.eventEvidence"
                  type="text"
                  placeholder="事件中哪个具体事实支持该判断..."
                  class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 text-xs"
                />
              </div>

              <div>
                <label class="block text-theme-text-muted mb-1">体悟析解</label>
                <textarea
                  v-model="manualForm.reasoning"
                  rows="2"
                  placeholder="为什么吻合，或表面相似但哪个关键机理不符..."
                  class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 text-xs"
                ></textarea>
              </div>

              <div class="flex justify-end">
                <button
                  type="button"
                  @click="handleManualAddCase"
                  class="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 text-white font-medium hover:from-rose-500 hover:to-rose-600 transition-all shadow-sm"
                >
                  留存此页印记
                </button>
              </div>
            </div>
          </details>
        </div>

        <!-- 弹窗底部 -->
        <div class="px-6 py-4 bg-gray-50/50 border-t border-rose-100 flex items-center justify-between">
          <button
            type="button"
            @click="deleteRuleCard"
            class="text-xs text-stone-400 hover:text-red-500 underline"
          >
            删除此篇心法
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="px-5 py-2 rounded-2xl bg-rose-500 text-white text-xs font-medium shadow-fluffy-sm hover:bg-rose-600"
          >
            合上手札
          </button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { X, Camera, Heart, Trash2, Plus } from 'lucide-vue-next';
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
    alert('请填写具体事件文本');
    return;
  }
  ruleStore.addCaseToRule(props.rule.id, {
    rawEventText: manualForm.rawEventText,
    eventCause: manualForm.eventCause,
    eventEvidence: manualForm.eventEvidence || '生活印记留存',
    matchType: manualForm.matchType,
    reasoning: manualForm.reasoning || '手札沉思',
    sourceType: 'MANUAL',
    author: settingsStore.authorName
  });

  manualForm.rawEventText = '';
  manualForm.eventEvidence = '';
  manualForm.reasoning = '';
  alert('生活印记已成功留存！');
}

function deleteCase(caseId: string) {
  if (!props.rule) return;
  if (confirm('确认删除该条生活印记？')) {
    ruleStore.deleteCase(props.rule.id, caseId);
  }
}

function deleteRuleCard() {
  if (!props.rule) return;
  if (confirm(`确认删除心法 ${props.rule.id} 及其挂载的全部生活印记吗？`)) {
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
      backgroundColor: '#fdf8f7',
      skipFonts: true
    });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Acumen-手札-${props.rule.id.replace('#', '')}.png`;
    a.click();
  } catch (err) {
    console.error('Snapshot failed:', err);
    alert('导出快照失败，请稍后重试。');
  } finally {
    isExporting.value = false;
  }
}
</script>
