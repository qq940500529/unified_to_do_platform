<template>
  <div class="todos-view fade-in">
    <div class="page-header mb-4">
      <h2 class="text-primary font-weight-bold mb-2">待办事项</h2>
      <p class="text-muted">管理和跟踪您的所有任务</p>
    </div>
    
    <div class="filters bg-light p-3 rounded-md shadow-sm mb-4">
      <div class="filter-container">
        <div class="filter-item">
          <el-select 
            v-model="filter.status" 
            placeholder="选择状态" 
            clearable
            class="filter-select"
          >
            <el-option label="待处理" value="pending" />
            <el-option label="进行中" value="in_progress" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </div>
        
        <div class="filter-item date-range-filter">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="date-picker"
          />
        </div>
        
        <div class="filter-item action-filter">
          <el-button 
            type="primary" 
            @click="createTodo"
            class="create-btn"
            :icon="Plus"
          >
            新建待办
          </el-button>
        </div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="responsive-table-container">
        <el-table 
          :data="filteredTodos" 
          v-loading="loading"
          class="w-100 border-0"
          :header-cell-class-name="'bg-light'"
          :row-class-name="getRowClass"
        >
          <el-table-column prop="title" label="标题" min-width="180">
            <template #default="{ row }">
              <div class="d-flex align-items-center">
                <el-icon :class="getPriorityIconClass(row.priority)" class="mr-2">
                  <component :is="getPriorityIcon(row.priority)" />
                </el-icon>
                <div>
                  <div class="font-weight-bold">{{ row.title }}</div>
                  <div class="text-muted font-size-sm">{{ row.description }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="statusTagType(row.status)"
                effect="light"
                class="rounded-full px-2"
                size="small"
              >
                {{ statusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="priority" label="优先级" width="100" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="priorityTagType(row.priority)"
                effect="light"
                class="rounded-full px-2"
                size="small"
              >
                {{ priorityText(row.priority) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="dueDate" label="截止日期" width="150">
            <template #default="{ row }">
              <div :class="getDueDateClass(row.dueDate)">
                {{ formatDate(row.dueDate) }}
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="assignee" label="负责人" width="120">
            <template #default="{ row }">
              <div class="d-flex align-items-center">
                <el-avatar :size="24" class="mr-2">{{ row.assignee.charAt(0) }}</el-avatar>
                <span>{{ row.assignee }}</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="systemSource" label="来源系统" width="120">
            <template #default="{ row }">
              <el-tag 
                type="info" 
                effect="plain"
                class="rounded-md"
                size="small"
              >
                {{ row.systemSource }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <div class="d-flex justify-content-center">
                <el-button 
                  type="primary" 
                  @click="editTodo(row)" 
                  text
                  :icon="Edit"
                  class="mr-2"
                />
                <el-button 
                  type="danger" 
                  @click="deleteTodo(row.id)" 
                  text
                  :icon="Delete"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <div v-if="filteredTodos.length === 0" class="empty-state p-5 text-center">
        <el-empty description="暂无待办事项" />
      </div>
    </div>

    <TodoForm
      v-model:visible="showForm"
      :todo="currentTodo"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTodosStore } from '@/store/modules/todos'
import { ElMessageBox } from 'element-plus'
import TodoForm from '@/components/TodoForm.vue'
import type { Todo } from '@/types/todo'
import { Plus, Edit, Delete, Warning, Star, InfoFilled } from '@element-plus/icons-vue'
import { format, isAfter, isBefore, addDays } from 'date-fns'

const todosStore = useTodosStore()
const loading = ref(false)
const filter = ref({
  status: '',
  startDate: null as Date | null,
  endDate: null as Date | null
})
const dateRange = ref<[Date | null, Date | null]>([null, null])

// 监听日期范围变化
watch(dateRange, (newVal) => {
  if (newVal && newVal.length === 2) {
    filter.value.startDate = newVal[0]
    filter.value.endDate = newVal[1]
  } else {
    filter.value.startDate = null
    filter.value.endDate = null
  }
})
const showForm = ref(false)
const currentTodo = ref<Todo | null>(null)

const statusTagType = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'in_progress':
      return 'primary'
    case 'completed':
      return 'success'
    default:
      return 'info'
  }
}

const statusText = (status: string) => {
  switch (status) {
    case 'pending':
      return '待处理'
    case 'in_progress':
      return '进行中'
    case 'completed':
      return '已完成'
    default:
      return '未知'
  }
}

const priorityTagType = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'danger'
    case 'medium':
      return 'warning'
    case 'low':
      return 'success'
    default:
      return 'info'
  }
}

const priorityText = (priority: string) => {
  switch (priority) {
    case 'high':
      return '高'
    case 'medium':
      return '中'
    case 'low':
      return '低'
    default:
      return '未知'
  }
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'high':
      return Star
    case 'medium':
      return InfoFilled
    case 'low':
      return InfoFilled
    default:
      return InfoFilled
  }
}

