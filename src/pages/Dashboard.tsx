import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { KPI, Country } from '../lib/types';
import { Users, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { CountryComparison } from '../components/CountryComparison';

export function Dashboard() {
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [countries, setCountries] = useState<Partial<Country>[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    Promise.all([api.getKpis(), api.getCountries()])
      .then(([kpiData, countryData]) => {
        setKpis(kpiData);
        setCountries(countryData);
        setLoading(false);
      });
  }, []);

  if (loading || !kpis) {
    return <div className="flex h-full items-center justify-center text-slate-500">Loading analytics engine...</div>;
  }

  const evaluatedCountries = countries.filter(c => c.isEvaluated);
  const topCountries = [...evaluatedCountries].sort((a, b) => (b.democracyScore || 0) - (a.democracyScore || 0)).slice(0, 5);
  const bottomCountries = [...evaluatedCountries].sort((a, b) => (a.democracyScore || 0) - (b.democracyScore || 0)).slice(0, 5);
  
  const chartData = [...topCountries, ...bottomCountries].map(c => ({
    name: c.name,
    score: c.democracyScore,
    status: c.status
  }));

  const years = [2020, 2021, 2022, 2023, 2024];
  const selectedTrendCountries = evaluatedCountries.slice(0, 5); // Take top 5 for the trend
  const trendData = years.map(year => {
    const dataPoint: any = { year: year.toString() };
    selectedTrendCountries.forEach(country => {
       const trend = country.historicalTrends?.find(t => t.year === year);
       if (trend) {
           dataPoint[country.name!] = trend.score;
       }
    });
    return dataPoint;
  });
  
  const lineColors = ['#14b8a6', '#facc15', '#fb923c', '#ea1c0e', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {t('dash.title')}
          </h2>
          <p className="text-slate-500 mt-1 pl-4">{t('dash.subtitle')}</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-sm">
          <img src="/elhak_logo.png" alt="El Hak Foundation" className="h-[50px] object-contain opacity-90 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
          <div className="w-[1px] h-10 bg-slate-800"></div>
          <img src="/ahri_logo.png" alt="African Human Rights Index" className="h-[50px] object-contain opacity-90 hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display = 'none'} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <KpiCard title={t('kpi.index')} value={kpis.averageDemocracy} icon={TrendingUp} color="emerald" fillClass="w-[64%]" />
        <KpiCard title={t('kpi.alerts')} value={kpis.highRiskCountries} icon={AlertTriangle} color="red" fillClass="w-[18%]" />
        <KpiCard title={t('kpi.improving')} value={kpis.improvingCountries} icon={ShieldCheck} color="blue" fillClass="w-[42%]" />
        <KpiCard title={t('kpi.monitored')} value={kpis.totalCountries} icon={Users} color="slate" fillClass="w-full" />
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0">
        <div className="xl:col-span-8 bg-slate-900/20 border border-slate-800 rounded-3xl p-6 relative flex flex-col">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
              {t('dash.extremes')}
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-slate-800 rounded-lg text-xs border border-slate-700 text-slate-300">{t('dash.detailed')}</button>
              <button className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs">{t('dash.global')}</button>
            </div>
          </div>
          <div className="h-80 bg-slate-800/10 rounded-2xl border border-slate-800/50 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#14b8a6' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score && entry.score >= 50 ? '#14b8a6' : '#ea1c0e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-4 bg-slate-900/40 border border-slate-800 rounded-3xl p-5 flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {t('dash.activity')}
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {countries.slice(0, 10).map((country) => {
              const scoreDisplay = country.isEvaluated ? country.democracyScore : 'N/A';
              const statusColor = country.isEvaluated ? 
                             (country.status === 'Excellent' ? 'text-teal-500' :
                             country.status === 'Very Good' ? 'text-lime-500' :
                             country.status === 'Good' ? 'text-yellow-500' :
                             country.status === 'Acceptable' ? 'text-orange-500' : 'text-rose-500') : 'text-slate-500';
              const bgColor = country.isEvaluated ? 
                             (country.status === 'Excellent' ? 'bg-teal-500' :
                             country.status === 'Very Good' ? 'bg-lime-500' :
                             country.status === 'Good' ? 'bg-yellow-500' :
                             country.status === 'Acceptable' ? 'bg-orange-500' : 'bg-rose-500') : 'bg-slate-600';
                             
              return (
                <Link key={country.id} to={`/country/${country.id}`} className="flex items-center justify-between group cursor-pointer py-2 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 px-3 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-slate-800 border border-slate-700 rounded-md overflow-hidden flex items-center justify-center shrink-0">
                       <div className={`w-1.5 h-1.5 rounded-full ${bgColor}`}></div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-300 group-hover:text-emerald-400 transition-colors">{country.name}</span>
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wide">{country.region}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${statusColor}`}>{scoreDisplay}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800">
             <Link to="/data" className="block text-center w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition-colors font-medium">{t('dash.view_all')}</Link>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900/20 border border-slate-800 rounded-3xl p-6 relative flex flex-col shrink-0">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-white mb-6">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          {t('dash.trend_title')}
        </h3>
        <div className="h-80 bg-slate-800/10 rounded-2xl border border-slate-800/50 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#334155' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#334155' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                itemStyle={{ fontSize: 13, fontWeight: 500 }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
              {selectedTrendCountries.map((country, idx) => (
                <Line 
                  key={country.name} 
                  type="monotone" 
                  dataKey={country.name!} 
                  stroke={lineColors[idx % lineColors.length]} 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <CountryComparison countriesList={countries} />
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color, fillClass = "w-[80%]" }: { title: string, value: string | number, icon: any, color: 'blue'|'red'|'emerald'|'slate', fillClass?: string }) {
  const { t } = useLanguage();
  const barColors = {
    blue: 'bg-indigo-500',
    red: 'bg-rose-500',
    emerald: 'bg-emerald-500',
    slate: 'bg-indigo-500'
  };
  const textColors = {
    blue: 'text-indigo-500',
    red: 'text-rose-500',
    emerald: 'text-emerald-500',
    slate: 'text-indigo-400'
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-sm flex flex-col">
       <div className="flex items-center justify-between mb-1">
         <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{title}</span>
         <Icon className={`w-4 h-4 ${textColors[color]}`} />
       </div>
       <div className="flex items-end justify-between mt-2">
         <span className="text-3xl font-bold text-white leading-none">{value}</span>
         <span className={`text-[10px] ${textColors[color]} font-mono uppercase tracking-widest bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700/50`}>{t('dash.recorded')}</span>
       </div>
       <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
         <div className={`${barColors[color]} h-full ${fillClass}`}></div>
       </div>
    </div>
  );
}
