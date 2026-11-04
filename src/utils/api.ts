import { IfThenRule, RuleCase } from '../types';

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
