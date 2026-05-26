export interface CountryIndicators {
  structural: number;
  process: number;
  outcome: number;
  civilPolitical: number;
  opinionExpression: number;
  economicSocial: number;
  vulnerableGroups: number;
  assemblyOrganization: number;
  justice: number;
}

export interface HistoricalTrend {
  year: number;
  score: number;
}

export interface Country {
  id: string;
  name: string;
  region: string;
  status?: string;
  isEvaluated?: boolean;
  democracyScore: number;
  indicators: CountryIndicators;
  historicalTrends: HistoricalTrend[];
}

export interface KPI {
  averageDemocracy: string;
  highRiskCountries: number;
  improvingCountries: number;
  totalCountries: number;
}
