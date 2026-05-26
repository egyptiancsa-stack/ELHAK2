import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { api } from '../lib/api';
import { Country } from '../lib/types';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';

// GeoJSON for Africa
const geoUrl = "https://code.highcharts.com/mapdata/custom/africa.topo.json";

const NAME_MAPPING: Record<string, string> = {
  "United Republic of Tanzania": "Tanzania",
  "Cape Verde": "Cabo Verde",
  "Guinea Bissau": "Guinea-Bissau",
  "Republic of Congo": "Congo", // In case it exists
};

const colorScale = scaleLinear<string>()
  .domain([20, 50, 80])
  .range(["#ea1c0e", "#f59e0b", "#14b8a6"]);

export function AfricaMap() {
  const [countries, setCountries] = useState<Partial<Country>[]>([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [filters, setFilters] = useState({
    excellent: true,
    very_good: true,
    good: true,
    acceptable: true,
    very_weak: true,
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    api.getCountries().then(setCountries);
  }, []);

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500 relative">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{t('map.title')}</h2>
          <p className="text-slate-400 mt-1">{t('map.subtitle')}</p>
        </div>
      </div>

      <div className="flex-1 bg-slate-900/20 border border-slate-800 rounded-3xl overflow-hidden shadow-sm relative isolate flex items-center justify-center p-4">
        
        {/* Legend */}
        <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-sm z-10 w-56">
          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-3">{t('map.legend')}</h4>
          <div className="space-y-2">
            <label className="flex items-center justify-between text-[11px] font-medium text-slate-400 font-mono cursor-pointer hover:text-slate-200 transition-colors">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={filters.excellent} onChange={() => toggleFilter('excellent')} className="rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-900" />
                <span>{t('map.excellent')}</span>
              </div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#14b8a6]"></span> 0.90–1.00</div>
            </label>
            <label className="flex items-center justify-between text-[11px] font-medium text-slate-400 font-mono cursor-pointer hover:text-slate-200 transition-colors">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={filters.very_good} onChange={() => toggleFilter('very_good')} className="rounded border-slate-700 bg-slate-800 text-lime-500 focus:ring-lime-500 focus:ring-offset-slate-900" />
                <span>{t('map.very_good')}</span>
              </div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#84cc16]"></span> 0.75–0.89</div>
            </label>
            <label className="flex items-center justify-between text-[11px] font-medium text-slate-400 font-mono cursor-pointer hover:text-slate-200 transition-colors">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={filters.good} onChange={() => toggleFilter('good')} className="rounded border-slate-700 bg-slate-800 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-slate-900" />
                <span>{t('map.good')}</span>
              </div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#facc15]"></span> 0.60–0.74</div>
            </label>
            <label className="flex items-center justify-between text-[11px] font-medium text-slate-400 font-mono cursor-pointer hover:text-slate-200 transition-colors">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={filters.acceptable} onChange={() => toggleFilter('acceptable')} className="rounded border-slate-700 bg-slate-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900" />
                <span>{t('map.acceptable')}</span>
              </div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#fb923c]"></span> 0.45–0.59</div>
            </label>
            <label className="flex items-center justify-between text-[11px] font-medium text-slate-400 font-mono cursor-pointer hover:text-slate-200 transition-colors">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={filters.very_weak} onChange={() => toggleFilter('very_weak')} className="rounded border-slate-700 bg-slate-800 text-rose-500 focus:ring-rose-500 focus:ring-offset-slate-900" />
                <span>{t('map.very_weak')}</span>
              </div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#ea1c0e]"></span> &lt; 0.45</div>
            </label>
          </div>
        </div>

        {tooltipContent && (
          <div className="absolute top-6 right-6 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg shadow-xl z-20 font-mono text-sm pointer-events-none transition-all">
            {tooltipContent}
          </div>
        )}

        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="h-full w-full bg-slate-800/10 rounded-2xl relative z-10">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 400, center: [20, 0] }}
            height={800}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const geoName = geo.properties.name || geo.properties.geounit;
                    const mappedName = NAME_MAPPING[geoName] || geoName;
                    const d = countries.find((s) => s.name === mappedName);
                    
                    let isVisible = true;
                    if (d && d.isEvaluated && d.democracyScore !== undefined) {
                      if (d.democracyScore >= 0.90 && !filters.excellent) isVisible = false;
                      else if (d.democracyScore >= 0.75 && d.democracyScore < 0.90 && !filters.very_good) isVisible = false;
                      else if (d.democracyScore >= 0.60 && d.democracyScore < 0.75 && !filters.good) isVisible = false;
                      else if (d.democracyScore >= 0.45 && d.democracyScore < 0.60 && !filters.acceptable) isVisible = false;
                      else if (d.democracyScore < 0.45 && !filters.very_weak) isVisible = false;
                    }

                    const getColor = (score: number) => {
                      if (score >= 0.90) return "#14b8a6"; // Excellent
                      if (score >= 0.75) return "#84cc16"; // Very Good
                      if (score >= 0.60) return "#facc15"; // Good
                      if (score >= 0.45) return "#fb923c"; // Acceptable
                      return "#ea1c0e"; // Very Weak
                    };

                    let fillColor = "#253761"; // Default unbound color
                    if (d && d.isEvaluated && d.democracyScore !== undefined) {
                      fillColor = isVisible ? getColor(d.democracyScore) : "#16264f";
                    }

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        onMouseEnter={() => {
                          if (d && !d.isEvaluated) {
                            setTooltipContent(`${d.name}: Not Evaluated`);
                          } else if (d && isVisible) {
                            setTooltipContent(`${d.name}: ${d.democracyScore}`);
                          } else if (!isVisible) {
                            setTooltipContent("");
                          } else {
                            setTooltipContent(`${mappedName}: No data`);
                          }
                        }}
                        onMouseLeave={() => setTooltipContent("")}
                        onClick={() => {
                          if (d && isVisible && d.isEvaluated) navigate(`/country/${d.id}`);
                        }}
                        style={{
                          default: { outline: "none", stroke: "#253761", strokeWidth: 0.5 },
                          hover: { outline: "none", fill: (!d || !isVisible) ? fillColor : "#3b82f6", cursor: (d && isVisible) ? "pointer" : "default" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>
    </div>
  );
}
