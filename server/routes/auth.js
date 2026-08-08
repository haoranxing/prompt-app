const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { auth, JWT_SECRET } = require('../middleware/auth');
const router = express.Router();

router.post('/register', (req, res) => {
  const { phone, password, nickname } = req.body;
  if (!phone || !password) return res.status(400).json({ error: '手机号和密码必填' });
  if (!/^1\d{10}$/.test(phone)) return res.status(400).json({ error: '手机号格式错误' });
  if (password.length < 6) return res.status(400).json({ error: '密码至少6位' });

  const hash = bcrypt.hashSync(password, 10);
  try {
    const result = db.prepare(
      'INSERT INTO users (phone, password, nickname, level) VALUES (?, ?, ?, ?)'
    ).run(phone, hash, nickname || phone, 'normal');
    const token = jwt.sign({ userId: result.lastInsertRowid, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: result.lastInsertRowid, phone, nickname: nickname || phone, role: 'user', level: 'normal' } });
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(409).json({ error: '手机号已注册' });
    throw e;
  }
});

router.post('/login', (req, res) => {
  const { phone, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: '手机号或密码错误' });
  }
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: { id: user.id, phone: user.phone, nickname: user.nickname, avatar: user.avatar, role: user.role, level: user.level || 'normal' }
  });
});

router.get('/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, phone, nickname, avatar, role, level, created_at FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json(user);
});

// Update profile (nickname)
router.put('/profile', auth, (req, res) => {
  const { nickname } = req.body;
  if (!nickname || !nickname.trim()) return res.status(400).json({ error: '昵称不能为空' });
  db.prepare('UPDATE users SET nickname = ? WHERE id = ?').run(nickname.trim(), req.userId);
  const user = db.prepare('SELECT id, phone, nickname, avatar, role, level FROM users WHERE id = ?').get(req.userId);
  res.json(user);
});

// Redeem activation code to upgrade to VIP
router.post('/redeem', auth, (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: '请输入激活码' });
  const row = db.prepare('SELECT * FROM activation_codes WHERE code = ?').get(code.trim());
  if (!row) return res.status(404).json({ error: '激活码不存在' });
  if (row.status === 'used') return res.status(409).json({ error: '激活码已被使用' });

  const update = db.transaction(() => {
    db.prepare("UPDATE users SET level = 'vip' WHERE id = ?").run(req.userId);
    db.prepare("UPDATE activation_codes SET status='used', used_by=?, used_at=CURRENT_TIMESTAMP WHERE id=?")
      .run(req.userId, row.id);
  });
  update();
  res.json({ ok: true, level: 'vip' });
});

module.exports = router;
