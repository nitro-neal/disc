import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateBagReport } from '../utils/bagReport';
import FlightPathModal from '../components/FlightPathModal';
import CombinedFlightChart from '../components/CombinedFlightChart';
import './BagReport.css';

function BagReport() {
  const { id } = useParams();
  const { state } = useApp();
  const [bag, setBag] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [selectedDisc, setSelectedDisc] = useState(null);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const foundBag = state.bags.find(b => b.id === id);
    if (foundBag) {
      setBag(foundBag);
      const report = generateBagReport(foundBag);
      setReportData(report);
    }
  }, [id, state.bags]);

  if (state.loading) {
    return (
      <div className="container">
        <div className="loading-page">
          <div className="spinner"></div>
          <p>Loading bag report...</p>
        </div>
      </div>
    );
  }

  if (!bag) {
    return (
      <div className="container">
        <div className="error-page">
          <h1>Bag Not Found</h1>
          <p>The bag you're looking for doesn't exist.</p>
          <Link to="/bags" className="btn-primary">Back to Bags</Link>
        </div>
      </div>
    );
  }

  const getStabilityColor = (stability) => {
    switch (stability?.toLowerCase()) {
      case 'very overstable': return '#dc2626';
      case 'overstable': return '#f59e0b';
      case 'stable': return '#10b981';
      case 'understable': return '#3b82f6';
      case 'very understable': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const discsList = bag?.discs || [];

  const estimateDistance = (disc) => {
    // Lightweight estimator to size mini charts similar to modal formula (intermediate)
    const C_skill = 30;
    const speed = parseInt(disc.speed);
    const glide = parseInt(disc.glide);
    const turn = parseInt(disc.turn);
    const fade = parseInt(disc.fade);
    const distance = C_skill * speed * (1 + 0.10 * (glide - 4)) * (1 + 0.05 * (-turn)) * (1 - 0.05 * fade);
    return Math.max(120, Math.min(500, Math.round(distance)));
  };

  return (
    <div className="bag-report">
      <div className="container">
        {/* Header */}
        <div className="report-header">
          <div className="report-info">
            <Link to={`/bag/${bag.id}`} className="back-link">← Back to Editor</Link>
            <h1 className="report-title">{bag.name} Report</h1>
            {bag.description && (
              <p className="report-description">{bag.description}</p>
            )}
          </div>
        </div>

        {reportData && (
          <>
            {/* Summary Stats */}
            <div className="report-summary">
              <div className="summary-card">
                <div className="summary-value">{reportData.totalDiscs}</div>
                <div className="summary-label">Total Discs</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{reportData.categories.length}</div>
                <div className="summary-label">Categories</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{reportData.speedRange.min}-{reportData.speedRange.max}</div>
                <div className="summary-label">Speed Range</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{reportData.brands.length}</div>
                <div className="summary-label">Brands</div>
              </div>
            </div>

            {/* Combined Flight Chart */}
            <div className="flight-gallery-container">
              <h2>Flight Chart</h2>
              <p className="chart-description">All discs overlaid in one interactive chart. Click a path or marker for details.</p>
              <CombinedFlightChart discs={discsList} onSelectDisc={setSelectedDisc} />
            </div>

            {/* Category Breakdown */}
            <div className="category-breakdown">
              <h2>Category Breakdown</h2>
              <div className="category-grid">
                {reportData.categoryBreakdown.map(category => (
                  <div key={category.name} className="category-card">
                    <div className="category-header">
                      <h3 className="category-name">{category.name}</h3>
                      <span className="category-count">{category.count}</span>
                    </div>
                    <div className="category-discs">
                      {category.discs.slice(0, 3).map(disc => (
                        <div key={disc.id} className="category-disc">
                          <span className="disc-name">{disc.name}</span>
                          <span className="disc-numbers">{disc.speed}|{disc.glide}|{disc.turn}|{disc.fade}</span>
                        </div>
                      ))}
                      {category.discs.length > 3 && (
                        <div className="category-more">
                          +{category.discs.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coverage Analysis */}
            <div className="coverage-analysis">
              <h2>Coverage Analysis</h2>
              <div className="coverage-cards">
                <div className="coverage-card">
                  <h4>Speed Coverage</h4>
                  <p>You have discs ranging from speed {reportData.speedRange.min} to {reportData.speedRange.max}.</p>
                  {reportData.speedRange.gaps.length > 0 && (
                    <p className="coverage-gap">
                      Missing speeds: {reportData.speedRange.gaps.join(', ')}
                    </p>
                  )}
                </div>
                
                <div className="coverage-card">
                  <h4>Stability Balance</h4>
                  <div className="stability-bars">
                    {Object.entries(reportData.stabilityBreakdown).map(([stability, count]) => (
                      <div key={stability} className="stability-bar">
                        <span className="stability-name">{stability}</span>
                        <div className="stability-progress">
                          <div 
                            className="stability-fill"
                            style={{ 
                              width: `${(count / reportData.totalDiscs) * 100}%`,
                              backgroundColor: getStabilityColor(stability)
                            }}
                          />
                        </div>
                        <span className="stability-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {selectedDisc && (
        <FlightPathModal disc={selectedDisc} onClose={() => setSelectedDisc(null)} />
      )}
    </div>
  );
}

export default BagReport;