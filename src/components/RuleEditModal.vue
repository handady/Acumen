<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-fluffy-lg border border-rose-100 overflow-hidden z-10">
      <!-- 头部 -->
      <div class="px-6 py-4 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <FilePlus2 class="w-5 h-5 text-rose-500" />
          <h2 class="text-base font-bold text-theme-text-main">
            {{ editRule ? `编辑规则 ${editRule.id}` : '创建新 If-Then 规则档案卡' }}
          </h2>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-rose-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 表单主体 -->
      <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
        <!-- 编号与场景 -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-theme-text-muted font-medium mb-1">规则编号</label>
            <input
              v-model="form.id"
              type="text"
              placeholder="#005"
              class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300 font-mono font-bold text-rose-600"
            />
          </div>

          <div>
            <label class="block text-theme-text-muted font-medium mb-1">场景分类</label>
            <input
              v-model="form.scenario"
              type="text"
              placeholder="例如: 行为纪律 / 认知工具"
              class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
        </div>

        <!-- IF 触发条件 -->
        <div>
          <label class="block text-theme-text-muted font-medium mb-1">
            <span class="text-rose-600 font-bold font-mono">IF</span>（触发条件 · 严格窄口径）
          </label>
          <textarea
            v-model="form.ifCondition"
            rows="2.5"
            placeholder="例如: 当前核心任务卡在某一子步骤超过 15 分钟且开始频繁切换无关网页"
            class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300 leading-relaxed"
          ></textarea>
        </div>

        <!-- THEN 应对动作 -->
        <div>
          <label class="block text-theme-text-muted font-medium mb-1">
            <span class="text-emerald-600 font-bold font-mono">THEN</span>（执行动作 / 认知定位）
          </label>
          <textarea
            v-model="form.thenAction"
            rows="2.5"
            placeholder="例如: 立即合上屏幕或推开键盘，起身去茶水间倒满一杯温水，深呼吸 3 次..."
            class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300 leading-relaxed"
          ></textarea>
        </div>

        <!-- WHY 底层机制 -->
        <div>
          <label class="block text-theme-text-muted font-medium mb-1">
            <span class="text-purple-600 font-bold font-mono">WHY</span>（为什么底层机制 · 判定 NEAR-MISS 核心依据）
          </label>
          <textarea
            v-model="form.whyMechanism"
            rows="2.5"
            placeholder="例如: 大脑因工作记忆超载引发逃避机制。离开现场可切断反刍回路，重置前额叶通道..."
            class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300 leading-relaxed"
          ></textarea>
        </div>

        <!-- 置信度与作者 -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-theme-text-muted font-medium mb-1">置信度/概率</label>
            <input
              v-model="form.probability"
              type="text"
              placeholder="例如: 90%"
              class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300 font-mono"
            />
          </div>
          <div>
            <label class="block text-theme-text-muted font-medium mb-1">创作者署名</label>
            <input
              v-model="form.author"
              type="text"
              placeholder="例如: Commander"
              class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="px-6 py-4 bg-gray-50/50 border-t border-rose-100 flex items-center justify-end space-x-3">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 rounded-xl text-xs font-medium text-theme-text-muted hover:text-theme-text-main"
        >
          取消
        </button>
        <button
          type="button"
          @click="handleSave"
          class="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 text-white text-xs font-medium shadow-fluffy-sm hover:from-rose-500 hover:to-rose-600 transition-all"
        >
          {{ editRule ? '保存修改' : '立即创建' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { FilePlus2, X } from 'lucide-vue-next';
import { IfThenRule } from '../types';
import { useRuleStore } from '../stores/ruleStore';
import { useSettingsStore } from '../stores/settingsStore';

const props = defineProps<{
  isOpen: boolean;
  editRule: IfThenRule | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const ruleStore = useRuleStore();
const settingsStore = useSettingsStore();

const form = reactive({
  id: '',
  ifCondition: '',
  thenAction: '',
  whyMechanism: '',
  scenario: '通用认知',
  probability: '85%',
  author: settingsStore.authorName
});

watch(
  () => props.isOpen,
  open => {
    if (open) {
      if (props.editRule) {
        form.id = props.editRule.id;
        form.ifCondition = props.editRule.ifCondition;
        form.thenAction = props.editRule.thenAction;
        form.whyMechanism = props.editRule.whyMechanism;
        form.scenario = props.editRule.scenario;
        form.probability = props.editRule.probability;
        form.author = props.editRule.author;
      } else {
        const nextNum = ruleStore.rules.length + 1;
        form.id = `#${String(nextNum).padStart(3, '0')}`;
        form.ifCondition = '';
        form.thenAction = '';
        form.whyMechanism = '';
        form.scenario = '通用认知';
        form.probability = '85%';
        form.author = settingsStore.authorName;
      }
    }
  }
);

function handleSave() {
  if (!form.ifCondition || !form.thenAction) {
    alert('请填写完整的 IF 触发条件与 THEN 动作！');
    return;
  }

  if (props.editRule) {
    ruleStore.updateRule(props.editRule.id, {
      ifCondition: form.ifCondition,
      thenAction: form.thenAction,
      whyMechanism: form.whyMechanism,
      scenario: form.scenario,
      probability: form.probability,
      author: form.author
    });
  } else {
    ruleStore.addRule({
      id: form.id,
      ifCondition: form.ifCondition,
      thenAction: form.thenAction,
      whyMechanism: form.whyMechanism || '机制待补充',
      scenario: form.scenario || '通用认知',
      probability: form.probability || '85%',
      author: form.author || settingsStore.authorName
    });
  }

  emit('close');
}
</script>
