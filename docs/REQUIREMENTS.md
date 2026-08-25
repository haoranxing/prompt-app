# 爱谱猫 - 提示词广场 需求开发文档

> 文档版本：v1.0  
> 创建时间：2026-08-09  
> 最后更新：2026-08-09  
> 作者：fengxin

---

## 1. 项目概述

根据用户提供的（数字)小程序image（热门页、分类广场页、我的页面、提示词详情页），搭建一个**移动端 H5 提示词广场应用**。UI 风格完全参考截图的深色卡片式设计。

### 1.1 应用名称
爱谱猫 - 提示词广场

### 1.2 核心定位
提供海量精选 AI 提示词，覆盖 Seedance、Midjourney、ChatGPT、Veo、Gemini 等主流 AI 平台，让 AI 创作更简单。

### 1.3 目标用户
- 普通会员：可免费浏览免费提示词
- 高级会员（VIP）：解锁全站 VIP 提示词
- 管理员 / 高级管理员：管理提示词、分类、用户、激活码、站点配置

---

## 2. 技术栈

| 层 | 技术 |
|---|---|
| 前端框架 | Vue 3 + Vite |
| 状态管理 | Pinia |
| 路由 | Vue Router |
| UI 样式 | Tailwind CSS |
| 后端框架 | Node.js + Express |
| 数据库 | SQLite（better-sqlite3） |
| 认证 | JWT（jsonwebtoken） |
| 密码加密 | bcryptjs |
| 文件上传 | multer |

---

## 3. 目录结构

```
prompt-app/
├── client/                 # 前端项目
│   ├── src/
│   │   ├── api/           # API 接口封装
│   │   ├── assets/        # 静态资源
│   │   ├── components/    # 公共组件
│   │   ├── router/        # 路由配置
│   │   ├── stores/        # Pinia 状态管理
│   │   └── views/         # 页面视图
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # 后端项目
│   ├── middleware/        # 中间件（认证、权限）
│   ├── routes/            # 路由模块
│   ├── uploads/           # 上传文件目录
│   ├── db.js              # 数据库初始化
│   ├── index.js           # 服务入口
│   ├── package.json
│   └── seed.js            # 种子数据脚本
├── docs/                   # 需求开发文档
│   └── REQUIREMENTS.md    # 本文档
└── README.md
```

---

## 4. 数据库模型

### 4.1 users（用户表）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INTEGER PK | 用户 ID |
| phone | TEXT UNIQUE | 手机号，登录账号 |
| password | TEXT | bcrypt 加密后的密码 |
| nickname | TEXT | 昵称 |
| avatar | TEXT | 头像 URL |
| role | TEXT | 角色：`user` / `admin` / `superadmin` |
| level | TEXT | 会员等级：`normal` / `vip` |
| created_at | DATETIME | 注册时间 |

### 4.2 prompts（提示词表）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INTEGER PK | 提示词 ID |
| title | TEXT | 标题 |
| content | TEXT | 中文提示词内容 |
| content_en | TEXT | 英文提示词内容 |
| description | TEXT | 描述 / 效果说明 |
| tips | TEXT | 优化要点说明 |
| category_id | INTEGER | 分类 ID |
| platform | TEXT | 适用平台：Seedream / Midjourney / ChatGPT / Veo / Gemini / Seedance 等 |
| price_type | TEXT | 价格类型：`free` / `vip` |
| image | TEXT | 封面图 URL |
| author_id | INTEGER | 作者（管理员）ID |
| is_featured | INTEGER | 是否首页推荐：0 / 1 |
| view_count | INTEGER | 浏览量 |
| created_at | DATETIME | 创建时间 |

### 4.3 categories（分类表）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INTEGER PK | 分类 ID |
| name | TEXT | 分类名称 |
| icon | TEXT | 图标（emoji 或类名） |
| sort_order | INTEGER | 排序 |

### 4.4 favorites（收藏表）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INTEGER PK | 收藏 ID |
| user_id | INTEGER | 用户 ID |
| prompt_id | INTEGER | 提示词 ID |
| created_at | DATETIME | 收藏时间 |

