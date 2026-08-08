const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'prompt-app-secret-key';

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' });
  }
  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (e) {
    return res.status(401).json({ error: '登录已过期' });
  }
}

module.exports = { auth, JWT_SECRET };
