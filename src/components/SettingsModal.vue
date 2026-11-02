<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <div class="relative w-full max-w-xl bg-white rounded-3xl shadow-fluffy-lg border border-rose-100 overflow-hidden z-10">
      <!-- 头部 -->
      <div class="px-6 py-4 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Settings class="w-5 h-5 text-rose-500" />
          <h2 class="text-base font-bold text-theme-text-main">设置与数据中心</h2>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-rose-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 选项卡与表单 -->
      <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
        <!-- 1. API 诊断配置 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-theme-text-main flex items-center space-x-1.5">
              <Key class="w-4 h-4 text-rose-500" />
              <span>大模型 API 配置（OpenAI-Compatible 协议）</span>
            </h3>
            <span class="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100" v-if="settingsStore.isConfigured">
              ✓ 已就绪
            </span>
            <span class="text-[11px] text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded-full border border-zinc-200" v-else>
              未配置（使用离线模式）
            </span>
          </div>

          <div class="p-3 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-3">
            <!-- 厂商快捷预设 -->
            <div class="flex items-center space-x-2 text-xs">
              <span class="text-theme-text-muted">快捷填入：</span>
              <button
                type="button"
                @click="applyPreset('deepseek')"
                class="px-2 py-1 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-mono"
              >
                DeepSeek
              </button>
              <button
                type="button"
                @click="applyPreset('openai')"
                class="px-2 py-1 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-mono"
              >
                OpenAI
              </button>
              <button
                type="button"
                @click="applyPreset('moonshot')"
                class="px-2 py-1 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-mono"
              >
                Kimi / Moonshot
              </button>
            </div>

            <!-- Base URL -->
            <div>
              <label class="block text-xs font-medium text-theme-text-muted mb-1">Base URL (接口基础地址)</label>
              <input
                v-model="form.baseUrl"
                type="text"
                placeholder="https://api.deepseek.com/v1"
                class="w-full px-3 py-2 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono"
              />
            </div>

            <!-- API Key -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-medium text-theme-text-muted">API Key</label>
                <button
                  type="button"
                  @click="showKey = !showKey"
                  class="text-[11px] text-rose-500 hover:text-rose-600 flex items-center space-x-1"
                >
                  <Eye v-if="!showKey" class="w-3.5 h-3.5" />
                  <EyeOff v-else class="w-3.5 h-3.5" />
                  <span>{{ showKey ? '隐藏' : '明文显示' }}</span>
                </button>
              </div>
              <input
                v-model="form.apiKey"
                :type="showKey ? 'text' : 'password'"
                placeholder="sk-..."
                class="w-full px-3 py-2 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono"
              />
            </div>

            <!-- Model -->
            <div>
              <label class="block text-xs font-medium text-theme-text-muted mb-1">Model Name (模型标识)</label>
              <input
                v-model="form.model"
                type="text"
                placeholder="deepseek-chat"
                class="w-full px-3 py-2 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono"
              />
            </div>

            <!-- 存储安全模式 -->
            <div>
              <label class="block text-xs font-medium text-theme-text-muted mb-1">Key 本地存储安全策略</label>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <label
                  :class="[
                    'flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition-all',
                    form.storageMode === 'local'
                      ? 'bg-white border-rose-400 text-rose-700 shadow-sm'
                      : 'bg-white/60 border-rose-100 text-theme-text-muted'
                  ]"
                >
                  <input type="radio" v-model="form.storageMode" value="local" class="text-rose-500" />
                  <div>
                    <span class="font-medium">本地持久化 (LocalStorage)</span>
                    <p class="text-[10px] text-theme-text-dim">重启浏览器后依然有效</p>
                  </div>
                </label>

                <label
                  :class="[
                    'flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition-all',
                    form.storageMode === 'session'
                      ? 'bg-white border-rose-400 text-rose-700 shadow-sm'
                      : 'bg-white/60 border-rose-100 text-theme-text-muted'
                  ]"
                >
                  <input type="radio" v-model="form.storageMode" value="session" class="text-rose-500" />
                  <div>
                    <span class="font-medium">安全临时模式 (Session)</span>
                    <p class="text-[10px] text-theme-text-dim">关闭网页或标签页即销毁</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. 用户个性化署名 -->
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-theme-text-main flex items-center space-x-1.5">
            <User class="w-4 h-4 text-rose-500" />
            <span>默认采风员 / 规则创作者署名</span>
          </h3>
          <input
            v-model="form.authorName"
            type="text"
            placeholder="例如: Commander / Sophia"
            class="w-full px-3 py-2 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <p class="text-[11px] text-theme-text-dim">新建规则与探针收菜时，默认填入该署名。</p>
        </div>

        <!-- 3. 数据备份与重置 -->
        <div class="space-y-3 pt-2 border-t border-rose-100">
          <h3 class="text-sm font-semibold text-theme-text-main flex items-center space-x-1.5">
            <Database class="w-4 h-4 text-rose-500" />
            <span>数据备份与管理 (100% 客户端本地)</span>
          </h3>

          <div class="grid grid-cols-2 gap-3">
            <!-- 导出 JSON -->
            <button
              type="button"
              @click="handleExportJson"
              class="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 text-xs font-medium transition-all"
            >
              <Download class="w-4 h-4" />
              <span>导出全量 JSON 备份</span>
            </button>

            <!-- 导入 JSON -->
            <label
              class="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-theme-secondary text-theme-text-main border border-rose-200 hover:bg-rose-50 text-xs font-medium cursor-pointer transition-all"
            >
              <Upload class="w-4 h-4 text-rose-500" />
              <span>导入 JSON 备份</span>
              <input type="file" accept=".json" @change="handleImportJson" class="hidden" />
            </label>
          </div>
          <p class="text-[11px] text-theme-text-dim flex items-center space-x-1">
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-500" />
            <span>安全承诺：导出文件中严格剔除 API 密钥，仅包含规则与判例数据，可安全公开分享。</span>
          </p>

          <div class="pt-2 flex justify-between items-center">
            <button
              type="button"
              @click="handleResetDefault"
              class="text-xs text-rose-400 hover:text-rose-600 underline"
            >
              重置为初始预置规则库
            </button>
            <button
              type="button"
              @click="settingsStore.setOnboardingBanner(true)"
              class="text-xs text-theme-text-muted hover:text-rose-600 underline"
            >
              重新唤出顶部上手指引横幅
            </button>
          </div>
        </div>
      </div>

      <!-- 底部保存 -->
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
          保存设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import {
  Settings,
  X,
  Key,
  Eye,
  EyeOff,
  User,
  Database,
  Download,
  Upload,
  ShieldCheck
} from 'lucide-vue-next';
import { useSettingsStore } from '../stores/settingsStore';
import { useRuleStore } from '../stores/ruleStore';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const settingsStore = useSettingsStore();
const ruleStore = useRuleStore();

