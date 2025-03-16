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
  static async generate({ type, period_start, period_end, created_by }) {
    let data = {};
    
    switch (type) {
      case 'daily':
        data = await this.generateDailyReport(created_by, period_start);
        break;
      case 'weekly':
        data = await this.generateWeeklyReport(created_by, period_start);
        break;
      case 'monthly':
        data = await this.generateMonthlyReport(created_by, period_start);
        break;
      case 'yearly':
        data = await this.generateYearlyReport(created_by, period_start);
        break;
      default:
        throw new Error('无效的报告类型');
    }

    const sql = `
      INSERT INTO reports 
      (type, period_start, period_end, created_by, data)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      type,
      period_start,
      period_end,
      created_by,
      JSON.stringify(data)
    ]);

    return new Report({
      id: result.insertId,
      type,
      period_start,
      period_end,
      created_by,
      data
    });
  }

  // 生成日报
  static async generateDailyReport(userId, date) {
    const sql = `
      SELECT 
        COUNT(*) AS total_todos,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_todos,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_todos
      FROM todos
      WHERE (created_by = ? OR assigned_to = ?)
        AND DATE(created_at) = ?
    `;
    const [stats] = await query(sql, [userId, userId, date]);

    return {
      date,
      stats
    };
  }

  // 生成周报
  static async generateWeeklyReport(userId, startDate) {
    const sql = `
      SELECT 
        DATE(created_at) AS date,
        COUNT(*) AS total_todos,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_todos,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_todos
      FROM todos
      WHERE (created_by = ? OR assigned_to = ?)
        AND created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
    `;
    const stats = await query(sql, [userId, userId, startDate, startDate]);

    return {
      start_date: startDate,
      end_date: new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 6)),
      stats
    };
  }

  // 生成月报
  static async generateMonthlyReport(userId, month) {
    const sql = `
      SELECT 
        WEEK(created_at) AS week,
        COUNT(*) AS total_todos,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_todos,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_todos
      FROM todos
      WHERE (created_by = ? OR assigned_to = ?)
        AND MONTH(created_at) = MONTH(?)
        AND YEAR(created_at) = YEAR(?)
      GROUP BY WEEK(created_at)
    `;
    const stats = await query(sql, [userId, userId, month, month]);

    return {
      month,
      stats
    };
  }

  // 生成年报
  static async generateYearlyReport(userId, year) {
    const sql = `
      SELECT 
        MONTH(created_at) AS month,
        COUNT(*) AS total_todos,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_todos,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_todos
      FROM todos
      WHERE (created_by = ? OR assigned_to = ?)
        AND YEAR(created_at) = YEAR(?)
      GROUP BY MONTH(created_at)
    `;
    const stats = await query(sql, [userId, userId, year]);

    return {
      year,
      stats
    };
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
