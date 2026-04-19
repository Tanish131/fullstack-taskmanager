import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from '../src/components/TaskCard';
import StatsBar from '../src/components/StatsBar';

const mockTask = {
  id: '123',
  title: 'Build Jenkins Pipeline',
  description: 'Set up all 7 stages',
  status: 'in-progress',
  priority: 'high',
  tags: ['devops', 'jenkins'],
  createdAt: '2024-01-01T00:00:00.000Z',
  dueDate: '2024-12-31T00:00:00.000Z'
};

describe('TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={mockTask} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('Build Jenkins Pipeline')).toBeInTheDocument();
  });

  it('renders task description', () => {
    render(<TaskCard task={mockTask} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('Set up all 7 stages')).toBeInTheDocument();
  });

  it('renders priority and status badges', () => {
    render(<TaskCard task={mockTask} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('in-progress')).toBeInTheDocument();
  });

  it('renders tags', () => {
    render(<TaskCard task={mockTask} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('devops')).toBeInTheDocument();
    expect(screen.getByText('jenkins')).toBeInTheDocument();
  });

  it('calls onEdit when Edit clicked', () => {
    const onEdit = jest.fn();
    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={jest.fn()} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when Delete clicked', () => {
    const onDelete = jest.fn();
    window.confirm = jest.fn(() => true);
    render(<TaskCard task={mockTask} onEdit={jest.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith(mockTask.id);
  });
});

describe('StatsBar', () => {
  const stats = {
    total: 10,
    byStatus: { pending: 3, 'in-progress': 4, completed: 2, cancelled: 1 },
    byPriority: { low: 2, medium: 3, high: 4, critical: 1 }
  };

  it('renders total tasks', () => {
    render(<StatsBar stats={stats} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
  });

  it('renders status counts', () => {
    render(<StatsBar stats={stats} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders critical count', () => {
    render(<StatsBar stats={stats} />);
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });
});
