import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';
import { IfThenRule, RuleCase, CaseMatchType } from '../types';
import { initialRules } from '../data/initialRules';

export interface LevelInfo {
  level: number;
  label: string;
  exp: number;
  nextExp: number;
  progressPercent: number;
  badgeClass: string;
}

export function calculateRuleLevel(rule: IfThenRule): LevelInfo {
  let applyCount = 0;
  let nearMissCount = 0;
  let uncertainCount = 0;

  rule.cases.forEach(c => {
    if (c.matchType === 'APPLY') applyCount++;
    else if (c.matchType === 'NEAR-MISS') nearMissCount++;
    else if (c.matchType === 'UNCERTAIN') uncertainCount++;
  });

  const exp = applyCount * 2 + nearMissCount * 3 + uncertainCount * 1;

  if (exp === 0) {
    return {
      level: 0,
      label: '初拟心语 · 待漫步',
      exp,
      nextExp: 1,
      progressPercent: 0,
      badgeClass: 'bg-stone-50 text-stone-500 border-stone-200/70'
    };
  } else if (exp <= 4) {
    return {
      level: 1,
      label: '初见真容',
      exp,
      nextExp: 5,
      progressPercent: Math.min(100, Math.round((exp / 4) * 100)),
      badgeClass: 'bg-rose-50 text-rose-600 border-rose-200/70'
    };
  } else if (exp <= 12) {
    return {
      level: 2,
      label: '边界明晰',
      exp,
      nextExp: 13,
      progressPercent: Math.min(100, Math.round(((exp - 4) / (12 - 4)) * 100)),
      badgeClass: 'bg-apricot-50 text-apricot-600 border-apricot-200/80 font-medium'
    };
  } else if (exp <= 25) {
    return {
      level: 3,
      label: '温润通透',
      exp,
      nextExp: 26,
      progressPercent: Math.min(100, Math.round(((exp - 12) / (25 - 12)) * 100)),
      badgeClass: 'bg-sage-50 text-sage-600 border-sage-200/80 font-medium'
    };
  } else {
    return {
      level: 4,
      label: '心法大成',
      exp,
      nextExp: exp,
      progressPercent: 100,
      badgeClass: 'bg-purple-50 text-purple-600 border-purple-200/80 font-semibold shadow-sm'
    };
  }
}

export const useRuleStore = defineStore('rules', () => {
  // 从 LocalStorage 加载或 fallback 到初始 Mock
  const saved = localStorage.getItem('acumen_rules_v1');
  const rules = ref<IfThenRule[]>(saved ? JSON.parse(saved) : initialRules);

  // 响应式持久化保存
  function persist() {
    localStorage.setItem('acumen_rules_v1', JSON.stringify(rules.value));
  }

  // 统计指标
  const totalRulesCount = computed(() => rules.value.length);
  
  const totalCasesCount = computed(() => {
    return rules.value.reduce((acc, r) => acc + r.cases.length, 0);
  });

  const manualCasesCount = computed(() => {
    return rules.value.reduce((acc, r) => {
      return acc + r.cases.filter(c => c.sourceType !== 'AUTO_SCOUT').length;
    }, 0);
  });

  const scoutCasesCount = computed(() => {
    return rules.value.reduce((acc, r) => {
      return acc + r.cases.filter(c => c.sourceType === 'AUTO_SCOUT').length;
    }, 0);
  });

  const allScenarios = computed(() => {
    const set = new Set<string>();
    rules.value.forEach(r => {
      if (r.scenario) set.add(r.scenario.trim());
    });
    return Array.from(set);
  });

  // 获取单张规则
  function getRuleById(id: string): IfThenRule | undefined {
    return rules.value.find(r => r.id === id);
  }

  // 新增规则
  function addRule(rule: Omit<IfThenRule, 'cases'> & { cases?: RuleCase[] }) {
    // 规范化编号
    let id = rule.id.trim();
    if (!id.startsWith('#')) id = `#${id}`;

    // 查重
    const existingIndex = rules.value.findIndex(r => r.id === id);
    if (existingIndex !== -1) {
      id = `#${String(rules.value.length + 1).padStart(3, '0')}`;
    }

    const newRule: IfThenRule = {
      ...rule,
      id,
      cases: rule.cases || []
    };

    rules.value.unshift(newRule);
    persist();
    return newRule;
  }

  // 更新规则
  function updateRule(id: string, updates: Partial<IfThenRule>) {
    const idx = rules.value.findIndex(r => r.id === id);
    if (idx !== -1) {
      rules.value[idx] = { ...rules.value[idx], ...updates };
      persist();
    }
  }

  // 删除规则
  function deleteRule(id: string) {
    rules.value = rules.value.filter(r => r.id !== id);
    persist();
  }

  // 挂载判例到指定规则卡片
  function addCaseToRule(ruleId: string, newCase: Omit<RuleCase, 'id' | 'createdAt'>) {
    const rule = rules.value.find(r => r.id === ruleId);
    if (!rule) {
      // 容错：去除或加上 # 再次查找
      const altId = ruleId.startsWith('#') ? ruleId.slice(1) : `#${ruleId}`;
      const altRule = rules.value.find(r => r.id === altId);
      if (!altRule) return null;
      return addCaseToRule(altRule.id, newCase);
    }

    const createdCase: RuleCase = {
      ...newCase,
      id: `case-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    rule.cases.unshift(createdCase);
    persist();
    return createdCase;
  }

  // 删除某张规则下的指定判例
  function deleteCase(ruleId: string, caseId: string) {
    const rule = rules.value.find(r => r.id === ruleId);
    if (rule) {
      rule.cases = rule.cases.filter(c => c.id !== caseId);
      persist();
    }
  }

  // 批量导入规则（支持覆盖或追加）
  function importRules(newRules: IfThenRule[], mode: 'append' | 'replace' = 'append') {
    if (mode === 'replace') {
      rules.value = [...newRules];
    } else {
      // 追加模式：避免 ID 冲突
      newRules.forEach(nr => {
        let uniqueId = nr.id;
        while (rules.value.some(r => r.id === uniqueId)) {
          const num = parseInt(uniqueId.replace(/\D/g, '') || '0') + 1;
          uniqueId = `#${String(num).padStart(3, '0')}`;
        }
        rules.value.push({ ...nr, id: uniqueId });
      });
    }
    persist();
  }

  // 导出全量 JSON 备份
  function exportJsonBackup(): string {
    const data = {
      appName: 'Acumen',
      exportVersion: '2.0',
      exportedAt: new Date().toISOString(),
      rules: rules.value
    };
    return JSON.stringify(data, null, 2);
  }

  // 恢复默认初始 Mock 数据
  function resetToDefault() {
    rules.value = JSON.parse(JSON.stringify(initialRules));
    persist();
  }

  return {
    rules,
    totalRulesCount,
    totalCasesCount,
    manualCasesCount,
    scoutCasesCount,
    allScenarios,
    getRuleById,
    addRule,
    updateRule,
    deleteRule,
    addCaseToRule,
    deleteCase,
    importRules,
    exportJsonBackup,
    resetToDefault
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRuleStore, import.meta.hot));
}
