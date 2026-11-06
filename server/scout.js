/**
 * server/scout.js
 * 负责抓取真实互联网最新热点事件，并由后端调用 DeepSeek 进行严谨硬约束碰撞研判
 */

export const HARD_CONSTRAINTS_PROMPT = `1. **不给建议**，不出现「你应该」「建议你」「下次可以」，不鼓励，不做总结。
2. **必须先做 EVENT 定性，再做规则匹配。** 不允许跳过定性、直接按表面词去对号入座。
3. **判断只落在可观察的行为或原话上。** 禁止用「摸鱼」「焦虑」「逃避」这类标签当触发依据，要明确指出事件里到底是哪个动作、哪句话。
4. **严格区分【NEAR-MISS (易混淆反例边界)】与【完全无关 (IRRELEVANT)】：**
   - **NEAR-MISS 必须具备显著的表面相似度**（行为或原话极度相似、当事人极易误以为能用该规则），仅因关键判据或深层机制不成立，才归为 NEAR-MISS；
   - **完全无关的规则绝不能列入 NEAR-MISS**！若规则的核心场景在事件中压根未出现（严禁以“都在网上”、“都涉及人”等抽象共性强拉硬扯），属于**完全无关**，**严禁出现在任何段落，直接彻底剔除**！
   - 在具有表面相似性的前提下，深层机制不符就是 NEAR-MISS，不是 UNCERTAIN。
5. **「信息不全」不等于「无法判断」。** 现有信息足以给出倾向时必须写进 APPLY 或 NEAR-MISS；仅当补上某条信息会让结论反转时才允许放进 UNCERTAIN，且必须写出现在的倾向。
6. 判断的是规则是否适用，不评价对错好坏。
7. 一件事同时触发多条规则时全部列出，一条规则只能出现在一个段落。
8. **宁缺毋滥，严禁凑数。** 没有吻合就写「无」，没有高相似度的机理辨析也写「无」，完全无关的心法坚决不上榜。
9. 每条一句话，全文不超过 400 字。
10. 不要改写或润色规则原文，引用时只截取编号和开头几个字。`;

// 经典真实生活素材池（离线或外部 API 波动时兜底）
const fallbackClassicEvents = [
  {
    id: 'classic-001',
    category: '真实职场博弈',
    title: '某跨国科技公司全员信取消餐补与打车',
    content: '公司管理层向全体员工发送全员信，正式宣布取消下午茶福利与打车报销。全员信中原话写道：“为了在行业寒冬中提升全员创业者心态，拒绝大企业温室安逸效应，我们决定将有限资源聚焦于真正创造硬仗价值的核心战场。”'
  },
  {
    id: 'classic-002',
    category: '协作沟通现场',
    title: '跨部门协作方催促出简版抽奖页',
    content: '周五下午四点半，业务负责人私聊前端开发并在群内发言称：“下周活动临时加一个轮盘抽奖，需求很简单，搞快点随便弄个第一版能用就行，不用搞太复杂，今晚能不能给个演示？”'
  },
  {
    id: 'classic-003',
    category: '技术研发卡顿',
    title: '重构底层鉴权模块频繁卡壳切屏',
    content: '下午两点打开编辑器准备重构遗留鉴权链路，面对 5 个深层耦合的老旧模块，未写一行代码便切到技术论坛刷帖，连续浏览行业琐碎八卦长达 40 分钟。'
  },
  {
    id: 'classic-004',
    category: '会议争端博弈',
    title: '方案汇报遭质疑并搬出行业惯例论据',
    content: '在产品架构评审会上，对方负责人反复陈述：“大厂和行业惯例向来都是这么做的，别人跑了几年都没出问题，我们不需要创新去承担未知风险。”'
  }
];

// 最近已采风见闻的历史去重池（内存级环形缓冲区，彻底杜绝重复搜到同一篇）
const recentlyFetchedUrls = new Set();
const recentlyFetchedTitles = new Set();

function rememberFetchedEvent(url, title) {
  if (url) recentlyFetchedUrls.add(url);
  if (title) recentlyFetchedTitles.add(title);
  if (recentlyFetchedUrls.size > 30) {
    const firstUrl = recentlyFetchedUrls.values().next().value;
    recentlyFetchedUrls.delete(firstUrl);
  }
  if (recentlyFetchedTitles.size > 30) {
    const firstTitle = recentlyFetchedTitles.values().next().value;
    recentlyFetchedTitles.delete(firstTitle);
  }
}

/**
 * 从规则中衍生真实多样的探针意图（结合 IF 遇境 + THEN 心定动作，涵盖真实经历、游戏攻略、职场指南与玩家经验）
 */
