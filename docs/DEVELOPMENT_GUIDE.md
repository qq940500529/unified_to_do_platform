# 📋 统一待办平台开发文档

<div align="center">
  
![版本](https://img.shields.io/badge/版本-1.0.0-blue)
![Node](https://img.shields.io/badge/Node.js-v16+-green)
![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange)
![许可证](https://img.shields.io/badge/许可证-MIT-lightgrey)

</div>

## 📑 目录

- [📋 项目概述](#-项目概述)
- [🔧 技术栈](#-技术栈)
- [📂 项目结构](#-项目结构)
- [💾 数据库设计](#-数据库设计)
- [⚙️ 后端架构](#️-后端架构)
  - [📊 模型层](#-模型层)
  - [🎮 控制器层](#-控制器层)
  - [🛣️ 路由层](#️-路由层)
  - [🧰 工具类](#-工具类)
- [🖥️ 前端架构](#️-前端架构)
  - [🧩 组件结构](#-组件结构)
  - [📦 状态管理](#-状态管理)
  - [🔌 API服务](#-api服务)
  - [🧭 路由配置](#-路由配置)
- [🔐 认证与授权](#-认证与授权)
- [✅ 待办事项功能](#-待办事项功能)
- [📊 报告功能](#-报告功能)
- [📝 开发指南](#-开发指南)
  - [🛠️ 环境设置](#️-环境设置)
  - [🔄 开发流程](#-开发流程)
  - [🧪 测试](#-测试)
  - [🚀 部署](#-部署)
- [🔧 故障排除与常见问题](#-故障排除与常见问题)
- [📋 最近更新](#-最近更新)

## 📋 项目概述

统一待办平台是一个集中管理待办事项的系统，支持多系统待办事项的统一管理、任务分配、状态跟踪以及报表统计功能。该平台采用前后端分离架构，提供RESTful API接口，支持多种报表导出格式。

### ✨ 主要功能

- 👤 用户认证与授权
- ✏️ 待办事项的创建、查询、更新和删除
- 🔄 待办事项的状态管理和任务分配
- 📈 多维度的统计报表生成
- 📁 报表导出（PDF、Excel格式）

## 🔧 技术栈

### 🔙 后端

- **🏃‍♂️ 运行环境**: Node.js
- **🌐 Web框架**: Express.js
- **🗄️ 数据库**: MySQL
- **🔌 数据访问**: 原生SQL查询（使用mysql2/promise）
- **🔑 认证**: JWT (JSON Web Token)
- **📄 文档生成**: PDF (PDFKit)、Excel (ExcelJS)

### 🔜 前端

- **⚡ 框架**: Vue 3
- **🛠️ 构建工具**: Vite
- **📦 状态管理**: Pinia
- **🎨 UI组件库**: Element Plus
- **🌐 HTTP客户端**: Axios
- **🧭 路由**: Vue Router
- **📝 类型检查**: TypeScript

## 📂 项目结构

项目采用前后端分离的结构，分为三个主要部分：

```
统一待办平台/
├── backend/             # 后端代码
│   ├── src/             # 源代码
│   │   ├── app.js       # 应用入口
│   │   ├── server.js    # 服务器配置
│   │   ├── controllers/ # 控制器
│   │   ├── models/      # 数据模型
│   │   ├── routes/      # 路由定义
│   │   ├── middleware/  # 中间件
│   │   ├── database/    # 数据库连接
│   │   └── utils/       # 工具函数
│   ├── .env             # 环境变量
│   ├── .env.example     # 环境变量示例
│   └── package.json     # 依赖配置
│
├── frontend/            # 前端代码
│   ├── src/             # 源代码
│   │   ├── assets/      # 静态资源
│   │   ├── components/  # 组件
│   │   ├── router/      # 路由配置
│   │   ├── services/    # API服务
│   │   ├── store/       # 状态管理
│   │   ├── types/       # TypeScript类型定义
│   │   ├── views/       # 页面视图
│   │   ├── App.vue      # 根组件
│   │   └── main.ts      # 应用入口
│   ├── .env             # 环境变量
│   ├── .env.example     # 环境变量示例
│   └── package.json     # 依赖配置
│
├── database/            # 数据库脚本
│   ├── schema.sql       # 数据库结构
│   └── init.sql         # 初始化数据
│
├── docs/                # 文档
│   ├── en/              # 英文文档
│   └── zh/              # 中文文档
│
├── .gitignore           # Git忽略文件
└── README.md            # 项目说明
```

## 💾 数据库设计

系统使用MySQL数据库，主要包含以下表：

### 👤 用户表 (users)

存储用户信息和认证数据。

| 字段 | 类型 | 描述 |
|------|------|------|
| id | INT | 主键，自增 |
| username | VARCHAR(50) | 用户名，唯一 |
| password_hash | VARCHAR(255) | 密码哈希值 |
| email | VARCHAR(100) | 电子邮箱，唯一 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### ✅ 待办事项表 (todos)

存储待办事项信息。

| 字段 | 类型 | 描述 |
|------|------|------|
| id | INT | 主键，自增 |
| user_id | INT | 创建者ID，外键关联users表 |
| title | VARCHAR(255) | 标题 |
| description | TEXT | 描述 |
| status | ENUM | 状态：pending, in_progress, completed |
| priority | ENUM | 优先级：low, medium, high |
| due_date | DATETIME | 截止日期 |
| assignee | VARCHAR(100) | 负责人 |
| system_source | VARCHAR(100) | 来源系统 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 📊 报告表 (reports)

存储生成的报告数据。

| 字段 | 类型 | 描述 |
|------|------|------|
| id | INT | 主键，自增 |
| user_id | INT | 用户ID，外键关联users表 |
| report_type | ENUM | 报告类型：daily, weekly, monthly, yearly |
| start_date | DATETIME | 开始日期 |
| end_date | DATETIME | 结束日期 |
| data | JSON | 报告数据（JSON格式） |
| created_at | TIMESTAMP | 创建时间 |

### 📝 系统日志表 (system_logs)

记录系统操作日志。

| 字段 | 类型 | 描述 |
|------|------|------|
| id | INT | 主键，自增 |
| user_id | INT | 用户ID，可为空 |
| action | VARCHAR(100) | 操作类型 |
| details | TEXT | 详细信息 |
| created_at | TIMESTAMP | 创建时间 |

## ⚙️ 后端架构

后端采用MVC架构，分为模型层、控制器层和路由层。

### 📊 模型层

模型层负责数据访问和业务逻辑，主要包含以下模型：

#### 👤 User模型 (User.js)

用户模型，负责用户相关的数据操作。

**主要方法**：
- `create(userData)`: 创建新用户
- `findByUsername(username)`: 通过用户名查找用户
- `findById(id)`: 通过ID查找用户
- `findByEmail(email)`: 通过邮箱查找用户
- `validatePassword(password)`: 验证密码
- `generateAuthToken()`: 生成JWT令牌
- `update(updates)`: 更新用户信息
- `delete()`: 删除用户

#### ✅ Todo模型 (Todo.js)

待办事项模型，负责待办事项的数据操作。

**主要方法**：
- `create(todoData)`: 创建待办事项
- `findById(id)`: 通过ID查找待办事项
- `findByUser(userId)`: 查找用户的所有待办事项
- `findBySystemSource(systemSource)`: 查找特定来源系统的待办事项
- `update(updates)`: 更新待办事项
- `delete()`: 删除待办事项

#### 📊 Report模型 (Report.js)

报告模型，负责报告的生成和查询。

**主要方法**：
- `generateReport(userId, reportType, startDate, endDate)`: 生成报告
- `findById(id)`: 通过ID查找报告
- `getUserReports(userId, reportType)`: 获取用户的报告列表
- `generateDailyReport(userId, date)`: 生成日报
- `generateWeeklyReport(userId, startDate)`: 生成周报
- `generateMonthlyReport(userId, month)`: 生成月报
- `generateYearlyReport(userId, year)`: 生成年报

### 🎮 控制器层

控制器层负责处理HTTP请求，调用模型层的方法，并返回响应。

#### 🔐 认证控制器 (authController.js)

处理用户认证相关的请求。

**主要路由**：
- `POST /register`: 用户注册
- `POST /login`: 用户登录
- `GET /me`: 获取当前用户信息
- `PUT /me`: 更新用户信息
- `POST /password-reset-request`: 请求重置密码
- `POST /password-reset`: 重置密码

#### ✅ 待办事项控制器 (todoController.js)

处理待办事项相关的请求。

**主要路由**：
- `POST /`: 创建待办事项
- `GET /`: 获取待办事项列表
- `GET /:id`: 获取单个待办事项
- `PUT /:id`: 更新待办事项
- `DELETE /:id`: 删除待办事项
- `PATCH /:id/status`: 更改待办事项状态

#### 📊 报告控制器 (reportController.js)

处理报告相关的请求。

**主要方法**：
- `generateReport(req, res)`: 生成报告
- `getReports(req, res)`: 获取报告列表
- `getReport(req, res)`: 获取单个报告
- `exportPDFReport(req, res)`: 导出PDF报告
- `exportExcelReport(req, res)`: 导出Excel报告
- `deleteReport(req, res)`: 删除报告
- `getReportStats(req, res)`: 获取报告统计数据

### 🛣️ 路由层

路由层定义API端点，将请求路由到相应的控制器方法。

#### 🔐 认证路由 (authController.js)

```javascript
// 路由定义在控制器文件中
app.use('/api/auth', authRouter);
```

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| GET | /api/auth/me | 获取当前用户信息 |
| PUT | /api/auth/me | 更新用户信息 |
| POST | /api/auth/password-reset-request | 请求重置密码 |
| POST | /api/auth/password-reset | 重置密码 |

#### ✅ 待办事项路由 (todoController.js)

```javascript
// 路由定义在控制器文件中
app.use('/api/todos', todoRouter);
```

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/todos | 获取待办事项列表 |
| POST | /api/todos | 创建待办事项 |
| GET | /api/todos/:id | 获取单个待办事项 |
| PUT | /api/todos/:id | 更新待办事项 |
| DELETE | /api/todos/:id | 删除待办事项 |
| PATCH | /api/todos/:id/status | 更改待办事项状态 |

#### 📊 报告路由 (reportRoutes.js)

```javascript
app.use('/api/reports', reportRouter);
```

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/reports/:report_type | 生成报告 |
| GET | /api/reports/:report_type | 获取报告列表 |
| GET | /api/reports/detail/:id | 获取单个报告 |
| GET | /api/reports/export/pdf/:report_id | 导出PDF报告 |
| GET | /api/reports/export/excel/:report_id | 导出Excel报告 |
| DELETE | /api/reports/:id | 删除报告 |
| GET | /api/reports/stats/:report_type | 获取报告统计数据 |

### 🧰 工具类

工具类提供通用功能，如PDF生成、Excel生成等。

#### 📄 PDF生成器 (pdfGenerator.js)

使用PDFKit库生成PDF报告。

**主要方法**：
- `generatePDFReport(reportData)`: 生成PDF报告

#### 📊 Excel生成器 (excelGenerator.js)

使用ExcelJS库生成Excel报告。

**主要方法**：
- `generateExcelReport(reportData)`: 生成Excel报告

#### 🔑 认证工具 (auth.js)

提供认证相关的工具函数。

**主要方法**：
- `generateToken(payload, expiresIn)`: 生成JWT令牌
- `generateResetToken(userId)`: 生成密码重置令牌
- `verifyResetToken(token)`: 验证密码重置令牌

#### 📧 邮件工具 (email.js)

提供邮件发送功能。

**主要方法**：
- `sendResetPasswordEmail(email, resetToken)`: 发送密码重置邮件

## 🖥️ 前端架构

前端采用Vue 3框架，使用Pinia进行状态管理，Vue Router进行路由管理。

### 🧩 组件结构

前端组件按照功能划分，主要包括：

#### 📋 布局组件

- `App.vue`: 根组件
- `DashboardView.vue`: 仪表盘布局

#### 📄 页面组件

- `LoginView.vue`: 登录页面
- `RegisterView.vue`: 注册页面
- `TodosView.vue`: 待办事项列表页面
- `ReportsView.vue`: 报告页面

#### 🧰 功能组件

- `TodoForm.vue`: 待办事项表单组件

### 📦 状态管理

使用Pinia进行状态管理，主要包括以下Store：

#### 🔐 认证Store (auth.ts)

管理用户认证状态。

**主要状态**：
- `user`: 当前用户信息
- `accessToken`: 访问令牌
- `refreshToken`: 刷新令牌

**主要方法**：
- `login(credentials)`: 用户登录
- `register(userData)`: 用户注册
- `refresh()`: 刷新令牌
- `logout()`: 用户登出

#### ✅ 待办事项Store (todos.ts)

管理待办事项状态。

**主要状态**：
- `todos`: 待办事项列表

**主要方法**：
- `fetchTodos()`: 获取待办事项列表
- `createTodo(todo)`: 创建待办事项
- `updateTodo(todo)`: 更新待办事项
- `deleteTodo(id)`: 删除待办事项

#### 📊 报告Store (reports.ts)

管理报告状态。

**主要状态**：
- `reportData`: 报告数据

**主要方法**：
- `fetchReportData(params)`: 获取报告数据
- `exportReport(params)`: 导出报告

### 🔌 API服务

API服务负责与后端API通信，主要包括：

#### 🔐 认证服务 (api.ts)

```typescript
export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {...},
  async register(userData: RegisterRequest): Promise<AuthResponse> {...},
  async refreshToken(): Promise<AuthResponse> {...}
}
```

#### ✅ 待办事项服务 (api.ts)

```typescript
export const todoService = {
  async getTodos(): Promise<Todo[]> {...},
  async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {...},
  async updateTodo(todo: Todo): Promise<Todo> {...},
  async deleteTodo(id: number): Promise<void> {...},
  async getTodoById(id: number): Promise<Todo> {...},
  async getTodoStatistics(): Promise<{...}> {...}
}
```

#### 📊 报告服务 (api.ts)

```typescript
export const reportService = {
  async generateReport(params: {...}): Promise<any> {...},
  async getReportData(params: {...}): Promise<ReportData> {...},
  async getReportById(reportId: string): Promise<ReportData> {...},
  async exportReport(params: {...}): Promise<Blob> {...}
}
```

### 🧭 路由配置

使用Vue Router进行路由管理，主要路由包括：

```typescript
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
    redirect: '/dashboard/todos',
    children: [
      {
        path: 'todos',
        name: 'todos',
        component: () => import('../views/TodosView.vue')
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('../views/ReportsView.vue')
      }
    ]
  }
]
```

## 🔐 认证与授权

系统使用JWT进行认证，主要流程如下：

1. 用户登录时，后端验证用户名和密码，生成JWT令牌
2. 前端将令牌存储在localStorage中
3. 每次请求时，前端在请求头中添加令牌
4. 后端验证令牌，确认用户身份

### 🔒 认证中间件 (authMiddleware.js)

认证中间件负责验证请求中的JWT令牌，确认用户身份。

```javascript
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '请提供认证令牌' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: '认证失败' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: '请进行认证' });
  }
};
```

## ✅ 待办事项功能

待办事项功能是系统的核心功能，支持待办事项的创建、查询、更新和删除，以及状态管理和任务分配。

### ➕ 待办事项创建

用户可以创建待办事项，指定标题、描述、优先级、截止日期和负责人。

```javascript
// 后端实现
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, due_date, assignee, system_source } = req.body;
    const user_id = req.user.id;

    const todo = await Todo.create({
      title,
      description,
      priority,
      due_date,
      assignee,
      user_id,
      system_source: system_source || '统一待办平台'
    });

    res.status(201).json(todo.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 🔍 待办事项查询

用户可以查询自己创建的或分配给自己的待办事项。

```javascript
// 后端实现
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.findByUser(req.user.id);
    res.json(todos.map(todo => todo.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 📝 待办事项更新

用户可以更新待办事项的标题、描述、优先级、截止日期、负责人和状态。

```javascript
// 后端实现
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: '待办事项未找到' });
    }

    // 检查权限
    if (todo.user_id !== req.user.id) {
      return res.status(403).json({ error: '无权修改此待办事项' });
    }

    const updatedTodo = await todo.update(req.body);
    res.json(updatedTodo.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 🗑️ 待办事项删除

用户可以删除自己创建的待办事项。

```javascript
// 后端实现
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: '待办事项未找到' });
    }

    // 检查权限
    if (todo.user_id !== req.user.id) {
      return res.status(403).json({ error: '无权删除此待办事项' });
    }

    await todo.delete();
    res.json({ message: '待办事项已删除' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 🔄 待办事项状态管理

用户可以更改待办事项的状态（待处理、进行中、已完成）。

```javascript
// 后端实现
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: '待办事项未找到' });
    }

    // 检查权限
    if (
      todo.user_id !== req.user.id &&
      todo.assignee !== req.user.username
    ) {
      return res.status(403).json({ error: '无权更改此待办事项状态' });
    }

    const updatedTodo = await todo.update({ status });
    res.json(updatedTodo.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 📊 报告功能

报告功能支持多维度的统计报表生成和导出，包括日报、周报、月报和年报。

### 📈 报告生成

用户可以生成指定时间范围的报告。

```javascript
// 后端实现
export const generateReport = async (req, res) => {
  try {
    const { report_type } = req.params;
    const { start_date, end_date } = req.body;

    // 验证报告类型
    const validReportTypes = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validReportTypes.includes(report_type)) {
      return res.status(400).json({ message: '无效的报告类型' });
    }

    // 计算时间范围
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // 生成报告
    const report = await Report.generateReport(
      req.user.id,
      report_type,
      startDate,
      endDate
    );

    res.status(201).json({
      id: report.id,
      type: report.type,
      period_start: report.period_start,
      period_end: report.period_end,
      data: report.data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### 🔍 报告查询

用户可以查询自己生成的报告。

```javascript
// 后端实现
export const getReports = async (req, res) => {
  try {
    const { report_type } = req.params;

    // 验证报告类型
    const validReportTypes = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validReportTypes.includes(report_type)) {
      return res.status(400).json({ message: '无效的报告类型' });
    }

    const reports = await Report.getUserReports(req.user.id, report_type);
    res.json(reports.map(report => report.toJSON()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### 📥 报告导出

用户可以将报告导出为PDF或Excel格式。

<details>
<summary>📄 PDF导出实现</summary>

```javascript
// 后端实现 - PDF导出
export const exportPDFReport = async (req, res) => {
  try {
    const { report_id } = req.params;
    
    // 获取报告数据
    const report = await Report.findById(report_id);
    if (!report || report.created_by !== req.user.id) {
      return res.status(404).json({ message: '报告未找到' });
    }

    // 生成PDF
    const pdfBuffer = await generatePDFReport({
      report_type: report.type,
      start_date: report.period_start,
      end_date: report.period_end,
      data: report.data
    });
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report_${report_id}.pdf`);
    
    // 发送PDF文件
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```
</details>

<details>
<summary>📊 Excel导出实现</summary>

```javascript
// 后端实现 - Excel导出
export const exportExcelReport = async (req, res) => {
  try {
    const { report_id } = req.params;
    
    // 获取报告数据
    const report = await Report.findById(report_id);
    if (!report || report.created_by !== req.user.id) {
      return res.status(404).json({ message: '报告未找到' });
    }

    // 生成Excel
    const excelBuffer = await generateExcelReport({
      report_type: report.type,
      start_date: report.period_start,
      end_date: report.period_end,
      data: report.data
    });
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=report_${report_id}.xlsx`);
    
    // 发送Excel文件
    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```
</details>

## 📝 开发指南

### 🛠️ 环境设置

#### 🔙 后端环境设置

1. 安装Node.js和npm
2. 克隆项目仓库
3. 进入backend目录
4. 安装依赖：`npm install`
5. 创建.env文件，配置环境变量（可以复制.env.example并修改）：

```
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todo_platform

# JWT配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# 邮件配置
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
```

6. 初始化数据库：
   - 创建数据库：`CREATE DATABASE todo_platform;`
   - 导入数据库结构：`mysql -u root -p todo_platform < database/init.sql`

7. 启动开发服务器：`npm run dev`

#### 🔜 前端环境设置

1. 进入frontend目录
2. 安装依赖：`npm install`
3. 创建.env文件，配置环境变量（可以复制.env.example并修改）：

```
VITE_API_BASE_URL=http://localhost:3000/api
```

4. 启动开发服务器：`npm run dev`

### 🔄 开发流程

#### 🔙 后端开发流程

1. 在models目录中创建或修改数据模型
2. 在controllers目录中创建或修改控制器
3. 在routes目录中创建或修改路由
4. 在app.js中注册路由
5. 编写测试用例
6. 运行测试并修复问题
7. 提交代码

#### 🔜 前端开发流程

1. 在types目录中定义TypeScript类型
2. 在services目录中创建或修改API服务
3. 在store目录中创建或修改状态管理
4. 在components目录中创建或修改组件
5. 在views目录中创建或修改页面视图
6. 在router目录中注册路由
7. 编写测试用例
8. 运行测试并修复问题
9. 提交代码

### 🧪 测试

#### 🔙 后端测试

后端使用Jest进行单元测试和集成测试。

运行测试：

```bash
cd backend
npm test
```

#### 🔜 前端测试

前端使用Vitest和Vue Test Utils进行单元测试和组件测试。

运行测试：

```bash
cd frontend
npm test
```

### 🚀 部署

#### 🔙 后端部署

1. 构建项目：

```bash
cd backend
npm run build
```

2. 配置生产环境变量：

```
NODE_ENV=production
PORT=3000
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=todo_platform
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

3. 启动服务器：

```bash
npm start
```

#### 🔜 前端部署

1. 构建项目：

```bash
cd frontend
npm run build
```

2. 配置生产环境变量：

```
VITE_API_BASE_URL=https://your-api-domain.com/api
```

3. 部署dist目录到Web服务器

## 🔧 故障排除与常见问题

### 数据库连接问题

**问题**: 无法连接到数据库，出现 "数据库连接失败" 错误。

**解决方案**:
1. 确认MySQL服务已启动
2. 检查.env文件中的数据库配置是否正确
3. 确认数据库用户有足够的权限
4. 检查防火墙设置是否允许数据库连接

### JWT认证问题

**问题**: 认证失败，出现 "请进行认证" 错误。

**解决方案**:
1. 确认前端请求中包含正确的Authorization头
2. 检查JWT_SECRET是否与生成令牌时使用的一致
3. 确认令牌未过期
4. 检查用户ID是否存在于数据库中

### 前端API请求问题

**问题**: 前端无法连接到后端API，出现跨域错误。

**解决方案**:
1. 确认后端CORS配置正确
2. 检查API基础URL是否正确配置
3. 确认后端服务器正在运行
4. 检查网络连接是否正常

### 报告生成问题

**问题**: 生成报告时出现错误。

**解决方案**:
1. 检查报告类型是否有效
2. 确认日期格式正确
3. 检查数据库中是否有足够的数据生成报告
4. 查看服务器日志获取详细错误信息

### 环境变量问题

**问题**: 应用程序无法读取环境变量。

**解决方案**:
1. 确认.env文件存在于正确的目录中
2. 检查环境变量名称是否正确
3. 重启开发服务器以加载新的环境变量
4. 在生产环境中，确认环境变量已正确设置

### 数据库迁移问题

**问题**: 数据库结构更新后，应用程序出现错误。

**解决方案**:
1. 确认已运行最新的数据库迁移脚本
2. 检查数据库表结构是否与模型定义一致
3. 备份数据库，然后重新导入最新的数据库结构
4. 检查应用程序代码是否与新的数据库结构兼容

## 📋 最近更新

### 2025年3月17日

- 修复了数据库连接问题，增强了错误处理能力
- 修复了多个文件中的导入问题
- 创建了缺少的文件（auth.js、email.js）和函数（findByEmail、connectDB）
- 将控制器从类结构改为标准的Express路由模块
- 修复了Todo模型中的findByTeam方法，将其改为findBySystemSource方法
- 添加了环境变量示例文件，方便新开发者快速配置项目
- 添加了.gitignore文件，确保敏感信息和临时文件不会被提交到版本控制系统
- 更新了开发文档，添加了故障排除和最近更新章节

### 2025年2月15日

- 添加了报告导出功能，支持PDF和Excel格式
- 优化了待办事项查询性能
- 添加了系统来源字段，支持多系统待办事项的统一管理
- 改进了前端UI设计，提升用户体验
- 添加了更多的数据可视化图表
- 增强了安全性，添加了密码重置功能

### 2025年1月10日

- 项目初始版本发布
- 实现了基本的用户认证功能
- 实现了待办事项的基本CRUD操作
- 实现了简单的报告生成功能
- 搭建了前端基础框架
