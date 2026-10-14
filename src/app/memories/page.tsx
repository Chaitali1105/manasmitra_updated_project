'use client';

import { useState } from 'react';
import { Brain, Plus, Search, Heart, Calendar } from 'lucide-react';

export default function MemoriesPage() {
  const [memories, setMemories] = useState([
    { id: '1', title: 'Childhood Home', description: 'Our house in the village', date: '2024-01-15', favorite: true },
    { id: '2', title: 'First School', description: 'St. Mary\'s School memories', date: '2024-02-20', favorite: false },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredMemories = memories.filter((memory) =>
    memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Memories</h1>
        <p className="text-muted-foreground">Store and revisit your precious memories</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          Add Memory
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMemories.map((memory) => (
          <div
            key={memory.id}
            className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{memory.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{memory.date}</span>
                  </div>
                </div>
              </div>
              {memory.favorite && (
                <Heart className="h-5 w-5 text-error fill-current" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{memory.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
