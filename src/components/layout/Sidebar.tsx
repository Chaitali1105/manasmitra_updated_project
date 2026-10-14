'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  Gamepad2,
  Zap,
  Calendar,
  TrendingUp,
  BarChart3,
  Trophy,
  FileText,
  Brain,
  Bell,
  User,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronRight,
  Users,
  MessageSquare,
  Library,
  ClipboardCheck,
  LogOut,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import BrandMark from '@/components/ui/BrandMark';
import { translations } from '@/utils/translations';

const navigationGroups = [
  {
    title: 'Main',
    items: [
      { name: 'Home', href: '/', icon: Home },
      { name: 'Learning Hub', href: '/learning', icon: BookOpen },
      { name: 'Games', href: '/games', icon: Gamepad2 },
      { name: 'Daily Challenge', href: '/daily-challenge', icon: Zap },
      { name: 'Daily Plan', href: '/daily-plan', icon: Calendar },
    ],
  },
  {
    title: 'Progress',
    items: [
      { name: 'Progress', href: '/progress', icon: TrendingUp },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Achievements', href: '/achievements', icon: Trophy },
      { name: 'Reports', href: '/reports', icon: FileText },
    ],
  },
  {
    title: 'Personal',
    items: [
      { name: 'Memories', href: '/memories', icon: Brain },
      { name: 'Reminders', href: '/reminders', icon: Bell },
      { name: 'Notifications', href: '/notifications', icon: Bell },
      { name: 'Profile', href: '/profile', icon: User },
    ],
  },
  {
    title: 'Support & Learning',
    items: [
      { name: 'Assessment', href: '/assessment', icon: ClipboardCheck },
      { name: 'Resources', href: '/resources', icon: Library },
      { name: 'AI Assistant', href: '/ai-assistant', icon: MessageSquare },
      { name: 'Family Dashboard', href: '/family-dashboard', icon: Users },
      { name: 'Help', href: '/help', icon: HelpCircle },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Main', 'Progress']);
  const { getUnreadCount, user, logout, language } = useStore();
  const text = translations[language];
  const translatedName = (name: string) => name === 'Home' ? text.home || name : name === 'Learning Hub' ? text.learning || name : name === 'Games' ? text.games : name === 'Daily Challenge' ? text.dailyChallenge : name === 'AI Assistant' ? text.aiAssistant : name === 'Settings' ? text.settings : name;
  const unreadCount = getUnreadCount();

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card transition-all duration-300 lg:translate-x-0 -translate-x-full">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-border px-6">
            <BrandMark compact />
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {navigationGroups.map((group) => (
            <div key={group.title} className="mb-4">
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted"
              >
                <span>{group.title}</span>
                {expandedGroups.includes(group.title) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {expandedGroups.includes(group.title) && (
                <div className="mt-2 space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    const showBadge = item.name === 'Notifications' && unreadCount > 0;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="flex-1">{translatedName(item.name)}</span>
                        {showBadge && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error text-xs text-white">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{user?.name || 'User'}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
            </div>
            <button onClick={() => { if (window.confirm('Are you sure you want to logout?')) logout(); }} aria-label={text.logout} title={text.logout} className="rounded-lg p-2 text-muted-foreground hover:bg-error/10 hover:text-error">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
