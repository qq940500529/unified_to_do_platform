export interface Todo {
  id: number
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
  assignee?: string
  systemSource?: string // 来源系统
  systemId?: string // 来源系统ID
}

export interface TodoFilter {
  status?: string
  priority?: string
  startDate?: string
  endDate?: string
  assignee?: string
  systemSource?: string
}
