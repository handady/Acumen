import { IfThenRule, RuleCase, ScoutSceneTheme, WildEventItem } from '../types';

/**
 * 封装前端与 SQLite API 服务的通信工具
 */

export async function fetchRulesApi(): Promise<IfThenRule[] | null> {
  try {
    const res = await fetch('/api/rules');
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.warn('[API] 后端服务未连接，回退至本地存储模式:', err);
    return null;
  }
}

export async function createRuleApi(rule: IfThenRule): Promise<boolean> {
  try {
    const res = await fetch('/api/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule)
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] 创建规则网络异常:', err);
    return false;
  }
}

export async function updateRuleApi(id: string, updates: Partial<IfThenRule>): Promise<boolean> {
  try {
    const res = await fetch(`/api/rules/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] 更新规则网络异常:', err);
    return false;
  }
}

export async function deleteRuleApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/rules/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] 删除规则网络异常:', err);
    return false;
  }
}

export async function addCaseApi(ruleId: string, newCase: RuleCase): Promise<boolean> {
  try {
    const res = await fetch(`/api/rules/${encodeURIComponent(ruleId)}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCase)
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] 添加印记网络异常:', err);
    return false;
  }
}

export async function deleteCaseApi(caseId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/cases/${encodeURIComponent(caseId)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] 删除印记网络异常:', err);
    return false;
  }
}

export async function syncRulesApi(rules: IfThenRule[]): Promise<boolean> {
  try {
    const res = await fetch('/api/rules/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rules })
    });
    return res.ok;
  } catch (err) {
    console.warn('[API] 批量同步规则网络异常:', err);
    return false;
  }
}

export async function uploadImageApi(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.url : null;
  } catch (err) {
    console.warn('[API] 图片上传网络异常:', err);
    return null;
  }
}

// ==================== 场景与通用配置接口 ====================

export async function fetchScenesApi(): Promise<ScoutSceneTheme[] | null> {
  try {
    const res = await fetch('/api/scenes');
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export async function createSceneApi(scene: ScoutSceneTheme): Promise<boolean> {
  try {
    const res = await fetch('/api/scenes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scene)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function updateSceneApi(id: string, updates: Partial<ScoutSceneTheme>): Promise<boolean> {
  try {
    const res = await fetch(`/api/scenes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteSceneApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/scenes/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchCommonSettingsApi(): Promise<{ globalBackgroundUrl?: string } | null> {
  try {
    const res = await fetch('/api/settings/common');
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export async function saveCommonSettingsApi(settings: { globalBackgroundUrl?: string }): Promise<boolean> {
  try {
    const res = await fetch('/api/settings/common', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ==================== 探针采风真实网络热点与后端 AI 代发接口 ====================

export interface SettleScoutResponse {
  success: boolean;
  lootEvent: WildEventItem & { source?: string };
  lootAnalysisRaw: string;
  isLiveAI: boolean;
  aiError?: string;
  modelUsed?: string;
}

export async function testLlmConnectionApi(params: {
  baseUrl?: string;
  apiKey?: string;
  model?: string;
}): Promise<{ success: boolean; latencyMs?: number; reply?: string; error?: string }> {
  try {
    const res = await fetch('/api/settings/test-llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      return { success: false, error: `后端服务异常 (HTTP ${res.status})` };
    }
    return await res.json();
  } catch (err: any) {
    return { success: false, error: `无法连通后端服务: ${err.message || '请确保 npm run dev 正在运行'}` };
  }
}
export async function settleScoutSessionApi(params: {
  equippedRules: IfThenRule[];
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}): Promise<SettleScoutResponse | null> {
  try {
    const res = await fetch('/api/scout/settle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('[API] 探针采风网络结算失败，将回退本地模式:', err);
    return null;
  }
}
