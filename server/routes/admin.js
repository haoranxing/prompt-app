const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { auth } = require('../middleware/auth');
const { adminOnly, superAdminOnly } = require('../middleware/admin');
const router = express.Router();

router.use(auth, adminOnly);

// Prompts CRUD
router.get('/prompts', (req, res) => {
  const rows = db.prepare(`
    SELECT p.*, c.name as category_name, u.nickname as author_name
    FROM prompts p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users u ON p.author_id = u.id
    ORDER BY p.created_at DESC
  `).all();
  res.json(rows);
});

router.post('/prompts', (req, res) => {
  const { title, content, content_en, description, tips, category_id, platform, price_type, image, is_featured } = req.body;
  const result = db.prepare(`
    INSERT INTO prompts (title, content, content_en, description, tips, category_id, platform, price_type, image, author_id, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(title, content, content_en || null, description, tips || null, category_id || null, platform || 'Seedream', price_type || 'free', image || null, req.userId, is_featured ? 1 : 0);
  res.json({ id: result.lastInsertRowid });
});

router.put('/prompts/:id', (req, res) => {
  const { title, content, content_en, description, tips, category_id, platform, price_type, image, is_featured } = req.body;
  db.prepare(`
    UPDATE prompts SET title=?, content=?, content_en=?, description=?, tips=?, category_id=?, platform=?, price_type=?, image=?, is_featured=?
    WHERE id=?
  `).run(title, content, content_en || null, description, tips || null, category_id || null, platform || 'Seedream', price_type || 'free', image || null, is_featured ? 1 : 0, req.params.id);
  res.json({ ok: true });
});

router.delete('/prompts/:id', (req, res) => {
  db.prepare('DELETE FROM prompts WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Categories CRUD
router.get('/categories', (req, res) => {
  res.json(db.prepare('SELECT * FROM categories ORDER BY sort_order, id').all());
});

router.post('/categories', superAdminOnly, (req, res) => {
  const { name, icon, sort_order } = req.body;
  const result = db.prepare('INSERT INTO categories (name, icon, sort_order) VALUES (?, ?, ?)').run(name, icon, sort_order || 0);
  res.json({ id: result.lastInsertRowid });
});

router.put('/categories/:id', superAdminOnly, (req, res) => {
  const { name, icon, sort_order } = req.body;
  db.prepare('UPDATE categories SET name=?, icon=?, sort_order=? WHERE id=?').run(name, icon, sort_order, req.params.id);
  res.json({ ok: true });
});

router.delete('/categories/:id', superAdminOnly, (req, res) => {
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Users management (superadmin only)
router.get('/users', superAdminOnly, (req, res) => {
  const rows = db.prepare('SELECT id, phone, nickname, avatar, role, level, created_at FROM users ORDER BY id DESC').all();
  res.json(rows);
});

router.put('/users/:id/role', superAdminOnly, (req, res) => {
  const { role } = req.body;
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  res.json({ ok: true });
});

router.put('/users/:id/level', superAdminOnly, (req, res) => {
  const { level } = req.body;
  if (!['normal', 'vip'].includes(level)) return res.status(400).json({ error: '等级无效' });
  db.prepare('UPDATE users SET level = ? WHERE id = ?').run(level, req.params.id);
  res.json({ ok: true });
});

router.delete('/users/:id', superAdminOnly, (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Activation codes management
function genCode(len = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

router.get('/codes', (req, res) => {
  const rows = db.prepare('SELECT c.*, u.nickname as used_by_name FROM activation_codes c LEFT JOIN users u ON c.used_by = u.id ORDER BY c.created_at DESC').all();
  res.json(rows);
});

router.post('/codes', (req, res) => {
  const { count = 1, level = 'vip' } = req.body;
  const n = Math.min(Math.max(1, +count || 1), 100);
  const created = [];
  const insert = db.prepare('INSERT INTO activation_codes (code, level, created_by) VALUES (?, ?, ?)');
  const tx = db.transaction(() => {
    for (let i = 0; i < n; i++) {
      let code, exists = true;
      while (exists) {
        code = genCode();
        exists = db.prepare('SELECT 1 FROM activation_codes WHERE code = ?').get(code);
      }
      insert.run(code, level, req.userId);
      created.push(code);
    }
  });
  tx();
  res.json({ ok: true, codes: created });
});

router.delete('/codes/:id', (req, res) => {
  db.prepare('DELETE FROM activation_codes WHERE id = ? AND status = ?').run(req.params.id, 'unused');
  res.json({ ok: true });
});

// Site config (admin editable)
router.get('/config', (req, res) => {
  const row = db.prepare('SELECT * FROM site_config WHERE id = 1').get();
  res.json(row);
});

router.put('/config', superAdminOnly, (req, res) => {
  const { app_name, slogan, platforms, seo_title, seo_description, seo_keywords, admin_wechat } = req.body;
  db.prepare(`
    UPDATE site_config SET
      app_name = COALESCE(?, app_name),
      slogan = COALESCE(?, slogan),
      platforms = COALESCE(?, platforms),
      seo_title = COALESCE(?, seo_title),
      seo_description = COALESCE(?, seo_description),
      seo_keywords = COALESCE(?, seo_keywords),
      admin_wechat = COALESCE(?, admin_wechat)
    WHERE id = 1
  `).run(app_name, slogan, platforms, seo_title, seo_description, seo_keywords, admin_wechat);
  res.json({ ok: true });
});

module.exports = router;
