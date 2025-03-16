import User from '../models/User.js';
import { generateToken } from '../utils/auth.js';
import { sendResetPasswordEmail } from '../utils/email.js';

class AuthController {
  // 用户注册
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // 检查用户名是否已存在
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: '用户名已存在' });
      }

      // 创建新用户
      const user = await User.create({ username, email, password });

      // 生成JWT
      const token = user.generateAuthToken();

      res.status(201).json({
        user: user.toJSON(),
        token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 用户登录
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // 查找用户
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: '用户名或密码错误' });
      }

      // 验证密码
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: '用户名或密码错误' });
      }

      // 生成JWT
      const token = user.generateAuthToken();

      res.json({
        user: user.toJSON(),
        token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 获取当前用户信息
  static async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: '用户未找到' });
      }
      res.json(user.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 更新用户信息
  static async updateUser(req, res) {
    try {
      const updates = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: '用户未找到' });
      }

      const updatedUser = await user.update(updates);
      res.json(updatedUser.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 请求重置密码
  static async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      // 查找用户
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: '未找到该邮箱的用户' });
      }

      // 生成重置令牌
      const resetToken = generateResetToken(user.id);

      // 发送重置密码邮件
      await sendResetPasswordEmail(user.email, resetToken);

      res.json({ message: '重置密码邮件已发送' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 重置密码
  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      // 验证重置令牌
      const userId = verifyResetToken(token);
      if (!userId) {
        return res.status(400).json({ error: '无效或过期的重置令牌' });
      }

      // 更新密码
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: '用户未找到' });
      }

      await user.update({ password: newPassword });

      res.json({ message: '密码重置成功' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default AuthController;
