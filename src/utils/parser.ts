import {
  ParsedDiagnosticResult,
  ParsedEventBlock,
  ParsedMatchItem,
  EventCauseType
} from '../types';

const VALID_CAUSES: EventCauseType[] = [
  '有明确任务被卡住',
  '任务没有收敛条件',
  '外部打断',
  '情绪触发',
  '其他'
];

/**
 * 解析大模型返回的诊断文本
 */
export function parseDiagnosticOutput(rawText: string): ParsedDiagnosticResult {
  const result: ParsedDiagnosticResult = {
    applyList: [],
    nearMissList: [],
    uncertainList: [],
    rawText
  };

  if (!rawText || !rawText.trim()) return result;

  // 规范化换行与清理 markdown code fences
  const cleaned = rawText
    .replace(/^```[a-z]*\n?/gm, '')
    .replace(/```$/gm, '')
    .trim();

  // 按照段落标题切分
  // 匹配 EVENT / APPLY / NEAR-MISS / UNCERTAIN
  const eventMatch = cleaned.match(/EVENT\s*([\s\S]*?)(?=(APPLY|NEAR-MISS|UNCERTAIN|$))/i);
  const applyMatch = cleaned.match(/APPLY\s*([\s\S]*?)(?=(EVENT|NEAR-MISS|UNCERTAIN|$))/i);
  const nearMissMatch = cleaned.match(/NEAR-MISS\s*([\s\S]*?)(?=(EVENT|APPLY|UNCERTAIN|$))/i);
  const uncertainMatch = cleaned.match(/UNCERTAIN\s*([\s\S]*?)(?=(EVENT|APPLY|NEAR-MISS|$))/i);

  // 1. 解析 EVENT 段落
  if (eventMatch && eventMatch[1]) {
    const eventBody = eventMatch[1].trim();
    const causeMatch = eventBody.match(/前因[：:]\s*([^\n*]+)/);
    const evidenceMatch = eventBody.match(/依据[：:]\s*([^\n*]+)/);

    let cause: EventCauseType = '其他';
    let causeSupplement = '';

    if (causeMatch && causeMatch[1]) {
      const rawCauseStr = causeMatch[1].trim();
      for (const vc of VALID_CAUSES) {
        if (rawCauseStr.includes(vc)) {
          cause = vc;
          // 提取括号中或破折号后的补充说明
          const supplementMatch = rawCauseStr.match(/[（(]([^)）]+)[)）]/);
          if (supplementMatch) {
            causeSupplement = supplementMatch[1].trim();
          } else {
            const rest = rawCauseStr.replace(vc, '').replace(/^[:：\-—\s]+/, '').trim();
            if (rest) causeSupplement = rest;
          }
          break;
        }
      }
    }

    const evidence = evidenceMatch && evidenceMatch[1] ? evidenceMatch[1].trim() : eventBody;

    result.event = {
      cause,
      causeSupplement,
      evidence
    };
  }

  // 2. 辅助解析列表匹配项
  function parseItemList(sectionText?: string): ParsedMatchItem[] {
    if (!sectionText) return [];
    const text = sectionText.trim();
    if (!text || text === '无' || text.toLowerCase() === 'none') return [];

    const lines = text.split('\n');
    const items: ParsedMatchItem[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line === '无' || line === '*' || line === '-') continue;

      // 匹配 #编号「原文片段」— 详细理由
      // 支持 #001、#1、规则1等
      const m = line.match(/^[\*\-\s]*([#\d\w-]+|#?\d{3})[「"“](.*?)[」"”][—\-–\s]+([\s\S]*)$/);
      if (m) {
        items.push({
          ruleId: m[1].startsWith('#') ? m[1] : `#${m[1]}`,
          quoteSnippet: m[2].trim(),
          detail: m[3].trim(),
          rawText: line
        });
      } else {
        // 宽松兜底：提取 #编号
        const idMatch = line.match(/([#\d\w-]+)/);
        if (idMatch && line.length > 5) {
          items.push({
            ruleId: idMatch[1].startsWith('#') ? idMatch[1] : `#${idMatch[1]}`,
            quoteSnippet: '',
            detail: line.replace(/^[*\-\s]+/, '').trim(),
            rawText: line
          });
        }
      }
    }

    return items;
  }

  if (applyMatch) {
    result.applyList = parseItemList(applyMatch[1]);
  }
  if (nearMissMatch) {
    result.nearMissList = parseItemList(nearMissMatch[1]);
  }
  if (uncertainMatch) {
    result.uncertainList = parseItemList(uncertainMatch[1]);
  }

  return result;
}
