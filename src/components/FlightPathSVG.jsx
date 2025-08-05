import { useMemo } from 'react';
import { generateFlightPath } from '../utils/flightPath';
import './FlightPathSVG.css';

function FlightPathSVG({ disc, skillLevel, distance, width = 400, height = 600 }) {
  // Dynamic scaling based on disc category
  const getMaxDistanceForCategory = (category) => {
    switch (category?.toLowerCase()) {
      case 'distance driver': return 500;
      case 'hybrid driver': return 450;
      case 'control driver': return 400;
      case 'midrange': return 300;
      case 'approach discs': return 250;
      case 'putter': return 200;
      default: return 400;
    }
  };

  const getDistanceMarkers = (maxDistance) => {
    if (maxDistance <= 200) return [0, 50, 100, 150, 200];
    if (maxDistance <= 250) return [0, 50, 100, 150, 200, 250];
    if (maxDistance <= 300) return [0, 75, 150, 225, 300];
    if (maxDistance <= 400) return [0, 100, 200, 300, 400];
    if (maxDistance <= 450) return [0, 100, 200, 300, 400, 450];
    return [0, 100, 200, 300, 400, 500];
  };

  const maxDistance = getMaxDistanceForCategory(disc.category);
  const distanceMarkers = getDistanceMarkers(maxDistance);

  const flightPath = useMemo(() => {
    return generateFlightPath(disc, distance, maxDistance);
  }, [disc, distance, maxDistance]);

  const viewBox = `0 0 ${width} ${height}`;
  const pathData = flightPath.join(' ');

  const centerX = width / 2;
  const startY = height - 100; // Release point at bottom
  const endY = 50; // Landing point at top

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
            width="25"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 50 L 0 0 25 0"
              fill="none"
              stroke="var(--grid-color, #f1f5f9)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Distance markers */}
        {distanceMarkers.map((dist, index) => {
          const y = startY - (startY - endY) * (dist / maxDistance); // Use maxDistance for scaling
          return (
            <g key={dist}>
              <line
                x1="50"
                y1={y}
                x2="60"
                y2={y}
                stroke="var(--marker-color, #94a3b8)"
                strokeWidth="2"
              />
              <text
                x="45"
                y={y + 4}
                textAnchor="end"
                className="distance-marker"
                fill="var(--text-color, #6b7280)"
              >
                {dist}ft
              </text>
            </g>
          );
        })}
        
        {/* Flight path */}
        <path
          d={pathData}
          fill="none"
          stroke="var(--flight-path-color, #3b82f6)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flight-path-line"
        />
        
        {/* Start point (release) */}
        <circle
          cx={centerX}
          cy={startY}
          r="8"
          fill="#10b981"
          stroke="white"
          strokeWidth="3"
        />
        
        {/* End point (landing) */}
        <circle
          cx={centerX + (parseInt(disc.turn) * 10) - (parseInt(disc.fade) * 15)}
          cy={startY - (startY - endY) * (distance / maxDistance)}
          r="8"
          fill="#ef4444"
          stroke="white"
          strokeWidth="3"
        />
        
        {/* Labels */}
        <text
          x={centerX}
          y={startY + 25}
          textAnchor="middle"
          className="flight-path-label"
          fill="var(--text-color, #6b7280)"
          fontWeight="600"
        >
          Release Point
        </text>
        
        <text
          x={centerX + (parseInt(disc.turn) * 10) - (parseInt(disc.fade) * 15)}
          y={startY - (startY - endY) * (distance / maxDistance) - 15}
          textAnchor="middle"
          className="flight-path-label"
          fill="#ef4444"
          fontWeight="600"
        >
          {distance} ft
        </text>
        
        {/* Direction indicators */}
        <text
          x={width - 30}
          y={startY + 50}
          textAnchor="middle"
          className="direction-label"
          fill="var(--text-color, #9ca3af)"
          transform={`rotate(-90, ${width - 30}, ${startY + 50})`}
        >
          Flight Direction →
        </text>
      </svg>
    </div>
  );
}

export default FlightPathSVG;