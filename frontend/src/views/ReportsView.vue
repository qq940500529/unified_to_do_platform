<template>
  <div class="reports-view fade-in">
    <div class="page-header mb-4">
      <h2 class="text-primary font-weight-bold mb-2">统计报表</h2>
      <p class="text-muted">查看和导出任务统计数据</p>
    </div>
    
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="row align-items-center mb-4">
          <div class="col-12 col-md-6">
            <h3 class="font-weight-bold mb-0">报表概览</h3>
            <p class="text-muted mb-0">{{ formatDateRange(dateRange) }}</p>
          </div>
          <div class="col-12 col-md-6 mt-3 mt-md-0">
            <div class="d-flex justify-content-md-end">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleDateChange"
                class="w-100 w-md-auto rounded-md"
                size="large"
              />
            </div>
          </div>
        </div>
        
        <div class="row mb-4">
          <div class="col-6 col-md-3 mb-3">
            <div class="stat-card bg-light p-3 rounded-md text-center">
              <div class="stat-value text-primary font-weight-bold font-size-xxl">{{ reportStore.reportData?.totalTasks || 0 }}</div>
              <div class="stat-label text-muted">总任务数</div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-3">
            <div class="stat-card bg-light p-3 rounded-md text-center">
              <div class="stat-value text-success font-weight-bold font-size-xxl">{{ reportStore.reportData?.completedTasks || 0 }}</div>
              <div class="stat-label text-muted">已完成</div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-3">
            <div class="stat-card bg-light p-3 rounded-md text-center">
              <div class="stat-value text-warning font-weight-bold font-size-xxl">{{ reportStore.reportData?.inProgressTasks || 0 }}</div>
              <div class="stat-label text-muted">进行中</div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-3">
            <div class="stat-card bg-light p-3 rounded-md text-center">
              <div class="stat-value text-danger font-weight-bold font-size-xxl">{{ reportStore.reportData?.pendingTasks || 0 }}</div>
              <div class="stat-label text-muted">待处理</div>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12 col-lg-6 mb-4">
            <div class="chart-card bg-light p-3 rounded-md shadow-sm h-100">
              <h4 class="font-weight-bold mb-3">待办事项趋势</h4>
              <div ref="todoChart" class="chart-container" v-loading="loading"></div>
            </div>
          </div>
          <div class="col-12 col-lg-6 mb-4">
            <div class="chart-card bg-light p-3 rounded-md shadow-sm h-100">
              <h4 class="font-weight-bold mb-3">任务状态分布</h4>
              <div ref="statusChart" class="chart-container" v-loading="loading"></div>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12 col-lg-6 mb-4">
            <div class="chart-card bg-light p-3 rounded-md shadow-sm h-100">
              <h4 class="font-weight-bold mb-3">任务来源分布</h4>
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="bg-light">
                    <tr>
                      <th>来源系统</th>
                      <th class="text-right">任务数量</th>
                      <th class="text-right">占比</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in reportStore.reportData?.tasksByCategory" :key="index">
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="color-dot mr-2" :style="{ backgroundColor: getSystemColor(index) }"></div>
                          {{ item.category }}
                        </div>
                      </td>
                      <td class="text-right font-weight-bold">{{ item.count }}</td>
                      <td class="text-right">{{ calculatePercentage(item.count, reportStore.reportData?.totalTasks) }}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-6 mb-4">
            <div class="chart-card bg-light p-3 rounded-md shadow-sm h-100">
              <h4 class="font-weight-bold mb-3">报表导出</h4>
              <p class="text-muted mb-4">选择报表类型和格式进行导出</p>
              
              <div class="row mb-3">
                <div class="col-12 col-md-6 mb-3">
                  <el-select v-model="exportType" placeholder="报表类型" class="w-100 rounded-md">
                    <el-option label="日报" value="daily" />
                    <el-option label="周报" value="weekly" />
                    <el-option label="月报" value="monthly" />
                    <el-option label="年报" value="yearly" />
                  </el-select>
                </div>
                <div class="col-12 col-md-6 mb-3">
                  <el-select v-model="exportFormat" placeholder="导出格式" class="w-100 rounded-md">
                    <el-option label="PDF" value="pdf" />
                    <el-option label="Excel" value="excel" />
                  </el-select>
                </div>
              </div>
              
              <el-button 
                type="primary" 
                class="w-100 rounded-md" 
                @click="handleExport"
                :loading="exporting"
                :icon="Download"
              >
                导出报表
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { useReportsStore } from '@/store/modules/reports'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { format } from 'date-fns'