### 4.5 site_config（站点配置表）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INTEGER PK CHECK(id=1) | 固定 1 条 |
| app_name | TEXT | 应用名称 |
| slogan | TEXT | 首页口号 |
| platforms | TEXT | 适配平台展示文案 |
| seo_title | TEXT | SEO 标题 |
| seo_description | TEXT | SEO 描述 |
| seo_keywords | TEXT | SEO 关键词 |
| admin_wechat | TEXT | 管理员微信号 |

### 4.6 activation_codes（激活码表）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | INTEGER PK | 激活码 ID |
| code | TEXT UNIQUE | 激活码 |
| level | TEXT | 兑换后等级：`vip` |
| status | TEXT | 状态：`unused` / `used` |
| used_by | INTEGER | 使用者 user_id |
| used_at | DATETIME | 使用时间 |
| created_at | DATETIME | 生成时间 |

---

## 5. 功能需求

### 5.1 用户端

#### 5.1.1 热门首页
- 顶部展示应用名称、口号、适配平台列表（后台可配置）
- 三个横向卡片区：趋势、热门、最新
- 每个卡片展示提示词封面图、标题、平台标签、VIP 标识
- 点击卡片进入提示词详情页

#### 5.1.2 分类广场
- 展示所有分类
- 按分类筛选提示词
- 分类卡片网格布局

#### 5.1.3 提示词详情页
- 顶部完整展示封面图（object-contain，不裁剪）
- 标题区显示「提示词」标签 + 分类标签
- 右上角关闭按钮，标题旁收藏心形
- 展示评分、使用量、作者信息
- 「提示词核心精准」模块：支持中 / EN 切换
- 「💡 使用建议 & 场景调校」模块：展示优化要点
- 模型参数：模型 / 平台 + 模型环境
- 底部一键复制按钮

#### 5.1.4 收藏
- 登录用户可收藏 / 取消收藏提示词
- 在「我的 → 我的收藏」查看收藏列表

#### 5.1.5 会员中心
- 显示当前会员等级徽章（普通会员 / 高级会员）
- 可修改昵称
- VIP 激活码兑换入口
- 联系管理员开通 VIP（展示管理员微信号，可一键复制）

#### 5.1.6 注册 / 登录
- 手机号 + 密码注册
- 手机号 + 密码登录
- JWT Token 持久化

### 5.2 VIP 权限与防复制

- VIP 提示词对非 VIP 用户：详情页内容锁定，显示「🔒 VIP 专享」，复制按钮引导开通 VIP
- 非 VIP 用户全局复制被拦截，提示「请开通VIP功能，解锁全站提示词」
- VIP 会员可正常复制全站内容
- 全局禁用右键菜单

### 5.3 管理后台

仅管理员 / 高级管理员可进入。

#### 5.3.1 提示词管理
- 添加 / 编辑 / 删除提示词
- 录入字段：标题、中文提示词、英文提示词、描述、优化要点、分类、平台、价格类型、封面图、是否推荐
- 上传封面图

#### 5.3.2 分类管理
- 添加 / 编辑 / 删除分类
- 设置分类名称、图标、排序

#### 5.3.3 用户管理
- 查看所有用户
- 删除用户
- 设置用户会员等级（普通 / VIP）

#### 5.3.4 激活码管理
- 批量生成激活码
- 复制激活码
- 删除未使用的激活码

#### 5.3.5 网站设置
- 修改应用名称
- 修改首页口号
- 修改适配平台展示文案
- 修改 SEO 标题 / 描述 / 关键词
- 修改管理员微信号

---

## 6. 接口设计

### 6.1 认证相关

| 方法 | 路径 | 说明 | 权限 |
|---|---|---|---|
| POST | /api/auth/register | 注册 | 公开 |
| POST | /api/auth/login | 登录 | 公开 |
| GET | /api/auth/me | 获取当前用户信息 | 登录 |
| PUT | /api/auth/profile | 修改昵称 | 登录 |
| POST | /api/auth/redeem | 激活码兑换 VIP | 登录 |

### 6.2 提示词相关

