import React from 'react';

export default function StatsBar({ stats }) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-number">{stats.total}</span>
        <span className="stat-label">Total Tasks</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{stats.byStatus?.pending || 0}</span>
        <span className="stat-label">Pending</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{stats.byStatus?.['in-progress'] || 0}</span>
        <span className="stat-label">In Progress</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{stats.byStatus?.completed || 0}</span>
        <span className="stat-label">Completed</span>
      </div>
      <div className="stat-card stat-card-highlight">
        <span className="stat-number">{stats.byPriority?.critical || 0}</span>
        <span className="stat-label">Critical</span>
      </div>
    </div>
  );
}
