<template>
  <el-dialog
    :title="formTitle"
    :model-value="visible"
    width="600px"
    :before-close="handleClose"
    @update:model-value="(val) => emit('update:visible', val)"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
      class="form-container"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status">
          <el-option label="待处理" value="pending" />
          <el-option label="进行中" value="in_progress" />
          <el-option label="已完成" value="completed" />
        </el-select>
      </el-form-item>

      <el-form-item label="优先级" prop="priority">
        <el-select v-model="form.priority">
          <el-option label="低" value="low" />
          <el-option label="中" value="medium" />
          <el-option label="高" value="high" />
        </el-select>
      </el-form-item>

      <el-form-item label="截止日期" prop="dueDate">
        <el-date-picker
          v-model="form.dueDate"
          type="datetime"
          placeholder="选择日期时间"
        />
      </el-form-item>

      <el-form-item label="分配人" prop="assignee">
        <el-input v-model="form.assignee" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { Todo } from '@/types/todo'

const props = defineProps<{
  visible: boolean
  todo?: Todo
}>()

const emit = defineEmits(['update:visible', 'submit'])

const formRef = ref<FormInstance>()
const form = ref({
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: new Date(),
  assignee: '',
  systemSource: '统一待办平台'
})

// 监听 todo 属性变化，更新表单数据
watch(() => props.todo, (newTodo) => {
  if (newTodo) {
    form.value = { ...newTodo }
    // 确保日期是 Date 对象
    if (typeof form.value.dueDate === 'string') {
      form.value.dueDate = new Date(form.value.dueDate)
    }
  } else {
    // 重置表单
    form.value = {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(),
      assignee: '',
      systemSource: '统一待办平台'
    }
  }
}, { immediate: true })

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }]
}

const formTitle = computed(() => (props.todo ? '编辑待办事项' : '新建待办事项'))

const handleClose = () => {
  emit('update:visible', false)
}

const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 准备提交的数据
        const formData = {
          ...form.value,
          // 确保日期是 ISO 字符串格式
          dueDate: form.value.dueDate instanceof Date 
            ? form.value.dueDate.toISOString() 
            : form.value.dueDate
        }
        
        emit('submit', formData)
        ElMessage.success('保存成功')
        handleClose()
      } catch (error) {
        ElMessage.error('保存失败: ' + (error instanceof Error ? error.message : '未知错误'))
      }
    }
  })
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 20px;
}

.form-container {
  max-width: 100%;
}

/* 响应式调整 */
@media (max-width: 576px) {
  .el-form {
    label-position: top;
    label-width: 100%;
  }
  
  .el-form-item__label {
    text-align: left;
    padding-bottom: 8px;
  }
  
  .el-select,
  .el-date-picker {
    width: 100%;
  }
}

@media (min-width: 577px) {
  .el-select,
  .el-date-picker {
    width: 100%;
    max-width: 300px;
  }
}

/* 美化表单元素 */
.el-input,
.el-select,
.el-date-picker {
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.el-form-item__label {
  font-weight: 500;
  color: var(--text-primary);
}

.el-dialog__header {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.el-dialog__title {
  font-weight: 600;
  color: var(--primary-color);
}

.el-dialog__footer {
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
  margin-top: 15px;
}
</style>
