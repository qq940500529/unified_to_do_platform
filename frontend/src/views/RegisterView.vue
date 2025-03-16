<template>
  <div class="register-container bg-light d-flex justify-content-center align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card shadow-lg rounded-lg border-0 slide-in-up">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="font-weight-bold text-primary">用户注册</h2>
                <p class="text-muted">创建您的统一待办平台账号</p>
              </div>
              
              <el-form
                :model="registerForm"
                :rules="rules"
                ref="registerFormRef"
                @submit.prevent="handleRegister"
                class="mt-4"
              >
                <el-form-item prop="username" class="mb-3">
                  <el-input
                    v-model="registerForm.username"
                    placeholder="请输入用户名"
                    prefix-icon="User"
                    class="rounded-md"
                    size="large"
                  />
                </el-form-item>

                <el-form-item prop="email" class="mb-3">
                  <el-input
                    v-model="registerForm.email"
                    placeholder="请输入邮箱"
                    prefix-icon="Message"
                    class="rounded-md"
                    size="large"
                  />
                </el-form-item>

                <el-form-item prop="password" class="mb-3">
                  <el-input
                    v-model="registerForm.password"
                    type="password"
                    placeholder="请输入密码"
                    prefix-icon="Lock"
                    show-password
                    class="rounded-md"
                    size="large"
                  />
                </el-form-item>

                <el-form-item prop="confirmPassword" class="mb-4">
                  <el-input
                    v-model="registerForm.confirmPassword"
                    type="password"
                    placeholder="请确认密码"
                    prefix-icon="Lock"
                    show-password
                    class="rounded-md"
                    size="large"
                  />
                </el-form-item>

                <el-button
                  type="primary"
                  native-type="submit"
                  :loading="loading"
                  class="w-100 rounded-md"
                  size="large"
                >
                  注册
                </el-button>
                
                <div class="text-center mt-4">
                  <span class="text-muted">已有账号？</span>
                  <el-link type="primary" @click="router.push({ name: 'login' })" class="ml-2">
                    立即登录
                  </el-link>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@/store/modules/auth'

interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const authStore = useAuthStore()
const registerFormRef = ref<FormInstance>()
const loading = ref(false)
const router = useRouter()

const registerForm = ref<RegisterForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validatePassword = (rule: any, value: string, callback: any) => {
  if (value !== registerForm.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = ref<FormRules<RegisterForm>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ]
})

const handleRegister = () => {
  registerFormRef.value?.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟注册成功
        // 在实际环境中，这里会调用 API 进行注册
        // await authStore.register({
        //   username: registerForm.value.username,
        //   email: registerForm.value.email,
        //   password: registerForm.value.password
        // })
        
        setTimeout(() => {
          ElMessage.success('注册成功')
          router.push({ name: 'login' })
        }, 1000)
      } catch (error) {
        ElMessage.error(error instanceof Error ? error.message : '注册失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
}

.register-card {
  width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #303133;
  font-weight: 500;
}

.register-btn {
  width: 100%;
}

.login-link {
  text-align: center;
  margin-top: 10px;
}

.login-link span {
  margin-right: 5px;
}
</style>
