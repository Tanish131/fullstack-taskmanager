import React from 'react';

const priorityColors = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444', critical: '#7c3aed' };
const statusColors = { pending: '#6b7280', 'in-progress': '#3b82f6', completed: '#22c55e', cancelled: '#ef4444' };

export default function TaskCard({ task, onEdit, onDelete }) {
  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : null;

  return (
    <div className="task-card" data-testid="task-card">
      <div className="task-card-header">
        <span className="task-badge" style={{ backgroundColor: priorityColors[task.priority] || '#6b7280' }}>
          {task.priority}
        </span>
        <span className="task-badge task-badge-outline" style={{ color: statusColors[task.status], borderColor: statusColors[task.status] }}>
          {task.status}
        </span>
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.dueDate && (
        <p className="task-due">Due: {formatDate(task.dueDate)}</p>
      )}

      {task.tags && task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
        </div>
      )}

      <div className="task-card-footer">
        <span className="task-created">Created {formatDate(task.createdAt)}</span>
        <div className="task-actions">
          <button className="btn btn-sm btn-outline" onClick={() => onEdit(task)}>Edit</button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
