import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../database/db.js';

class User {
  constructor({ id, username, email, password_hash, created_at, updated_at }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // 创建新用户
  static async create({ username, email, password }) {
    const passwordHash = await bcrypt.hash(password, 10);
    const sql = `
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `;
    const result = await query(sql, [username, email, passwordHash]);
    return new User({
      id: result.insertId,
      username,
      email,
      password_hash: passwordHash
    });
  }

  // 通过用户名查找用户
  static async findByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const rows = await query(sql, [username]);
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  // 通过ID查找用户
  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const rows = await query(sql, [id]);
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  // 验证密码
  async validatePassword(password) {
    return await bcrypt.compare(password, this.password_hash);
  }

  // 生成JWT
  generateAuthToken() {
    return jwt.sign(
      { id: this.id, username: this.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  // 更新用户信息
  async update(updates) {
    const allowedUpdates = ['username', 'email', 'password'];
    const updatesToApply = Object.keys(updates).filter(key =>
      allowedUpdates.includes(key)
    );

    if (updatesToApply.includes('password')) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const setClause = updatesToApply
      .map(key => `${key} = ?`)
      .join(', ');

    const values = updatesToApply.map(key => updates[key]);
    values.push(this.id);

    const sql = `
      UPDATE users
      SET ${setClause}
      WHERE id = ?
    `;

    await query(sql, values);
    return this;
  }

  // 删除用户
  async delete() {
    const sql = 'DELETE FROM users WHERE id = ?';
    await query(sql, [this.id]);
  }

  // 转换为JSON
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

export default User;
