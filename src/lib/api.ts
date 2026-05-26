import { Country, KPI } from './types.js';

const API_BASE = '/api';

export const api = {
  getKpis: async (): Promise<KPI> => {
    const res = await fetch(`${API_BASE}/analytics/kpis`);
    if (!res.ok) throw new Error('Failed to fetch KPIs');
    return res.json();
  },
  
  getCountries: async (): Promise<Partial<Country>[]> => {
    const res = await fetch(`${API_BASE}/analytics/countries`);
    if (!res.ok) throw new Error('Failed to fetch countries');
    return res.json();
  },
  
  getCountry: async (id: string): Promise<Country> => {
    const res = await fetch(`${API_BASE}/analytics/countries/${id}`);
    if (!res.ok) throw new Error('Failed to fetch country');
    return res.json();
  },
  
  updateCountry: async (id: string, updates: Partial<Country>): Promise<Country> => {
    const res = await fetch(`${API_BASE}/analytics/countries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update country');
    return res.json();
  },
  
  generateAiReport: async (countryId: string): Promise<{ analysis: string }> => {
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
