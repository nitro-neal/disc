import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContextProvider } from './context/AppContext';
import AppShell from './components/AppShell';
import Home from './pages/Home';
import DiscDetail from './pages/DiscDetail';
import BrandGrid from './pages/BrandGrid';
import BrandDetail from './pages/BrandDetail';
import FlightSearch from './pages/FlightSearch';
import BagsDashboard from './pages/BagsDashboard';
import BagEditor from './pages/BagEditor';
import BagReport from './pages/BagReport';
import GetGood from './pages/GetGood';
import ProBags from './pages/ProBags';
import ProBagDetail from './pages/ProBagDetail';
import Scorecards from './pages/Scorecards';
import NewScorecard from './pages/NewScorecard';
import Scorecard from './pages/Scorecard';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <ContextProvider>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/disc/:slug" element={<DiscDetail />} />
            <Route path="/brand" element={<BrandGrid />} />
            <Route path="/brand/:slug" element={<BrandDetail />} />
            <Route path="/flight" element={<FlightSearch />} />
            <Route path="/bags" element={<BagsDashboard />} />
            <Route path="/bag/:id" element={<BagEditor />} />
            <Route path="/bag/:id/report" element={<BagReport />} />
            <Route path="/get-good" element={<GetGood />} />
            <Route path="/pro-bags" element={<ProBags />} />
            <Route path="/pro-bag/:slug" element={<ProBagDetail />} />
            <Route path="/scorecards" element={<Scorecards />} />
            <Route path="/scorecards/new" element={<NewScorecard />} />
            <Route path="/scorecard/:id" element={<Scorecard />} />
            {/* 404 Catch-all route - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </Router>
    </ContextProvider>
  );
}

export default App;