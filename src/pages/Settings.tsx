import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Globe, Lock, CheckCircle2, Sliders } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export function Settings() {
  const { t, language, toggleLanguage } = useLanguage();
  const [wpUrl, setWpUrl] = useState('');
  const [wpKey, setWpKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load from local storage if available
    const savedUrl = localStorage.getItem('ahri_wp_url');
    const savedKey = localStorage.getItem('ahri_wp_key');
    if (savedUrl) setWpUrl(savedUrl);
    if (savedKey) setWpKey(savedKey);
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('ahri_wp_url', wpUrl);
      localStorage.setItem('ahri_wp_key', wpKey);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-emerald-500" /> {t('set.title')}
        </h2>
        <p className="text-slate-500 mt-1 pl-8">{t('set.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* General Settings */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-white mb-6">
            <Sliders className="w-5 h-5 text-emerald-500" />
            {t('set.general')}
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">{t('set.lang')}</label>
              <div className="flex bg-slate-950 border border-slate-800 rounded-lg overflow-hidden p-1 inline-flex">
                <button
                  onClick={() => language !== 'en' && toggleLanguage()}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${language === 'en' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  English
                </button>
                <button
                  onClick={() => language !== 'ar' && toggleLanguage()}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${language === 'ar' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  عربي
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">{t('set.theme')}</label>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-sm text-slate-400 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-700"></div>
                Dark Theme (Default)
              </div>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-white mb-6">
            <Globe className="w-5 h-5 text-emerald-500" />
            {t('set.integration')}
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">{t('set.wp_url')}</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
                <input
                  type="url"
                  value={wpUrl}
                  onChange={(e) => setWpUrl(e.target.value)}
                  placeholder="https://elhak.org"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 rtl:pl-4 rtl:pr-10 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-700"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">{t('set.wp_key')}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
                <input
                  type="password"
                  value={wpKey}
                  onChange={(e) => setWpKey(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 rtl:pl-4 rtl:pr-10 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="pt-6 border-t border-slate-800 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Save className="w-5 h-5" />
          )}
          {t('set.save')}
        </button>
        
        {saved && (
          <span className="text-emerald-400 text-sm font-medium flex items-center gap-2 animate-in slide-in-from-left-2 rtl:slide-in-from-right-2 fade-in">
            <CheckCircle2 className="w-4 h-4" /> {t('set.saved')}
          </span>
        )}
      </div>
    </div>
  );
}
