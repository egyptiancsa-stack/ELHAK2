import { Routes, Route, HashRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AfricaMap } from './pages/AfricaMap';
import { CountryDetail } from './pages/CountryDetail';
import { DataCenter } from './pages/DataCenter';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { LanguageProvider } from './lib/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="map" element={<AfricaMap />} />
            <Route path="country/:id" element={<CountryDetail />} />
            <Route path="data" element={<DataCenter />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
}

export default App;
