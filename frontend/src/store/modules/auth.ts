import { defineStore } from 'pinia'
import { authService } from '@/services/api'
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthResponse['user'] | null,
    accessToken: null as string | null,
    refreshToken: null as string | null,
    loading: false,
    error: null as string | null
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    currentUser: (state) => state.user
  },
  actions: {
    async login(credentials: LoginRequest) {
      this.loading = true
      try {
        const response = await authService.login(credentials)
        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken
        this.user = response.user
        localStorage.setItem('token', response.accessToken)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
        throw error
      } finally {
        this.loading = false
      }
    },
    async register(userData: RegisterRequest) {
      this.loading = true
      try {
        const response = await authService.register(userData)
        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken
        this.user = response.user
        localStorage.setItem('token', response.accessToken)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
        throw error
      } finally {
        this.loading = false
      }
    },
    async refresh() {
      if (!this.refreshToken) return
      try {
        const response = await authService.refreshToken()
        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken
        localStorage.setItem('token', response.accessToken)
      } catch (error) {
        this.logout()
        throw error
      }
    },
    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})
