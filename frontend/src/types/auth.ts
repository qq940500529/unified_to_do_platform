export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    username: string
    email: string
    role: string
  }
}

export interface User {
  id: number
  username: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}
