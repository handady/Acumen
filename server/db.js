import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保 server/data 目录存在
export const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 确保 server/uploads 目录存在
export const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const dbPath = path.join(dataDir, 'acumen.db');
export const db = new DatabaseSync(dbPath);

// 初始化数据库表结构
db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS rules (
    id TEXT PRIMARY KEY,
    if_condition TEXT NOT NULL,
    then_action TEXT NOT NULL,
    why_mechanism TEXT NOT NULL,
    scenario TEXT NOT NULL,
    probability TEXT DEFAULT '85%',
    author TEXT DEFAULT '随笔者',
    cover_image TEXT,
    created_at TEXT,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS rule_cases (
    id TEXT PRIMARY KEY,
    rule_id TEXT NOT NULL,
    created_at TEXT,
    raw_event_text TEXT NOT NULL,
    event_cause TEXT NOT NULL,
    event_cause_supplement TEXT,
    event_evidence TEXT NOT NULL,
    match_type TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    source_type TEXT DEFAULT 'MANUAL',
    author TEXT,
    FOREIGN KEY(rule_id) REFERENCES rules(id) ON DELETE CASCADE
  );
`);

// 种子规则（若数据库完全为空时自动装载）
const defaultSeedRules = [
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
        createdAt: '2026-10-25',
        rawEventText: '公司周会上宣布取消下午茶并推行周末随时响应机制，管理层称这是“打破大企业病、重燃初创激情”。',
        eventCause: '情绪触发',
        eventCauseSupplement: '道德绑架引发心理内疚',
        eventEvidence: '用“打破大企业病重燃激情”解释削减福利与增加工时',
        matchType: 'APPLY',
        reasoning: '精准命中：典型的用高尚精神话术遮掩资源压缩现实。',
        sourceType: 'AUTO_SCOUT',
        author: 'Sophia-Lens'
      }
    ]
  },
  {
    id: '#003',
    ifCondition: '在关键决策讨论中对方频繁使用“大家都是这么做的”、“行业惯例向来如此”作为核心论据',
    thenAction: '立刻要求其提供最新 3 个一手成功事实与数据切片，不以群体规模替代因果有效性',
    whyMechanism: '从众诉求往往是论据匮乏时的认知偷懒与权威借势，行业惯例多为路径依赖或生存者偏差。',
    scenario: '博弈叙事',
    probability: '85%',
    author: 'Marcus-Truth',
    cases: []
  }
];

// 批量同步/导入规则
export function syncBatchRules(rulesList) {
  const insertRuleStmt = db.prepare(`
    INSERT OR REPLACE INTO rules (
      id, if_condition, then_action, why_mechanism, scenario, probability, author, cover_image, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertCaseStmt = db.prepare(`
    INSERT OR REPLACE INTO rule_cases (
      id, rule_id, created_at, raw_event_text, event_cause, event_cause_supplement, event_evidence, match_type, reasoning, source_type, author
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();

  db.exec('BEGIN TRANSACTION');
  try {
    for (const r of rulesList) {
      insertRuleStmt.run(
        r.id,
        r.ifCondition,
        r.thenAction,
        r.whyMechanism || '',
        r.scenario || '通用认知',
        r.probability || '85%',
        r.author || '随笔者',
        r.coverImage || null,
        r.createdAt || now,
        now
      );

      if (Array.isArray(r.cases)) {
        for (const c of r.cases) {
          insertCaseStmt.run(
            c.id,
            r.id,
            c.createdAt || now.split('T')[0],
            c.rawEventText,
            c.eventCause || '其他',
            c.eventCauseSupplement || null,
            c.eventEvidence || '',
            c.matchType || 'APPLY',
            c.reasoning || '',
            c.sourceType || 'MANUAL',
            c.author || r.author || '随笔者'
          );
        }
      }
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

// 获取全量规则及判例
export function getAllRules() {
  const rules = db.prepare(`
    SELECT id, if_condition as ifCondition, then_action as thenAction, why_mechanism as whyMechanism,
           scenario, probability, author, cover_image as coverImage, created_at as createdAt, updated_at as updatedAt
    FROM rules
    ORDER BY id ASC
  `).all();

  const cases = db.prepare(`
    SELECT id, rule_id as ruleId, created_at as createdAt, raw_event_text as rawEventText,
           event_cause as eventCause, event_cause_supplement as eventCauseSupplement,
           event_evidence as eventEvidence, match_type as matchType, reasoning,
           source_type as sourceType, author
    FROM rule_cases
    ORDER BY created_at DESC
  `).all();

  const caseMap = new Map();
  for (const c of cases) {
    if (!caseMap.has(c.ruleId)) {
      caseMap.set(c.ruleId, []);
    }
    caseMap.get(c.ruleId).push(c);
  }

  return rules.map(r => ({
    ...r,
    cases: caseMap.get(r.id) || []
  }));
}

// 安全删除本地拍立得物理文件
export function deleteOldLocalImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return;
  // 只处理我们服务器自己生成的本地上传路径，如 /uploads/polaroid-xxx.png
  if (imageUrl.startsWith('/uploads/')) {
    const filename = path.basename(imageUrl);
    const fullPath = path.join(uploadsDir, filename);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log(`[SQLite] 已物理清理旧图片文件: ${filename}`);
      } catch (err) {
        console.warn(`[SQLite] 清理旧图片物理文件失败:`, err);
      }
    }
  }
}

// 新增单条规则
export function insertRule(rule) {
  let id = rule.id.trim();
  if (!id.startsWith('#')) id = `#${id}`;

  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO rules (id, if_condition, then_action, why_mechanism, scenario, probability, author, cover_image, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    rule.ifCondition,
    rule.thenAction,
    rule.whyMechanism || '',
    rule.scenario || '通用认知',
    rule.probability || '85%',
    rule.author || '随笔者',
    rule.coverImage || null,
    now,
    now
  );

  return { ...rule, id, cases: [] };
}

// 更新规则（支持 Upsert 容错与旧图片自动物理清理）
export function updateRule(id, updates) {
  const existing = db.prepare('SELECT * FROM rules WHERE id = ?').get(id);
  const now = new Date().toISOString();

  // 若记录尚未在 SQLite 中存在（例如前端离线时新建的 #004），自动执行 Upsert 插入
  if (!existing) {
    const stmt = db.prepare(`
      INSERT INTO rules (id, if_condition, then_action, why_mechanism, scenario, probability, author, cover_image, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      updates.ifCondition || '未命名遇境',
      updates.thenAction || '未命名心定处',
      updates.whyMechanism || '',
      updates.scenario || '通用认知',
      updates.probability || '85%',
      updates.author || '随笔者',
      updates.coverImage || null,
      now,
      now
    );
    return true;
  }

  // 若存在旧图片，且本次更换了封面（或清空封面），物理删除旧图片文件
  if (
    updates.coverImage !== undefined &&
    existing.cover_image &&
    existing.cover_image !== updates.coverImage
  ) {
    deleteOldLocalImage(existing.cover_image);
  }

  const ifCondition = updates.ifCondition !== undefined ? updates.ifCondition : existing.if_condition;
  const thenAction = updates.thenAction !== undefined ? updates.thenAction : existing.then_action;
  const whyMechanism = updates.whyMechanism !== undefined ? updates.whyMechanism : existing.why_mechanism;
  const scenario = updates.scenario !== undefined ? updates.scenario : existing.scenario;
  const probability = updates.probability !== undefined ? updates.probability : existing.probability;
  const author = updates.author !== undefined ? updates.author : existing.author;
  const coverImage = updates.coverImage !== undefined ? updates.coverImage : existing.cover_image;

  db.prepare(`
    UPDATE rules
    SET if_condition = ?, then_action = ?, why_mechanism = ?, scenario = ?, probability = ?, author = ?, cover_image = ?, updated_at = ?
    WHERE id = ?
  `).run(ifCondition, thenAction, whyMechanism, scenario, probability, author, coverImage, now, id);

  return true;
}

// 删除规则（联动清理封面物理文件）
export function deleteRule(id) {
  const existing = db.prepare('SELECT cover_image FROM rules WHERE id = ?').get(id);
  if (existing && existing.cover_image) {
    deleteOldLocalImage(existing.cover_image);
  }
  db.prepare('DELETE FROM rules WHERE id = ?').run(id);
  return true;
}

// 为规则新增判例
export function insertCase(ruleId, newCase) {
  const id = newCase.id || `case-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const createdAt = newCase.createdAt || new Date().toISOString().split('T')[0];

  const stmt = db.prepare(`
    INSERT INTO rule_cases (
      id, rule_id, created_at, raw_event_text, event_cause, event_cause_supplement, event_evidence, match_type, reasoning, source_type, author
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    ruleId,
    createdAt,
    newCase.rawEventText,
    newCase.eventCause || '其他',
    newCase.eventCauseSupplement || null,
    newCase.eventEvidence || '',
    newCase.matchType || 'APPLY',
    newCase.reasoning || '',
    newCase.sourceType || 'MANUAL',
    newCase.author || '随笔者'
  );

  return { ...newCase, id, createdAt };
}

// 删除判例
export function deleteCase(caseId) {
  db.prepare('DELETE FROM rule_cases WHERE id = ?').run(caseId);
  return true;
}

// 初始化种子数据检测
function checkAndSeed() {
  const countRow = db.prepare('SELECT count(*) as count FROM rules').get();
  if (!countRow || countRow.count === 0) {
    console.log('[SQLite] 数据库为空，正在初始化默认种子规则...');
    syncBatchRules(defaultSeedRules);
    console.log('[SQLite] 默认种子数据写入完成！');
  }
}

checkAndSeed();