const reportStore = useReportsStore()
const loading = ref(false)
const exporting = ref(false)
const exportType = ref('daily')
const exportFormat = ref('pdf')
const chartInstances = ref<echarts.ECharts[]>([])

const dateRange = ref<[Date, Date]>([
  new Date(new Date().setDate(new Date().getDate() - 7)),
  new Date()
])

const todoChart = ref<HTMLElement>()
const statusChart = ref<HTMLElement>()

// 格式化日期范围显示
const formatDateRange = (range: [Date, Date]) => {
  if (!range || range.length !== 2) return ''
  return `${format(range[0], 'yyyy年MM月dd日')} - ${format(range[1], 'yyyy年MM月dd日')}`
}

// 计算百分比
const calculatePercentage = (value: number, total?: number) => {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

// 获取系统颜色
const getSystemColor = (index: number) => {
  const colors = [
    '#3498db', '#2ecc71', '#9b59b6', '#f39c12', '#e74c3c',
    '#1abc9c', '#34495e', '#16a085', '#27ae60', '#2980b9'
  ]
  return colors[index % colors.length]
}

const initCharts = () => {
  // 清除之前的图表实例
  chartInstances.value.forEach(chart => chart.dispose())
  chartInstances.value = []
  
  // 待办事项趋势图
  if (todoChart.value) {
    const todoChartInstance = echarts.init(todoChart.value)
    chartInstances.value.push(todoChartInstance)
    
    todoChartInstance.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.value.todoTrend.map(item => item.category),
        axisLabel: {
          interval: 0,
          rotate: 30
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '任务数量',
          data: chartData.value.todoTrend.map((item, index) => ({
            value: item.count,
            itemStyle: {
              color: getSystemColor(index)
            }
          })),
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.1)'
          },
          barWidth: '40%',
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
  }

  // 任务状态饼图
  if (statusChart.value) {
    const statusChartInstance = echarts.init(statusChart.value)
    chartInstances.value.push(statusChartInstance)
    
    statusChartInstance.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: chartData.value.statusDistribution.map(item => item.priority)
      },
      series: [
        {
          name: '任务状态',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: chartData.value.statusDistribution.map((item, index) => ({
            value: item.count,
            name: item.priority,
            itemStyle: {
              color: index === 0 ? '#e74c3c' : index === 1 ? '#f39c12' : '#2ecc71'
            }
          }))
        }
      ]
    })
  }
}

const handleResize = () => {
  chartInstances.value.forEach(chart => chart.resize())
}

