import React from 'react';
import { useLanguage, Language } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center bg-rose-50/80 p-1 rounded-full border border-pink-200/80 shadow-2xs ${className}`}>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setLanguage('sq')}
          aria-label="Kthe në gjuhën shqipe"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
            language === 'sq'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs scale-102'
              : 'text-stone-600 hover:text-pink-600 hover:bg-white/60'
          }`}
        >
          <span className="text-sm">🇦🇱</span>
          <span>SQ</span>
        </button>

        <button
          type="button"
          onClick={() => setLanguage('de')}
          aria-label="Auf Deutsch umstellen"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
            language === 'de'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs scale-102'
              : 'text-stone-600 hover:text-pink-600 hover:bg-white/60'
          }`}
        >
          <span className="text-sm">🇩🇪</span>
          <span>DE</span>
        </button>
      </div>
    </div>
  );
};
