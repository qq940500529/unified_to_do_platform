import { query } from '../database/db.js';

class Report {
  constructor({
    id,
    type,
    period_start,
    period_end,
    created_by,
    created_at,
    data
  }) {
    this.id = id;
    this.type = type;
    this.period_start = period_start;
    this.period_end = period_end;
    this.created_by = created_by;
    this.created_at = created_at;
    this.data = data;
  }

  // 生成报告
  static async generateReport(userId, report_type, startDate, endDate) {
    let data = {};
    
    switch (report_type) {
      case 'daily':
        data = await this.generateDailyReport(userId, startDate);
        break;
      case 'weekly':
        data = await this.generateWeeklyReport(userId, startDate);
        break;
      case 'monthly':
        data = await this.generateMonthlyReport(userId, startDate);
        break;
      case 'yearly':
        data = await this.generateYearlyReport(userId, startDate);
        break;
      default:
        throw new Error('无效的报告类型');
    }

    const sql = `
      INSERT INTO reports 
      (report_type, start_date, end_date, user_id, data)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      report_type,
      startDate,
      endDate,
      userId,
      JSON.stringify(data)
    ]);

    return new Report({
      id: result.insertId,
      type: report_type,
      period_start: startDate,
      period_end: endDate,
      created_by: userId,
      data
    });
  }

  // 生成日报
  static async generateDailyReport(userId, date) {
    const sql = `
      SELECT 
        COUNT(*) AS total_todos,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_todos,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_todos,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_todos
      FROM todos
      WHERE (user_id = ? OR assignee = ?)
        AND DATE(created_at) = ?
    `;
    const [stats] = await query(sql, [userId, userId, date]);

    return {
      date,
      total: stats.total_todos || 0,
      completed: stats.completed_todos || 0,
      pending: stats.pending_todos || 0,
      in_progress: stats.in_progress_todos || 0
    };
  }

  // 生成周报
  static async generateWeeklyReport(userId, startDate) {
    const sql = `
      SELECT 
        DATE(created_at) AS date,
        COUNT(*) AS total_todos,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_todos,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_todos,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_todos
      FROM todos
      WHERE (user_id = ? OR assignee = ?)
        AND created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
    `;
    const dailyStats = await query(sql, [userId, userId, startDate, startDate]);
    
    // 计算总计
    const total = dailyStats.reduce((sum, day) => sum + (day.total_todos || 0), 0);
    const completed = dailyStats.reduce((sum, day) => sum + (day.completed_todos || 0), 0);
    const pending = dailyStats.reduce((sum, day) => sum + (day.pending_todos || 0), 0);
    const in_progress = dailyStats.reduce((sum, day) => sum + (day.in_progress_todos || 0), 0);
    
    const endDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 6));
    
    return {
      start_date: startDate,
      end_date: endDate,
      total,
      completed,
      pending,
      in_progress,
      daily_stats: dailyStats.map(day => ({
        date: day.date,
        total: day.total_todos || 0,
        completed: day.completed_todos || 0,
        pending: day.pending_todos || 0,
        in_progress: day.in_progress_todos || 0
      }))
    };
  }

  // 生成月报
  static async generateMonthlyReport(userId, month) {
    const sql = `
      SELECT 
        WEEK(created_at) AS week,
        COUNT(*) AS total_todos,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_todos,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_todos,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_todos
      FROM todos
      WHERE (user_id = ? OR assignee = ?)
        AND MONTH(created_at) = MONTH(?)
        AND YEAR(created_at) = YEAR(?)
      GROUP BY WEEK(created_at)
    `;
    const weeklyStats = await query(sql, [userId, userId, month, month]);
    
    // 计算总计
    const total = weeklyStats.reduce((sum, week) => sum + (week.total_todos || 0), 0);
    const completed = weeklyStats.reduce((sum, week) => sum + (week.completed_todos || 0), 0);
    const pending = weeklyStats.reduce((sum, week) => sum + (week.pending_todos || 0), 0);
    const in_progress = weeklyStats.reduce((sum, week) => sum + (week.in_progress_todos || 0), 0);
    
    return {
      month,
      total,
      completed,
      pending,
      in_progress,
      weekly_stats: weeklyStats.map(week => ({
        week: week.week,
        total: week.total_todos || 0,
        completed: week.completed_todos || 0,
        pending: week.pending_todos || 0,
        in_progress: week.in_progress_todos || 0
      }))
    };
  }

  // 生成年报
  static async generateYearlyReport(userId, year) {
    const sql = `
      SELECT 
        MONTH(created_at) AS month,
        COUNT(*) AS total_todos,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_todos,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_todos,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_todos
      FROM todos
      WHERE (user_id = ? OR assignee = ?)
        AND YEAR(created_at) = YEAR(?)
      GROUP BY MONTH(created_at)
    `;
    const monthlyStats = await query(sql, [userId, userId, year]);
    
    // 计算总计
    const total = monthlyStats.reduce((sum, month) => sum + (month.total_todos || 0), 0);
    const completed = monthlyStats.reduce((sum, month) => sum + (month.completed_todos || 0), 0);
    const pending = monthlyStats.reduce((sum, month) => sum + (month.pending_todos || 0), 0);
    const in_progress = monthlyStats.reduce((sum, month) => sum + (month.in_progress_todos || 0), 0);
    
    return {
      year,
      total,
      completed,
      pending,
      in_progress,
      monthly_stats: monthlyStats.map(month => ({
        month: month.month,
        total: month.total_todos || 0,
        completed: month.completed_todos || 0,
        pending: month.pending_todos || 0,
        in_progress: month.in_progress_todos || 0
      }))
    };
  }

  // 通过ID查找报告
  static async findById(id) {
    const sql = 'SELECT * FROM reports WHERE id = ?';
    const rows = await query(sql, [id]);
    if (rows.length === 0) return null;
    
    const reportData = rows[0];
    return new Report({
      id: reportData.id,
      type: reportData.report_type,
      period_start: reportData.start_date,
      period_end: reportData.end_date,
      created_by: reportData.user_id,
      created_at: reportData.created_at,
      data: JSON.parse(reportData.data)
    });
  }
  
  // 获取用户报告列表
  static async getUserReports(userId, reportType) {
    const sql = `
      SELECT * FROM reports 
      WHERE user_id = ? AND report_type = ?
      ORDER BY created_at DESC
    `;
    const rows = await query(sql, [userId, reportType]);
    return rows.map(row => new Report({
      id: row.id,
      type: row.report_type,
      period_start: row.start_date,
      period_end: row.end_date,
      created_by: row.user_id,
      created_at: row.created_at,
      data: JSON.parse(row.data)
    }));
  }

  // 转换为JSON
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      period_start: this.period_start,
      period_end: this.period_end,
      created_by: this.created_by,
      created_at: this.created_at,
      data: this.data
    };
  }
}

export default Report;
