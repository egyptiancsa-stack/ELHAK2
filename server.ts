import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { generateAfricanCountries } from './src/data/seedData.js';

// File-based Database Simulation (Repository Pattern)
class AnalyticsRepository {
  private countries: any[];
  private dbPath = path.join(process.cwd(), 'data.json');

  constructor() {
    if (fs.existsSync(this.dbPath)) {
      try {
        this.countries = JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
      } catch (e) {
        this.countries = generateAfricanCountries();
        this.save();
      }
    } else {
      this.countries = generateAfricanCountries();
      this.save();
    }
  }

  private save() {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.countries, null, 2));
  }

  getKpis() {
    const avgScore = this.countries.reduce((acc, c) => acc + c.democracyScore, 0) / this.countries.length;
    const highRisk = this.countries.filter(c => c.democracyScore < 0.40).length;
    const improving = this.countries.filter(c => c.indicators.process > 0.60).length;
    
    return {
      averageDemocracy: avgScore.toFixed(1),
      highRiskCountries: highRisk,
      improvingCountries: improving,
      totalCountries: this.countries.length
    };
  }

  getAllCountries() {
    return this.countries.map(c => ({
      id: c.id,
      name: c.name,
      democracyScore: c.democracyScore,
      status: this.getStatus(c.democracyScore),
      region: c.region,
      isEvaluated: c.isEvaluated,
      indicators: c.indicators
    })).sort((a, b) => b.democracyScore - a.democracyScore);
  }

  getCountry(id: string) {
    return this.countries.find(c => c.id === id);
  }

  updateCountry(id: string, updates: any) {
    const idx = this.countries.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.countries[idx] = { ...this.countries[idx], ...updates };
      this.save();
      return this.countries[idx];
    }
    return null;
  }

  private getStatus(score: number): string {
    if (score >= 0.90) return 'Excellent';
    if (score >= 0.75) return 'Very Good';
    if (score >= 0.60) return 'Good';
    if (score >= 0.45) return 'Acceptable';
    return 'Very Weak';
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());
  
  const repo = new AnalyticsRepository();

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || 'MISSING_KEY',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // --- REST API Endpoints ---
  
  app.get('/api/analytics/kpis', (req, res) => {
    res.json(repo.getKpis());
  });

  app.get('/api/analytics/countries', (req, res) => {
    res.json(repo.getAllCountries());
  });

  app.get('/api/analytics/countries/:id', (req, res) => {
    const country = repo.getCountry(req.params.id);
    if (!country) return res.status(404).json({ error: 'Country not found' });
    res.json(country);
  });

  app.put('/api/analytics/countries/:id', (req, res) => {
    const updated = repo.updateCountry(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Country not found' });
    res.json(updated);
  });

  app.post('/api/ai/analyze', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ error: 'GEMINI_API_KEY is not configured.' });
      }
      
      const { countryId } = req.body;
      const country = repo.getCountry(countryId);
      if (!country) return res.status(404).json({ error: 'Country not found' });

      const prompt = `
      Analyze the human rights and democracy context for ${country.name}.
      Current Stats:
      - Democracy Score: ${country.democracyScore}/100
      - Structural Indicators: ${country.indicators.structural}/100
      - Civil & Political Rights: ${country.indicators.civilPolitical}/100
      - Freedom of Opinion: ${country.indicators.opinionExpression}/100
      - Economic & Social Rights: ${country.indicators.economicSocial}/100
      - Rights of Vulnerable Groups: ${country.indicators.vulnerableGroups}/100
      - Right to Assembly: ${country.indicators.assemblyOrganization}/100
      - Right to Justice: ${country.indicators.justice}/100
      
      Provide a brief (3-4 paragraphs) highly professional, objective executive AI summary interpreting these scores.
      Include "Areas of Concern" and "Policy Recommendations".
      End with a structured conclusion.
      `;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });

      res.json({ analysis: aiResponse.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate AI analysis', details: err.message });
    }
  });

  // --- Vite Middleware or Static Assets ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
