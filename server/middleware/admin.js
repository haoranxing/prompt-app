function adminOnly(req, res, next) {
  if (!['admin', 'superadmin'].includes(req.role)) {
    return res.status(403).json({ error: '无管理员权限' });
  }
  next();
}

function superAdminOnly(req, res, next) {
  if (req.role !== 'superadmin') {
    return res.status(403).json({ error: '需要高级管理员权限' });
  }
  next();
}

module.exports = { adminOnly, superAdminOnly };
