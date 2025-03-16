# 统一待办平台

统一待办平台是一个企业级应用，用于集中管理和展示来自公司各业务系统的待办事项，提供统一的用户界面和操作体验。

## 功能特点

- **用户认证**：支持用户注册和登录，使用 JWT 令牌进行身份验证
- **待办事项管理**：
  - 集中展示来自不同业务系统的待办事项
  - 按状态、日期等条件筛选待办事项
  - 支持创建、编辑、删除待办事项
  - 支持将完成情况回传至源系统
- **统计报表**：
  - 提供待办事项趋势图
  - 任务状态分布图
  - 支持生成日报、周报、月报、年报
  - 支持导出 PDF/Excel 格式报表
- **系统集成**：提供标准 API 接口，方便与企业其他业务系统集成

## 技术栈

### 前端

- Vue 3：JavaScript 框架
- TypeScript：类型安全的 JavaScript 超集
- Pinia：状态管理库
- Element Plus：UI 组件库
- ECharts：数据可视化图表库
- Vite：构建工具

### 后端

- Node.js/Express：后端服务框架
- MySQL：关系型数据库
- JWT：用户认证
- RESTful API：标准 API 设计

## 项目结构

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

## 安装与运行

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

## 配置

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

## 使用说明

1. 用户注册/登录系统
2. 在待办事项页面查看和管理待办任务
3. 在统计报表页面查看数据分析和导出报表

## 系统集成

其他业务系统可以通过调用 API 接口将待办事项推送到统一待办平台，详细接口说明请参考 [API.md](./API.md)。

## 许可证

MIT
