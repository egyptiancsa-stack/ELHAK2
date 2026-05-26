import { useState, useEffect, useRef } from 'react';
import { Country } from '../lib/types';
import { api } from '../lib/api';
import { useLanguage } from '../lib/LanguageContext';
import { Save, AlertCircle, CheckCircle2, Search, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

export function DataCenter() {
  const { t } = useLanguage();
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Country>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // We fetch detailed data for all, which might not be exposed currently.
    // Wait, getCountries returns Partial<Country> in the UI, but let's fetch individual or just adjust.
    // Instead of fighting it, let's just make getCountries return the full list or we can edit selected.
    fetchData();
  }, []);

  const fetchData = async () => {
    // Actually we need the detailed ones to edit indicators.
    // Since getCountries currently returns partial, let's fetch them one by one or modify getCountries?
    // Let's modify getAllCountries in server to return everything, or just fetch partials and fetch detail on edit.
    const list = await api.getCountries();
    setCountries(list as Country[]);
  };

  const handleEditClick = async (id: string) => {
    const fullCountry = await api.getCountry(id);
    setEditingId(id);
    setEditForm(JSON.parse(JSON.stringify(fullCountry))); // deep copy
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditForm({});
    setSaveStatus('idle');
  };

  const handleSaveClick = async () => {
    if (!editingId) return;
    setSaveStatus('saving');
    try {
      const parseVal = (v: any): number => {
        if (v === undefined || v === null || v === '') return 0;
        const parsed = parseFloat(String(v));
        return isNaN(parsed) ? 0 : parsed;
      };

      const payloadToSave: Partial<Country> = {
        ...editForm,
        isEvaluated: true,
        democracyScore: parseVal(editForm.democracyScore),
        indicators: editForm.indicators ? {
          structural: parseVal(editForm.indicators.structural),
          process: parseVal(editForm.indicators.process),
          outcome: parseVal(editForm.indicators.outcome),
          civilPolitical: parseVal(editForm.indicators.civilPolitical),
          opinionExpression: parseVal(editForm.indicators.opinionExpression),
          economicSocial: parseVal(editForm.indicators.economicSocial),
          vulnerableGroups: parseVal(editForm.indicators.vulnerableGroups),
          assemblyOrganization: parseVal(editForm.indicators.assemblyOrganization),
          justice: parseVal(editForm.indicators.justice)
        } : undefined
      };

      await api.updateCountry(editingId, payloadToSave);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
      setEditingId(null);
      fetchData(); // Refresh list to get updated data
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  const updateIndicator = (key: string, value: string) => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const dotCount = (cleanValue.match(/\./g) || []).length;
    let finalValue = cleanValue;
    if (dotCount > 1) {
      const parts = cleanValue.split('.');
      finalValue = parts[0] + '.' + parts.slice(1).join('');
    }
    setEditForm({
      ...editForm,
      isEvaluated: true,
      indicators: {
        ...editForm.indicators,
        [key]: finalValue
      }
    } as any);
  };

  const updateScore = (value: string) => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const dotCount = (cleanValue.match(/\./g) || []).length;
    let finalValue = cleanValue;
    if (dotCount > 1) {
      const parts = cleanValue.split('.');
      finalValue = parts[0] + '.' + parts.slice(1).join('');
    }
    setEditForm({
      ...editForm,
      isEvaluated: true,
      democracyScore: finalValue
    } as any);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        let newForm = { ...editForm, isEvaluated: true };
        
        if (data.length > 0) {
          const firstRow = data[0] as any;
          if (firstRow.hasOwnProperty('structural') || firstRow.hasOwnProperty('democracyScore') || firstRow.hasOwnProperty('overall')) {
             // Row format: each column is an indicator
             const parseVal = (v: any) => parseFloat(v) || 0;
             newForm = {
               ...newForm,
               democracyScore: parseVal(firstRow.overall ?? firstRow.democracyScore ?? newForm.democracyScore),
               indicators: {
                 ...newForm.indicators,
                 structural: parseVal(firstRow.structural ?? newForm.indicators?.structural),
                 process: parseVal(firstRow.process ?? newForm.indicators?.process),
                 outcome: parseVal(firstRow.outcome ?? newForm.indicators?.outcome),
                 civilPolitical: parseVal(firstRow.civilPolitical ?? newForm.indicators?.civilPolitical),
                 opinionExpression: parseVal(firstRow.opinionExpression ?? newForm.indicators?.opinionExpression),
                 economicSocial: parseVal(firstRow.economicSocial ?? newForm.indicators?.economicSocial),
                 vulnerableGroups: parseVal(firstRow.vulnerableGroups ?? newForm.indicators?.vulnerableGroups),
                 assemblyOrganization: parseVal(firstRow.assemblyOrganization ?? newForm.indicators?.assemblyOrganization),
                 justice: parseVal(firstRow.justice ?? newForm.indicators?.justice)
               }
             };
          } else {
             // Key value format: row has 'Indicator' and 'Value'
             data.forEach((row: any) => {
               const key = String(row.Indicator || row.indicator || row.Key || row.key || row.metric || row.Metric || '').trim();
               const val = parseFloat(row.Value || row.value || row.score || row.Score);
               if (key && !isNaN(val)) {
                 if (key === 'democracyScore' || key === 'overall' || key === 'Overall Democracy Score' || key === 'المؤشر الكلي للديمقراطية') {
                   newForm.democracyScore = val;
                 } else if (newForm.indicators) {
                   if (key.includes('structural') || key.includes('الهيكلية')) newForm.indicators.structural = val;
                   else if (key.includes('process') || key.includes('العمليات')) newForm.indicators.process = val;
                   else if (key.includes('outcome') || key.includes('النتائج')) newForm.indicators.outcome = val;
                   else if (key.includes('civil') || key.includes('المدنية')) newForm.indicators.civilPolitical = val;
                   else if (key.includes('opinion') || key.includes('الرأي')) newForm.indicators.opinionExpression = val;
                   else if (key.includes('economic') || key.includes('الاقتصادية')) newForm.indicators.economicSocial = val;
                   else if (key.includes('vulnerable') || key.includes('المستضعفة')) newForm.indicators.vulnerableGroups = val;
                   else if (key.includes('assembly') || key.includes('التجمع')) newForm.indicators.assemblyOrganization = val;
                   else if (key.includes('justice') || key.includes('العدالة')) newForm.indicators.justice = val;
                 }
               }
             });
          }
          if (!newForm.indicators) newForm.indicators = editForm.indicators;
          setEditForm(newForm);
        }
      } catch (err) {
        console.error("Error parsing Excel:", err);
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const filteredCountries = countries.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span> {t('data.title')}
        </h2>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder={t('data.search')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 font-mono tracking-widest">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">{t('data.country')}</th>
                <th className="px-6 py-4">{t('data.region')}</th>
                <th className="px-6 py-4">{t('country.overall')}</th>
                <th className="px-6 py-4 rounded-tr-xl text-right">{t('data.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCountries.map(country => (
                <tr key={country.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-200">{country.name}</td>
                  <td className="px-6 py-4">{country.region}</td>
                  <td className="px-6 py-4 font-mono">
                    {country.isEvaluated ? country.democracyScore : <span className="text-slate-500 italic">Not evaluated</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEditClick(country.id)}
                      className="text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest text-[11px] transition-colors"
                    >
                      {t('data.edit')}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCountries.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    {t('data.no_results')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {t('data.editing')} {editForm.name}
              </h3>
              <div className="flex items-center gap-3 relative">
                <input 
                  type="file" 
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {t('data.upload_excel')}
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('country.overall')}</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={editForm.democracyScore ?? ''}
                    onChange={(e) => updateScore(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 border-b border-slate-800 pb-2 mb-2">
                  <h4 className="text-sm font-bold text-slate-300">{t('country.main_dimensions')}</h4>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('indicator.structural')}</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={editForm.indicators?.structural ?? ''}
                    onChange={(e) => updateIndicator('structural', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('indicator.process')}</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={editForm.indicators?.process ?? ''}
                    onChange={(e) => updateIndicator('process', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('indicator.outcome')}</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={editForm.indicators?.outcome ?? ''}
                    onChange={(e) => updateIndicator('outcome', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2 border-b border-slate-800 pb-2 mb-2 mt-4">
                  <h4 className="text-sm font-bold text-slate-300">{t('country.categories')}</h4>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('category.civilPolitical')}</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={editForm.indicators?.civilPolitical ?? ''}
                    onChange={(e) => updateIndicator('civilPolitical', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('category.opinionExpression')}</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={editForm.indicators?.opinionExpression ?? ''}
                    onChange={(e) => updateIndicator('opinionExpression', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('category.economicSocial')}</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={editForm.indicators?.economicSocial ?? ''}
                    onChange={(e) => updateIndicator('economicSocial', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('category.vulnerableGroups')}</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={editForm.indicators?.vulnerableGroups ?? ''}
                    onChange={(e) => updateIndicator('vulnerableGroups', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('category.assemblyOrganization')}</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={editForm.indicators?.assemblyOrganization ?? ''}
                    onChange={(e) => updateIndicator('assemblyOrganization', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('category.justice')}</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={editForm.indicators?.justice ?? ''}
                    onChange={(e) => updateIndicator('justice', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                {saveStatus === 'success' && <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase"><CheckCircle2 className="w-4 h-4" /> {t('data.saved')}</span>}
                {saveStatus === 'error' && <span className="flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase"><AlertCircle className="w-4 h-4" /> {t('data.error')}</span>}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleCancelClick}
                  className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
                >
                  {t('data.cancel')}
                </button>
                <button 
                  onClick={handleSaveClick}
                  disabled={saveStatus === 'saving'}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saveStatus === 'saving' ? t('data.saving') : t('data.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
