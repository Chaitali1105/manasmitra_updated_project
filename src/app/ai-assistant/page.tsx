'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { MessageSquare, Send, Sparkles, Trash2, User, Bot } from 'lucide-react';
import { mockSuggestedPrompts } from '@/data/mockData';
import { getSupportLevelLabel, translateText } from '@/utils/translations';

export default function AIAssistantPage() {
  const { chatMessages, addChatMessage, clearChat, assessmentResult, progress, language } = useStore();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = (key: string, fallback: string) => translateText(language, key, fallback);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    });

    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const levelAdvice = assessmentResult
        ? `Your current ${getSupportLevelLabel(language, assessmentResult.level).toLowerCase()} plan starts with short, comfortable sessions. `
        : 'Start with a short, comfortable session and take breaks whenever you need them. ';
      const responses = [
        `${levelAdvice}Try a memory exercise for five minutes, then tell me how it felt.`,
        `${levelAdvice}Your current tracked accuracy is ${progress.accuracy}%. I recommend a focus activity next and celebrating steady effort rather than speed.`,
        `${levelAdvice}I can help you build a simple daily plan: one memory activity, one focus activity, and a quiet break.`,
        `${levelAdvice}Regular gentle practice can support memory and focus. If anything feels difficult, reduce the difficulty and ask a caregiver or clinician for support.`,
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      });

      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('aiAssistant', 'AI Assistant')}</h1>
        <p className="text-muted-foreground">{t('assistantDescription', 'Get personalized guidance based on your assessment and progress')}</p>
      </div>

      {assessmentResult && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-primary">{getSupportLevelLabel(language, assessmentResult.level)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('gamesAdaptToLevel', 'Games are adjusted to begin at a comfortable challenge level.')}</p>
        </div>
      )}

      {/* Chat Container */}
      <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col h-[600px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t('assistantWelcome', 'How can I help you today?')}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t('assistantPromptHint', 'Ask me about exercises, routines, or your progress')}</p>
              
              <div className="grid gap-2 w-full max-w-md">
                {mockSuggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground hover:bg-muted/80 transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start gap-3 max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-accent-foreground'
                      }`}
                    >
                      {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl bg-muted px-4 py-3">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={t('assistantPlaceholder', 'Type your message...')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
            <button
              onClick={clearChat}
              className="rounded-lg border border-border px-4 py-2 text-foreground hover:bg-muted transition-colors"
              title={t('clearChat', 'Clear chat')}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          <strong>{t('note', 'Note')}:</strong> {t('assistantNote', 'This assistant provides wellness guidance, not medical advice.')}
        </p>
      </div>
    </div>
  );
}
