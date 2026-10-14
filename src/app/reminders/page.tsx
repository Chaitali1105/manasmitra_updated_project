'use client';

import { useState } from 'react';
import { Bell, Plus, Clock, Check, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function RemindersPage() {
  const { reminders, addReminder, removeReminder, toggleReminder } = useStore();
  const [newReminder, setNewReminder] = useState({ title: '', description: '', time: '' });

  const handleAddReminder = () => {
    if (newReminder.title && newReminder.time) {
      addReminder({
        id: Date.now().toString(),
        title: newReminder.title,
        description: newReminder.description,
        time: new Date(newReminder.time),
        completed: false,
      });
      setNewReminder({ title: '', description: '', time: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Reminders</h1>
        <p className="text-muted-foreground">Set reminders for important tasks and activities</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Add New Reminder</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Reminder title"
            value={newReminder.title}
            onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
            className="rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="datetime-local"
            value={newReminder.time}
            onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
            className="rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newReminder.description}
            onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
            className="rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
          />
          <button
            onClick={handleAddReminder}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors md:col-span-2"
          >
            <Plus className="h-4 w-4" />
            Add Reminder
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No reminders yet. Add your first reminder above.</p>
          </div>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`rounded-xl border border-border bg-card p-4 shadow-sm ${
                reminder.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleReminder(reminder.id)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                      reminder.completed
                        ? 'border-success bg-success text-white'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {reminder.completed && <Check className="h-4 w-4" />}
                  </button>
                  <div>
                    <h4 className={`font-semibold ${reminder.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {reminder.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(reminder.time).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeReminder(reminder.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-error/10 hover:text-error transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
