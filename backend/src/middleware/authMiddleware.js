import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 验证JWT
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '请提供认证令牌' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: '认证失败' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: '请进行认证' });
  }
};

// 验证管理员权限
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '需要管理员权限' });
  }
  next();
};

// 记录请求日志
const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

// 错误处理
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: '认证失败' });
  }

  res.status(500).json({ error: '服务器错误' });
};

// 验证用户ID
const validateUserId = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: '用户未找到' });
    }
    req.targetUser = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 验证请求体
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export {
  authenticate,
  isAdmin,
  requestLogger,
  errorHandler,
  validateUserId,
  validateRequest
};
