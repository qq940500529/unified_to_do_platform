# 📋 Unified Todo Platform

> 🌐 Multilingual Support: [English](./README.en.md) | [中文](../zh/README.zh.md)

> 🚀 A modern enterprise-level todo management platform to help teams collaborate efficiently

The Unified Todo Platform is an enterprise-level application designed to centralize and display todo items from various business systems, providing a unified user interface and operation experience.

[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 🛠️ Tech Stack

> 🔧 Main Technology Choices

### 🖥️ Frontend

- 🟢 Vue 3: JavaScript framework
- 🔵 TypeScript: Type-safe JavaScript superset
- 🟣 Pinia: State management library
- 🟠 Element Plus: UI component library
- 📊 ECharts: Data visualization library
- ⚡ Vite: Build tool

### ⚙️ Backend

- 🟩 Node.js/Express: Backend service framework
- 🟦 MySQL: Relational database
- 🔑 JWT: User authentication
- 🔗 RESTful API: Standard API design

## 🤖 Development Approach

> 🧠 Intelligent Development Explanation

- 🤖 **AI Development Plug-in**：CLINE
- 🧠 **Large Model APIs**:
  - 🐙 DeepSeek Chat
  - 🤖 Claude 3.7 Sonnet 20250219
- 🚀 **Development Mode**: Fully automated development with minimal human intervention

## ⚠️ AI Development Risk Statement

> 🚨 Risk Notice for Using AI Development Tools

1. **Code Quality Risks**: AI-generated code may contain potential defects or security vulnerabilities. Rigorous code review and testing are recommended.
2. **Intellectual Property Risks**: AI-generated code may involve copyright issues. Please ensure compliance with relevant laws and regulations.
3. **Technical Debt Risks**: AI-generated code may lack maintainability. Necessary refactoring and documentation are suggested.
4. **Security Vulnerability Risks**: AI-generated code may contain security vulnerabilities. Comprehensive security audits are advised.
5. **Performance Risks**: AI-generated code may have performance bottlenecks. Performance testing and optimization are recommended.

## 📅 Development Plan

> 🗓️ Project Progress Tracking

- 📄 View detailed development progress: [Development Plan](./DEVELOPMENT_PLAN.en.md)
- 🔍 Real-time status updates
- 📊 Visualized development progress

## 🎯 Features

> 💡 Main Feature Overview

- 🔐 **User Authentication**: Supports user registration and login using JWT tokens
- ✅ **Todo Management**:
  - 📥 Centralized display of todos from different business systems
  - 🔍 Filter todos by status, date, etc.
  - ✏️ Create, edit, and delete todos
  - 🔄 Sync completion status back to source systems
- 📊 **Reporting**:
  - 📈 Todo trend charts
  - 🎯 Task status distribution charts
  - 📅 Generate daily, weekly, monthly, and annual reports
  - 📤 Export reports in PDF/Excel formats
- 🤝 **System Integration**: Provides standard API interfaces for integration with other business systems

## 📂 Project Structure

> 🗂️ Project Directory Overview

```
unified-todo-platform/
├── frontend/                # Frontend project
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── assets/          # Asset files
│   │   ├── components/      # Common components
│   │   ├── router/          # Routing configuration
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   ├── types/           # TypeScript type definitions
│   │   ├── views/           # Page components
│   │   ├── App.vue          # Root component
│   │   └── main.ts          # Entry file
│   ├── .env                 # Environment variables
│   ├── package.json         # Dependency configuration
│   └── vite.config.ts       # Vite configuration
├── backend/                 # Backend project
│   ├── src/                 # Source code
│   │   ├── controllers/     # Controllers
│   │   ├── models/          # Data models
│   │   ├── routes/          # Routes
│   │   ├── services/        # Business logic
│   │   └── index.js         # Entry file
│   ├── .env                 # Environment variables
│   └── package.json         # Dependency configuration
├── database/                # Database scripts
├── API.md                   # API documentation
└── README.md                # Project documentation
```

## 🚀 Installation & Running

> ⚙️ Quick Start Guide

### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build production version
npm run build
```

### Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Build production version
npm run build
```

### Database

```bash
# Import database scripts
mysql -u username -p database_name < database/init.sql
```

## ⚙️ Configuration

> 🔧 Environment Variable Configuration

### Frontend Configuration

In `frontend/.env` file:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

### Backend Configuration

In `backend/.env` file:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=todo_platform
JWT_SECRET=your_jwt_secret
```

## 📖 Usage Guide

> 👨‍💻 User Operation Manual

1. Register/Login to the system
2. View and manage todos in the Todo page
3. View data analysis and export reports in the Reports page

## 🤝 System Integration

> 🔗 Integration with Other Systems

Other business systems can push todos to the Unified Todo Platform by calling API interfaces. Refer to [API](./API.en.md) for detailed interface documentation.

## 📜 License

> ⚖️ Open Source License Information

MIT
