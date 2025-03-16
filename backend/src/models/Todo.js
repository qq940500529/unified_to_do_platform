import { query } from '../database/db.js';

class Todo {
  constructor({
    id,
    title,
    description,
    status,
    priority,
    due_date,
    assigned_to,
    created_by,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.due_date = due_date;
    this.assigned_to = assigned_to;
    this.created_by = created_by;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // 创建待办事项
  static async create({
    title,
    description,
    priority = 'medium',
    due_date,
    assigned_to,
    created_by
  }) {
    const sql = `
      INSERT INTO todos 
      (title, description, status, priority, due_date, assigned_to, created_by)
      VALUES (?, ?, 'pending', ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      title,
      description,
      priority,
      due_date,
      assigned_to,
      created_by
    ]);
    return new Todo({
      id: result.insertId,
      title,
      description,
      status: 'pending',
      priority,
      due_date,
      assigned_to,
      created_by
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
      'assigned_to'
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
      WHERE created_by = ? OR assigned_to = ?
      ORDER BY due_date ASC
    `;
    const rows = await query(sql, [userId, userId]);
    return rows.map(row => new Todo(row));
  }

  // 获取团队待办事项
  static async findByTeam(teamId) {
    const sql = `
      SELECT * FROM todos 
      WHERE team_id = ?
      ORDER BY due_date ASC
    `;
    const rows = await query(sql, [teamId]);
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
      assigned_to: this.assigned_to,
      created_by: this.created_by,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

export default Todo;