function deriveDynamicSearchIntent(targetRule) {
  const ifText = (targetRule.ifCondition || '').trim();
  const thenText = (targetRule.thenAction || '').trim();

  // 1. 提取 IF 中的核心子分支
  const clauses = ifText
    .split(/[或\/，,；;]|或者/)
    .map(c => c.replace(/^(当|如果|若|在|遇到|出现)/g, '').replace(/(时|的时候|的情况下|且开始|导致)$/g, '').trim())
    .filter(c => c.length >= 3);

  let pickedIfClause = clauses.length > 0
    ? clauses[Math.floor(Math.random() * clauses.length)]
    : ifText.slice(0, 25);

  pickedIfClause = pickedIfClause.replace(/[“”"']/g, '').slice(0, 25).trim();

  // 2. 提取 THEN 中的核心应对动作词（如：屏蔽、关标签页、接水、深呼吸、建立边界）
  const thenActionSnippet = thenText
    .replace(/^(立即|瞬间|立刻|将其)/g, '')
    .slice(0, 20)
    .replace(/[“”"']/g, '')
    .trim();

  // 3. 构造丰富真实的非新闻载体词缀（涵盖真实经历、游戏/生活攻略、玩家经验、社区复盘、行动指南）
  const carrierModifiers = [
    '玩家真实经验 攻略',
    '应对指南 真实经历',
    '贴吧 社区真实讨论 技巧',
    '知乎 亲历复盘 教程',
    '心态调整 攻略 亲身体验',
    '实战经验 吐槽 应对方法',
    '真实生活 踩坑 经验帖'
  ];
  const randCarrier = carrierModifiers[Math.floor(Math.random() * carrierModifiers.length)];

  // 4. 组合为高精度的全网搜索 query（同时包含“遇境”与“应对”，搜出的必然是真正关联的经历或攻略教程）
  const query = `${pickedIfClause} ${thenActionSnippet} ${randCarrier}`.trim().slice(0, 80);

  // 5. 构造自然的原始问题意图 (ori_question)，帮助 DeepSeek 搜索引擎准确理解目标领域（绝不跑偏去搜明星八卦）
  const oriQuestion = `${pickedIfClause}时，如何${thenActionSnippet}？真实经验与攻略指南`.slice(0, 100);

  return { query, oriQuestion };
}

/**
 * 1.0 基于行囊心法关键词，调用 DeepSeek 官方自研搜索引擎接口 (/v1/tools/search) 定向全网搜寻真实生活/职场/游戏经历与攻略
 */
export async function fetchEventWithDeepSeekSearch({ baseUrl, apiKey, rules }) {
  if (!apiKey || apiKey.trim().length < 5 || !rules || rules.length === 0) {
    return null;
  }

  // 1. 挑选行囊中的心法，并生成涵盖“经历/攻略/教程”的多维探针
  const targetRule = rules[Math.floor(Math.random() * rules.length)];
  const { query, oriQuestion } = deriveDynamicSearchIntent(targetRule);
  console.log(`[Scout Search] 启动 DeepSeek 官方全网探寻: Query="${query}", 意图问题="${oriQuestion}" (心法: ${targetRule.id})`);

  let searchEndpoint = (baseUrl || 'https://api.deepseek.com').trim().replace(/\/+$/, '');
  if (searchEndpoint.endsWith('/v1')) {
    searchEndpoint = `${searchEndpoint}/tools/search`;
  } else {
    searchEndpoint = `${searchEndpoint}/v1/tools/search`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(searchEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        query,
        ori_question: oriQuestion, // 核心增强：向 DeepSeek 自研搜索引擎声明真实问题意图，锁定游戏/职场攻略与经历，杜绝明星八卦
        count: 8,
        need_content: true
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const results = (data.results || []).filter(item => item.title && (item.summary || item.content));

      if (results.length > 0) {
        // 2. 优先过滤掉最近已经采风过的历史重复文章（彻底杜绝连续搜到同一篇杨迪新闻）
        let freshResults = results.filter(item =>
          (!item.url || !recentlyFetchedUrls.has(item.url)) &&
          (!item.title || !recentlyFetchedTitles.has(item.title))
        );

        if (freshResults.length === 0) {
          freshResults = results; // 若全部命中过去历史，才降级使用
        }

        // 3. 在优质集合中随机抽样（拒绝死板只拿第0条！）
        const highQuality = freshResults.filter(r => (r.rerank_score || 0) >= 1.2);
        const candidatePool = highQuality.length > 0 ? highQuality : freshResults;
        const picked = candidatePool[Math.floor(Math.random() * candidatePool.length)];

        // 记录至去重缓冲区
        rememberFetchedEvent(picked.url, picked.title);

        // 4. 完整内容处理：优先使用正文，如果正文存在则保留完整真实细节（放宽至 2500 字完整段落，绝不生硬半句截断）
        let fullContent = (picked.content && picked.content.length > 50) ? picked.content : (picked.summary || picked.snippet || '');
        fullContent = fullContent.trim();

        // 若超长，在自然句子末尾截断，确保语句完整
        if (fullContent.length > 2500) {
          const cutIdx = fullContent.lastIndexOf('。', 2400);
          if (cutIdx > 1500) {
            fullContent = fullContent.slice(0, cutIdx + 1) + ' ...（篇幅较长，已截取核心事实部分）';
          } else {
            fullContent = fullContent.slice(0, 2400) + '...';
          }
        }

        console.log(`[Scout Search] DeepSeek 官方搜索成功！拾得切片: 《${picked.title}》, 长度: ${fullContent.length}字, 来源: ${picked.site_name || '全网真实案例'}`);

        return {
          id: `ds-${Date.now().toString(36)}`,
          category: `定向探寻 · ${targetRule.scenario || '真实生活印照'}`,
          title: picked.title.trim(),
          content: fullContent,
          summary: picked.summary,
          url: picked.url,
          siteName: picked.site_name,
          source: 'DEEPSEEK_WEB_SEARCH',
          matchedRuleId: targetRule.id,
          queryUsed: query
        };
      }
    } else {
      const errText = await res.text();
      console.warn('[Scout Search] DeepSeek Search 接口响应非 200:', res.status, errText.slice(0, 100));
    }
  } catch (err) {
    console.warn('[Scout Search] 调用 DeepSeek 官方搜索引擎失败，将降级轮换:', err.message);
  }

  return null;
}

/**
 * 1. 从真实互联网中抓取最新鲜的真实热点事件切片（优先 DeepSeek 官方全网定向搜索，降级到知乎热点或经典切片）
 */
export async function fetchRealWorldHotEvent({ baseUrl, apiKey, rules } = {}) {
  // 优先尝试 DeepSeek 官方自研搜索接口
  const searchResult = await fetchEventWithDeepSeekSearch({ baseUrl, apiKey, rules });
  if (searchResult) {
    return searchResult;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    // 抓取知乎实时热榜（包含详细新闻原话与事实细节）
    const res = await fetch('https://api.zhihu.com/topstory/hot-lists/total?limit=25', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const list = data.data || [];
      const validItems = list.filter(item => item.target && item.target.title && item.target.excerpt);

      if (validItems.length > 0) {
        const picked = validItems[Math.floor(Math.random() * validItems.length)].target;
        return {
          id: `hot-${Date.now().toString(36)}`,
          category: '网络实时热点采风',
          title: picked.title.trim(),
          content: picked.excerpt.trim(),
          source: 'LIVE_WEB_HOTLIST'
        };
      }
    }
  } catch (err) {
    console.warn('[Scout] 实时网络热榜接口暂未连通，自动轮换至经典真实生活切片:', err.message);
  }

  // 离线兜底：使用真实的经典切片
  const pickedFallback = fallbackClassicEvents[Math.floor(Math.random() * fallbackClassicEvents.length)];
  return {
    ...pickedFallback,
    source: 'CLASSIC_REAL_EVENT'
  };
}

/**
 * 2. 由后端直接调用 DeepSeek 进行碰撞分析（绝无浏览器 CORS 跨域问题）
 */
export async function runLlmDiagnosticBackend({ baseUrl, apiKey, model, rules, eventText }) {
  console.log(`[Scout LLM] 收到研判请求: baseUrl=${baseUrl || 'default'}, model=${model || 'default'}, rulesCount=${rules?.length || 0}, keyLen=${apiKey ? apiKey.length : 0}`);

  if (!apiKey || apiKey.trim().length < 5) {
    console.warn('[Scout LLM] 拦截: 未配置有效大模型 API Key');
    return {
      success: false,
      error: '未配置有效 API Key（请在“设置与数据中心”中配置并保存）',
      rawOutput: generateFallbackOutput(rules, eventText, '未配置有效 API Key')
    };
  }

  // 格式化规则库
  const rulesContent = (rules || []).map((r, i) => {
    return `规则 ${i + 1} (${r.id}):
- IF（触发条件）: ${r.ifCondition}
- THEN（应对/认知）: ${r.thenAction}
- WHY（底层机制）: ${r.whyMechanism}
- 场景: ${r.scenario || '通用认知'} | 置信度: ${r.probability || '85%'}`;
  }).join('\n\n');

  const prompt = `## 我的 If-Then 心法规则库

\`\`\`
${rulesContent || '暂无随身携带规则'}
\`\`\`

## 今天发生的事（真实互联网拾得切片）

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

## 硬约束（必须100%遵照）

${HARD_CONSTRAINTS_PROMPT}`;

  // 规范化 BaseUrl
  let endpoint = (baseUrl || 'https://api.deepseek.com/v1').trim().replace(/\/+$/, '');
  if (!endpoint.endsWith('/chat/completions')) {
    endpoint = `${endpoint}/chat/completions`;
  }

  const isReasonerModel = (model || '').toLowerCase().includes('reasoner') || (model || '').toLowerCase().includes('r1');

  // 构建消息：对于 deepseek-reasoner / R1 等思考模型，官方规定不支持 system 角色与 temperature
  const messages = isReasonerModel
    ? [
        {
          role: 'user',
          content: `【诊断学者原则】你是一名极其严谨、冷峻客观的认知认知学与博弈论诊断学者。严格依据用户给定的 10 条硬约束输出，绝不说任何废话。\n\n${prompt}`
        }
      ]
    : [
        {
          role: 'system',
          content: '你是一名极其严谨、冷峻客观的认知认知学与博弈论诊断学者。严格依据用户给定的 10 条硬约束输出，绝不说任何废话。'
        },
        {
          role: 'user',
          content: prompt
        }
      ];

  const requestBody = {
    model: model || 'deepseek-chat',
    messages
    // 注意：完全不人为设置狭窄的 max_tokens！遵循 DeepSeek 官方默认最大生成上限 (4096 / 8192 tokens)，彻底杜绝因人为限额导致的思维链爆仓或内容截断
  };

  if (!isReasonerModel) {
    requestBody.temperature = 0.1;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 宽裕的 60 秒上限

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      console.warn('[Scout LLM] DeepSeek API 响应异常:', response.status, errText);
      return {
        success: false,
        error: `DeepSeek 返回 HTTP ${response.status}: ${errText.slice(0, 120)}`,
        rawOutput: generateFallbackOutput(rules, eventText, `API 返回 HTTP ${response.status}`)
      };
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    let content = choice?.message?.content?.trim();
    const reasoningContent = choice?.message?.reasoning_content?.trim();
    const textLegacy = choice?.text?.trim();

    // 智能多通道容错提取：优先正文 -> 其次思维链 -> 再次传统 text 字段
    if (!content && reasoningContent) {
      console.log('[Scout LLM] 检测到 content 为空但 reasoning_content 存在，提取 reasoning 输出');
      content = reasoningContent;
    }
    if (!content && textLegacy) {
      content = textLegacy;
    }

    if (!content) {
      const finishReason = choice?.finish_reason || 'unknown';
      console.warn('[Scout LLM] choices 内容为空，原始数据:', JSON.stringify(choice));
      throw new Error(`大模型返回内容为空 (finish_reason: ${finishReason}, model: ${model || 'deepseek-chat'})`);
    }

    console.log('[Scout LLM] DeepSeek 碰撞研判成功，返回字符数:', content.length);

    return {
      success: true,
      rawOutput: content,
      modelUsed: model || 'deepseek-chat'
    };
  } catch (err) {
    clearTimeout(timeout);
    const isTimeout = err.name === 'AbortError';
    const errMsg = isTimeout ? '请求超时 (超过 45 秒未响应)' : err.message;
    console.warn('[Scout LLM] 后端调用 DeepSeek 失败:', errMsg);
    return {
      success: false,
      error: `请求大模型失败: ${errMsg}`,
      rawOutput: generateFallbackOutput(rules, eventText, errMsg)
    };
  }
}

/**
 * 3. 连通性测试：由后端轻量发起 1 句对话，验证 API Key 与 BaseUrl 的可用性
 */
export async function testLlmConnectivity({ baseUrl, apiKey, model }) {
  if (!apiKey || apiKey.trim().length < 5) {
    return {
      success: false,
      error: '请先填写有效的 API Key'
    };
  }

  let endpoint = (baseUrl || 'https://api.deepseek.com/v1').trim().replace(/\/+$/, '');
  if (!endpoint.endsWith('/chat/completions')) {
    endpoint = `${endpoint}/chat/completions`;
  }

  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: model || 'deepseek-chat',
        messages: [
          { role: 'user', content: '请仅回复两个字：收到' }
        ],
        max_tokens: 10
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        latencyMs,
        error: `HTTP ${response.status}: ${errText.slice(0, 150)}`
      };
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '';

    return {
      success: true,
      latencyMs,
      reply,
      modelUsed: model || 'deepseek-chat'
    };
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    return {
      success: false,
      latencyMs,
      error: `连接失败: ${err.message}`
    };
  }
}

function generateFallbackOutput(rules, eventText, reason) {
  const reasonText = reason || '大模型离线或未连通';
  return `EVENT
* 前因：其他（真实外部生活事件见闻）
* 依据：${eventText.slice(0, 45)}...

APPLY
无

NEAR-MISS
无

UNCERTAIN
* 【离线降级提示】因大模型未连通（${reasonText}），未完成深层语义硬约束比对。`;
}
