import { useState, useEffect } from 'react';

export type Language = 'zh' | 'en' | 'ms';

export function useLanguage(): [Language, (lang: Language) => void] {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('cn_lang') as Language;
      return saved && ['zh', 'en', 'ms'].includes(saved) ? saved : 'zh';
    } catch {
      return 'zh';
    }
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try { localStorage.setItem('cn_lang', newLang); } catch {}
  };

  return [lang, setLang];
}
