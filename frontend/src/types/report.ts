export type ReportType = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface ReportData {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  completionRate: number
  averageCompletionTime: number
  tasksByCategory: Array<{
    category: string
    count: number
  }>
  tasksByPriority: Array<{
    priority: string
    count: number
  }>
  tasksByAssignee: Array<{
    assignee: string
    count: number
  }>
  createdAt: string
  updatedAt: string
}
