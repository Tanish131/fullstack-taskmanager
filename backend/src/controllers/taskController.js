const { validationResult } = require('express-validator');
const Task = require('../models/Task');

const createTask = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const task = Task.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ task });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const getTasks = (req, res) => {
  const { status, priority, search, page = 1, limit = 10 } = req.query;
  const all = Task.findByUserId(req.user.id, { status, priority, search });
  const start = (page - 1) * limit;
  res.json({
    tasks: all.slice(start, start + parseInt(limit)),
    pagination: { total: all.length, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(all.length / limit) }
  });
};

const getTaskById = (req, res) => {
  const task = Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (task.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  res.json({ task });
};

const updateTask = (req, res) => {
  try {
    const task = Task.update(req.params.id, req.user.id, req.body);
    res.json({ task });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const deleteTask = (req, res) => {
  try {
    Task.delete(req.params.id, req.user.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const getStats = (req, res) => res.json({ stats: Task.getStats(req.user.id) });

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, getStats };
