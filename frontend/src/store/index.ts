import { createPinia } from 'pinia'
import { useAuthStore } from './modules/auth'
import { useTodosStore } from './modules/todos'
import { useReportsStore } from './modules/reports'

const pinia = createPinia()

export const useStore = () => ({
  auth: useAuthStore(),
  todos: useTodosStore(),
  reports: useReportsStore()
})

export default pinia
