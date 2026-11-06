// 1. 事件前因分类枚举
export type EventCauseType = 
  | '有明确任务被卡住'
  | '任务没有收敛条件'
  | '外部打断'
  | '情绪触发'
  | '其他';

// 2. 判例匹配类型
export type CaseMatchType = 'APPLY' | 'NEAR-MISS' | 'UNCERTAIN';

// 3. 挂载在卡片下的真实事件判例
export interface RuleCase {
  id: string;
  createdAt: string;              // 日期 YYYY-MM-DD
  rawEventText: string;           // 原始真实事件描述
  eventCause: EventCauseType;     // EVENT定性：前因分类
  eventCauseSupplement?: string;  // 前因的一句话补充
  eventEvidence: string;          // EVENT依据：事件里的哪个具体细节支持该判断
  matchType: CaseMatchType;       // 匹配分类：APPLY | NEAR-MISS | UNCERTAIN
  reasoning: string;              // 具体触发细节 / 表面哪里像但哪个条件不成立 / 倾向与反转条件
  sourceType?: 'MANUAL' | 'AUTO_SCOUT'; // 来源：手动输入 vs 采风探针带回
  author?: string;                // 贡献者署名
}

// 4. 规则卡片主结构
export interface IfThenRule {
  id: string;                     // 规则编号，如 "#001"
  ifCondition: string;            // If：触发条件
  thenAction: string;             // Then：执行动作或认知判断
  whyMechanism: string;           // 为什么：底层机制说明（判定 NEAR-MISS 的核心依据）
  scenario: string;               // 场景分类（如：行为纪律 / 认知工具 / 博弈叙事 / 情绪自洽）
  probability: string;            // 概率/置信度（如 "85%"）
  author: string;                 // 规则创作者署名
  cases: RuleCase[];              // 挂载在该规则下的真实判例集合
  coverImage?: string;            // 拍立得封面图片（Base64 或图片链接）
}

// 5. 可热插拔的 AI 采风视觉主题场景 (Scout Visual Scene)
export interface ScoutSceneTheme {
  id: string;
  name: string;                   // 场景名称，如 "赛博花店集市"、"深海数据中心"、"古典哲学广场"
  backgroundUrl: string;          // AI 生成的背景图 URL 或 Base64（若为空则回退到内置 CSS 雷达/像素网格动画）
  characterUrl?: string;          // 可选：前景独立角色透明 PNG 图层（支持轻微上下浮动动画）
  statusText: string;             // 采风进行中的主文案，如 "Buddy 正在商场店铺采风中..." 或 "Rover 正在扫描职场吐槽帖..."
  tipsList: string[];             // 底部轮播的轻提示文案数组
}

// 6. 内置野生事件池条目（供探针挂机抽取）
export interface WildEventItem {
  id: string;
  category: string;               // 分类：职场困境 / 商业公关 / 历史博弈 / 日常习惯
  title: string;
  content: string;                // 真实的事件详细描述（包含具体动作或原话细节）
  precomputedResult?: string;     // 预置的符合10条硬约束的标准输出文本（用于离线零API直接开箱体验）
}

// 7. 采风探针运行状态机 (Scout State)
export interface ScoutSessionState {
  status: 'IDLE' | 'SCOUTING' | 'READY_TO_CLAIM';
  equippedRuleIds: string[];      // 行囊中携带的规则 ID（最多 3 张）
  sceneThemeId: string;           // 本次出行随机或指定匹配到的视觉场景 ID
  startTime?: number;             // 出发时间戳 (ms)
  endTime?: number;               // 预计归来时间戳 (ms)
  durationMinutes: number;        // 设定的采风时长（支持 15分钟 / 45分钟 / 3小时 / 5秒极速测试模式）
  lootEvent?: WildEventItem;      // 本次采风抓取到的野生事件
  lootAnalysisRaw?: string;       // 碰撞生成的诊断报告原文
  isLiveAI?: boolean;             // 真实连通后端并由大模型研判完成（为 false 时为离线兜底）
  aiError?: string;               // 若大模型研判未成功时的真实错误详情
}

// 8. 解析后的 AI 诊断块
export interface ParsedEventBlock {
  cause: EventCauseType;
  causeSupplement?: string;
  evidence: string;
}

export interface ParsedMatchItem {
  ruleId: string;
  quoteSnippet: string;
  detail: string;
  rawText: string;
}

export interface ParsedDiagnosticResult {
  event?: ParsedEventBlock;
  applyList: ParsedMatchItem[];
  nearMissList: ParsedMatchItem[];
  uncertainList: ParsedMatchItem[];
  rawText: string;
}

// 9. API 配置与安全设置
export interface ApiSettings {
  baseUrl: string;
  apiKey: string;
  model: string;
  storageMode: 'session' | 'local'; // 安全策略：关闭网页即清除 vs 本地持久化
  authorName: string;
}
