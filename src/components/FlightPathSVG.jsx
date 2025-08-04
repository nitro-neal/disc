import { useMemo } from 'react';
import { generateFlightPath } from '../utils/flightPath';
import './FlightPathSVG.css';

function FlightPathSVG({ disc, width = 600, height = 200 }) {
  const flightPath = useMemo(() => {
    return generateFlightPath(disc);
  }, [disc]);

  const viewBox = `0 0 ${width} ${height}`;
  const pathData = flightPath.join(' ');

  return (
    <div className="flight-path-svg-container">
      <svg
        className="flight-path-svg"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Flight path for ${disc.name}`}
      >
        {/* Background grid */}
        <defs>
          <pattern
            id="grid"
            width="50"
            height="25"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 25"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Ground line */}
        <line
          x1="0"
          y1={height - 20}
          x2={width}
          y2={height - 20}
          stroke="#94a3b8"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Flight path */}
        <path
          d={pathData}
          fill="none"
          stroke={disc.color || '#3b82f6'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flight-path-line"
        />
        
        {/* Start point */}
        <circle
          cx="50"
          cy={height / 2}
          r="6"
          fill="#10b981"
          stroke="white"
          strokeWidth="2"
        />
        
        {/* End point */}
        <circle
          cx={width - 50}
          cy={flightPath[flightPath.length - 1]?.split(' ')[2] || height / 2}
          r="6"
          fill="#ef4444"
          stroke="white"
          strokeWidth="2"
        />
        
        {/* Labels */}
        <text
          x="50"
          y={height - 5}
          textAnchor="middle"
          className="flight-path-label"
          fill="#6b7280"
        >
          Release
        </text>
        
        <text
          x={width - 50}
          y={height - 5}
          textAnchor="middle"
          className="flight-path-label"
          fill="#6b7280"
        >
          Landing
        </text>
        
        {/* Wind direction indicator */}
        <g className="wind-indicator">
          <text
            x={width - 100}
            y="20"
            textAnchor="end"
            className="wind-label"
            fill="#9ca3af"
          >
            No Wind
          </text>
          <path
            d="M {width - 90} 15 L {width - 80} 10 L {width - 80} 20 Z"
            fill="#9ca3af"
          />
        </g>
      </svg>
      
      {/* Flight characteristics overlay */}
      <div className="flight-characteristics-overlay">
        <div className="flight-stage">
          <div className="stage-name">Initial Turn</div>
          <div className="stage-value">{disc.turn}</div>
        </div>
        <div className="flight-stage">
          <div className="stage-name">Glide</div>
          <div className="stage-value">{disc.glide}</div>
        </div>
        <div className="flight-stage">
          <div className="stage-name">Fade</div>
          <div className="stage-value">{disc.fade}</div>
        </div>
      </div>
    </div>
  );
}

export default FlightPathSVG;