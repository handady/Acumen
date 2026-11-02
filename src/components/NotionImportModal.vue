<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <div class="relative w-full max-w-3xl bg-white rounded-3xl shadow-fluffy-lg border border-rose-100 overflow-hidden z-10 flex flex-col max-h-[90vh]">
      <!-- 头部 -->
      <div class="px-6 py-4 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <ClipboardList class="w-5 h-5 text-rose-500" />
          <div>
            <h2 class="text-base font-bold text-theme-text-main">Notion 表格批量粘贴导入</h2>
            <p class="text-xs text-theme-text-muted">直接全选复制 Notion 数据库表格（TSV）或 Markdown 表格粘贴至此</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-rose-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 内容区 -->
      <div class="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
        <!-- 输入框 -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-theme-text-muted font-medium">剪贴板表格内容粘贴处</label>
            <button
              type="button"
              @click="insertSampleNotion"
              class="text-rose-500 hover:text-rose-600 underline text-[11px]"
            >
              填入 Notion 示例表格数据
            </button>
          </div>
          <textarea
            v-model="rawInput"
            rows="6"
            placeholder="支持制表符分隔（Notion 直接复制）或 Markdown | 格式表格：&#10;编号&#9;IF触发条件&#9;THEN应对动作&#9;底层机制&#9;场景分类&#9;置信度&#10;#005&#9;遇到需求频繁变更&#9;启动变更日志留痕&#9;锁定沟通版本基准&#9;博弈叙事&#9;90%"
            class="w-full px-3 py-2 rounded-2xl bg-theme-secondary border border-rose-100 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-rose-300 leading-relaxed whitespace-pre"
          ></textarea>
        </div>

        <!-- 错误提示 -->
        <div v-if="parseResult.error" class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          ⚠️ {{ parseResult.error }}
        </div>

        <!-- 实时解析预览表格 -->
        <div v-if="parseResult.success && parseResult.rules.length > 0" class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-emerald-700 flex items-center space-x-1">
              <CheckCircle class="w-4 h-4 text-emerald-500" />
              <span>成功识别 {{ parseResult.totalParsed }} 条规则卡片</span>
            </span>
            <div class="flex items-center space-x-2">
              <label class="flex items-center space-x-1 text-theme-text-muted cursor-pointer">
                <input type="radio" v-model="importMode" value="append" class="text-rose-500" />
                <span>追加导入 (保留已有)</span>
              </label>
              <label class="flex items-center space-x-1 text-theme-text-muted cursor-pointer">
                <input type="radio" v-model="importMode" value="replace" class="text-rose-500" />
                <span>覆盖清空现有</span>
              </label>
            </div>
          </div>

          <div class="max-h-56 overflow-y-auto rounded-xl border border-rose-100 overflow-x-auto">
            <table class="w-full text-[11px] text-left border-collapse bg-white">
              <thead class="bg-rose-50 text-rose-700 font-medium sticky top-0">
                <tr>
                  <th class="p-2 border-b border-rose-100">编号</th>
                  <th class="p-2 border-b border-rose-100">IF 触发条件</th>
                  <th class="p-2 border-b border-rose-100">THEN 执行动作</th>
                  <th class="p-2 border-b border-rose-100">底层机制</th>
                  <th class="p-2 border-b border-rose-100">分类</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-rose-50">
                <tr v-for="r in parseResult.rules" :key="r.id" class="hover:bg-rose-50/40">
                  <td class="p-2 font-mono font-bold text-rose-600 whitespace-nowrap">{{ r.id }}</td>
                  <td class="p-2 truncate max-w-[160px]">{{ r.ifCondition }}</td>
                  <td class="p-2 truncate max-w-[160px]">{{ r.thenAction }}</td>
                  <td class="p-2 truncate max-w-[120px] text-theme-text-dim">{{ r.whyMechanism }}</td>
                  <td class="p-2 whitespace-nowrap">{{ r.scenario }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="px-6 py-4 bg-gray-50/50 border-t border-rose-100 flex items-center justify-between">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 rounded-xl text-xs font-medium text-theme-text-muted hover:text-theme-text-main"
        >
          取消
        </button>
        <button
          type="button"
          @click="confirmImport"
          :disabled="!parseResult.success || parseResult.rules.length === 0"
          class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 text-white text-xs font-medium shadow-fluffy-sm hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          确认导入 {{ parseResult.rules.length }} 条规则
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ClipboardList, X, CheckCircle } from 'lucide-vue-next';
import { parseNotionTableText } from '../utils/notionImporter';
import { useRuleStore } from '../stores/ruleStore';
import { useSettingsStore } from '../stores/settingsStore';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const ruleStore = useRuleStore();
const settingsStore = useSettingsStore();

const rawInput = ref('');
const importMode = ref<'append' | 'replace'>('append');

const parseResult = computed(() => {
  return parseNotionTableText(rawInput.value, settingsStore.authorName);
});

function insertSampleNotion() {
  rawInput.value = `编号\tIF触发条件\tTHEN执行动作\t底层机制\t场景分类\t置信度
#005\t跨部门协作对接人临时更换且无任何交接备忘录\t暂停执行原有口头约定，要求发起三人同步会拉齐待办清单\t避免单方承担历史遗留高熵黑箱与扯皮风险\t博弈叙事\t88%
#006\t面临重大选择时连续纠结两天仍无法抉择\t限定 10 分钟抛硬币测试潜意识偏好，观察硬币在空中时的真实倾向\t逻辑分析瘫痪时调用边缘系统直觉以打破分析停滞\t认知工具\t85%`;
}

function confirmImport() {
  if (!parseResult.value.success || parseResult.value.rules.length === 0) return;

  ruleStore.importRules(parseResult.value.rules, importMode.value);
  alert(`成功导入 ${parseResult.value.rules.length} 条规则！`);
  rawInput.value = '';
  emit('close');
}
</script>
