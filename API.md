# 统一待办平台 API 文档

本文档详细说明了统一待办平台提供的 API 接口，供其他业务系统集成使用。

## 基本信息

- **基础 URL**: `http://[服务器地址]/api`
- **认证方式**: JWT Token
- **数据格式**: JSON
- **请求方法**: GET, POST, PUT, DELETE

## 认证

所有 API 请求（除了登录和注册）都需要在 HTTP 头部包含有效的 JWT 令牌：

```
Authorization: Bearer [token]
```

### 获取令牌

```
POST /auth/login
```

**请求参数**:

```json
{
  "username": "string",
  "password": "string"
}
```

**响应**:

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "number",
    "username": "string",
    "name": "string",
    "email": "string"
  }
}
```

### 刷新令牌

```
POST /auth/refresh
```

**请求头**:

```
Authorization: Bearer [refreshToken]
```

**响应**:

```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

## 待办事项 API

### 获取待办事项列表

```
GET /todos
```

**查询参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| status | string | 否 | 状态筛选 (pending, in_progress, completed) |
| startDate | string | 否 | 开始日期 (ISO 格式) |
| endDate | string | 否 | 结束日期 (ISO 格式) |
| systemSource | string | 否 | 来源系统 |

**响应**:

```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "status": "string",
    "priority": "string",
    "dueDate": "string",
    "assignee": "string",
    "systemSource": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### 获取单个待办事项

```
GET /todos/:id
```

**响应**:

```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "dueDate": "string",
  "assignee": "string",
  "systemSource": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### 创建待办事项

```
POST /todos
```

**请求参数**:

```json
{
  "title": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "dueDate": "string",
  "assignee": "string",
  "systemSource": "string"
}
```

**响应**:

```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "dueDate": "string",
  "assignee": "string",
  "systemSource": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### 更新待办事项

```
PUT /todos/:id
```

**请求参数**:

```json
{
  "title": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "dueDate": "string",
  "assignee": "string"
}
```

**响应**:

```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "dueDate": "string",
  "assignee": "string",
  "systemSource": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### 删除待办事项

```
DELETE /todos/:id
```

**响应**:

```json
{
  "success": true,
  "message": "待办事项已删除"
}
```

### 批量创建待办事项

```
POST /todos/batch
```

**请求参数**:

```json
{
  "todos": [
    {
      "title": "string",
      "description": "string",
      "status": "string",
      "priority": "string",
      "dueDate": "string",
      "assignee": "string",
      "systemSource": "string"
    }
  ]
}
```

**响应**:

```json
{
  "success": true,
  "count": "number",
  "todos": [
    {
      "id": "number",
      "title": "string"
    }
  ]
}
```

### 获取待办事项统计

```
GET /todos/statistics
```

**查询参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| startDate | string | 否 | 开始日期 (ISO 格式) |
| endDate | string | 否 | 结束日期 (ISO 格式) |
| systemSource | string | 否 | 来源系统 |

**响应**:

```json
{
  "total": "number",
  "completed": "number",
  "pending": "number",
  "inProgress": "number"
}
```

## 报表 API

### 获取报表数据

```
GET /reports/:type
```

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| type | string | 报表类型 (daily, weekly, monthly, yearly) |

**查询参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| startDate | string | 是 | 开始日期 (ISO 格式) |
| endDate | string | 是 | 结束日期 (ISO 格式) |

**响应**:

```json
{
  "tasksByCategory": [
    {
      "category": "string",
      "count": "number"
    }
  ],
  "tasksByPriority": [
    {
      "priority": "string",
      "count": "number"
    }
  ],
  "tasksByStatus": [
    {
      "status": "string",
      "count": "number"
    }
  ],
  "totalTasks": "number",
  "completedTasks": "number",
  "pendingTasks": "number",
  "inProgressTasks": "number"
}
```

### 导出报表

```
GET /reports/:type/export
```

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| type | string | 报表类型 (daily, weekly, monthly, yearly) |

**查询参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| startDate | string | 是 | 开始日期 (ISO 格式) |
| endDate | string | 是 | 结束日期 (ISO 格式) |
| format | string | 是 | 导出格式 (pdf, excel) |

**响应**:

返回二进制文件流，Content-Type 根据请求的格式而定：
- PDF: `application/pdf`
- Excel: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

## 用户 API

### 获取当前用户信息

```
GET /users/me
```

**响应**:

```json
{
  "id": "number",
  "username": "string",
  "name": "string",
  "email": "string",
  "avatar": "string",
  "role": "string"
}
```

### 更新用户信息

```
PUT /users/me
```

**请求参数**:

```json
{
  "name": "string",
  "email": "string",
  "avatar": "string"
}
```

**响应**:

```json
{
  "id": "number",
  "username": "string",
  "name": "string",
  "email": "string",
  "avatar": "string",
  "role": "string"
}
```

## 系统集成

### 系统注册

其他业务系统需要先在统一待办平台注册，获取系统标识和访问密钥。

```
POST /systems/register
```

**请求参数**:

```json
{
  "name": "string",
  "description": "string",
  "callbackUrl": "string"
}
```

**响应**:

```json
{
  "id": "number",
  "name": "string",
  "systemKey": "string",
  "systemSecret": "string",
  "callbackUrl": "string"
}
```

### 系统认证

业务系统使用系统标识和访问密钥获取 API 访问令牌：

```
POST /systems/auth
```

**请求参数**:

```json
{
  "systemKey": "string",
  "systemSecret": "string"
}
```

**响应**:

```json
{
  "accessToken": "string",
  "expiresIn": "number"
}
```

## 错误处理

所有 API 在发生错误时会返回适当的 HTTP 状态码和错误信息：

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

常见错误码：

| 状态码 | 描述 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权或令牌无效 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 数据模型

### 待办事项 (Todo)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | number | 唯一标识符 |
| title | string | 标题 |
| description | string | 描述 |
| status | string | 状态 (pending, in_progress, completed) |
| priority | string | 优先级 (high, medium, low) |
| dueDate | string | 截止日期 (ISO 格式) |
| assignee | string | 负责人 |
| systemSource | string | 来源系统 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

### 用户 (User)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | number | 唯一标识符 |
| username | string | 用户名 |
| name | string | 姓名 |
| email | string | 邮箱 |
| avatar | string | 头像 URL |
| role | string | 角色 |

### 系统 (System)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | number | 唯一标识符 |
| name | string | 系统名称 |
| description | string | 系统描述 |
| systemKey | string | 系统标识 |
| systemSecret | string | 访问密钥 |
| callbackUrl | string | 回调 URL |