| 方法 | 路径 | 说明 | 权限 |
|---|---|---|---|
| GET | /api/prompts/home | 首页推荐数据 | 公开 |
| GET | /api/prompts | 提示词列表 | 公开 |
| GET | /api/prompts/:id | 提示词详情 | 公开 |
| GET | /api/categories | 分类列表 | 公开 |
| GET | /api/config | 站点配置 | 公开 |

### 6.3 收藏相关

| 方法 | 路径 | 说明 | 权限 |
|---|---|---|---|
| GET | /api/favorites | 我的收藏 | 登录 |
| POST | /api/favorites | 添加收藏 | 登录 |
| DELETE | /api/favorites/:promptId | 取消收藏 | 登录 |

### 6.4 管理员相关

| 方法 | 路径 | 说明 | 权限 |
|---|---|---|---|
| GET | /api/admin/prompts | 提示词列表 | 管理员 |
| POST | /api/admin/prompts | 添加提示词 | 管理员 |
| PUT | /api/admin/prompts/:id | 编辑提示词 | 管理员 |
| DELETE | /api/admin/prompts/:id | 删除提示词 | 管理员 |
| GET | /api/admin/categories | 分类列表 | 管理员 |
| POST | /api/admin/categories | 添加分类 | 管理员 |
| PUT | /api/admin/categories/:id | 编辑分类 | 管理员 |
| DELETE | /api/admin/categories/:id | 删除分类 | 管理员 |
| GET | /api/admin/users | 用户列表 | 高级管理员 |
| PUT | /api/admin/users/:id/level | 设置用户等级 | 高级管理员 |
| DELETE | /api/admin/users/:id | 删除用户 | 高级管理员 |
| GET | /api/admin/codes | 激活码列表 | 高级管理员 |
| POST | /api/admin/codes | 批量生成激活码 | 高级管理员 |
| DELETE | /api/admin/codes/:id | 删除激活码 | 高级管理员 |
| GET | /api/admin/config | 站点配置 | 管理员 |
| PUT | /api/admin/config | 修改站点配置 | 高级管理员 |

### 6.5 上传相关

| 方法 | 路径 | 说明 | 权限 |
|---|---|---|---|
| POST | /api/upload/image | 上传图片 | 管理员 |

---

## 7. 默认数据

### 7.1 默认管理员
- 手机号：`mimi`
- 密码：`mimi`
- 角色：`superadmin`
- 等级：`vip`

### 7.2 默认分类
- 人物形象
- 摄影艺术
- 视频创作
- 卡通插画
- 设计创意
- 自然风光
- 赛博国潮

### 7.3 默认站点配置
- 应用名称：爱谱猫
- 口号：海量精选提示词，AI 创作更简单
- 适配平台：Seedance, Midjourney, ChatGPT, Veo, Gemini & more
- 管理员微信号：fx829999

---

## 8. 启动方式

```bash
# 启动后端
cd prompt-app/server
npm install
npm start

# 启动前端
cd prompt-app/client
npm install
npm run dev
```

- 后端地址：http://localhost:3001
- 前端地址：http://localhost:5173

---

## 9. 迭代记录

### v1.0 基础版本
- 搭建前后端项目
- 实现首页、分类、详情、收藏、登录注册、管理员后台

### v1.1 详情页优化
- 顶部图片完整展示
- 中英切换
- 新增英文提示词
- 模型参数展示

### v1.2 精简与 SEO
- 移除重复图片与英文提示词重复区
- 新增优化要点说明
- 首页文案后台可配置
- 新增 SEO 后台管理

### v1.3 会员体系
- 普通会员 / 高级会员
- 激活码兑换 VIP
- 会员中心
- VIP 权限控制
- 全局防复制

---

## 10. 待办 / 可选优化

- [ ] 接入真实短信验证码
- [ ] 微信支付购买 VIP
- [ ] 提示词搜索功能
- [ ] 分页加载
- [ ] 提示词点赞 / 评论
- [ ] 部署上线（服务器 / 微信小程序）
- [ ] 接入 CDN 图片存储
- [ ] 操作日志与数据分析
