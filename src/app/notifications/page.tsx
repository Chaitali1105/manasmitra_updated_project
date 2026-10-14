'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Bell, Check, CheckCircle, Trash2, Award, Zap, Calendar, TrendingUp, Filter } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, getUnreadCount } =
    useStore();
  const [filter, setFilter] = useState<'all' | 'unread' | 'achievements' | 'reminders'>('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Award className="h-5 w-5 text-warning" />;
      case 'daily-challenge':
        return <Zap className="h-5 w-5 text-primary" />;
      case 'reminder':
        return <Calendar className="h-5 w-5 text-accent" />;
      case 'progress':
        return <TrendingUp className="h-5 w-5 text-success" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'achievements') return notification.type === 'achievement';
    if (filter === 'reminders') return notification.type === 'reminder';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your progress and achievements</p>
        </div>
        {getUnreadCount() > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-2">
          {(['all', 'unread', 'achievements', 'reminders'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filter === filterType
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === 'unread' && ` (${getUnreadCount()})`}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications found.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl border border-border bg-card p-4 shadow-sm ${
                !notification.read ? 'border-l-4 border-l-primary' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <button
                          onClick={() => markNotificationRead(notification.id)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-success/10 hover:text-success transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-error/10 hover:text-error transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
