import { defineStore } from 'pinia'
import { reportService } from '@/services/api'
import type { ReportData, ReportType } from '@/types/report'

export const useReportsStore = defineStore('reports', {
  state: () => ({
    reportData: null as ReportData | null,
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchReportData(params: {
      startDate: string;
      endDate: string;
      type: ReportType;
    }) {
      this.loading = true
      try {
        const data = await reportService.getReportData(params)
        this.reportData = data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async exportReport(params: {
      startDate: string;
      endDate: string;
      type: ReportType;
      format: 'pdf' | 'excel';
    }) {
      try {
        const blob = await reportService.exportReport(params)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        
        // 设置文件名
        const fileExt = params.format === 'pdf' ? 'pdf' : 'xlsx'
        const fileName = `${params.type}_report_${new Date().toISOString().split('T')[0]}.${fileExt}`
        link.setAttribute('download', fileName)
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
        throw error
      }
    }
  }
})
