import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Country } from '../lib/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Sparkles, Download, FileCode, FileSpreadsheet } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../lib/LanguageContext';
import { generateSingleCountryReport } from '../lib/reportGenerator';

export function CountryDetail() {
  const { id } = useParams<{ id: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (id) {
      api.getCountry(id).then(setCountry);
    }
  }, [id]);

  const handleGenerateReport = async () => {
    if (!country) return;
    setIsGenerating(true);
    try {
      const { analysis } = await api.generateAiReport(country.id);
      setAiReport(analysis);
    } catch (err: any) {
      alert(`Failed to generate report: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!country) return <div className="p-8 text-slate-500">Loading country profile...</div>;

  const sortedTrends = [...country.historicalTrends].sort((a, b) => a.score - b.score);
  const troughYear = sortedTrends.length > 0 ? sortedTrends[0].year : null;
  const peakYear = sortedTrends.length > 0 ? sortedTrends[sortedTrends.length - 1].year : null;

  const scoreDisplay = country.isEvaluated ? country.democracyScore : 'N/A';
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative pb-10">
      <div className="flex items-start justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-emerald-400 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t('country.back')}
          </Link>
          <div className="flex items-center gap-3">
             <div className={`w-4 h-8 ${country.isEvaluated ? 'bg-emerald-500' : 'bg-slate-500'} rounded-sm`}></div>
             <h2 className="text-3xl font-bold text-white tracking-tight">{country.name}</h2>
             <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${country.isEvaluated ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                {scoreDisplay}
             </span>
          </div>
          <p className="text-slate-400 mt-2 font-mono text-sm tracking-wide">{country.region} • {t('country.profile')}</p>
        </div>
        <div className="flex gap-3 mt-4">
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs tracking-widest transition-colors disabled:opacity-75 disabled:cursor-wait"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? t('country.generating') : t('country.generate')}
          </button>
          <button 
            onClick={() => generateSingleCountryReport(country, 'html')}
            className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-xl font-bold text-xs tracking-widest transition-colors"
          >
            <FileCode className="w-4 h-4" />
            {t('country.export')}
          </button>
          <button 
            onClick={() => generateSingleCountryReport(country, 'csv')}
            className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-xl font-bold text-xs tracking-widest transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV
          </button>
          <button 
            onClick={() => generateSingleCountryReport(country, 'docx')}
            className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-xl font-bold text-xs tracking-widest transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-sky-400" />
            WORD
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0">
        <div className="xl:col-span-8 space-y-6">
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 relative flex flex-col shadow-xl backdrop-blur-sm">
            <h3 className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-wide">
              {t('country.trend')}
            </h3>
            <div className="h-64">
              {country.isEvaluated ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={country.historicalTrends} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <RechartsTooltip 
                      cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '3 3' }}
                      content={<CustomTooltip peakYear={peakYear} troughYear={troughYear} t={t} />}
                    />
                    <Area type="monotone" dataKey="score" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center border border-dashed border-slate-700/50 rounded-xl">
                   <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Not Evaluated</p>
                </div>
              )}
            </div>
          </div>

          {aiReport && (
            <div className="bg-emerald-950/20 rounded-3xl border border-emerald-900/50 p-8 shadow-xl text-slate-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="flex items-center gap-3 text-white mb-6">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-emerald-500">{t('country.ai_summary')}</h3>
              </div>
              <div className="markdown-body relative z-10 text-sm">
                <ReactMarkdown>{aiReport}</ReactMarkdown>
              </div>
            </div>
          )}

        </div>

        <div className="xl:col-span-4 space-y-6 flex flex-col">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl shadow-xl backdrop-blur-sm overflow-hidden flex flex-col flex-1">
            <div className="p-5 border-b border-slate-800 bg-slate-800/10 shrink-0">
               <h3 className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {t('country.main_dimensions')}
               </h3>
               <p className="text-xs text-slate-500">{t('country.scores_out_of')}</p>
            </div>
            <div className="p-6 space-y-5 border-b border-slate-800/50">
              <IndicatorBar label={t('indicator.structural')} value={country.isEvaluated ? country.indicators.structural : undefined} color="bg-indigo-400" />
              <IndicatorBar label={t('indicator.process')} value={country.isEvaluated ? country.indicators.process : undefined} color="bg-indigo-400" />
              <IndicatorBar label={t('indicator.outcome')} value={country.isEvaluated ? country.indicators.outcome : undefined} color="bg-purple-400" />
            </div>
            <div className="p-5 border-b border-slate-800 bg-slate-800/10 shrink-0">
               <h3 className="text-[11px] font-bold text-amber-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {t('country.categories')}
               </h3>
            </div>
            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
              <IndicatorBar label={t('category.civilPolitical')} value={country.isEvaluated ? country.indicators.civilPolitical : undefined} color="bg-indigo-500" />
              <IndicatorBar label={t('category.opinionExpression')} value={country.isEvaluated ? country.indicators.opinionExpression : undefined} color="bg-orange-400" />
              <IndicatorBar label={t('category.economicSocial')} value={country.isEvaluated ? country.indicators.economicSocial : undefined} color="bg-teal-500" />
              <IndicatorBar label={t('category.vulnerableGroups')} value={country.isEvaluated ? country.indicators.vulnerableGroups : undefined} color="bg-purple-500" />
              <IndicatorBar label={t('category.assemblyOrganization')} value={country.isEvaluated ? country.indicators.assemblyOrganization : undefined} color="bg-yellow-500" />
              <IndicatorBar label={t('category.justice')} value={country.isEvaluated ? country.indicators.justice : undefined} color="bg-rose-500" />
            </div>
          </div>
          
          <div className="h-48 bg-emerald-500 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shrink-0">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-400 rounded-full opacity-30"></div>
             <div className="relative z-10">
               <h3 className="text-slate-950 font-black text-xl leading-tight uppercase whitespace-pre-wrap">{t('country.export_title').split(' ').slice(0,2).join(' ')}<br/>{t('country.export_title').split(' ').slice(2).join(' ')}</h3>
               <p className="text-emerald-900 text-xs mt-1 font-medium">{t('country.export_desc')}</p>
             </div>
             <button 
               onClick={() => generateSingleCountryReport(country, 'pdf')}
               className="relative z-10 bg-slate-950 hover:bg-slate-900 text-white py-3 rounded-2xl font-bold text-[10px] tracking-widest flex items-center justify-center gap-2 transition-colors"
             >
               {t('country.download')}
               <Download className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IndicatorBar({ label, value, color, highlight = false }: { label: string, value?: number, color: string, highlight?: boolean }) {
  const isUndefined = value === undefined;
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className={`text-xs ${highlight ? 'font-bold text-white' : 'font-medium text-slate-400'}`}>{label}</span>
        <span className={`font-mono ${highlight ? 'text-lg font-bold text-emerald-400' : 'text-sm font-semibold text-slate-300'}`}>{isUndefined ? 'N/A' : value}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full border-r border-slate-900 ${isUndefined ? 'bg-slate-700' : color} rounded-full`} 
          style={{ width: isUndefined ? '0%' : `${value}%` }} 
        />
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, peakYear, troughYear, t }: any) {
  if (active && payload && payload.length) {
    const isPeak = label === peakYear;
    const isTrough = label === troughYear;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl font-mono text-sm min-w-[140px]">
        <p className="text-slate-300 font-bold mb-1">{`${t('country.year')}: ${label}`}</p>
        <p className="text-teal-400">{`${t('country.score')}: ${payload[0].value}`}</p>
        {isPeak && <p className="text-indigo-400 text-[10px] mt-2 uppercase tracking-widest font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>{t('country.peak')}</p>}
        {isTrough && <p className="text-rose-400 text-[10px] mt-2 uppercase tracking-widest font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>{t('country.trough')}</p>}
      </div>
    );
  }
  return null;
}
