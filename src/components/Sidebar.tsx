import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map as MapIcon, FileText, Settings, Database, Languages } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '../lib/LanguageContext';

const navItems = [
  { translationKey: 'nav.dashboard', path: '/', icon: LayoutDashboard },
  { translationKey: 'nav.map', path: '/map', icon: MapIcon },
  { translationKey: 'nav.data', path: '/data', icon: Database },
  { translationKey: 'nav.reports', path: '/reports', icon: FileText },
  { translationKey: 'nav.settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 min-h-screen flex flex-col hidden md:flex shrink-0">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 bg-white/5">
          <img src="/elhak_logo.png" alt="El Hak Foundation" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="font-bold text-slate-900">EF</span>'; e.currentTarget.parentElement!.classList.add('bg-emerald-500'); }} />
        </div>
        <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">EL HAK <span className="text-emerald-500">FOUNDATION</span></span>
      </div>
      
      <nav className="flex-1 py-6 flex flex-col gap-2 px-6">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 block">{t('nav.title')}</label>
        <ul className="space-y-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer border border-transparent',
                    isActive 
                      ? 'text-slate-300 bg-slate-800/50 border-slate-700' 
                      : 'text-slate-500 hover:bg-slate-800/30'
                  )}
                >
                  <div className={clsx("w-1.5 h-1.5 rounded-full shrink-0", isActive ? "bg-emerald-500" : "bg-slate-700")}></div>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{t(item.translationKey)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-4 mb-4">
          <p className="text-xs text-emerald-500 font-bold mb-2 uppercase tracking-wide">{t('status.title')}</p>
          <div className="flex items-center gap-2 text-[11px] leading-relaxed text-slate-400">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            {t('status.online')}
          </div>
        </div>
        
        <button 
          onClick={toggleLanguage}
          className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors uppercase tracking-widest"
        >
          <Languages className="w-4 h-4" />
          {language === 'en' ? 'عربي' : 'ENGLISH'}
        </button>
      </div>
    </aside>
  );
}
