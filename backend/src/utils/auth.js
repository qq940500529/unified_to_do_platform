import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// 生成重置密码令牌
export const generateResetToken = (userId) => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 在实际应用中，这里应该将令牌存储到数据库中
  // 并设置过期时间，这里简化处理
  const token = jwt.sign(
    { id: userId, token: hashedToken },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};

// 验证重置密码令牌
export const verifyResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// 生成JWT令牌
export const generateToken = (payload, expiresIn = '1d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};
