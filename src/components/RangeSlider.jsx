import { useState, useRef, useCallback } from 'react';
import './RangeSlider.css';

function RangeSlider({ label, min, max, value, onChange, tooltip }) {
  const [isDragging, setIsDragging] = useState(null);
  const sliderRef = useRef(null);

  const getValueFromPosition = useCallback((clientX) => {
    if (!sliderRef.current) return min;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + percent * (max - min);
    
    // Round to nearest integer
    return Math.round(rawValue);
  }, [min, max]);

  const handleMouseDown = (thumbIndex) => (e) => {
    e.preventDefault();
    setIsDragging(thumbIndex);
    
    const handleMouseMove = (e) => {
      const newValue = getValueFromPosition(e.clientX);
      const newRange = [...value];
      
      if (thumbIndex === 0) {
        // Left thumb - ensure it doesn't go past right thumb
        newRange[0] = Math.min(newValue, value[1]);
      } else {
        // Right thumb - ensure it doesn't go before left thumb
        newRange[1] = Math.max(newValue, value[0]);
      }
      
      onChange(newRange);
    };
    
    const handleMouseUp = () => {
      setIsDragging(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTrackClick = (e) => {
    if (isDragging !== null) return;
    
    const newValue = getValueFromPosition(e.clientX);
    const leftDistance = Math.abs(newValue - value[0]);
    const rightDistance = Math.abs(newValue - value[1]);
    
    // Move the closest thumb
    if (leftDistance < rightDistance) {
      onChange([Math.min(newValue, value[1]), value[1]]);
    } else {
      onChange([value[0], Math.max(newValue, value[0])]);
    }
  };

  const getPercentage = (val) => ((val - min) / (max - min)) * 100;

  const leftPercent = getPercentage(value[0]);
  const rightPercent = getPercentage(value[1]);

  return (
    <div className="range-slider">
      <div className="range-slider-header">
        <label className="range-slider-label">
          {label}
          {tooltip && <span className="range-slider-tooltip" title={tooltip}>?</span>}
        </label>
        <div className="range-slider-values">
          <span className="range-value">{value[0]}</span>
          <span className="range-separator">–</span>
          <span className="range-value">{value[1]}</span>
        </div>
      </div>
      
      <div className="range-slider-container">
        <div 
          ref={sliderRef}
          className="range-slider-track"
          onClick={handleTrackClick}
        >
          {/* Background track */}
          <div className="range-slider-track-bg" />
          
          {/* Active range */}
          <div 
            className="range-slider-range"
            style={{
              left: `${leftPercent}%`,
              width: `${rightPercent - leftPercent}%`
            }}
          />
          
          {/* Left thumb */}
          <div
            className={`range-slider-thumb ${isDragging === 0 ? 'dragging' : ''}`}
            style={{ left: `${leftPercent}%` }}
            onMouseDown={handleMouseDown(0)}
            role="slider"
            aria-label={`${label} minimum`}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value[0]}
            tabIndex={0}
          >
            <div className="range-slider-thumb-value">{value[0]}</div>
          </div>
          
          {/* Right thumb */}
          <div
            className={`range-slider-thumb ${isDragging === 1 ? 'dragging' : ''}`}
            style={{ left: `${rightPercent}%` }}
            onMouseDown={handleMouseDown(1)}
            role="slider"
            aria-label={`${label} maximum`}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value[1]}
            tabIndex={0}
          >
            <div className="range-slider-thumb-value">{value[1]}</div>
          </div>
        </div>
        
        {/* Scale marks */}
        <div className="range-slider-scale">
          {Array.from({ length: Math.min(max - min + 1, 11) }, (_, i) => {
            const val = min + Math.round((i * (max - min)) / Math.min(max - min, 10));
            return (
              <div 
                key={val}
                className="range-slider-tick"
                style={{ left: `${getPercentage(val)}%` }}
              >
                <span className="range-slider-tick-label">{val}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RangeSlider;