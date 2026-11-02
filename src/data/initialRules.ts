import { IfThenRule } from '../types';

export const initialRules: IfThenRule[] = [
  {
    id: '#001',
    ifCondition: '当前核心任务卡在某一子步骤超过 15 分钟且开始频繁切换无关网页',
    thenAction: '立即合上屏幕或推开键盘，起身去茶水间倒满一杯温水，深呼吸 3 次后再重新梳理卡点',
    whyMechanism: '大脑因工作记忆超载引发逃避防御机制。机械性离开物理现场并补充水分可强行切断反刍回路，重置前额叶注意力通道。',
    scenario: '行为纪律',
    probability: '90%',
    author: 'Commander-K',
    cases: [
      {
        id: 'case-001-1',
        createdAt: '2026-10-24',
        rawEventText: '下午两点半打开代码编辑器准备重构登录模块，看到涉及 5 个老旧文件的耦合，还没改一行代码就切去刷技术论坛，一刷就是 40 分钟。',
        eventCause: '有明确任务被卡住',
        eventCauseSupplement: '代码模块依赖复杂导致认知过载',
        eventEvidence: '涉及 5 个老旧文件的耦合，还没改一行代码就切去刷技术论坛',
        matchType: 'APPLY',
        reasoning: '符合典型任务受阻且无意识切换网页特征，满足触发条件中“卡在子步骤且频繁切换网页”的动作事实。',
        sourceType: 'MANUAL',
        author: 'Commander-K'
      },
      {
        id: 'case-001-2',
        createdAt: '2026-10-26',
        rawEventText: '上午刚到工位，还没想好今天具体先做哪件事，顺手打开即时通讯软件看了半小时行业闲聊群。',
        eventCause: '任务没有收敛条件',
        eventCauseSupplement: '开工时缺乏明确首要任务清单',
        eventEvidence: '还没想好今天具体先做哪件事，顺手打开即时通讯软件',
        matchType: 'NEAR-MISS',
        reasoning: '表面看似同样是“上班摸鱼划水”，但机制不符：这是任务未收敛导致的“漂移型摸鱼”，并非“明确任务受阻超15分钟后的逃避型摸鱼”，因此不应触发起身接水动作，而应先做任务拆解。',
        sourceType: 'AUTO_SCOUT',
        author: 'Rover-Alpha'
      },
      {
        id: 'case-001-3',
        createdAt: '2026-10-28',
        rawEventText: '写周报写到第三段卡住了，中途被同事拉去开了一个临时电话会议，开完回来继续盯着屏幕发呆了 10 分钟。',
        eventCause: '外部打断',
        eventCauseSupplement: '被临时开会切断上下文',
        eventEvidence: '被同事拉去开临时电话会，回来发呆 10 分钟',
        matchType: 'UNCERTAIN',
        reasoning: '倾向于不适用：总发呆时间仅 10 分钟尚未达到 15 分钟阈值；若后续继续发呆超过 5 分钟且切屏，则结论反转为 APPLY。',
        sourceType: 'MANUAL',
        author: 'Commander-K'
      }
    ]
  },
  {
    id: '#002',
    ifCondition: '组织公告中出现“为了提升全员创业者心态/拥抱不确定性/拒绝温室效应”等高尚道德词汇来解释福利或资源削减',
    thenAction: '将其降维翻译为“现金流吃紧或业务线收缩”，不产生道德负罪感，并盘点个人可变现硬实力',
    whyMechanism: '高贵谎言叙事本质是用宏大崇高的共同体道德词汇掩盖利益博弈与客观财务衰竭，诱导个体产生自我怀疑或无私奉献幻想。',
    scenario: '认知工具',
    probability: '95%',
    author: 'Sophia-Lens',
    cases: [
      {
        id: 'case-002-1',
        createdAt: '2026-10-20',
        rawEventText: '某互联网公司发布全员信宣布取消餐补和免费打车，信中强调：“为了重塑全员创业初心，打破大公司温室安逸病，将弹药留给真正有长期价值的攻坚战场。”',
        eventCause: '其他',
        eventCauseSupplement: '企业单方面缩减员工福利公关',
        eventEvidence: '全员信中原话：“重塑全员创业初心，打破大公司温室安逸病”',
        matchType: 'APPLY',
        reasoning: '完全符合规则原文对高尚辞藻包装利益缩减的定义，通过“创业初心”道德化合理化削减成本行为。',
        sourceType: 'AUTO_SCOUT',
        author: 'Scout-Delta'
      },
      {
        id: 'case-002-2',
        createdAt: '2026-10-22',
        rawEventText: '老板在周例会上批评某产品上线后留存率只有 8%，严肃要求：“产品团队必须反思用户核心痛点，不要躺在过往版本功劳簿上吃老本。”',
        eventCause: '有明确任务被卡住',
        eventCauseSupplement: '产品业务数据未达标业务复盘',
        eventEvidence: '留存率只有 8%，要求反思核心痛点',
        matchType: 'NEAR-MISS',
        reasoning: '老板虽语气严厉并使用批评词汇，但并未削减客观资源，其动作属于常规业务结果检视与质量追责，机制非“高贵的道德谎言叙事”。',
        sourceType: 'MANUAL',
        author: 'Sophia-Lens'
      }
    ]
  },
  {
    id: '#003',
    ifCondition: '需求方或跨部门协作方提出“尽快出个第一版”、“做个简单好用的方案”等模糊限定词',
    thenAction: '不立即动手排期，反手提供 2 个极端的标尺选项让对方做二选一确认：“是要 1 天搞定但只保跑通的骨架版，还是 4 天包含边界防护的完整版？”',
    whyMechanism: '“尽快”和“简单”属于高熵主观词。直接动手会承担对方心中的最高预期，通过极端锚点选择可强行将主观模糊要求逼入客观边界。',
    scenario: '博弈叙事',
    probability: '88%',
    author: 'Strategy-Bot',
    cases: [
      {
        id: 'case-003-1',
        createdAt: '2026-10-18',
        rawEventText: '运营总监在群里发消息：“技术同学帮帮忙，下周活动急需一个抽奖页面，要尽快搞定，做个简单的就行。”',
        eventCause: '外部打断',
        eventCauseSupplement: '外部部门突发插单模糊需求',
        eventEvidence: '群里发言原话：“要尽快搞定，做个简单的就行”',
        matchType: 'APPLY',
        reasoning: '精准命中“尽快”与“简单”两个高危模糊词，必须给出极端时间与范围选项反向锚定，不可按自己理解盲目开工。',
        sourceType: 'AUTO_SCOUT',
        author: 'Strategy-Bot'
      }
    ]
  },
  {
    id: '#004',
    ifCondition: '因突发被批评或突发冲突导致胸口发闷、想立刻打字长篇大论反驳',
    thenAction: '将手从键盘移开 3 分钟，在物理白纸上写下三行字：1.对方陈述的事实是什么？2.对方宣泄的情绪是什么？3.我方底线是什么？',
    whyMechanism: '杏仁核劫持状态下的大脑会把语言中枢用于防御性攻击，纸笔书写可强制调用视觉与手部慢神经通路，恢复理智降噪。',
    scenario: '情绪自洽',
    probability: '92%',
    author: 'Calm-Mind',
    cases: [
      {
        id: 'case-004-1',
        createdAt: '2026-10-15',
        rawEventText: '客户在群里突然发飙：“你们这周交付的报表全是漏洞，到底有没有用心做？”当事人感到心跳加速，输入框已经敲了二百字反驳材料。',
        eventCause: '情绪触发',
        eventCauseSupplement: '遭遇客户公开发飙指责引发防御本能',
        eventEvidence: '客户原话指责，当事人在输入框敲了二百字反驳材料',
        matchType: 'APPLY',
        reasoning: '符合情绪爆发与迫切反驳的物理动作特征，纸笔三问可迅速剥离指责中的情绪与真实报表漏洞。',
        sourceType: 'MANUAL',
        author: 'Calm-Mind'
      }
    ]
  }
];
