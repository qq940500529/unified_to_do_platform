<template>
  <el-container class="dashboard-container">
    <el-header class="shadow-sm bg-light">
      <div class="header-content container-fluid">
        <div class="d-flex align-items-center">
          <span class="logo text-primary font-weight-bold">统一待办平台</span>
          <div class="d-md-none ml-auto">
            <el-button type="text" @click="toggleSidebar">
              <el-icon><Menu /></el-icon>
            </el-button>
          </div>
        </div>
        <el-dropdown>
          <span class="user-info d-flex align-items-center">
            <el-avatar :size="32" :src="user.avatar" class="shadow-sm" />
            <span class="username ml-2 d-none d-sm-inline">{{ user.name }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-icon><User /></el-icon>
                <span class="ml-1">个人中心</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>
                <span class="ml-1">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="flex-grow-1">
      <el-aside 
        :width="sidebarWidth" 
        class="bg-light shadow-sm transition-normal"
        :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
      >
        <el-menu
          :default-active="activeMenu"
          router
          @select="handleMenuSelect"
          :collapse="isSidebarCollapsed"
          class="border-0 h-100"
        >
          <el-menu-item index="/dashboard/todos" class="rounded-sm my-1">
            <el-icon><List /></el-icon>
            <template #title>
              <span>待办事项</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/dashboard/reports" class="rounded-sm my-1">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>
              <span>统计报表</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="p-0 p-md-3 bg-color">
        <div class="content-container p-3 rounded-md">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { List, DataAnalysis, Menu, User, SwitchButton } from '@element-plus/icons-vue'
import { useAuthStore } from '@/store/modules/auth'

const router = useRouter()
const authStore = useAuthStore()
const activeMenu = ref('/dashboard/todos')
const isSidebarCollapsed = ref(false)
const windowWidth = ref(window.innerWidth)

// 响应式侧边栏宽度
const sidebarWidth = computed(() => {
  if (isSidebarCollapsed.value) {
    return '64px'
  }
  return windowWidth.value < 768 ? '200px' : '220px'
})

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth
  // 在小屏幕上自动折叠侧边栏
  isSidebarCollapsed.value = windowWidth.value < 768
}

// 切换侧边栏
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const user = computed(() => {
  return authStore.currentUser || {
    name: '管理员',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  }
})

const handleMenuSelect = (index: string) => {
  activeMenu.value = index
  // 在移动设备上，选择菜单项后自动折叠侧边栏
  if (windowWidth.value < 768) {
    isSidebarCollapsed.value = true
  }
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    authStore.logout()
    router.push({ name: 'login' })
  })
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  // 初始化时检查窗口大小
  handleResize()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
  overflow: hidden;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  font-size: 1.25rem;
  letter-spacing: 0.5px;
}

.user-info {
  cursor: pointer;
}

.username {
  font-weight: 500;
}

.el-header {
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

.el-aside {
  transition: width var(--transition-normal);
  overflow-x: hidden;
  border-right: 1px solid var(--border-color);
}

.sidebar-collapsed {
  width: 64px !important;
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  margin: 4px 8px;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.el-menu-item:hover {
  background-color: rgba(var(--el-color-primary-rgb), 0.1) !important;
}

.el-menu-item.is-active {
  background-color: rgba(var(--el-color-primary-rgb), 0.15) !important;
  font-weight: 600;
  color: var(--primary-color) !important;
  box-shadow: var(--shadow-sm);
}

.el-menu-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background-color: var(--primary-color);
}

.content-container {
  background-color: var(--background-light);
  min-height: calc(100vh - 60px);
  box-shadow: var(--shadow-sm);
}

.bg-color {
  background-color: var(--background-color);
}

/* 移动设备适配 */
@media (max-width: 768px) {
  .el-aside {
    position: fixed;
    top: 60px;
    left: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(0);
  }
  
  .sidebar-collapsed {
    transform: translateX(-100%);
  }
  
  .el-main {
    margin-left: 0 !important;
  }
}

/* 平板设备适配 */
@media (min-width: 769px) and (max-width: 992px) {
  .el-main {
    margin-left: 64px;
  }
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