const getPriorityIconClass = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-danger'
    case 'medium':
      return 'text-warning'
    case 'low':
      return 'text-success'
    default:
      return 'text-info'
  }
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return format(date, 'yyyy-MM-dd')
  } catch (e) {
    return dateString
  }
}

const getDueDateClass = (dateString: string) => {
  try {
    const dueDate = new Date(dateString)
    const today = new Date()
    const tomorrow = addDays(today, 1)
    
    if (isBefore(dueDate, today)) {
      return 'text-danger font-weight-bold'
    } else if (isBefore(dueDate, tomorrow)) {
      return 'text-warning font-weight-bold'
    } else {
      return 'text-muted'
    }
  } catch (e) {
    return ''
  }
}

const getRowClass = ({ row }: { row: Todo }) => {
  if (row.status === 'completed') {
    return 'completed-row'
  }
  return ''
}

const filteredTodos = computed(() => {
  return todosStore.todos.filter(todo => {
    // 状态过滤
    const matchesStatus = filter.value.status ? todo.status === filter.value.status : true
    
    // 日期过滤
    let matchesDate = true
    if (filter.value.startDate && filter.value.endDate) {
      const dueDate = new Date(todo.dueDate)
      const startDate = new Date(filter.value.startDate)
      const endDate = new Date(filter.value.endDate)
      
      // 设置时间为一天的结束，以便包含结束日期当天
      endDate.setHours(23, 59, 59, 999)
      
      matchesDate = dueDate >= startDate && dueDate <= endDate
    }
    
    return matchesStatus && matchesDate
  })
})

const createTodo = () => {
  currentTodo.value = null
  showForm.value = true
}

const editTodo = (todo: Todo) => {
  currentTodo.value = todo
  showForm.value = true
}

const handleFormSubmit = async (formData: any) => {
  try {
    loading.value = true
    if (currentTodo.value) {
      await todosStore.updateTodo({ ...currentTodo.value, ...formData })
    } else {
      await todosStore.createTodo(formData)
    }
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    loading.value = false
  }
}

const deleteTodo = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定删除该待办事项吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    await todosStore.deleteTodo(id)
  } catch (error) {
    console.error('删除失败:', error)
  } finally {
    loading.value = false
  }
}

// 初始化加载数据
// 在实际环境中，这里会调用 API 获取数据
// todosStore.fetchTodos()

// 模拟待办事项数据
todosStore.$patch({
  todos: [
    {
      id: 1,
      title: '完成项目需求分析',
      description: '分析客户需求，整理功能列表',
      status: 'completed',
      priority: 'high',
      dueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      assignee: '张三',
      systemSource: 'OA系统'
    },
    {
      id: 2,
      title: '设计数据库结构',
      description: '设计数据库表结构和关系',
      status: 'completed',
      priority: 'high',
      dueDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      assignee: '李四',
      systemSource: '项目管理系统'
    },
    {
      id: 3,
      title: '前端页面开发',
      description: '开发用户界面和交互功能',
      status: 'in_progress',
      priority: 'medium',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      assignee: '王五',
      systemSource: '项目管理系统'
    },
    {
      id: 4,
      title: '后端接口开发',
      description: '开发API接口和业务逻辑',
      status: 'in_progress',
      priority: 'medium',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
      assignee: '赵六',
      systemSource: '项目管理系统'
    },
    {
      id: 5,
      title: '单元测试',
      description: '编写单元测试用例',
      status: 'pending',
      priority: 'low',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
      assignee: '张三',
      systemSource: '测试系统'
    },
    {
      id: 6,
      title: '集成测试',
      description: '进行系统集成测试',
      status: 'pending',
      priority: 'low',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      assignee: '李四',
      systemSource: '测试系统'
    },
    {
      id: 7,
      title: '部署上线',
      description: '将系统部署到生产环境',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
      assignee: '王五',
      systemSource: '运维系统'
    }
  ]
})
</script>

<style scoped>
.todos-view {
  padding: 0;
}

.filters {
  margin-bottom: 20px;
}

.responsive-table-container {
  width: 100%;
  overflow-x: auto;
}

.completed-row {
  background-color: rgba(var(--el-color-success-rgb), 0.1);
}

.completed-row td {
  text-decoration: line-through;
  color: var(--text-secondary);
}

/* 筛选区域样式 */
.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 200px;
}

.date-range-filter {
  flex: 2;
  min-width: 300px;
}

.action-filter {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  min-width: 120px;
}

.filter-label {
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.filter-select,
.date-picker {
  width: 100%;
}

.create-btn {
  width: 100%;
  border-radius: var(--border-radius-md);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .filter-item,
  .date-range-filter,
  .action-filter {
    width: 100%;
    min-width: 100%;
  }
  
  .el-table {
    font-size: var(--font-size-sm);
  }
  
  .el-button {
    padding: 8px 15px;
  }
}

@media (max-width: 576px) {
  .el-table-column--fixed-right {
    position: static !important;
  }
}
</style>
