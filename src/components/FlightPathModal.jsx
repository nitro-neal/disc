import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import FlightPathSVG from './FlightPathSVG';
import './FlightPathModal.css';

function FlightPathModal({ disc, onClose }) {
  const [skillLevel, setSkillLevel] = useState('intermediate');

  // Skill level constants for C_skill
  const skillConstants = {
    beginner: 25,
    intermediate: 30,
    advanced: 35,
    professional: 40
  };

  // Calculate flight distance using the provided formula
  const calculateDistance = () => {
    const C_skill = skillConstants[skillLevel];
    const speed = parseInt(disc.speed);
    const glide = parseInt(disc.glide);
    const turn = parseInt(disc.turn);
    const fade = parseInt(disc.fade);

    const Distance_ft = C_skill * speed * 
      (1 + 0.10 * (glide - 4)) * 
      (1 + 0.05 * (-turn)) * 
      (1 - 0.05 * fade);

    return Math.round(Distance_ft);
  };

  const distance = calculateDistance();
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

  const modalContent = (
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

        <div className="flight-controls">
          <div className="skill-selector">
            <label htmlFor="skill-level">Skill Level:</label>
            <select
              id="skill-level"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="skill-dropdown"
            >
              <option value="beginner">Beginner (25)</option>
              <option value="intermediate">Intermediate (30)</option>
              <option value="advanced">Advanced (35)</option>
              <option value="professional">Professional (40)</option>
            </select>
          </div>
          
          <div className="distance-display">
            <span className="distance-label">Estimated Distance:</span>
            <span className="distance-value">{distance} ft</span>
          </div>
        </div>

        <div className="flight-path-container">
          <FlightPathSVG disc={disc} skillLevel={skillLevel} distance={distance} />
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

  return createPortal(modalContent, document.body);
}

export default FlightPathModal;