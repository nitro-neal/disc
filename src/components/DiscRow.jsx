import { Link } from 'react-router-dom';
import './DiscRow.css';

function DiscRow({ disc }) {
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

  const getCategoryBadgeColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'putter': return '#10b981';
      case 'approach discs': return '#f59e0b';
      case 'midrange': return '#3b82f6';
      case 'control driver': return '#8b5cf6';
      case 'hybrid driver': return '#ef4444';
      case 'distance driver': return '#dc2626';
      default: return 'var(--color-secondary)';
    }
  };

  const getDiscLetter = (name) => {
    // Handle special characters like ( and # by finding the first letter
    const firstLetter = name.match(/[A-Za-z]/);
    return firstLetter ? firstLetter[0].toUpperCase() : name.charAt(0).toUpperCase();
  };

  return (
    <Link to={`/disc/${disc.name_slug}`} className="disc-row">
      <div className="disc-row-image">
        <div
          className="disc-placeholder-small"
          style={{
            backgroundColor: getCategoryBadgeColor(disc.category),
            color: 'white'
          }}
        >
{getDiscLetter(disc.name)}
        </div>
      </div>

      <div className="disc-row-info">
        <div className="disc-row-header">
          <h3 className="disc-row-name">{disc.name}</h3>
          <span className="disc-brand">{disc.brand}</span>
        </div>
        
        <div className="disc-row-meta">
          <span className="disc-category">{disc.category}</span>
          <span className="disc-separator">•</span>
          <span 
            className="disc-stability"
            style={{ color: getStabilityColor(disc.stability) }}
          >
            {disc.stability}
          </span>
        </div>
      </div>

      <div className="disc-row-numbers">
        <div className="flight-numbers">
          <span className="flight-number" title="Speed">{disc.speed}</span>
          <span className="flight-separator">|</span>
          <span className="flight-number" title="Glide">{disc.glide}</span>
          <span className="flight-separator">|</span>
          <span className="flight-number" title="Turn">{disc.turn}</span>
          <span className="flight-separator">|</span>
          <span className="flight-number" title="Fade">{disc.fade}</span>
        </div>
      </div>

      <div className="disc-row-arrow">
        →
      </div>
    </Link>
  );
}

export default DiscRow;