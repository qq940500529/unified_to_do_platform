import Report from '../models/Report.js';
import { query } from '../database/db.js';
import { generatePDFReport } from '../utils/pdfGenerator.js';
import { generateExcelReport } from '../utils/excelGenerator.js';

// 生成报告
export const generateReport = async (req, res) => {
  try {
    const { report_type } = req.params;
    const { start_date, end_date } = req.body;

    // 验证报告类型
    const validReportTypes = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validReportTypes.includes(report_type)) {
      return res.status(400).json({ message: '无效的报告类型' });
    }

    // 计算时间范围
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // 生成报告
    const report = await Report.generateReport(
      req.user.id,
      report_type,
      startDate,
      endDate
    );

    res.status(201).json({
      id: report.id,
      type: report.type,
      period_start: report.period_start,
      period_end: report.period_end,
      data: report.data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 导出PDF报告
export const exportPDFReport = async (req, res) => {
  try {
    const { report_id } = req.params;
    
    // 获取报告数据
    const report = await Report.findById(report_id);
    if (!report || report.created_by !== req.user.id) {
      return res.status(404).json({ message: '报告未找到' });
    }

    // 生成PDF
    const pdfBuffer = await generatePDFReport({
      report_type: report.type,
      start_date: report.period_start,
      end_date: report.period_end,
      data: report.data
    });
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report_${report_id}.pdf`);
    
    // 发送PDF文件
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 导出Excel报告
export const exportExcelReport = async (req, res) => {
  try {
    const { report_id } = req.params;
    
    // 获取报告数据
    const report = await Report.findById(report_id);
    if (!report || report.created_by !== req.user.id) {
      return res.status(404).json({ message: '报告未找到' });
    }

    // 生成Excel
    const excelBuffer = await generateExcelReport({
      report_type: report.type,
      start_date: report.period_start,
      end_date: report.period_end,
      data: report.data
    });
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=report_${report_id}.xlsx`);
    
    // 发送Excel文件
    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取报告列表
export const getReports = async (req, res) => {
  try {
    const { report_type } = req.params;

    // 验证报告类型
    const validReportTypes = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validReportTypes.includes(report_type)) {
      return res.status(400).json({ message: '无效的报告类型' });
    }

    const reports = await Report.getUserReports(req.user.id, report_type);
    res.json(reports.map(report => report.toJSON()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取单个报告
export const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report || report.created_by !== req.user.id) {
      return res.status(404).json({ message: '报告未找到' });
    }

    res.json({
      id: report.id,
      type: report.type,
      period_start: report.period_start,
      period_end: report.period_end,
      data: report.data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 删除报告
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report || report.created_by !== req.user.id) {
      return res.status(404).json({ message: '报告未找到' });
    }
    
    const sql = 'DELETE FROM reports WHERE id = ?';
    await query(sql, [req.params.id]);

    res.json({ message: '报告已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取报告统计数据
export const getReportStats = async (req, res) => {
  try {
    const { report_type } = req.params;

    // 获取最新报告
    const reports = await Report.getUserReports(req.user.id, report_type);
    
    if (reports.length === 0) {
      return res.status(404).json({ message: '没有可用的报告' });
    }

    // 返回最新的报告
    const latestReport = reports[0];
    
    res.json({
      id: latestReport.id,
      type: latestReport.type,
      period_start: latestReport.period_start,
      period_end: latestReport.period_end,
      data: latestReport.data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
