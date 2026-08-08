const express = require('express');
const db = require('../db');
const { auth } = require('../middleware/auth');
const router = express.Router();

function rowToPrompt(row, userId = null) {
  if (!row) return null;
  const prompt = { ...row, is_featured: !!row.is_featured };
  if (userId !== undefined && userId !== null) {
    prompt.is_favorite = !!row.is_favorite;
  }
  return prompt;
}

router.get('/', (req, res) => {
  const { category_id, platform, search, sort = 'new', page = 1, limit = 20 } = req.query;
  const userId = req.headers.authorization ? null : null; // favorites need auth separately
  const offset = (Math.max(1, +page) - 1) * +limit;

  let where = 'WHERE 1=1';
  const params = [];
  if (category_id) { where += ' AND p.category_id = ?'; params.push(category_id); }
  if (platform) { where += ' AND p.platform = ?'; params.push(platform); }
  if (search) { where += ' AND (p.title LIKE ? OR p.content LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  let order = 'p.created_at DESC';
  if (sort === 'hot') order = 'p.view_count DESC, p.created_at DESC';
  if (sort === 'trend') order = 'p.is_featured DESC, p.view_count DESC';

  const rows = db.prepare(`
    SELECT p.*, c.name as category_name, u.nickname as author_name
    FROM prompts p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users u ON p.author_id = u.id
    ${where}
    ORDER BY ${order}
    LIMIT ? OFFSET ?
  `).all(...params, +limit, offset);

  res.json(rows.map(r => rowToPrompt(r)));
});

router.get('/home', (req, res) => {
  const trends = db.prepare(`
    SELECT p.*, c.name as category_name FROM prompts p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.is_featured DESC, p.view_count DESC LIMIT 6
  `).all();
  const hot = db.prepare(`
    SELECT p.*, c.name as category_name FROM prompts p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.view_count DESC LIMIT 6
  `).all();
  const latest = db.prepare(`
    SELECT p.*, c.name as category_name FROM prompts p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC LIMIT 6
  `).all();
  res.json({ trends, hot, latest });
});

router.get('/:id', (req, res) => {
  const row = db.prepare(`
    SELECT p.*, c.name as category_name, u.nickname as author_name
    FROM prompts p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users u ON p.author_id = u.id
    WHERE p.id = ?
  `).get(req.params.id);
  if (!row) return res.status(404).json({ error: '提示词不存在' });
  db.prepare('UPDATE prompts SET view_count = view_count + 1 WHERE id = ?').run(req.params.id);
  row.view_count += 1;
  res.json(rowToPrompt(row));
});

module.exports = router;
