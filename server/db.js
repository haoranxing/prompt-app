const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nickname TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin', 'superadmin')),
    level TEXT DEFAULT 'normal' CHECK(level IN ('normal', 'vip')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    platform TEXT DEFAULT 'Seedream',
    price_type TEXT DEFAULT 'free' CHECK(price_type IN ('free', 'vip')),
    image TEXT,
    author_id INTEGER REFERENCES users(id),
    is_featured INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    content_en TEXT,
    tips TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prompt_id INTEGER NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, prompt_id)
  );
`);

// Migration: add content_en if missing
try {
  db.exec("ALTER TABLE prompts ADD COLUMN content_en TEXT");
} catch (e) {
  // column already exists
}

// Migration: add tips if missing
try {
  db.exec("ALTER TABLE prompts ADD COLUMN tips TEXT");
} catch (e) {
  // column already exists
}

// Migration: add level if missing
try {
  db.exec("ALTER TABLE users ADD COLUMN level TEXT DEFAULT 'normal'");
} catch (e) {
  // column already exists
}

// Site config table
db.exec(`
  CREATE TABLE IF NOT EXISTS site_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    app_name TEXT DEFAULT '爱谱猫',
    slogan TEXT DEFAULT '海量精选提示词，AI 创作更简单',
    platforms TEXT DEFAULT 'Seedance, Midjourney, ChatGPT, Veo, Gemini & more',
    seo_title TEXT DEFAULT '爱谱猫 - 提示词广场',
    seo_description TEXT DEFAULT '爱谱猫提供海量精选 AI 提示词，覆盖 Seedance、Midjourney、ChatGPT、Veo、Gemini 等主流平台，让 AI 创作更简单。',
    seo_keywords TEXT DEFAULT '提示词,AI 提示词,Prompt,Seedance,Midjourney,ChatGPT,Veo,Gemini',
    admin_wechat TEXT DEFAULT 'fx829999'
  )
`);

// Migration: add admin_wechat if missing
try {
  db.exec("ALTER TABLE site_config ADD COLUMN admin_wechat TEXT DEFAULT 'fx829999'");
} catch (e) {
  // column already exists
}

// Insert default site config if not exists
db.exec(`
  INSERT OR IGNORE INTO site_config (id, app_name, slogan, platforms, seo_title, seo_description, seo_keywords, admin_wechat)
  VALUES (1, '爱谱猫', '海量精选提示词，AI 创作更简单', 'Seedance, Midjourney, ChatGPT, Veo, Gemini & more',
          '爱谱猫 - 提示词广场',
          '爱谱猫提供海量精选 AI 提示词，覆盖 Seedance、Midjourney、ChatGPT、Veo、Gemini 等主流平台，让 AI 创作更简单。',
          '提示词,AI 提示词,Prompt,Seedance,Midjourney,ChatGPT,Veo,Gemini', 'fx829999')
`);

// Activation codes table
db.exec(`
  CREATE TABLE IF NOT EXISTS activation_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    level TEXT DEFAULT 'vip' CHECK(level IN ('vip')),
    status TEXT DEFAULT 'unused' CHECK(status IN ('unused', 'used')),
    used_by INTEGER REFERENCES users(id),
    used_at DATETIME,
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Seed default categories if empty
const count = db.prepare('SELECT COUNT(*) as c FROM categories').get();
if (count.c === 0) {
  const insert = db.prepare('INSERT INTO categories (name, icon, sort_order) VALUES (?, ?, ?)');
  [
    ['摄影', '📷', 1],
    ['卡通', '🎨', 2],
    ['修图', '✨', 3],
    ['影视', '🎬', 4],
    ['设计', '🖌️', 5],
    ['文案', '✍️', 6]
  ].forEach(c => insert.run(c));
}

// Seed superadmin if no admin exists
const adminCount = db.prepare("SELECT COUNT(*) as c FROM users WHERE role IN ('admin','superadmin')").get();
if (adminCount.c === 0) {
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare("INSERT INTO users (phone, password, nickname, role) VALUES (?, ?, ?, ?)")
    .run('secret-mima-username', hash, '高级管理员', 'superadmin');
}

module.exports = db;
