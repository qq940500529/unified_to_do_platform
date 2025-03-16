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
    return api.post('/auth/login', credentials)
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return api.post('/auth/register', userData)
  },

  async refreshToken(): Promise<AuthResponse> {
    return api.post('/auth/refresh')
  }
}

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    return api.get('/todos')
  },

  async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    return api.post('/todos', todo)
  },

  async updateTodo(todo: Todo): Promise<Todo> {
    return api.put(`/todos/${todo.id}`, todo)
  },

  async deleteTodo(id: number): Promise<void> {
    return api.delete(`/todos/${id}`)
  },

  async getTodoById(id: number): Promise<Todo> {
    return api.get(`/todos/${id}`)
  },

  async getTodoStatistics(): Promise<{
    total: number
    completed: number
    pending: number
  }> {
    return api.get('/todos/statistics')
  }
}

export const reportService = {
  async getReportData(params: {
    startDate: string;
    endDate: string;
    type: ReportType;
  }): Promise<ReportData> {
    return api.get(`/reports/${params.type}`, {
      params: {
        startDate: params.startDate,
        endDate: params.endDate
      }
    })
  },

  async exportReport(params: {
    startDate: string;
    endDate: string;
    type: ReportType;
    format: 'pdf' | 'excel';
  }): Promise<Blob> {
    return api.get(`/reports/${params.type}/export`, {
      params: {
        startDate: params.startDate,
        endDate: params.endDate,
        format: params.format
      },
      responseType: 'blob'
    })
  }
}

export default api
