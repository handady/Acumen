import express from 'express';
import cors from 'cors';
import path from 'node:path';
import multer from 'multer';

import {
  getAllRules,
  insertRule,
  updateRule,
  deleteRule,
  insertCase,
  deleteCase,
  syncBatchRules,
  uploadsDir
} from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// 静态文件服务：托管上传的拍立得照片
app.use('/uploads', express.static(uploadsDir));

// 配置 multer 上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `polaroid-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 限制 10MB
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Acumen SQLite API Server',
    version: '1.0.0',
    time: new Date().toISOString()
  });
});

// 1. 获取所有规则列表
app.get('/api/rules', (req, res) => {
  try {
    const rules = getAllRules();
    res.json({ success: true, data: rules });
  } catch (err) {
    console.error('获取规则失败:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. 新增规则
app.post('/api/rules', (req, res) => {
  try {
    const rule = req.body;
    if (!rule || !rule.ifCondition || !rule.thenAction) {
      return res.status(400).json({ success: false, error: '缺少关键规则字段' });
    }
    const created = insertRule(rule);
    res.json({ success: true, data: created });
  } catch (err) {
    console.error('新增规则失败:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. 更新规则
app.put('/api/rules/:id', (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id);
    const updates = req.body;
    const ok = updateRule(id, updates);
    if (!ok) {
      return res.status(404).json({ success: false, error: '未找到指定规则' });
    }
    res.json({ success: true, data: { id, ...updates } });
  } catch (err) {
    console.error('更新规则失败:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. 删除规则
app.delete('/api/rules/:id', (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id);
    deleteRule(id);
    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    console.error('删除规则失败:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. 挂载生活印记判例
app.post('/api/rules/:id/cases', (req, res) => {
  try {
    const ruleId = decodeURIComponent(req.params.id);
    const newCase = req.body;
    if (!newCase || !newCase.rawEventText) {
      return res.status(400).json({ success: false, error: '缺少判例事实文本' });
    }
    const created = insertCase(ruleId, newCase);
    res.json({ success: true, data: created });
  } catch (err) {
    console.error('挂载生活印记失败:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. 删除指定生活印记
app.delete('/api/cases/:caseId', (req, res) => {
  try {
    const caseId = req.params.caseId;
    deleteCase(caseId);
    res.json({ success: true, message: '删除生活印记成功' });
  } catch (err) {
    console.error('删除生活印记失败:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. 批量同步/迁移已有规则
app.post('/api/rules/sync', (req, res) => {
  try {
    const { rules } = req.body;
    if (!Array.isArray(rules)) {
      return res.status(400).json({ success: false, error: '请提供 rules 数组' });
    }
    syncBatchRules(rules);
    const all = getAllRules();
    res.json({ success: true, count: all.length, data: all });
  } catch (err) {
    console.error('批量同步失败:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. 拍立得图片上传
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: '未接收到有效图片文件' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    console.error('图片上传失败:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 启动服务
app.listen(PORT, () => {
  console.log(`\n==========================================`);
  console.log(`🌿 Acumen SQLite API Server 已就绪！`);
  console.log(`📍 地址: http://localhost:${PORT}`);
  console.log(`📂 数据存储: server/data/acumen.db`);
  console.log(`🖼️ 图片目录: server/uploads/`);
  console.log(`==========================================\n`);
});
