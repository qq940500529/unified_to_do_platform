import ExcelJS from 'exceljs';

export const generateExcelReport = async (reportData) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('待办事项报告');

    // 设置表头
    worksheet.columns = [
      { header: '报告类型', key: 'report_type', width: 20 },
      { header: '开始时间', key: 'start_date', width: 20 },
      { header: '结束时间', key: 'end_date', width: 20 },
      { header: '总任务数', key: 'total', width: 15 },
      { header: '已完成', key: 'completed', width: 15 },
      { header: '进行中', key: 'in_progress', width: 15 },
      { header: '待处理', key: 'pending', width: 15 },
      { header: '完成率', key: 'completion_rate', width: 15 }
    ];

    // 获取报告数据
    const data = reportData.data;
    const completionRate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;

    // 添加摘要数据行
    worksheet.addRow({
      report_type: getReportTypeName(reportData.report_type),
      start_date: new Date(reportData.start_date).toLocaleDateString(),
      end_date: new Date(reportData.end_date).toLocaleDateString(),
      total: data.total || 0,
      completed: data.completed || 0,
      in_progress: data.in_progress || 0,
      pending: data.pending || 0,
      completion_rate: `${completionRate}%`
    });

    // 设置样式
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9D9D9' }
      };
    });

    // 如果有详细统计数据，添加详细工作表
    if (data.daily_stats && data.daily_stats.length > 0) {
      const detailSheet = workbook.addWorksheet('每日统计');
      detailSheet.columns = [
        { header: '日期', key: 'date', width: 20 },
        { header: '总任务数', key: 'total', width: 15 },
        { header: '已完成', key: 'completed', width: 15 },
        { header: '进行中', key: 'in_progress', width: 15 },
        { header: '待处理', key: 'pending', width: 15 }
      ];

      data.daily_stats.forEach(day => {
        detailSheet.addRow({
          date: new Date(day.date).toLocaleDateString(),
          total: day.total,
          completed: day.completed,
          in_progress: day.in_progress,
          pending: day.pending
        });
      });

      detailSheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9D9D9' }
        };
      });
    } else if (data.weekly_stats && data.weekly_stats.length > 0) {
      const detailSheet = workbook.addWorksheet('每周统计');
      detailSheet.columns = [
        { header: '周数', key: 'week', width: 15 },
        { header: '总任务数', key: 'total', width: 15 },
        { header: '已完成', key: 'completed', width: 15 },
        { header: '进行中', key: 'in_progress', width: 15 },
        { header: '待处理', key: 'pending', width: 15 }
      ];

      data.weekly_stats.forEach(week => {
        detailSheet.addRow({
          week: `第${week.week}周`,
          total: week.total,
          completed: week.completed,
          in_progress: week.in_progress,
          pending: week.pending
        });
      });

      detailSheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9D9D9' }
        };
      });
    } else if (data.monthly_stats && data.monthly_stats.length > 0) {
      const detailSheet = workbook.addWorksheet('每月统计');
      detailSheet.columns = [
        { header: '月份', key: 'month', width: 15 },
        { header: '总任务数', key: 'total', width: 15 },
        { header: '已完成', key: 'completed', width: 15 },
        { header: '进行中', key: 'in_progress', width: 15 },
        { header: '待处理', key: 'pending', width: 15 }
      ];

      data.monthly_stats.forEach(month => {
        detailSheet.addRow({
          month: getMonthName(month.month),
          total: month.total,
          completed: month.completed,
          in_progress: month.in_progress,
          pending: month.pending
        });
      });

      detailSheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9D9D9' }
        };
      });
    }

    // 生成Excel文件
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    throw new Error(`生成Excel报告失败: ${error.message}`);
  }
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
