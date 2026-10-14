'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { BookOpen, Brain, Clock, Target, Search, Filter } from 'lucide-react';
import { ActivityCategory, Difficulty } from '@/types';
import Link from 'next/link';

export default function LearningHubPage() {
  const { activities } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories: (ActivityCategory | 'All')[] = ['All', 'Memory', 'Focus', 'Reading', 'Vocabulary', 'ProblemSolving'];
  const difficulties: (Difficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredActivities = activities.filter((activity) => {
    const matchesCategory = selectedCategory === 'All' || activity.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || activity.difficulty === selectedDifficulty;
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case 'Memory':
        return <Brain className="h-5 w-5" />;
      case 'Focus':
        return <Target className="h-5 w-5" />;
      case 'Reading':
        return <BookOpen className="h-5 w-5" />;
      case 'Vocabulary':
        return <BookOpen className="h-5 w-5" />;
      case 'ProblemSolving':
        return <Target className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Learning Hub</h1>
        <p className="text-muted-foreground">Explore educational activities to enhance cognitive skills</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ActivityCategory | 'All')}
            className="rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'All')}
            className="rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {getCategoryIcon(activity.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{activity.title}</h3>
                  <span className="text-xs text-muted-foreground">{activity.category}</span>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  activity.difficulty === 'Easy'
                    ? 'bg-success/10 text-success'
                    : activity.difficulty === 'Medium'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-error/10 text-error'
                }`}
              >
                {activity.difficulty}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{activity.description}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{activity.duration} min</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{activity.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${activity.progress}%` }}
                />
              </div>
            </div>

            {activity.completed ? (
              <div className="text-center text-sm font-semibold text-success">Completed ✓</div>
            ) : (
              <Link
                href={`/learning-hub/${activity.id}`}
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Start Learning
              </Link>
            )}
          </div>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No activities found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
