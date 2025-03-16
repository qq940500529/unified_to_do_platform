import app from './app.js';
import { connectDB } from './database/db.js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const PORT = process.env.PORT || 5000;

// 启动服务器
const startServer = async () => {
  try {
    // 连接数据库
    await connectDB();
    
    // 启动Express应用
    app.listen(PORT, () => {
      console.log(`服务器正在运行，端口：${PORT}`);
      console.log(`API文档：http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
};

startServer();

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  process.exit(1);
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (err) => {
  console.error('未处理的Promise拒绝:', err);
  process.exit(1);
});
