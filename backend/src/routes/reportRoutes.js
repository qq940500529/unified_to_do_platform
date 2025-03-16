import express from 'express';
import { 
  generateReport,
  exportPDFReport,
  exportExcelReport,
  getReports,
  getReport,
  deleteReport,
  getReportStats
} from '../controllers/reportController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// 报告相关路由
router.use(authMiddleware);

// 生成报告
router.post('/:report_type', generateReport);

// 导出PDF报告
router.get('/export/pdf/:report_id', exportPDFReport);

// 导出Excel报告
router.get('/export/excel/:report_id', exportExcelReport);

// 获取报告列表
router.get('/:report_type', getReports);

// 获取单个报告
router.get('/detail/:id', getReport);

// 删除报告
router.delete('/:id', deleteReport);

// 获取报告统计数据
router.get('/stats/:report_type', getReportStats);

export default router;
