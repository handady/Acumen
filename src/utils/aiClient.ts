import { IfThenRule } from '../types';

export const HARD_CONSTRAINTS_PROMPT = `1. **不给建议**，不出现「你应该」「建议你」「下次可以」，不鼓励，不做总结。
2. **必须先做 EVENT 定性，再做规则匹配。** 不允许跳过定性、直接按表面词（摸鱼、焦虑、被冒犯……）去对号入座。大多数误判都发生在这一步。
3. **判断只落在可观察的行为或原话上。** 禁止用「摸鱼」「焦虑」「逃避」「内耗」这类标签当触发依据——标签是结论，不是证据。要指出事件里到底是哪个动作、哪句话。
4. **只按我规则原文判断，不要按「通常会怎么做」补全。** 我的规则写得窄，就按窄的判；不要用常识替我扩展适用范围。规则的「为什么」那一列说明了它的机制，**机制不匹配就是 NEAR-MISS，不是 UNCERTAIN**。
5. **「信息不全」不等于「无法判断」。** 现有信息足以给出倾向时，必须把倾向写进 APPLY 或 NEAR-MISS。  
   只有当「补上某一条信息后结论会反转」时，才允许放进 UNCERTAIN，**并且必须写出你现在的倾向**。  
   把所有条目都推进 UNCERTAIN 视为不合格输出。
6. 判断的是**规则是否适用**，不评价我做得对不对、好不好。
7. **一件事同时触发多条规则时，全部列出**，不要只挑最像的那一条。一条规则只能出现在一个段落里。
8. 宁缺毋滥。没有就写「无」，不要凑数。
9. 每条一句话，全文不超过 400 字。
10. 不要改写、润色或「优化」我的规则原文。引用时只截取开头几个字用于定位，不要补全或改写。`;

/**
 * 格式化规则库为文本
 */
export function formatRulesForPrompt(rules: IfThenRule[]): string {
  return rules
    .map((r, i) => {
      return `规则 ${i + 1} (${r.id}):
- IF（触发条件）: ${r.ifCondition}
- THEN（应对/认知）: ${r.thenAction}
- WHY（底层机制）: ${r.whyMechanism}
- 场景: ${r.scenario} | 置信度: ${r.probability}`;
    })
    .join('\n\n');
}

/**
 * 按照 PRD 第5节 硬编码模板，一字不差生成碰撞 Prompt
 */
export function buildDiagnosticPrompt(rules: IfThenRule[], eventText: string): string {
  const rulesContent = formatRulesForPrompt(rules);

  return `## 我的规则库

\`\`\`
${rulesContent}
\`\`\`

## 今天发生的事

\`\`\`
${eventText.trim()}
\`\`\`

## 输出格式（严格遵守，段落顺序不可变）

\`\`\`
EVENT
* 前因：这件事的起因是什么（按「有明确任务被卡住 / 任务没有收敛条件 / 外部打断 / 情绪触发 / 其他」择一，可加一句补充）
* 依据：事件里的哪个具体细节支持这个判断

APPLY
* #编号「规则原文开头若干字…」— 事件里的哪个细节触发了它

NEAR-MISS
* #编号「规则原文开头若干字…」— 表面哪里像，但哪个条件不成立

UNCERTAIN
* #编号「规则原文开头若干字…」— 倾向：适用 / 不适用；缺哪条信息会让结论反转
\`\`\`

某一段没有内容就写「无」。

## 硬约束

${HARD_CONSTRAINTS_PROMPT}`;
}

/**
 * 纯前端直连调用 OpenAI-Compatible 接口
 */
export async function callLlmDiagnostic(options: {
  baseUrl: string;
  apiKey: string;
  model: string;
  rules: IfThenRule[];
  eventText: string;
}): Promise<string> {
  const { baseUrl, apiKey, model, rules, eventText } = options;
  if (!apiKey) {
    throw new Error('未配置 API Key');
  }

  const prompt = buildDiagnosticPrompt(rules, eventText);

  // 清理 baseUrl 后缀斜杠
  let endpoint = baseUrl.trim().replace(/\/+$/, '');
  if (!endpoint.endsWith('/chat/completions')) {
    endpoint = `${endpoint}/chat/completions`;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: model || 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个严格执行认知规则碰撞的判例引擎。你必须绝对遵守输出格式与10条硬约束，不给建议，不打标签，只按规则原文判定。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 1000,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API 调用失败 [${res.status}]: ${errorText || res.statusText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('大模型未返回有效文本');
  }

  return content.trim();
}
