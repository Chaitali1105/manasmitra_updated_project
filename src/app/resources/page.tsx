'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Library, Search, Filter, Bookmark, Heart, Clock, BookOpen, Lightbulb, Target, Puzzle } from 'lucide-react';

export default function ResourcesPage() {
  const { resources, toggleBookmark, updateResourceViewed } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  const categories = ['All', 'Memory', 'Focus', 'Reading', 'Vocabulary', 'General'];
  const types = ['All', 'article', 'guide', 'exercise', 'tip'];

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesType = selectedType === 'All' || resource.type === selectedType;
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Lightbulb':
        return <Lightbulb className="h-5 w-5" />;
      case 'Target':
        return <Target className="h-5 w-5" />;
      case 'BookOpen':
        return <BookOpen className="h-5 w-5" />;
      case 'Library':
        return <Library className="h-5 w-5" />;
      case 'Puzzle':
        return <Puzzle className="h-5 w-5" />;
      case 'Calendar':
        return <Clock className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const handleResourceClick = (resourceId: string) => {
    updateResourceViewed(resourceId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Resources</h1>
        <p className="text-muted-foreground">Educational materials, tips, and guides for cognitive improvement</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookmarked Resources */}
      {resources.some((r) => r.bookmarked) && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-error" />
            Bookmarked
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources
              .filter((r) => r.bookmarked)
              .map((resource) => (
                <div
                  key={resource.id}
                  onClick={() => handleResourceClick(resource.id)}
                  className="cursor-pointer rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {getIcon(resource.icon)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(resource.id);
                      }}
                      className="rounded-lg p-2 text-error hover:bg-error/10 transition-colors"
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                      {resource.category}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                      {resource.type}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* All Resources */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">All Resources</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              onClick={() => handleResourceClick(resource.id)}
              className="cursor-pointer rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {getIcon(resource.icon)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(resource.id);
                  }}
                  className={`rounded-lg p-2 transition-colors ${
                    resource.bookmarked
                      ? 'text-error hover:bg-error/10'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${resource.bookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{resource.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                  {resource.category}
                </span>
                <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                  {resource.type}
                </span>
              </div>
              {resource.lastViewed && (
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Viewed {new Date(resource.lastViewed).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Library className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No resources found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
