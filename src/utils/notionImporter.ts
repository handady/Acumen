import { IfThenRule } from '../types';

export interface NotionImportPreview {
  success: boolean;
  rules: IfThenRule[];
  error?: string;
  totalParsed: number;
}

/**
 * 解析从 Notion 复制的表格文本（TSV 制表符分隔）或 Markdown 表格
 */
export function parseNotionTableText(rawInput: string, defaultAuthor: string = 'Explorer'): NotionImportPreview {
  const text = rawInput.trim();
  if (!text) {
    return { success: false, rules: [], totalParsed: 0, error: '输入内容为空' };
  }

  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    return { success: false, rules: [], totalParsed: 0, error: '表格内容不足，至少需要表头和一行数据' };
  }

  // 判断分隔符：制表符 \t 还是 Markdown 竖线 |
  const isMarkdown = lines[0].includes('|');
  const separator = isMarkdown ? '|' : '\t';

  function splitRow(row: string): string[] {
    if (isMarkdown) {
      return row
        .split('|')
        .map(cell => cell.trim())
        .filter((cell, idx, arr) => !(idx === 0 && cell === '') && !(idx === arr.length - 1 && cell === ''));
    }
    return row.split('\t').map(cell => cell.trim());
  }

  const rawHeaders = splitRow(lines[0]);
  const headers = rawHeaders.map(h => h.toLowerCase());

  // 忽略 Markdown 分隔行 |---|---|
  const dataLines = isMarkdown && lines[1].includes('---') ? lines.slice(2) : lines.slice(1);

  // 列索引推断
  let idCol = -1;
  let ifCol = -1;
  let thenCol = -1;
  let whyCol = -1;
  let scenarioCol = -1;
  let probCol = -1;
  let authorCol = -1;

  headers.forEach((h, idx) => {
    if (h.includes('编号') || h.includes('id') || h.includes('#')) idCol = idx;
    else if (h.includes('if') || h.includes('触发') || h.includes('条件') || h.includes('当前')) ifCol = idx;
    else if (h.includes('then') || h.includes('执行') || h.includes('动作') || h.includes('应对')) thenCol = idx;
    else if (h.includes('why') || h.includes('为什么') || h.includes('机制') || h.includes('底层')) whyCol = idx;
    else if (h.includes('场景') || h.includes('分类') || h.includes('领域')) scenarioCol = idx;
    else if (h.includes('概率') || h.includes('置信度') || h.includes('prob')) probCol = idx;
    else if (h.includes('作者') || h.includes('author') || h.includes('创作者')) authorCol = idx;
  });

  // 如果未能识别核心列，尝试按默认列顺序回退 [编号, If, Then, 为什么, 场景, 概率, 作者]
  if (ifCol === -1 && headers.length >= 3) {
    idCol = 0;
    ifCol = 1;
    thenCol = 2;
    whyCol = headers.length > 3 ? 3 : -1;
    scenarioCol = headers.length > 4 ? 4 : -1;
    probCol = headers.length > 5 ? 5 : -1;
  }

  if (ifCol === -1 || thenCol === -1) {
    return {
      success: false,
      rules: [],
      totalParsed: 0,
      error: '无法识别必须的「If（触发条件）」和「Then（执行动作）」列，请检查表头。'
    };
  }

  const rules: IfThenRule[] = [];

  dataLines.forEach((line, rowIdx) => {
    const cols = splitRow(line);
    if (cols.length === 0 || cols.every(c => !c)) return;

    const ifVal = cols[ifCol] || '';
    const thenVal = cols[thenCol] || '';

    if (!ifVal || !thenVal) return; // 必填项缺失跳过

    let idVal = idCol !== -1 && cols[idCol] ? cols[idCol] : `#${String(rules.length + 1).padStart(3, '0')}`;
    if (!idVal.startsWith('#')) {
      idVal = `#${idVal}`;
    }

    rules.push({
      id: idVal,
      ifCondition: ifVal,
      thenAction: thenVal,
      whyMechanism: whyCol !== -1 && cols[whyCol] ? cols[whyCol] : '机制待补充',
      scenario: scenarioCol !== -1 && cols[scenarioCol] ? cols[scenarioCol] : '通用认知',
      probability: probCol !== -1 && cols[probCol] ? cols[probCol] : '80%',
      author: authorCol !== -1 && cols[authorCol] ? cols[authorCol] : defaultAuthor,
      cases: []
    });
  });

  if (rules.length === 0) {
    return {
      success: false,
      rules: [],
      totalParsed: 0,
      error: '未从数据中提取到有效规则行，请检查表格是否包含内容。'
    };
  }

  return {
    success: true,
    rules,
    totalParsed: rules.length
  };
}
