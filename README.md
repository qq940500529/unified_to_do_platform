# 📋 统一待办平台

> 🌐 多语言支持：[English](./docs/en/README.en.md) | [中文](./docs/zh/README.zh.md)

> 🚀 一个现代化的企业级待办事项管理平台，帮助团队高效协作

统一待办平台是一个企业级应用，用于集中管理和展示来自公司各业务系统的待办事项，提供统一的用户界面和操作体验。

[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 🛠️ 技术栈

> 🔧 主要技术选型

### 🖥️ 前端

- 🟢 Vue 3：JavaScript 框架
- 🔵 TypeScript：类型安全的 JavaScript 超集
- 🟣 Pinia：状态管理库
- 🟠 Element Plus：UI 组件库
- 📊 ECharts：数据可视化图表库
- ⚡ Vite：构建工具

### ⚙️ 后端

- 🟩 Node.js/Express：后端服务框架
- 🟦 MySQL：关系型数据库
- 🔑 JWT：用户认证
- 🔗 RESTful API：标准 API 设计

## 🤖 开发方式

> 🧠 智能开发说明

- 🤖 **AI 开发框架**：CLINE AI 框架
- 🧠 **大模型 API**：
  - 🐙 DeepSeek Chat
  - 🤖 Claude 3.7 Sonnet 20250219
- 🚀 **开发模式**：全自动开发，几乎无人工参与

## 📅 开发计划

> 🗓️ 项目进度追踪

- 📄 查看详细开发进度：[开发计划文档](./docs/zh/DEVELOPMENT_PLAN.md)
- 🔍 实时更新项目状态
- 📊 可视化开发进度

## 🎯 功能特点

> 💡 主要功能概览

- 🔐 **用户认证**：支持用户注册和登录，使用 JWT 令牌进行身份验证
- ✅ **待办事项管理**：
  - 📥 集中展示来自不同业务系统的待办事项
  - 🔍 按状态、日期等条件筛选待办事项
  - ✏️ 支持创建、编辑、删除待办事项
  - 🔄 支持将完成情况回传至源系统
- 📊 **统计报表**：
  - 📈 提供待办事项趋势图
  - 🎯 任务状态分布图
  - 📅 支持生成日报、周报、月报、年报
  - 📤 支持导出 PDF/Excel 格式报表
- 🤝 **系统集成**：提供标准 API 接口，方便与企业其他业务系统集成

## 🛠️ 技术栈

> 🔧 主要技术选型

### 🖥️ 前端

- 🟢 Vue 3：JavaScript 框架
- 🔵 TypeScript：类型安全的 JavaScript 超集
- 🟣 Pinia：状态管理库
- 🟠 Element Plus：UI 组件库
- 📊 ECharts：数据可视化图表库
- ⚡ Vite：构建工具

### ⚙️ 后端

- 🟩 Node.js/Express：后端服务框架
- 🟦 MySQL：关系型数据库
- 🔑 JWT：用户认证
- 🔗 RESTful API：标准 API 设计

## 📂 项目结构

> 🗂️ 项目目录说明

```
统一待办平台/
├── frontend/                # 前端项目
│   ├── public/              # 静态资源
│   ├── src/                 # 源代码
│   │   ├── assets/          # 资源文件
│   │   ├── components/      # 公共组件
│   │   ├── router/          # 路由配置
│   │   ├── services/        # API 服务
│   │   ├── store/           # 状态管理
│   │   ├── types/           # TypeScript 类型定义
│   │   ├── views/           # 页面组件
│   │   ├── App.vue          # 根组件
│   │   └── main.ts          # 入口文件
│   ├── .env                 # 环境变量
│   ├── package.json         # 依赖配置
│   └── vite.config.ts       # Vite 配置
├── backend/                 # 后端项目
│   ├── src/                 # 源代码
│   │   ├── controllers/     # 控制器
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   ├── services/        # 业务逻辑
│   │   └── index.js         # 入口文件
│   ├── .env                 # 环境变量
│   └── package.json         # 依赖配置
├── database/                # 数据库脚本
├── API.md                   # API 文档
└── README.md                # 项目说明
```

## 🚀 安装与运行

> ⚙️ 快速开始指南

### 前端

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 后端

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 数据库

```bash
# 导入数据库脚本
mysql -u username -p database_name < database/init.sql
```

## ⚙️ 配置

> 🔧 环境变量配置说明

### 前端配置

在 `frontend/.env` 文件中配置：

```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 后端配置

在 `backend/.env` 文件中配置：

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=todo_platform
JWT_SECRET=your_jwt_secret
```

## 📖 使用说明

> 👨‍💻 用户操作指南

1. 用户注册/登录系统
2. 在待办事项页面查看和管理待办任务
3. 在统计报表页面查看数据分析和导出报表

## 🤝 系统集成

> 🔗 与其他系统对接说明

其他业务系统可以通过调用 API 接口将待办事项推送到统一待办平台，详细接口说明请参考 [API.md](./docs/zh/API.zh.md)。

## 📜 许可证

> ⚖️ 开源许可信息

MIT
