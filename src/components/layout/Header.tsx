'use client';

import { Sun, Moon, Menu, Mic, MicOff, MessageSquare } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { speak } from '@/utils/voice';
import { translations } from '@/utils/translations';
import { languageOptions } from '@/utils/translations';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggleTheme, voiceEnabled, voiceVolume, setVoiceEnabled, language, setLanguage } = useStore();
  const text = translations[language];

  const toggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    speak(next ? text.voiceOn : text.voiceOff, next, voiceVolume);
  };

  return (
    <header className="fixed right-0 top-0 z-30 h-16 border-b border-border bg-card lg:left-64">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-foreground hover:bg-muted"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex-1 lg:hidden" />

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
          <button onClick={toggleVoice} className={`relative rounded-lg p-2 transition-colors ${voiceEnabled ? 'bg-success/10 text-success' : 'text-foreground hover:bg-muted'}`} aria-label={voiceEnabled ? text.voiceOn : text.voiceOff} title={voiceEnabled ? text.voiceOn : text.voiceOff}>
            {voiceEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            {voiceEnabled && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-success" />}
          </button>
          <Link href="/ai-assistant" className="rounded-lg p-2 text-foreground hover:bg-muted" aria-label={text.aiAssistant} title={text.aiAssistant}>
            <MessageSquare className="h-5 w-5" />
          </Link>
          <label className="sr-only" htmlFor="header-language">Language</label>
          <select id="header-language" value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} className="max-w-28 rounded-lg border border-border bg-background px-2 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Select language">
            {languageOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
      </div>
    </header>
  );
}
