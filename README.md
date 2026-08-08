# 爱谱猫 - 提示词广场

参考小程序截图风格搭建的移动端 H5 应用，支持提示词浏览、分类、收藏、复制、用户注册登录、会员体系、激活码兑换、VIP 权限控制，以及管理员后台管理。

## 技术栈

- 前端：Vue 3 + Vite + Tailwind CSS + Pinia + Vue Router
- 后端：Node.js + Express + SQLite（better-sqlite3）

## 目录结构

```
prompt-app/
├── client/      # 前端
├── server/      # 后端
├── docs/        # 需求开发文档
│   └── REQUIREMENTS.md
└── README.md
```

## 快速启动

### 1. 启动后端

```bash
cd server
npm install
npm start
```

后端默认运行在 `http://localhost:3001`。

### 2. 启动前端

```bash
cd client
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`。

## 默认账号

- 高级管理员：手机号 `13800000000`，密码 `admin123`

## 功能清单

### 用户端

- [x] 热门首页（趋势 / 热门 / 最新）
- [x] 分类广场
- [x] 提示词详情页（含中英切换、优化要点、模型参数）
- [x] 一键复制提示词
- [x] 用户注册 / 登录（手机号 + 密码）
- [x] 收藏提示词，可在「我的收藏」查看
- [x] 会员中心：查看等级、修改昵称、激活码兑换 VIP
- [x] VIP 权限控制：VIP 提示词仅 VIP 可见
- [x] 全局防复制：非 VIP 用户复制时提示开通 VIP

### 管理后台

- [x] 提示词：添加 / 编辑 / 删除
- [x] 上传提示词封面图
- [x] 分类管理
- [x] 用户管理：删除用户、设置会员等级
- [x] 激活码管理：批量生成 / 删除激活码
- [x] 网站设置：应用名称 / 口号 / 适配平台 / SEO / 管理员微信号

## 开发文档

详细需求、数据库模型、接口设计见 [`docs/REQUIREMENTS.md`](./docs/REQUIREMENTS.md)。

## 待办

- [ ] 接入真实短信验证码
- [ ] 微信支付购买 VIP
- [ ] 提示词搜索与分页
- [ ] 部署上线
