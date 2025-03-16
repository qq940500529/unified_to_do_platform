import Todo from '../models/Todo.js';

class TodoController {
  // 创建待办事项
  static async createTodo(req, res) {
    try {
      const { title, description, priority, due_date, assignee, system_source } = req.body;
      const user_id = req.user.id;

      const todo = await Todo.create({
        title,
        description,
        priority,
        due_date,
        assignee,
        user_id,
        system_source: system_source || '统一待办平台'
      });

      res.status(201).json(todo.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 获取用户待办事项列表
  static async getTodos(req, res) {
    try {
      const todos = await Todo.findByUser(req.user.id);
      res.json(todos.map(todo => todo.toJSON()));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 获取单个待办事项详情
  static async getTodo(req, res) {
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ error: '待办事项未找到' });
      }

      // 检查权限
      if (
        todo.user_id !== req.user.id &&
        todo.assignee !== req.user.username
      ) {
        return res.status(403).json({ error: '无权访问此待办事项' });
      }

      res.json(todo.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 更新待办事项
  static async updateTodo(req, res) {
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ error: '待办事项未找到' });
      }

      // 检查权限
      if (todo.user_id !== req.user.id) {
        return res.status(403).json({ error: '无权修改此待办事项' });
      }

      const updatedTodo = await todo.update(req.body);
      res.json(updatedTodo.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 删除待办事项
  static async deleteTodo(req, res) {
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ error: '待办事项未找到' });
      }

      // 检查权限
      if (todo.user_id !== req.user.id) {
        return res.status(403).json({ error: '无权删除此待办事项' });
      }

      await todo.delete();
      res.json({ message: '待办事项已删除' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 更改待办事项状态
  static async changeTodoStatus(req, res) {
    try {
      const { status } = req.body;
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ error: '待办事项未找到' });
      }

      // 检查权限
      if (
        todo.user_id !== req.user.id &&
        todo.assignee !== req.user.username
      ) {
        return res.status(403).json({ error: '无权更改此待办事项状态' });
      }

      const updatedTodo = await todo.update({ status });
      res.json(updatedTodo.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default TodoController;
