<template>
  <div class="home">
    <h1>统一待办平台</h1>
    <p>欢迎使用企业统一待办平台</p>
    <el-button type="primary" @click="goToLogin">登录</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push({ name: 'login' })
}
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 100px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

p {
  font-size: 1.2rem;
  margin-bottom: 40px;
}
</style>
