'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Calendar, Plus, Trash2, Check, Circle, Target, TrendingUp, Play } from 'lucide-react';
import Link from 'next/link';

export default function DailyPlanPage() {
  const { tasks, addTask, removeTask, toggleTask, updateTaskPriority } = useStore();
  const [newTask, setNewTask] = useState({ title: '', description: '', type: 'activity' as const, priority: 'medium' as const });

  const handleAddTask = () => {
    if (newTask.title) {
      addTask({
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        type: newTask.type,
        priority: newTask.priority,
        completed: false,
      });
      setNewTask({ title: '', description: '', type: 'activity', priority: 'medium' });
    }
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  const recommendations = [
    { title: 'Memory Practice', description: 'A gentle card matching exercise', type: 'learning' as const, href: '/learning-hub/1', priority: 'medium' as const },
    { title: 'Focus Training', description: 'A short attention exercise', type: 'learning' as const, href: '/learning-hub/3', priority: 'low' as const },
    { title: 'Reading Exercise', description: 'Read and answer one question', type: 'learning' as const, href: '/learning-hub/4', priority: 'medium' as const },
    { title: 'Cognitive Game', description: 'Play a reaction-time game', type: 'game' as const, href: '/games/4', priority: 'low' as const },
  ];

  const addRecommendation = (recommendation: typeof recommendations[number]) => addTask({ id: `${Date.now()}-${recommendation.title}`, title: recommendation.title, description: recommendation.description, type: recommendation.type, priority: recommendation.priority, completed: false });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-error/10 text-error';
      case 'medium':
        return 'bg-warning/10 text-warning';
      case 'low':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Daily Plan</h1>
        <p className="text-muted-foreground">Organize your daily activities and track your progress</p>
      </div>

      <section>
        <div className="mb-3 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /><h2 className="text-xl font-bold text-foreground">Recommended Activities for Today</h2></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{recommendations.map((recommendation) => <div key={recommendation.title} className="rounded-xl border border-border bg-card p-5 shadow-sm"><h3 className="font-semibold text-foreground">{recommendation.title}</h3><p className="mt-1 text-sm text-muted-foreground">{recommendation.description}</p><p className="mt-3 text-xs font-semibold uppercase text-muted-foreground">{recommendation.priority} priority · 10 min</p><button onClick={() => addRecommendation(recommendation)} className="mt-4 w-full rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10">Add to Plan</button></div>)}</div>
      </section>

      {/* Progress Summary */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Today's Progress</h3>
              <p className="text-sm text-muted-foreground">{completedTasks} of {tasks.length} tasks completed</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">{progressPercentage.toFixed(0)}%</p>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className="bg-linear-to-r from-primary to-accent h-3 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Add Task */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Add New Task</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={newTask.type}
            onChange={(e) => setNewTask({ ...newTask, type: e.target.value as any })}
            className="rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="activity">Activity</option>
            <option value="game">Game</option>
            <option value="learning">Learning</option>
            <option value="reminder">Reminder</option>
          </select>
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
            className="rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <button
            onClick={handleAddTask}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors md:col-span-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tasks for today. Add your first task above.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Target className="h-4 w-4" />
              <span>Pending Tasks</span>
            </div>
            {tasks.filter((t) => !t.completed).map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-border hover:border-primary transition-colors"
                    >
                      <Circle className="h-4 w-4" />
                    </button>
                    <div>
                      <h4 className="font-semibold text-foreground">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-error/10 hover:text-error transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 flex gap-2"><Link href={task.type === 'game' ? '/games/4' : '/learning-hub/1'} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"><Play className="h-4 w-4" />Start</Link><button onClick={() => toggleTask(task.id)} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground">Mark Complete</button></div>
                </div>
              </div>
            ))}

            {tasks.filter((t) => t.completed).length > 0 && (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 mt-6">
                  <Check className="h-4 w-4 text-success" />
                  <span>Completed Tasks</span>
                </div>
                {tasks.filter((t) => t.completed).map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl border border-border bg-card p-4 shadow-sm opacity-60"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-white">
                          <Check className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground line-through">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground line-through">{task.description}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeTask(task.id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-error/10 hover:text-error transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
