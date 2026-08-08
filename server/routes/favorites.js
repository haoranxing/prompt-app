const express = require('express');
const db = require('../db');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
  const rows = db.prepare(`
    SELECT p.*, c.name as category_name, 1 as is_favorite
    FROM favorites f
    JOIN prompts p ON f.prompt_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `).all(req.userId);
  res.json(rows);
});

router.post('/', (req, res) => {
  const { prompt_id } = req.body;
  try {
    db.prepare('INSERT INTO favorites (user_id, prompt_id) VALUES (?, ?)').run(req.userId, prompt_id);
    res.json({ ok: true });
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(409).json({ error: '已收藏' });
    throw e;
  }
});

router.delete('/:prompt_id', (req, res) => {
  db.prepare('DELETE FROM favorites WHERE user_id = ? AND prompt_id = ?').run(req.userId, req.params.prompt_id);
  res.json({ ok: true });
});

module.exports = router;
