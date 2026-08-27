import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: React.ReactNode;
}

// Crisp Vector SVG Flags
export const ArgentinaFlag: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg viewBox="0 0 768 480" className={`${className} rounded-xs shadow-xs shrink-0 inline-block overflow-hidden`}>
    <path fill="#74acdf" d="M0 0h768v480H0z" />
    <path fill="#fff" d="M0 160h768v160H0z" />
    {/* Sun of May */}
    <g transform="translate(384,240) scale(1.1)">
      <circle r="36" fill="#f6b40e" stroke="#853406" strokeWidth="2" />
      <circle r="33" fill="#f6b40e" />
      <g id="sun-rays" stroke="#853406" strokeWidth="2.5" fill="#f6b40e">
        {[...Array(16)].map((_, i) => (
          <path
            key={i}
            d="M 0,-36 L 0,-62 L 4,-44 Z"
            transform={`rotate(${i * 22.5})`}
          />
        ))}
      </g>
      <circle r="7" fill="#853406" opacity="0.3" />
    </g>
  </svg>
);

export const GreeceFlag: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg viewBox="0 0 768 512" className={`${className} rounded-xs shadow-xs shrink-0 inline-block overflow-hidden`}>
    <path fill="#0d5eaf" d="M0 0h768v512H0z" />
    {/* 9 Stripes */}
    <path fill="#fff" d="M0 56.88h768v56.88H0zm0 113.78h768v56.88H0zm0 113.78h768v56.88H0zm0 113.78h768v56.88H0z" />
    {/* Canton */}
    <path fill="#0d5eaf" d="M0 0h284.44v284.44H0z" />
    {/* Cross */}
    <path fill="#fff" d="M113.78 0h56.88v284.44h-56.88z" />
    <path fill="#fff" d="M0 113.78h284.44v56.88H0z" />
  </svg>
);

export const UkFlag: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg viewBox="0 0 60 30" className={`${className} rounded-xs shadow-xs shrink-0 inline-block overflow-hidden`}>
    <clipPath id="s">
      <path d="M0 0v30h60V0z" />
    </clipPath>
    <clipPath id="t">
      <path d="M30 15h30v15zV0zH0zV0z" />
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0 0v30h60V0z" fill="#012169" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30m0-30L0 30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

const languages: Language[] = [
  { code: 'es', name: 'Español', nativeName: 'Español (Argentina)', flag: <ArgentinaFlag /> },
  { code: 'el', name: 'Griego', nativeName: 'Ελληνικά (Grecia)', flag: <GreeceFlag /> },
  { code: 'en', name: 'Inglés', nativeName: 'English (UK / Int.)', flag: <UkFlag /> },
];

export const GoogleTranslate: React.FC<{
  variant?: 'diplomatic' | 'compact' | 'light';
  align?: 'left' | 'right';
}> = ({ variant = 'diplomatic', align = 'right' }) => {
  const [currentLang, setCurrentLang] = useState<string>('es');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check existing language cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const googtrans = getCookie('googtrans');
    if (googtrans) {
      const lang = googtrans.split('/')[2];
      if (lang && ['es', 'el', 'en'].includes(lang)) {
        setCurrentLang(lang);
      }
    } else {
      const localLang = localStorage.getItem('cicha_lang');
      if (localLang && ['es', 'el', 'en'].includes(localLang)) {
        setCurrentLang(localLang);
      }
    }

    // Load Google Translate script only once
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'es',
              includedLanguages: 'es,el,en',
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            'google_translate_element'
          );
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.async = true;
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    }

    // Close on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    localStorage.setItem('cicha_lang', langCode);
    setIsOpen(false);

    // Set cookie for Google Translate
    const domain = window.location.hostname;
    document.cookie = `googtrans=/es/${langCode}; path=/;`;
    document.cookie = `googtrans=/es/${langCode}; path=/; domain=${domain};`;
    document.cookie = `googtrans=/es/${langCode}; path=/; domain=.${domain};`;

    // Trigger select element inside google translate if present
    const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event('change'));
    } else {
      // If combo not ready or changing back to original, reload cleanly to apply
      window.location.reload();
    }
  };

  const selectedLanguage = languages.find((l) => l.code === currentLang) || languages[0];

  // Button styles based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'light':
        return 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200';
      case 'compact':
        return 'bg-white/10 hover:bg-white/20 text-white border border-white/20';
      case 'diplomatic':
      default:
        return 'bg-blue-950/80 hover:bg-blue-900 text-slate-200 hover:text-white border border-blue-800/80 shadow-xs';
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Hidden container for Google Translate Engine */}
      <div id="google_translate_element" style={{ display: 'none' }} />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${getButtonStyles()}`}
        aria-label="Seleccionar idioma / Select language / Επιλέξτε γλώσσα"
        title="Cambiar idioma del portal"
      >
        {selectedLanguage.flag}
        <span className="tracking-wide uppercase text-[11px] font-bold">
          {selectedLanguage.code}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 notranslate`}
        >
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-blue-600" />
            <span>Idioma / Language</span>
          </div>

          {languages.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 text-blue-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {lang.flag}
                  <div>
                    <div className="font-semibold text-slate-900 leading-none">{lang.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{lang.nativeName}</div>
                  </div>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
