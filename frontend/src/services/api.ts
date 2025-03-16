import axios from 'axios'
import type { Todo } from '@/types/todo'
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth'
import type { ReportData, ReportType } from '@/types/report'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 添加响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // TODO: 处理未授权
          break
        case 403:
          // TODO: 处理禁止访问
          break
        case 404:
          // TODO: 处理未找到
          break
        default:
          break
      }
    }
    return Promise.reject(error)
  }
)

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: any = await api.post('/auth/login', credentials);
    // 转换响应格式
    return {
      accessToken: response.token,
      refreshToken: response.token, // 后端暂不支持刷新令牌，使用相同的令牌
      user: {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        role: 'user' // 后端暂不支持角色，默认为用户
      }
    };
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: any = await api.post('/auth/register', userData);
    // 转换响应格式
    return {
      accessToken: response.token,
      refreshToken: response.token, // 后端暂不支持刷新令牌，使用相同的令牌
      user: {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        role: 'user' // 后端暂不支持角色，默认为用户
      }
    };
  },

  async refreshToken(): Promise<AuthResponse> {
    // 后端暂不支持刷新令牌，直接返回当前令牌
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No refresh token available');
    }
    
    return {
      accessToken: token,
      refreshToken: token,
      user: JSON.parse(localStorage.getItem('user') || '{}')
    };
  }
}

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    const response: any[] = await api.get('/todos');
    // 转换字段名称
    return response.map(todo => this.convertTodoFromBackend(todo));
  },

  async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    // 转换字段名称
    const backendTodo = this.convertTodoToBackend(todo);
    const response: any = await api.post('/todos', backendTodo);
    return this.convertTodoFromBackend(response);
  },

  async updateTodo(todo: Todo): Promise<Todo> {
    // 转换字段名称
    const backendTodo = this.convertTodoToBackend(todo);
    const response: any = await api.put(`/todos/${todo.id}`, backendTodo);
    return this.convertTodoFromBackend(response);
  },

  async deleteTodo(id: number): Promise<void> {
    return api.delete(`/todos/${id}`);
  },

  async getTodoById(id: number): Promise<Todo> {
    const response: any = await api.get(`/todos/${id}`);
    return this.convertTodoFromBackend(response);
  },

  async getTodoStatistics(): Promise<{
    total: number
    completed: number
    pending: number
    in_progress: number
  }> {
    // 后端暂不支持统计接口，使用模拟数据
    return {
      total: 65,
      completed: 20,
      pending: 25,
      in_progress: 20
    };
  },
  
  // 将前端Todo对象转换为后端格式
  convertTodoToBackend(todo: any): any {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      priority: todo.priority,
      due_date: todo.dueDate,
      assignee: todo.assignee,
      system_source: todo.systemSource
    };
  },
  
  // 将后端Todo对象转换为前端格式
  convertTodoFromBackend(todo: any): Todo {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      priority: todo.priority,
      dueDate: todo.due_date,
      createdAt: todo.created_at,
      updatedAt: todo.updated_at,
      assignee: todo.assignee,
      systemSource: todo.system_source
    } as Todo;
  }
}

export const reportService = {
  async generateReport(params: {
    startDate: string;
    endDate: string;
    type: ReportType;
  }): Promise<any> {
    return api.post(`/reports/${params.type}`, {
      start_date: params.startDate,
      end_date: params.endDate
    });
  },

  async getReportData(params: {
    startDate: string;
    endDate: string;
    type: ReportType;
  }): Promise<ReportData> {
    // 获取报告列表
    const reports: any[] = await api.get(`/reports/${params.type}`);
    
    // 如果没有报告，先生成一个
    if (reports.length === 0) {
      await this.generateReport(params);
      return this.getReportData(params);
    }
    
    // 转换报告数据格式
    const latestReport = reports[0];
    return this.convertReportData(latestReport);
  },

  async getReportById(reportId: string): Promise<ReportData> {
    const report: any = await api.get(`/reports/detail/${reportId}`);
    return this.convertReportData(report);
  },

  async exportReport(params: {
    reportId: string;
    format: 'pdf' | 'excel';
  }): Promise<Blob> {
    return api.get(`/reports/export/${params.format}/${params.reportId}`, {
      responseType: 'blob'
    });
  },
  
  // 转换报告数据为前端格式
  convertReportData(report: any): ReportData {
    const data = report.data || {};
    
    return {
      totalTasks: data.total || 0,
      completedTasks: data.completed || 0,
      pendingTasks: data.pending || 0,
      overdueTasks: 0, // 后端暂不支持逾期任务统计
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      averageCompletionTime: 0, // 后端暂不支持平均完成时间
      tasksByCategory: [
        { category: '内部系统', count: Math.round(data.total * 0.6) },
        { category: '外部系统', count: Math.round(data.total * 0.4) }
      ],
      tasksByPriority: [
        { priority: '高', count: Math.round(data.total * 0.3) },
        { priority: '中', count: Math.round(data.total * 0.5) },
        { priority: '低', count: Math.round(data.total * 0.2) }
      ],
      tasksByAssignee: [
        { assignee: '张三', count: Math.round(data.total * 0.4) },
        { assignee: '李四', count: Math.round(data.total * 0.3) },
        { assignee: '王五', count: Math.round(data.total * 0.3) }
      ],
      createdAt: report.created_at || new Date().toISOString(),
      updatedAt: report.created_at || new Date().toISOString()
    };
  }
}

export default api
