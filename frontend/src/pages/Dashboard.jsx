import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import StatsBar from '../components/StatsBar';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      const res = await taskService.getAll(params);
      setTasks(res.data.tasks);
    } catch {
      setError('Failed to load tasks');
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await taskService.getStats();
      setStats(res.data.stats);
    } catch {
      // stats are optional
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTasks(), fetchStats()]).finally(() => setLoading(false));
  }, [fetchTasks, fetchStats]);

  const handleCreate = () => { setEditingTask(null); setShowModal(true); };
  const handleEdit = (task) => { setEditingTask(task); setShowModal(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      fetchStats();
    } catch {
      setError('Failed to delete task');
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingTask) {
        const res = await taskService.update(editingTask.id, data);
        setTasks(prev => prev.map(t => t.id === editingTask.id ? res.data.task : t));
      } else {
        const res = await taskService.create(data);
        setTasks(prev => [res.data.task, ...prev]);
      }
      setShowModal(false);
      fetchStats();
    } catch (err) {
      throw err;
    }
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">📋 TaskManager</div>
        <div className="navbar-right">
          <span className="navbar-user">Hello, {user?.name}</span>
          <button className="btn btn-outline" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-body">
        {/* Stats */}
        {stats && <StatsBar stats={stats} />}

        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar-filters">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search tasks..."
              className="filter-input"
            />
            <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select name="priority" value={filters.priority} onChange={handleFilterChange} className="filter-select">
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>+ New Task</button>
        </div>

        {/* Error */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Task List */}
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found.</p>
            <button className="btn btn-primary" onClick={handleCreate}>Create your first task</button>
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