const handleDateChange = async () => {
  try {
    if (dateRange.value && dateRange.value.length === 2) {
      // 模拟数据加载
      loading.value = true
      
      setTimeout(() => {
        // 模拟不同日期范围的数据
        const startDate = dateRange.value[0]
        const endDate = dateRange.value[1]
        const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        
        // 根据日期范围调整数据
        const multiplier = Math.max(1, Math.min(daysDiff / 7, 2))
        
        reportStore.$patch({
          reportData: {
            tasksByCategory: [
              { category: 'OA系统', count: Math.round(15 * multiplier) },
              { category: '项目管理系统', count: Math.round(28 * multiplier) },
              { category: '测试系统', count: Math.round(12 * multiplier) },
              { category: '运维系统', count: Math.round(8 * multiplier) },
              { category: '财务系统', count: Math.round(5 * multiplier) }
            ],
            tasksByPriority: [
              { priority: '高', count: Math.round(18 * multiplier) },
              { priority: '中', count: Math.round(32 * multiplier) },
              { priority: '低', count: Math.round(15 * multiplier) }
            ],
            tasksByStatus: [
              { status: '待处理', count: Math.round(25 * multiplier) },
              { status: '进行中', count: Math.round(20 * multiplier) },
              { status: '已完成', count: Math.round(20 * multiplier) }
            ],
            totalTasks: Math.round(65 * multiplier),
            completedTasks: Math.round(20 * multiplier),
            pendingTasks: Math.round(25 * multiplier),
            inProgressTasks: Math.round(20 * multiplier)
          }
        })
        
        initCharts()
        loading.value = false
      }, 500)
    }
  } catch (error) {
    ElMessage.error('获取报告数据失败')
    loading.value = false
  }
}

const handleExport = async () => {
  try {
    if (dateRange.value && dateRange.value.length === 2) {
      // 模拟导出操作
      exporting.value = true
      
      setTimeout(() => {
        ElMessage.success(`${getExportTypeName(exportType.value)}已成功导出为${exportFormat.value.toUpperCase()}格式`)
        exporting.value = false
      }, 1000)
    }
  } catch (error) {
    ElMessage.error('报表导出失败')
    exporting.value = false
  }
}

const getExportTypeName = (type: string) => {
  switch (type) {
    case 'daily': return '日报'
    case 'weekly': return '周报'
    case 'monthly': return '月报'
    case 'yearly': return '年报'
    default: return '报表'
  }
}

const chartData = computed(() => ({
  todoTrend: reportStore.reportData?.tasksByCategory || [],
  statusDistribution: reportStore.reportData?.tasksByPriority || []
}))

onMounted(async () => {
  try {
    loading.value = true
    
    // 模拟报表数据
    // 在实际环境中，这里会调用 API 获取数据
    // await reportStore.fetchReportData({
    //   startDate: dateRange.value[0].toISOString(),
    //   endDate: dateRange.value[1].toISOString(),
    //   type: 'daily'
    // })
    
    // 模拟设置报表数据
    reportStore.$patch({
      reportData: {
        tasksByCategory: [
          { category: 'OA系统', count: 15 },
          { category: '项目管理系统', count: 28 },
          { category: '测试系统', count: 12 },
          { category: '运维系统', count: 8 },
          { category: '财务系统', count: 5 }
        ],
        tasksByPriority: [
          { priority: '高', count: 18 },
          { priority: '中', count: 32 },
          { priority: '低', count: 15 }
        ],
        tasksByStatus: [
          { status: '待处理', count: 25 },
          { status: '进行中', count: 20 },
          { status: '已完成', count: 20 }
        ],
        totalTasks: 65,
        completedTasks: 20,
        pendingTasks: 25,
        inProgressTasks: 20
      }
    })
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize)
    
    // 初始化图表
    setTimeout(() => {
      initCharts()
      loading.value = false
    }, 300)
  } catch (error) {
    ElMessage.error('获取报告数据失败')
    loading.value = false
  }
})

onBeforeUnmount(() => {
  // 移除窗口大小变化监听
  window.removeEventListener('resize', handleResize)
  
  // 销毁图表实例
  chartInstances.value.forEach(chart => chart.dispose())
})
</script>

<style scoped>
.reports-view {
  padding: 0;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.stat-card {
  transition: all var(--transition-normal);
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.stat-value {
  font-size: 2rem;
  line-height: 1.2;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.table {
  width: 100%;
  margin-bottom: 1rem;
  color: var(--text-primary);
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  vertical-align: middle;
  border-top: 1px solid var(--border-color);
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid var(--border-color);
  font-weight: 600;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.table-responsive {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }
  
  .w-md-auto {
    width: auto !important;
  }
}
</style>