const showKey = ref(false);

const form = reactive({
  baseUrl: settingsStore.baseUrl,
  apiKey: settingsStore.apiKey,
  model: settingsStore.model,
  storageMode: settingsStore.storageMode,
  authorName: settingsStore.authorName
});

watch(
  () => props.isOpen,
  open => {
    if (open) {
      form.baseUrl = settingsStore.baseUrl;
      form.apiKey = settingsStore.apiKey;
      form.model = settingsStore.model;
      form.storageMode = settingsStore.storageMode;
      form.authorName = settingsStore.authorName;
    }
  }
);

function applyPreset(provider: 'deepseek' | 'openai' | 'moonshot') {
  if (provider === 'deepseek') {
    form.baseUrl = 'https://api.deepseek.com/v1';
    form.model = 'deepseek-chat';
  } else if (provider === 'openai') {
    form.baseUrl = 'https://api.openai.com/v1';
    form.model = 'gpt-4o-mini';
  } else if (provider === 'moonshot') {
    form.baseUrl = 'https://api.moonshot.cn/v1';
    form.model = 'moonshot-v1-8k';
  }
}

function handleSave() {
  settingsStore.saveSettings({
    baseUrl: form.baseUrl,
    apiKey: form.apiKey,
    model: form.model,
    storageMode: form.storageMode,
    authorName: form.authorName
  });
  emit('close');
}

function handleExportJson() {
  const jsonStr = ruleStore.exportJsonBackup();
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Acumen-Rules-Backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleImportJson(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target?.result as string);
      if (parsed.rules && Array.isArray(parsed.rules)) {
        if (confirm(`即将导入 ${parsed.rules.length} 条规则，是否确认追加？`)) {
          ruleStore.importRules(parsed.rules, 'append');
          alert('导入成功！');
          emit('close');
        }
      } else {
        alert('导入失败：未找到有效的 rules 规则数组');
      }
    } catch {
      alert('解析 JSON 文件失败，请确认文件格式。');
    }
  };
  reader.readAsText(file);
}

function handleResetDefault() {
  if (confirm('确认恢复为预置初始规则库？当前自定义规则将被重置。')) {
    ruleStore.resetToDefault();
    alert('已恢复为初始预置规则！');
  }
}
</script>
