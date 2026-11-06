import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';
import { ApiSettings } from '../types';
import { fetchCommonSettingsApi, saveCommonSettingsApi } from '../utils/api';

export const useSettingsStore = defineStore('settings', () => {
  // 检查是否有 session 保存的 key，否则 fallback 到 localStorage
  const sessionKey = sessionStorage.getItem('acumen_temp_api_key') || '';
  const localKey = localStorage.getItem('acumen_saved_api_key') || '';

  const storageMode = ref<'session' | 'local'>(
    (localStorage.getItem('acumen_storage_mode') as 'session' | 'local') || 'local'
  );

  const baseUrl = ref<string>(
    localStorage.getItem('acumen_api_base_url') || 'https://api.deepseek.com/v1'
  );

  const apiKey = ref<string>(sessionKey || localKey || '');
  const model = ref<string>(localStorage.getItem('acumen_api_model') || 'deepseek-chat');
  const authorName = ref<string>(localStorage.getItem('acumen_author_name') || 'Commander');
  const showOnboardingBanner = ref<boolean>(
    localStorage.getItem('acumen_show_onboarding') !== 'false'
  );

  // 全景沉浸式背景图：清理旧版庞大的 Base64 本地大图缓存
  const storedBg = localStorage.getItem('acumen_global_bg_v1') || '';
  const isHeavyBase64 = storedBg.startsWith('data:image') || storedBg.length > 50000;
  const isOldTreeBg = storedBg.includes('photo-1518495973542-4542c06a5843');
  
  if (isHeavyBase64 || isOldTreeBg) {
    localStorage.removeItem('acumen_global_bg_v1');
  }

  const globalBackgroundUrl = ref<string>((isHeavyBase64 || isOldTreeBg) ? '' : storedBg);

  // 异步从后端同步全局背景
  async function initSettingsFromBackend() {
    try {
      const common = await fetchCommonSettingsApi();
      if (common && common.globalBackgroundUrl !== undefined) {
        if (common.globalBackgroundUrl) {
          globalBackgroundUrl.value = common.globalBackgroundUrl;
          localStorage.setItem('acumen_global_bg_v1', common.globalBackgroundUrl);
        }
      }
    } catch (e) {
      console.warn('[settingsStore] 从后端拉取公共配置失败:', e);
    }
  }

  initSettingsFromBackend();

  function setGlobalBackground(url: string) {
    globalBackgroundUrl.value = url;
    localStorage.setItem('acumen_global_bg_v1', url);
    saveCommonSettingsApi({ globalBackgroundUrl: url });
  }

  function resetGlobalBackground() {
    globalBackgroundUrl.value = '';
    localStorage.removeItem('acumen_global_bg_v1');
    saveCommonSettingsApi({ globalBackgroundUrl: '' });
  }

  // 保存设置并严格遵循安全模式
  function saveSettings(newSettings: Partial<ApiSettings>) {
    if (newSettings.baseUrl !== undefined) {
      baseUrl.value = newSettings.baseUrl;
      localStorage.setItem('acumen_api_base_url', newSettings.baseUrl);
    }
    if (newSettings.model !== undefined) {
      model.value = newSettings.model;
      localStorage.setItem('acumen_api_model', newSettings.model);
    }
    if (newSettings.authorName !== undefined) {
      authorName.value = newSettings.authorName;
      localStorage.setItem('acumen_author_name', newSettings.authorName);
    }
    if (newSettings.storageMode !== undefined) {
      storageMode.value = newSettings.storageMode;
      localStorage.setItem('acumen_storage_mode', newSettings.storageMode);
    }

    if (newSettings.apiKey !== undefined) {
      apiKey.value = newSettings.apiKey;
      if (storageMode.value === 'session') {
        sessionStorage.setItem('acumen_temp_api_key', newSettings.apiKey);
        localStorage.removeItem('acumen_saved_api_key');
      } else {
        localStorage.setItem('acumen_saved_api_key', newSettings.apiKey);
        sessionStorage.removeItem('acumen_temp_api_key');
      }
    }
  }

  // 脱敏掩码显示
  const maskedApiKey = computed(() => {
    if (!apiKey.value) return '未配置 API Key';
    const trimmed = apiKey.value.trim();
    if (trimmed.length <= 8) return '••••••••';
    return `${trimmed.slice(0, 3)}••••••••${trimmed.slice(-4)}`;
  });

  const isConfigured = computed(() => Boolean(apiKey.value && apiKey.value.trim().length > 5));

  function setOnboardingBanner(show: boolean) {
    showOnboardingBanner.value = show;
    localStorage.setItem('acumen_show_onboarding', show ? 'true' : 'false');
  }

  function clearApiKey() {
    apiKey.value = '';
    sessionStorage.removeItem('acumen_temp_api_key');
    localStorage.removeItem('acumen_saved_api_key');
  }

  return {
    baseUrl,
    apiKey,
    model,
    storageMode,
    authorName,
    showOnboardingBanner,
    globalBackgroundUrl,
    maskedApiKey,
    isConfigured,
    saveSettings,
    clearApiKey,
    setOnboardingBanner,
    setGlobalBackground,
    resetGlobalBackground
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot));
}
