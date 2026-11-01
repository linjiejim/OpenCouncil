import { Routes, Route } from 'react-router-dom';
import { I18nProvider } from './lib/i18n';
import { Header } from './components/layout/Header';
import { Home } from './pages/Home';
import { ThinkerList } from './pages/ThinkerList';
import { Thinker } from './pages/Thinker';
import { Work } from './pages/Work';
import { SearchPage } from './pages/SearchPage';
import { ThemeExplore } from './pages/ThemeExplore';

export default function App() {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-[var(--color-parchment)]">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/thinkers" element={<ThinkerList />} />
            <Route path="/thinker/:slug" element={<Thinker />} />
            <Route path="/work/:id" element={<Work />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/themes" element={<ThemeExplore />} />
          </Routes>
        </main>
      </div>
    </I18nProvider>
  );
}
