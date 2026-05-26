import { Country, KPI } from './types.js';

const API_BASE = '/api';
const LOCAL_KEY = 'ahri_persisted_data';

const getLocal = (): any[] | null => {
  try {
    const s = localStorage.getItem(LOCAL_KEY);
    return s ? JSON.parse(s) : null;
  } catch (e) {
    return null;
  }
};

const setLocal = (d: any[]) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(d));
  } catch (e) {}
};

export const api = {
  getKpis: async (): Promise<KPI> => {
    const res = await fetch(`${API_BASE}/analytics/kpis`);
    if (!res.ok) throw new Error('Failed to fetch KPIs');
    const serverKpi = await res.json();
    
    // Attempt local fallback recalculation if server lost data
    const local = getLocal();
    if (local && Array.isArray(local) && local.length > 0) {
      const hasEvaluatedLocal = local.some(c => c.isEvaluated);
      // Wait, 54 default countries. If server has HighRisk = 54 (default 0 scores), but user inputted positive scores
      if (hasEvaluatedLocal) {
        const avgScore = local.reduce((acc, c) => acc + (c.democracyScore || 0), 0) / local.length;
        const highRisk = local.filter(c => (c.democracyScore || 0) < 40).length;
        const improving = local.filter(c => c.indicators && c.indicators.process > 60).length;
        return {
          averageDemocracy: avgScore.toFixed(1),
          highRiskCountries: highRisk,
          improvingCountries: improving,
          totalCountries: local.length
        };
      }
    }
    return serverKpi;
  },
  
  getCountries: async (): Promise<Partial<Country>[]> => {
    const res = await fetch(`${API_BASE}/analytics/countries`);
    if (!res.ok) throw new Error('Failed to fetch countries');
    const db = await res.json();
    
    const local = getLocal();
    if (local && Array.isArray(local) && local.length > 0) {
      let syncPromises: Promise<any>[] = [];
      const dbMap = new Map(db.map((c: any) => [c.id, c]));
      let hasLostData = false;
      
      for (const loc of local) {
        if (loc.isEvaluated) {
           const serv = dbMap.get(loc.id);
           if (!serv || !serv.isEvaluated) {
              hasLostData = true;
              syncPromises.push(
                fetch(`${API_BASE}/analytics/countries/${loc.id}`, {
                   method: 'PUT',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(loc)
                }).catch(()=>{})
              );
           }
        }
      }
      
      if (hasLostData) {
        Promise.all(syncPromises).then(() => {
          // Sync completed in background
        });
        return local; 
      } else {
        setLocal(db); // Update local to latest server data (e.g. if another client updated it)
        return db;
      }
    } else {
      setLocal(db);
      return db;
    }
  },
  
  getCountry: async (id: string): Promise<Country> => {
    const res = await fetch(`${API_BASE}/analytics/countries/${id}`);
    if (!res.ok) throw new Error('Failed to fetch country');
    const serv = await res.json();
    
    const local = getLocal() || [];
    const loc = local.find(c => c.id === id);
    if (loc && loc.isEvaluated && !serv.isEvaluated) {
       return loc;
    }
    return serv;
  },
  
  updateCountry: async (id: string, updates: Partial<Country>): Promise<Country> => {
    const res = await fetch(`${API_BASE}/analytics/countries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update country');
    const updated = await res.json();
    
    const local = getLocal() || [];
    const idx = local.findIndex((c: any) => c.id === id);
    if (idx !== -1) {
      local[idx] = updated;
    } else {
      local.push(updated);
    }
    setLocal(local);
    
    return updated;
  },
  
  generateAiReport: async (countryId: string): Promise<{ analysis: string }> => {
    const local = getLocal() || [];
    const loc = local.find(c => c.id === countryId);
    if (loc && loc.isEvaluated) {
        await fetch(`${API_BASE}/analytics/countries/${countryId}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(loc)
        }).catch(()=>{});
    }

    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ countryId }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate report');
    }
    return res.json();
  }
};
