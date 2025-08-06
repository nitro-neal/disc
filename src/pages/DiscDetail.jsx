import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { getDiscBySlug } from '../utils/dataLoader';
import { findSimilarDiscs } from '../utils/fuzzySearch';
import FlightPathModal from '../components/FlightPathModal';
import './DiscDetail.css';

function DiscDetail() {
  const { slug } = useParams();
  const { state, actions } = useApp();
  const [showFlightPath, setShowFlightPath] = useState(false);
  const [showAddToBag, setShowAddToBag] = useState(false);
  const dropdownRef = useRef(null);

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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

  const getDiscDescription = (category) => {
    switch (category?.toLowerCase()) {
      case 'putter':
        return "Putters are designed for accuracy and control at short distances. They typically have low speed ratings and are ideal for putting, short approach shots, and controlled drives. Their stable flight makes them reliable for precision shots around the basket.";
      
      case 'approach discs':
        return "Approach discs bridge the gap between putters and midranges. They offer more distance than putters while maintaining excellent control and accuracy. Perfect for approach shots, short drives, and situations where you need reliable fade and placement.";
      
      case 'midrange':
        return "Midrange discs are versatile workhorses that provide excellent control and moderate distance. They're perfect for straight shots, gentle turnovers, and reliable hyzer shots. Great for learning proper form and developing consistent throws.";
      
      case 'control driver':
        return "Control drivers offer increased distance while maintaining good accuracy and control. They're ideal for players developing their arm speed and for shots requiring both distance and precision. These discs typically have moderate speed ratings.";
      
      case 'hybrid driver':
        return "Hybrid drivers combine elements of both control and distance drivers. They offer good distance potential with reasonable control, making them versatile for various shot shapes and distances. A great middle ground for developing players.";
      
      case 'distance driver':
        return "Distance drivers are built for maximum distance and require significant arm speed to fly properly. They feature high speed ratings and are designed for experienced players who can generate the power needed to achieve their full flight potential.";
      
      default:
        return "This disc offers unique flight characteristics designed to help players achieve their desired shot shapes and distances. Experiment with different release angles and power levels to discover its full potential.";
    }
  };

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

  const getDiscLetter = (name) => {
    // Handle special characters like ( and # by finding the first letter
    const firstLetter = name.match(/[A-Za-z]/);
    return firstLetter ? firstLetter[0].toUpperCase() : name.charAt(0).toUpperCase();
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAddToBag(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddToBag = (bagId) => {
    if (!disc) return;

    const bag = state.bags.find(b => b.id === bagId);
    if (!bag) return;

    // Check if disc is already in bag
    const isAlreadyInBag = bag.discs.some(d => d.id === disc.id);
    if (isAlreadyInBag) {
      alert('This disc is already in your bag!');
      return;
    }

    // Add disc to bag
    const updatedBag = {
      ...bag,
      discs: [...bag.discs, disc],
      updatedAt: new Date().toISOString()
    };

    actions.updateBag(updatedBag);
    setShowAddToBag(false);
    
    // Show success message
    alert(`Added ${disc.name} to ${bag.name}!`);
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
{getDiscLetter(disc.name)}
            </div>
          </div>
          
          <div className="disc-header-info">
            <h1 className="disc-name">{disc.name}</h1>
            <div className="disc-brand">{disc.brand}</div>
            
            <div className="disc-separator"></div>
            
            <div className="disc-characteristics">
              <div className="characteristic">
                <div className="characteristic-label">Speed</div>
                <div className="characteristic-value">{disc.speed}</div>
                <div className="characteristic-description">
                  How fast the disc flies through the air
                </div>
              </div>
              
              <div className="characteristic">
                <div className="characteristic-label">Glide</div>
                <div className="characteristic-value">{disc.glide}</div>
                <div className="characteristic-description">
                  How well the disc maintains loft during flight
                </div>
              </div>
              
              <div className="characteristic">
                <div className="characteristic-label">Turn</div>
                <div className="characteristic-value">{disc.turn}</div>
                <div className="characteristic-description">
                  Initial flight path tendency (negative = right turn for RHBH)
                </div>
              </div>
              
              <div className="characteristic">
                <div className="characteristic-label">Fade</div>
                <div className="characteristic-value">{disc.fade}</div>
                <div className="characteristic-description">
                  End flight path tendency (positive = left hook for RHBH)
                </div>
              </div>
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
            className="btn-primary"
          >
            Find Similar
          </Link>
          
          {/* Add to Bag Dropdown */}
          {state.bags.length > 0 && (
            <div className="add-to-bag-dropdown" ref={dropdownRef}>
              <button
                onClick={() => setShowAddToBag(!showAddToBag)}
                className="btn-primary"
              >
                Add to Bag ▼
              </button>
              
              {showAddToBag && (
                <div className="dropdown-menu">
                  {state.bags.map(bag => (
                    <button
                      key={bag.id}
                      onClick={() => handleAddToBag(bag.id)}
                      className="dropdown-item"
                    >
                      <span className="bag-name">{bag.name}</span>
                      <span className="bag-count">({bag.discs?.length || 0} discs)</span>
                    </button>
                  ))}
                  <div className="dropdown-divider"></div>
                  <Link
                    to="/bags"
                    className="dropdown-item create-bag-link"
                    onClick={() => setShowAddToBag(false)}
                  >
                    + Create New Bag
                  </Link>
                </div>
              )}
            </div>
          )}
          
          <a
            href={disc.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Buy Online ↗
          </a>
        </div>

        {/* Description */}
        <div className="disc-description">
          <p className="description-text">
            {getDiscDescription(disc.category)}
          </p>
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
{getDiscLetter(similarDisc.name)}
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