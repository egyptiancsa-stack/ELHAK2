import { useState, useEffect } from 'react';
import { Country } from '../lib/types';
import { api } from '../lib/api';
import { useLanguage } from '../lib/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Scale, ArrowRightLeft } from 'lucide-react';

export function CountryComparison({ countriesList }: { countriesList: Partial<Country>[] }) {
  const { t } = useLanguage();
  const [selected1, setSelected1] = useState<string>('');
  const [selected2, setSelected2] = useState<string>('');
  const [data1, setData1] = useState<Country | null>(null);
  const [data2, setData2] = useState<Country | null>(null);

  useEffect(() => {
    if (selected1) {
      api.getCountry(selected1).then(setData1);
    } else {
      setData1(null);
    }
  }, [selected1]);

  useEffect(() => {
    if (selected2) {
      api.getCountry(selected2).then(setData2);
    } else {
      setData2(null);
    }
  }, [selected2]);

  const chartData = [];
  if (data1 || data2) {
    const indicators = [
      { key: 'structural', label: t('indicator.structural') },
      { key: 'process', label: t('indicator.process') },
      { key: 'outcome', label: t('indicator.outcome') },
      { key: 'civilPolitical', label: t('category.civilPolitical') },
      { key: 'opinionExpression', label: t('category.opinionExpression') },
      { key: 'economicSocial', label: t('category.economicSocial') },
      { key: 'vulnerableGroups', label: t('category.vulnerableGroups') },
      { key: 'assemblyOrganization', label: t('category.assemblyOrganization') },
      { key: 'justice', label: t('category.justice') }
    ];

    indicators.forEach(ind => {
      chartData.push({
        name: ind.label,
        [data1?.name || 'Country 1']: data1?.indicators[ind.key as keyof typeof data1.indicators] || 0,
        [data2?.name || 'Country 2']: data2?.indicators[ind.key as keyof typeof data2.indicators] || 0,
      });
    });
  }

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm mt-8">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">{t('dash.compare')}</h3>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 text-sm">
        <select 
          className="flex-1 w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none font-medium transition-shadow cursor-pointer"
          value={selected1}
          onChange={(e) => setSelected1(e.target.value)}
        >
          <option value="" disabled>{t('dash.select_c1')}</option>
          {countriesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-full bg-slate-800 border border-slate-700">
           <ArrowRightLeft className="w-4 h-4 text-slate-400" />
        </div>
        
        <select 
          className="flex-1 w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-medium transition-shadow cursor-pointer"
          value={selected2}
          onChange={(e) => setSelected2(e.target.value)}
        >
          <option value="" disabled>{t('dash.select_c2')}</option>
          {countriesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {(data1 || data2) ? (
        <div className="h-80 w-full animate-in fade-in duration-500">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#334155' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#334155' }} />
              <Tooltip 
                cursor={{ fill: '#1e293b' }}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {data1 && <Bar dataKey={data1.name} fill="#14b8a6" radius={[4, 4, 0, 0]} maxBarSize={40} />}
              {data2 && <Bar dataKey={data2.name} fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center border border-dashed border-slate-700 rounded-2xl bg-slate-800/30">
          <p className="text-slate-500 text-sm font-medium">
            {t('dash.select_c1')} {t('dash.vs')} {t('dash.select_c2')}
          </p>
        </div>
      )}
    </div>
  );
}
