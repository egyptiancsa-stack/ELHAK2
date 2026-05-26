import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Country } from '../lib/types';
import { useLanguage } from '../lib/LanguageContext';
import { Globe, Flag, Download, CheckCircle2, Loader2, FileCode, FileSpreadsheet } from 'lucide-react';
import { generateSingleCountryReport, generateCollectiveReport } from '../lib/reportGenerator';

export function Reports() {
  const { t } = useLanguage();
  const [countries, setCountries] = useState<Partial<Country>[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [generatingSingle, setGeneratingSingle] = useState<'pdf' | 'html' | 'csv' | 'docx' | null>(null);
  const [generatingCollective, setGeneratingCollective] = useState<'pdf' | 'html' | 'csv' | 'docx' | null>(null);
  const [singleSuccess, setSingleSuccess] = useState(false);
  const [collectiveSuccess, setCollectiveSuccess] = useState(false);

  useEffect(() => {
    api.getCountries().then(setCountries);
  }, []);

  const generateSingle = async (format: 'pdf' | 'html' | 'csv' | 'docx') => {
    if (!selectedCountry) return;
    setGeneratingSingle(format);
    setSingleSuccess(false);
    try {
      const fullCountry = await api.getCountry(selectedCountry);
      // Give UI a moment to show loading state if data fetch is too fast
      await new Promise(r => setTimeout(r, 500));
      generateSingleCountryReport(fullCountry, format);
      setSingleSuccess(true);
      setTimeout(() => setSingleSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratingSingle(null);
    }
  };

  const generateCollective = async (format: 'pdf' | 'html' | 'csv' | 'docx') => {
    setGeneratingCollective(format);
    setCollectiveSuccess(false);
    try {
      // get detailed data for all, standard getCountries might be partial, so we fetch each or use standard depending on what's available
      // The API's getCountries method actually returns all detailed data based on previously modified setup or seed
      const allList = await api.getCountries() as Country[];
      await new Promise(r => setTimeout(r, 600));
      generateCollectiveReport(allList, format);
      setCollectiveSuccess(true);
      setTimeout(() => setCollectiveSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratingCollective(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{t('reports.title')}</h2>
          <p className="text-slate-400 mt-1">{t('reports.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Single Country Report Card */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Flag className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('reports.single')}</h3>
              <p className="text-sm text-slate-400">{t('reports.single_desc')}</p>
            </div>
          </div>

          <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-end">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t('reports.select_country')}</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-medium cursor-pointer"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="" disabled>{t('reports.select_country')}</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => generateSingle('pdf')}
                disabled={!selectedCountry || generatingSingle !== null}
                className="flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-3 rounded-xl font-bold text-[11px] tracking-widest transition-colors disabled:opacity-50"
              >
                {generatingSingle === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {generatingSingle === 'pdf' ? t('reports.generating') : t('reports.generate_pdf')}
              </button>
              <button 
                onClick={() => generateSingle('html')}
                disabled={!selectedCountry || generatingSingle !== null}
                className="flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-3 rounded-xl font-bold text-[11px] tracking-widest transition-colors disabled:opacity-50"
              >
                {generatingSingle === 'html' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCode className="w-4 h-4" />}
                {generatingSingle === 'html' ? t('reports.generating') : t('reports.generate_html')}
              </button>
              <button 
                onClick={() => generateSingle('csv')}
                disabled={!selectedCountry || generatingSingle !== null}
                className="flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-3 rounded-xl font-bold text-[11px] tracking-widest transition-colors disabled:opacity-50"
              >
                {generatingSingle === 'csv' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                {generatingSingle === 'csv' ? t('reports.generating') : t('reports.generate_csv')}
              </button>
              <button 
                onClick={() => generateSingle('docx')}
                disabled={!selectedCountry || generatingSingle !== null}
                className="flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-3 rounded-xl font-bold text-[11px] tracking-widest transition-colors disabled:opacity-50"
              >
                {generatingSingle === 'docx' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4 text-sky-400" />}
                {generatingSingle === 'docx' ? t('reports.generating') : t('reports.generate_docx')}
              </button>
            </div>
            {singleSuccess && (
              <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 mt-4">
                <CheckCircle2 className="w-4 h-4" /> {t('reports.success')}
              </p>
            )}
          </div>
        </div>

        {/* Collective Report Card */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('reports.collective')}</h3>
              <p className="text-sm text-slate-400">{t('reports.collective_desc')}</p>
            </div>
          </div>

          <div className="space-y-6 mt-16 relative z-10 flex-1 flex flex-col justify-end">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => generateCollective('pdf')}
                disabled={generatingCollective !== null}
                className="flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-3 rounded-xl font-bold text-[11px] tracking-widest transition-colors disabled:opacity-50"
              >
                {generatingCollective === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {generatingCollective === 'pdf' ? t('reports.generating') : t('reports.generate_pdf')}
              </button>
              <button 
                onClick={() => generateCollective('html')}
                disabled={generatingCollective !== null}
                className="flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-3 rounded-xl font-bold text-[11px] tracking-widest transition-colors disabled:opacity-50"
              >
                {generatingCollective === 'html' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCode className="w-4 h-4" />}
                {generatingCollective === 'html' ? t('reports.generating') : t('reports.generate_html')}
              </button>
              <button 
                onClick={() => generateCollective('csv')}
                disabled={generatingCollective !== null}
                className="flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-3 rounded-xl font-bold text-[11px] tracking-widest transition-colors disabled:opacity-50"
              >
                {generatingCollective === 'csv' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                {generatingCollective === 'csv' ? t('reports.generating') : t('reports.generate_csv')}
              </button>
              <button 
                onClick={() => generateCollective('docx')}
                disabled={generatingCollective !== null}
                className="flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-3 rounded-xl font-bold text-[11px] tracking-widest transition-colors disabled:opacity-50"
              >
                {generatingCollective === 'docx' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
                {generatingCollective === 'docx' ? t('reports.generating') : t('reports.generate_docx')}
              </button>
            </div>
            {collectiveSuccess && (
              <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 mt-4">
                <CheckCircle2 className="w-4 h-4" /> {t('reports.success')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
