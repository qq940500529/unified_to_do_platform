import app from './app.js';
import { connectDB, initDatabase } from './database/db.js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const PORT = process.env.PORT || 5000;

// 启动服务器
const startServer = async () => {
  try {
    // 尝试连接数据库
    try {
      await connectDB();
      
      // 初始化数据库
      try {
        await initDatabase();
        console.log('数据库初始化成功');
      } catch (error) {
        console.warn('数据库初始化失败，可能已经初始化:', error.message);
      }
    } catch (error) {
      console.error('数据库连接失败，但服务器将继续启动:', error.message);
    }
    
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
