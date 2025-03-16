import PDFDocument from 'pdfkit';
import fs from 'fs';

export const generatePDFReport = async (reportData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      
      // 收集PDF数据
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // 设置PDF内容
      doc.fontSize(25).text('待办事项报告', { align: 'center' });
      doc.moveDown();
      
      // 添加报告元数据
      doc.fontSize(14)
        .text(`报告类型: ${getReportTypeName(reportData.report_type)}`)
        .text(`时间范围: ${new Date(reportData.start_date).toLocaleDateString()} - ${new Date(reportData.end_date).toLocaleDateString()}`)
        .moveDown();

      // 添加报告数据
      const data = reportData.data;
      doc.fontSize(12)
        .text(`总任务数: ${data.total || 0}`)
        .text(`已完成: ${data.completed || 0}`)
        .text(`进行中: ${data.in_progress || 0}`)
        .text(`待处理: ${data.pending || 0}`)
        .moveDown();

      // 添加完成率
      const completionRate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
      doc.text(`完成率: ${completionRate}%`).moveDown();

      // 如果有详细统计数据，添加详细信息
      if (data.daily_stats) {
        doc.fontSize(14).text('每日统计', { underline: true }).moveDown();
        data.daily_stats.forEach(day => {
          doc.fontSize(12)
            .text(`日期: ${new Date(day.date).toLocaleDateString()}`)
            .text(`  总任务: ${day.total}, 已完成: ${day.completed}, 进行中: ${day.in_progress}, 待处理: ${day.pending}`)
            .moveDown(0.5);
        });
      } else if (data.weekly_stats) {
        doc.fontSize(14).text('每周统计', { underline: true }).moveDown();
        data.weekly_stats.forEach(week => {
          doc.fontSize(12)
            .text(`第${week.week}周`)
            .text(`  总任务: ${week.total}, 已完成: ${week.completed}, 进行中: ${week.in_progress}, 待处理: ${week.pending}`)
            .moveDown(0.5);
        });
      } else if (data.monthly_stats) {
        doc.fontSize(14).text('每月统计', { underline: true }).moveDown();
        data.monthly_stats.forEach(month => {
          doc.fontSize(12)
            .text(`${getMonthName(month.month)}`)
            .text(`  总任务: ${month.total}, 已完成: ${month.completed}, 进行中: ${month.in_progress}, 待处理: ${month.pending}`)
            .moveDown(0.5);
        });
      }

      // 结束文档
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// 获取报告类型名称
function getReportTypeName(type) {
  switch (type) {
    case 'daily': return '日报';
    case 'weekly': return '周报';
    case 'monthly': return '月报';
    case 'yearly': return '年报';
    default: return type;
  }
}

// 获取月份名称
function getMonthName(monthNumber) {
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];
  return months[monthNumber - 1] || `第${monthNumber}月`;
}
