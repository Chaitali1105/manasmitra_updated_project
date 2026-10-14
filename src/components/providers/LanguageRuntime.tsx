'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { getPhraseMap } from '@/utils/translations';

const originalTextByNode = new WeakMap<Text, string>();

export default function LanguageRuntime() {
  const language = useStore((state) => state.language);

  useEffect(() => {
    const root = document.body;
    const phraseMap = getPhraseMap(language);
    let translating = false;

    const translate = () => {
      if (translating) return;
      translating = true;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const textNode = node as Text;
        const parent = textNode.parentElement;
        if (!parent || ['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA', 'OPTION'].includes(parent.tagName)) continue;

        const current = textNode.textContent || '';
        const trimmed = current.trim();
        if (!trimmed) continue;

        const source = originalTextByNode.get(textNode) || trimmed;
        originalTextByNode.set(textNode, source);

        const translated = phraseMap[source];
        if (translated && trimmed !== translated) {
          textNode.textContent = current.replace(trimmed, translated);
        }
      }
      translating = false;
    };

    document.documentElement.lang = language;
    translate();
    const observer = new MutationObserver(translate);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);

  return null;
}