<template>
  <div class="login-container bg-light d-flex justify-content-center align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card shadow-lg rounded-lg border-0 slide-in-up">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="font-weight-bold text-primary">用户登录</h2>
                <p class="text-muted">欢迎使用统一待办平台</p>
              </div>
              
              <el-form
                :model="loginForm"
                :rules="rules"
                ref="loginFormRef"
                @submit.prevent="handleLogin"
                class="mt-4"
              >
                <el-form-item prop="username" class="mb-4">
                  <el-input
                    v-model="loginForm.username"
                    placeholder="请输入用户名"
                    prefix-icon="User"
                    class="rounded-md"
                    size="large"
                  />
                </el-form-item>

                <el-form-item prop="password" class="mb-4">
                  <el-input
                    v-model="loginForm.password"
                    type="password"
                    placeholder="请输入密码"
                    prefix-icon="Lock"
                    show-password
                    class="rounded-md"
                    size="large"
                  />
                </el-form-item>

                <div class="d-flex justify-content-between align-items-center mb-4">
                  <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
                  <el-link type="primary" class="font-size-sm">忘记密码？</el-link>
                </div>

                <el-button
                  type="primary"
                  native-type="submit"
                  :loading="loading"
                  class="w-100 rounded-md"
                  size="large"
                >
                  登录
                </el-button>
                
                <div class="text-center mt-4">
                  <span class="text-muted">没有账号？</span>
                  <el-link type="primary" @click="router.push({ name: 'register' })" class="ml-2">
                    立即注册
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
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@/store/modules/auth'
import type { LoginRequest } from '@/types/auth'

interface LoginForm {
  username: string
  password: string
  rememberMe: boolean
}

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loginForm = ref<LoginForm>({
  username: '',
  password: '',
  rememberMe: false
})

const rules = ref<FormRules<LoginForm>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟登录成功
        // 在实际环境中，这里会调用 API 进行身份验证
        // const loginData: LoginRequest = {
        //   username: loginForm.value.username,
        //   password: loginForm.value.password
        // }
        // await authStore.login(loginData)
        
        // 模拟设置用户信息
        authStore.$patch({
          user: {
            id: 1,
            username: loginForm.value.username,
            name: '管理员',
            email: 'admin@example.com',
            avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
          },
          accessToken: 'mock-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now()
        })
        
        // 保存 token 到本地存储
        localStorage.setItem('token', 'mock-token-' + Date.now())
        
        ElMessage.success('登录成功')
        
        // 如果有重定向，则跳转到重定向页面
        const redirectPath = route.query.redirect as string
        router.push(redirectPath || { name: 'dashboard' })
      } catch (error) {
        ElMessage.error('登录失败：' + (error instanceof Error ? error.message : '未知错误'))
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
}

.login-card {
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

.login-btn {
  width: 100%;
}

.register-link {
  text-align: center;
  margin-top: 10px;
}

.register-link span {
  margin-right: 5px;
}
</style>
