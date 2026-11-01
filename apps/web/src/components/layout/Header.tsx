import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { Logo } from '../brand/Logo';
import { Menu, X } from 'lucide-react';

export function Header() {
  const { lang, setLang, t } = useI18n();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/thinkers', label: t('nav.thinkers') },
  ];

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-parchment-dark)] bg-[var(--color-parchment)]/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[var(--color-ink)] group"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors">
            <Logo size={26} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif font-semibold text-[1.35rem] tracking-tight">OpenCouncil</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                isActive(item.to)
                  ? 'bg-[var(--color-gold)]/12 text-[var(--color-gold)] font-medium'
                  : 'text-[var(--color-ink-light)] hover:text-[var(--color-ink)]'
              }`}
            >
              {item.label}
            </Link>
          ))}

          <button
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="ml-2 text-xs px-2.5 py-1.5 rounded-full border border-[var(--color-parchment-dark)] text-[var(--color-ink-light)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
          >
            {lang === 'en' ? '中文' : 'EN'}
          </button>
        </nav>

        {/* Mobile */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="text-xs px-2.5 py-1.5 rounded-full border border-[var(--color-parchment-dark)] text-[var(--color-ink-light)]"
          >
            {lang === 'en' ? '中文' : 'EN'}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-[var(--color-ink-light)] hover:text-[var(--color-ink)]"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[var(--color-parchment-dark)] bg-[var(--color-parchment)]/95 backdrop-blur-md">
          <nav className="flex flex-col py-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={`px-6 py-3 text-sm transition-colors ${
                  isActive(item.to)
                    ? 'text-[var(--color-gold)] font-medium'
                    : 'text-[var(--color-ink-light)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
