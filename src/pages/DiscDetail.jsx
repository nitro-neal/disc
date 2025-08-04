import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getDiscBySlug } from '../utils/dataLoader';
import { findSimilarDiscs } from '../utils/fuzzySearch';
import FlightPathModal from '../components/FlightPathModal';
import './DiscDetail.css';

function DiscDetail() {
  const { slug } = useParams();
  const { state } = useApp();
  const [showFlightPath, setShowFlightPath] = useState(false);

  if (state.loading) {
    return (
      <div className="container">
        <div className="loading-page">
          <div className="spinner"></div>
          <p>Loading disc details...</p>
        </div>
      </div>
    );
  }

  const disc = getDiscBySlug(state.discs, slug);

  if (!disc) {
    return (
      <div className="container">
        <div className="error-page">
          <h1>Disc Not Found</h1>
          <p>The disc you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const similarDiscs = findSimilarDiscs(state.discs, disc, 6);

  const specs = [
    { label: 'Category', value: disc.category },
    { label: 'Speed', value: disc.speed },
    { label: 'Glide', value: disc.glide },
    { label: 'Turn', value: disc.turn },
    { label: 'Fade', value: disc.fade },
    { label: 'Stability', value: disc.stability }
  ];

  const getStabilityColor = (stability) => {
    switch (stability?.toLowerCase()) {
      case 'very overstable': return 'var(--color-error)';
      case 'overstable': return '#f59e0b';
      case 'stable': return 'var(--color-success)';
      case 'understable': return '#3b82f6';
      case 'very understable': return '#8b5cf6';
      default: return 'var(--color-secondary)';
    }
  };

  return (
    <div className="disc-detail">
      <div className="container">
        {/* Header */}
        <div className="disc-header">
          <div className="disc-image">
            <div
              className="disc-placeholder-large"
              style={{
                backgroundColor: disc.background_color,
                color: disc.color
              }}
            >
              {disc.name.charAt(0)}
            </div>
          </div>
          
          <div className="disc-header-info">
            <div className="disc-brand">{disc.brand}</div>
            <h1 className="disc-name">{disc.name}</h1>
            <div className="disc-numbers">
              <span className="number">Speed: {disc.speed}</span>
              <span className="number">Glide: {disc.glide}</span>
              <span className="number">Turn: {disc.turn}</span>
              <span className="number">Fade: {disc.fade}</span>
            </div>
            <div 
              className="disc-stability"
              style={{ color: getStabilityColor(disc.stability) }}
            >
              {disc.stability}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="disc-actions">
          <button
            onClick={() => setShowFlightPath(true)}
            className="btn-primary"
          >
            Show Flight Path
          </button>
          <Link
            to={`/flight?speed=${disc.speed}&glide=${disc.glide}&turn=${disc.turn}&fade=${disc.fade}`}
            className="btn-outline"
          >
            Find Similar
          </Link>
          <a
            href={disc.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Buy Online ↗
          </a>
        </div>

        {/* Specifications */}
        <div className="disc-specs">
          <h2>Specifications</h2>
          <div className="specs-grid">
            {specs.map((spec, index) => (
              <div key={index} className="spec-item">
                <dt className="spec-label">{spec.label}</dt>
                <dd className="spec-value">{spec.value}</dd>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Discs */}
        {similarDiscs.length > 0 && (
          <div className="similar-discs">
            <h2>Similar Discs</h2>
            <div className="similar-discs-grid">
              {similarDiscs.map(similarDisc => (
                <Link
                  key={similarDisc.id}
                  to={`/disc/${similarDisc.name_slug}`}
                  className="similar-disc-card"
                >
                  <div
                    className="similar-disc-image"
                    style={{
                      backgroundColor: similarDisc.background_color,
                      color: similarDisc.color
                    }}
                  >
                    {similarDisc.name.charAt(0)}
                  </div>
                  <div className="similar-disc-info">
                    <div className="similar-disc-name">{similarDisc.name}</div>
                    <div className="similar-disc-brand">{similarDisc.brand}</div>
                    <div className="similar-disc-numbers">
                      {similarDisc.speed} | {similarDisc.glide} | {similarDisc.turn} | {similarDisc.fade}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Flight Path Modal */}
      {showFlightPath && (
        <FlightPathModal
          disc={disc}
          onClose={() => setShowFlightPath(false)}
        />
      )}
    </div>
  );
}

export default DiscDetail;