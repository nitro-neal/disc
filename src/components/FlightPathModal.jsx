import { useEffect } from 'react';
import FlightPathSVG from './FlightPathSVG';
import './FlightPathModal.css';

function FlightPathModal({ disc, onClose }) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="flight-path-modal-backdrop" onClick={handleBackdropClick}>
      <div className="flight-path-modal">
        <div className="flight-path-modal-header">
          <div className="disc-info">
            <h2>{disc.name}</h2>
            <p>{disc.brand} • {disc.speed} | {disc.glide} | {disc.turn} | {disc.fade}</p>
          </div>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="flight-path-container">
          <FlightPathSVG disc={disc} />
        </div>

        <div className="flight-path-info">
          <div className="flight-characteristics">
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

          <div className="stability-info">
            <div className="stability-indicator">
              <span className="stability-label">Stability:</span>
              <span 
                className="stability-value"
                style={{
                  color: disc.stability?.toLowerCase().includes('overstable') ? '#ef4444' :
                         disc.stability?.toLowerCase().includes('understable') ? '#3b82f6' :
                         '#10b981'
                }}
              >
                {disc.stability}
              </span>
            </div>
            <p className="flight-note">
              Flight path shown for right-handed backhand throw (RHBH) at moderate power.
              Actual flight may vary based on release angle, power, and wind conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightPathModal;