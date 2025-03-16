import Report from '../models/Report.js';
import { query } from '../database/db.js';

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

    res.status(201).json(report.toJSON());
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
    const sql = 'SELECT * FROM reports WHERE id = ? AND user_id = ?';
    const rows = await query(sql, [req.params.id, req.user.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: '报告未找到' });
    }

    const report = new Report({
      ...rows[0],
      data: JSON.parse(rows[0].data)
    });

    res.json(report.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 删除报告
export const deleteReport = async (req, res) => {
  try {
    const sql = 'DELETE FROM reports WHERE id = ? AND user_id = ?';
    const result = await query(sql, [req.params.id, req.user.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '报告未找到' });
    }

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
    const sql = `
      SELECT * FROM reports 
      WHERE user_id = ? AND report_type = ?
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const rows = await query(sql, [req.user.id, report_type]);

    if (rows.length === 0) {
      return res.status(404).json({ message: '没有可用的报告' });
    }

    const report = new Report({
      ...rows[0],
      data: JSON.parse(rows[0].data)
    });

    res.json(report.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
