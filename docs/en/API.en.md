# 📄 Unified Todo Platform API Documentation

[![API Status](https://img.shields.io/badge/API-Stable-brightgreen)](https://example.com)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)](https://example.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> 🔗 Unified Todo Platform API documentation for business system integration

This document provides detailed information about the API interfaces provided by the Unified Todo Platform for integration with other business systems.

## ℹ️ Basic Information

> 📌 Overview of API basic information

- 🌐 **Base URL**: `http://[server address]/api`
- 🔐 **Authentication**: JWT Token
- 📦 **Data Format**: JSON
- 📤 **Request Methods**: GET, POST, PUT, DELETE

## 🔐 Authentication

> 🔑 User authentication related interfaces

All API requests (except login and registration) require a valid JWT token in the HTTP header:

```
Authorization: Bearer [token]
```

### 🎫 Get Token

```
POST /auth/login
```

**Request Parameters**:

```json
{
  "username": "string",
  "password": "string"
}
```

**Response**:

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

### 🔄 Refresh Token

```
POST /auth/refresh
```

**Request Header**:

```
Authorization: Bearer [refreshToken]
```

**Response**:

```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

## ✅ Todo API

> 📋 Todo management related interfaces

### 📜 Get Todo List

```
GET /todos
```

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | Status filter (pending, in_progress, completed) |
| startDate | string | No | Start date (ISO format) |
| endDate | string | No | End date (ISO format) |
| systemSource | string | No | Source system |

**Response**:

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

### 🔍 Get Single Todo

```
GET /todos/:id
```

**Response**:

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

### ➕ Create Todo

```
POST /todos
```

**Request Parameters**:

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

**Response**:

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

### ✏️ Update Todo

```
PUT /todos/:id
```

**Request Parameters**:

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

**Response**:

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

### 🗑️ Delete Todo

```
DELETE /todos/:id
```

**Response**:

```json
{
  "success": true,
  "message": "Todo has been deleted"
}
```

### 📦 Batch Create Todos

```
POST /todos/batch
```

**Request Parameters**:

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

**Response**:

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

### 📊 Get Todo Statistics

```
GET /todos/statistics
```

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | string | No | Start date (ISO format) |
| endDate | string | No | End date (ISO format) |
| systemSource | string | No | Source system |

**Response**:

```json
{
  "total": "number",
  "completed": "number",
  "pending": "number",
  "inProgress": "number"
}
```

## 📈 Report API

> 📊 Data statistics and report related interfaces

### 📄 Get Report Data

```
GET /reports/:type
```

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Report type (daily, weekly, monthly, yearly) |

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | string | Yes | Start date (ISO format) |
| endDate | string | Yes | End date (ISO format) |

**Response**:

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

### 📤 Export Report

```
GET /reports/:type/export
```

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Report type (daily, weekly, monthly, yearly) |

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | string | Yes | Start date (ISO format) |
| endDate | string | Yes | End date (ISO format) |
| format | string | Yes | Export format (pdf, excel) |

**Response**:

Returns a binary file stream, Content-Type depends on the requested format:
- PDF: `application/pdf`
- Excel: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

## 👤 User API

> 👨‍💻 User information management related interfaces

### 👤 Get Current User Information

```
GET /users/me
```

**Response**:

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

### ✏️ Update User Information

```
PUT /users/me
```

**Request Parameters**:

```json
{
  "name": "string",
  "email": "string",
  "avatar": "string"
}
```

**Response**:

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

## 🤝 System Integration

> 🔗 System integration related interfaces

### 📝 System Registration

Other business systems need to register on the Unified Todo Platform to obtain system identification and access keys.

```
POST /systems/register
```

**Request Parameters**:

```json
{
  "name": "string",
  "description": "string",
  "callbackUrl": "string"
}
```

**Response**:

```json
{
  "id": "number",
  "name": "string",
  "systemKey": "string",
  "systemSecret": "string",
  "callbackUrl": "string"
}
```

### 🔑 System Authentication

Business systems use system identification and access keys to obtain API access tokens:

```
POST /systems/auth
```

**Request Parameters**:

```json
{
  "systemKey": "string",
  "systemSecret": "string"
}
```

**Response**:

```json
{
  "accessToken": "string",
  "expiresIn": "number"
}
```

## ❌ Error Handling

> ⚠️ API error response description

All APIs return appropriate HTTP status codes and error messages when an error occurs:

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

Common error codes:

| Status Code | Description |
|-------------|-------------|
| 400 | Bad request parameters |
| 401 | Unauthorized or invalid token |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 500 | Internal server error |

## 📊 Data Models

> 🗂️ Main data structure description

### ✅ Todo

| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique identifier |
| title | string | Title |
| description | string | Description |
| status | string | Status (pending, in_progress, completed) |
| priority | string | Priority (high, medium, low) |
| dueDate | string | Due date (ISO format) |
| assignee | string | Assignee |
| systemSource | string | Source system |
| createdAt | string | Creation time |
| updatedAt | string | Update time |

### 👤 User

| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique identifier |
| username | string | Username |
| name | string | Name |
| email | string | Email |
| avatar | string | Avatar URL |
| role | string | Role |

### 🤖 System

| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique identifier |
| name | string | System name |
| description | string | System description |
| systemKey | string | System identification |
| systemSecret | string | Access key |
| callbackUrl | string | Callback URL |
