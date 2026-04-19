const { v4: uuidv4 } = require('uuid');

const tasks = new Map();
const STATUSES = ['pending', 'in-progress', 'completed', 'cancelled'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];

class Task {
  constructor({ title, description, status, priority, dueDate, userId, tags }) {
    this.id = uuidv4();
    this.title = title;
    this.description = description || '';
    this.status = status || 'pending';
    this.priority = priority || 'medium';
    this.dueDate = dueDate || null;
    this.userId = userId;
    this.tags = tags || [];
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static create(data) {
    const task = new Task(data);
    tasks.set(task.id, task);
    return task;
  }

  static findById(id) { return tasks.get(id) || null; }

  static findByUserId(userId, filters = {}) {
    let result = [...tasks.values()].filter(t => t.userId === userId);
    if (filters.status) result = result.filter(t => t.status === filters.status);
    if (filters.priority) result = result.filter(t => t.priority === filters.priority);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s));
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static update(id, userId, updates) {
    const task = Task.findById(id);
    if (!task) { const e = new Error('Task not found'); e.status = 404; throw e; }
    if (task.userId !== userId) { const e = new Error('Forbidden'); e.status = 403; throw e; }
    ['title', 'description', 'status', 'priority', 'dueDate', 'tags'].forEach(k => {
      if (updates[k] !== undefined) task[k] = updates[k];
    });
    task.updatedAt = new Date().toISOString();
    tasks.set(id, task);
    return task;
  }

  static delete(id, userId) {
    const task = Task.findById(id);
    if (!task) { const e = new Error('Task not found'); e.status = 404; throw e; }
    if (task.userId !== userId) { const e = new Error('Forbidden'); e.status = 403; throw e; }
    tasks.delete(id);
    return true;
  }

  static getStats(userId) {
    const all = Task.findByUserId(userId);
    return {
      total: all.length,
      byStatus: STATUSES.reduce((a, s) => ({ ...a, [s]: all.filter(t => t.status === s).length }), {}),
      byPriority: PRIORITIES.reduce((a, p) => ({ ...a, [p]: all.filter(t => t.priority === p).length }), {})
    };
  }

  static _clear() { tasks.clear(); }
}

module.exports = Task;
