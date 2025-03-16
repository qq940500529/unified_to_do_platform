import { query } from '../database/db.js';

class Todo {
  constructor({
    id,
    title,
    description,
    status,
    priority,
    due_date,
    assignee,
    user_id,
    system_source,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.due_date = due_date;
    this.assignee = assignee;
    this.user_id = user_id;
    this.system_source = system_source;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // 创建待办事项
  static async create({
    title,
    description,
    priority = 'medium',
    due_date,
    assignee,
    user_id,
    system_source
  }) {
    const sql = `
      INSERT INTO todos 
      (title, description, status, priority, due_date, assignee, user_id, system_source)
      VALUES (?, ?, 'pending', ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      title,
      description,
      priority,
      due_date,
      assignee,
      user_id,
      system_source
    ]);
    return new Todo({
      id: result.insertId,
      title,
      description,
      status: 'pending',
      priority,
      due_date,
      assignee,
      user_id,
      system_source
    });
  }

  // 更新待办事项
  async update(updates) {
    const allowedUpdates = [
      'title',
      'description',
      'status',
      'priority',
      'due_date',
      'assignee',
      'system_source'
    ];
    const updatesToApply = Object.keys(updates).filter(key =>
      allowedUpdates.includes(key)
    );

    if (updatesToApply.length === 0) {
      throw new Error('没有有效的更新字段');
    }

    const setClause = updatesToApply
      .map(key => `${key} = ?`)
      .join(', ');

    const values = updatesToApply.map(key => updates[key]);
    values.push(this.id);

    const sql = `
      UPDATE todos
      SET ${setClause}
      WHERE id = ?
    `;

    await query(sql, values);
    return this;
  }

  // 删除待办事项
  async delete() {
    const sql = 'DELETE FROM todos WHERE id = ?';
    await query(sql, [this.id]);
  }

  // 获取用户的所有待办事项
  static async findByUser(userId) {
    const sql = `
      SELECT * FROM todos 
      WHERE user_id = ? OR assignee = ?
      ORDER BY due_date ASC
    `;
    const rows = await query(sql, [userId, userId]);
    return rows.map(row => new Todo(row));
  }

  // 通过ID查找待办事项
  static async findById(id) {
    const sql = 'SELECT * FROM todos WHERE id = ?';
    const rows = await query(sql, [id]);
    if (rows.length === 0) return null;
    return new Todo(rows[0]);
  }

  // 获取系统来源待办事项
  static async findBySystemSource(systemSource) {
    const sql = `
      SELECT * FROM todos 
      WHERE system_source = ?
      ORDER BY due_date ASC
    `;
    const rows = await query(sql, [systemSource]);
    return rows.map(row => new Todo(row));
  }

  // 转换为JSON
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      due_date: this.due_date,
      assignee: this.assignee,
      user_id: this.user_id,
      system_source: this.system_source,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

export default Todo;
