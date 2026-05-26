import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Bell, Search, User } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export function Layout() {
  const { t } = useLanguage();

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4 text-slate-400">
            <Search className="w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder={t('header.search')} 
              className="bg-transparent border-none outline-none text-sm w-64 text-slate-200 placeholder:text-slate-600 focus:ring-0"
            />
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-xs font-mono text-emerald-400">{t('header.active')}</span>
             </div>
             <button className="text-slate-500 hover:text-slate-300 transition-colors relative">
               <Bell className="w-5 h-5" />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
             </button>
             <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 mx-2">JD</div>
          </div>
        </header>
        <div className="p-8 pb-16 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
