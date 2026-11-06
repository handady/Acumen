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
  getAllScenes,
  insertScene,
  updateScene,
  deleteScene,
  getAppSetting,
  setAppSetting,
  uploadsDir
} from './db.js';

import {
  fetchRealWorldHotEvent,
  runLlmDiagnosticBackend,
  testLlmConnectivity
} from './scout.js';

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

// 8. 图片实体文件统一上传（拍立得、全景大背景、场景16:9视窗等通用）
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

// 9. 获取场景列表
app.get('/api/scenes', (req, res) => {
  try {
    const scenes = getAllScenes();
    res.json({ success: true, data: scenes });
  } catch (err) {
    console.error('获取场景失败:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. 新增场景
app.post('/api/scenes', (req, res) => {
  try {
    const scene = req.body;
    if (!scene || !scene.name) {
      return res.status(400).json({ success: false, error: '场景名称不能为空' });
    }
    const created = insertScene(scene);
    res.json({ success: true, data: created });
  } catch (err) {
    console.error('新增场景失败:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. 更新场景
app.put('/api/scenes/:id', (req, res) => {
  try {
    const id = req.params.id;
    const ok = updateScene(id, req.body);
    if (!ok) {
      return res.status(404).json({ success: false, error: '未找到指定场景' });
    }
    res.json({ success: true, data: { id, ...req.body } });
  } catch (err) {
    console.error('更新场景失败:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. 删除场景
app.delete('/api/scenes/:id', (req, res) => {
  try {
    const id = req.params.id;
    deleteScene(id);
    res.json({ success: true, message: '删除场景成功' });
  } catch (err) {
    console.error('删除场景失败:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 13. 获取全局通用配置（全景背景图等，绝对不含 API Key）
app.get('/api/settings/common', (req, res) => {
  try {
    const globalBg = getAppSetting('global_background_url') || '';
    res.json({ success: true, data: { globalBackgroundUrl: globalBg } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 14. 保存全局通用配置
app.put('/api/settings/common', (req, res) => {
  try {
    const { globalBackgroundUrl } = req.body;
    if (globalBackgroundUrl !== undefined) {
      setAppSetting('global_background_url', globalBackgroundUrl);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 14.1 测试大模型连通性
app.post('/api/settings/test-llm', async (req, res) => {
  try {
    const { baseUrl, apiKey, model } = req.body;
    const testRes = await testLlmConnectivity({ baseUrl, apiKey, model });
    res.json(testRes);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 15. 探针采风结算：抓取互联网最新真实事件 + 由后端直接调用 DeepSeek 碰撞研判（杜绝浏览器 CORS 跨域）
app.post('/api/scout/settle', async (req, res) => {
  try {
    const { equippedRules, apiKey, baseUrl, model } = req.body;

    // 1. 抓取真实互联网热点事件（优先使用 DeepSeek 官方搜索接口定向搜寻心法相关真实见闻）
    const lootEvent = await fetchRealWorldHotEvent({
      baseUrl,
      apiKey,
      rules: equippedRules || []
    });

    // 2. 调用大模型进行研判
    const diagResult = await runLlmDiagnosticBackend({
      baseUrl,
      apiKey,
      model,
      rules: equippedRules || [],
      eventText: lootEvent.content
    });

    res.json({
      success: true,
      lootEvent,
      lootAnalysisRaw: diagResult.rawOutput,
      isLiveAI: diagResult.success,
      aiError: diagResult.error,
      modelUsed: diagResult.modelUsed
    });
  } catch (err) {
    console.error('采风结算异常:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 启动服务
const server = app.listen(PORT, () => {
  console.log(`\n==========================================`);
  console.log(`🌿 Acumen SQLite API Server 已就绪！`);
  console.log(`📍 地址: http://localhost:${PORT}`);
  console.log(`📂 数据存储: server/data/acumen.db`);
  console.log(`🖼️ 图片目录: server/uploads/`);
  console.log(`==========================================\n`);
});

// 优雅退出管理：捕获 Ctrl+C (SIGINT) 或终止信号 (SIGTERM)，确保立即关闭 HTTP Server 并干净释放 3001 端口
function safeShutdown(signal) {
  console.log(`\n[Server] 收到 ${signal} 信号，正在释放 3001 端口并退出...`);
  server.close(() => {
    console.log('[Server] 3001 端口已完全释放，后端服务安全退出。');
    process.exit(0);
  });
  // 1.5 秒兜底强退，防止长连接挂死
  setTimeout(() => process.exit(0), 1500).unref();
}

process.on('SIGINT', () => safeShutdown('SIGINT (Ctrl+C)'));
process.on('SIGTERM', () => safeShutdown('SIGTERM'));
process.on('SIGHUP', () => safeShutdown('SIGHUP'));
