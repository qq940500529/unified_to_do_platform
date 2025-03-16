import { defineStore } from 'pinia'
import { todoService } from '@/services/api'
import type { Todo, TodoFilter } from '@/types/todo'

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: [] as Todo[],
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchTodos(params?: TodoFilter) {
      this.loading = true
      try {
        this.todos = await todoService.getTodos()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
      } finally {
        this.loading = false
      }
    },
    async createTodo(todo: Omit<Todo, 'id'>) {
      this.loading = true
      try {
        const newTodo = await todoService.createTodo(todo)
        this.todos.unshift(newTodo)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
      } finally {
        this.loading = false
      }
    },
    async updateTodo(todo: Todo) {
      this.loading = true
      try {
        const updatedTodo = await todoService.updateTodo(todo)
        const index = this.todos.findIndex(t => t.id === updatedTodo.id)
        if (index !== -1) {
          this.todos.splice(index, 1, updatedTodo)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
      } finally {
        this.loading = false
      }
    },
    async deleteTodo(id: number) {
      this.loading = true
      try {
        await todoService.deleteTodo(id)
        this.todos = this.todos.filter(t => t.id !== id)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
      } finally {
        this.loading = false
      }
    }
  },
  getters: {
    pendingTodos: (state) => state.todos.filter(t => t.status === 'pending'),
    inProgressTodos: (state) => state.todos.filter(t => t.status === 'in_progress'),
    completedTodos: (state) => state.todos.filter(t => t.status === 'completed')
  }
})
