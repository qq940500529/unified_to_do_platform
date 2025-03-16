import express from 'express';
import cors from 'cors';
import authRouter from './controllers/authController.js';
import todoRouter from './controllers/todoController.js';
import reportRouter from './controllers/reportController.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRouter);
app.use('/api/todos', todoRouter);
app.use('/api/reports', reportRouter);

// 错误处理
app.use(errorHandler);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
