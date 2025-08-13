import { useMemo } from 'react';
import { generateFlightGeometry } from '../utils/flightPath';
import './CombinedFlightChart.css';

function CombinedFlightChart({ discs, onSelectDisc, width = 1000, height = 700 }) {
  // ViewBox uses the same internal coordinate system as generateFlightPath
  const viewBoxWidth = 400;
  const viewBoxHeight = 600;
  const centerX = viewBoxWidth / 2;
  const startY = viewBoxHeight - 100;
  const endY = 50;

  const gridPatternId = useMemo(
    () => `grid-${Math.random().toString(36).slice(2)}`,
    []
  );

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

  const estimateDistance = (disc) => {
    const C_skill = 30; // intermediate baseline
    const speed = parseInt(disc.speed);
    const glide = parseInt(disc.glide);
    const turn = parseInt(disc.turn);
    const fade = parseInt(disc.fade);
    const distance = C_skill * speed * (1 + 0.10 * (glide - 4)) * (1 + 0.05 * (-turn)) * (1 - 0.05 * fade);
    return Math.max(120, Math.min(500, Math.round(distance)));
  };

  const colorForIndex = (index, total) => {
    const hue = Math.round((index * 360) / Math.max(1, total));
    return `hsl(${hue} 75% 50%)`;
  };

  const distanceMarkers = (maxDistance) => {
    if (maxDistance <= 200) return [0, 50, 100, 150, 200];
    if (maxDistance <= 250) return [0, 50, 100, 150, 200, 250];
    if (maxDistance <= 300) return [0, 75, 150, 225, 300];
    if (maxDistance <= 400) return [0, 100, 200, 300, 400];
    if (maxDistance <= 450) return [0, 100, 200, 300, 400, 450];
    return [0, 100, 200, 300, 400, 500];
  };

  // Choose a chart max distance that covers the longest disc
  const chartMaxDistance = useMemo(() => {
    const maxes = discs.map((d) => getMaxDistanceForCategory(d.category));
    return Math.max(300, ...maxes);
  }, [discs]);

  // Precompute path data and colors
  const items = useMemo(() => {
    return discs.map((disc, index) => {
      const maxDistance = getMaxDistanceForCategory(disc.category);
      const distance = estimateDistance(disc);
      const color = colorForIndex(index, discs.length);
      const { pathData, endPoint } = generateFlightGeometry(disc, distance, maxDistance);
      return { disc, color, path: pathData, endX: endPoint.x, endY: endPoint.y, distance, maxDistance };
    });
  }, [discs]);

  return (
    <div className="combined-flight-chart" style={{ width: '100%' }}>
      <svg
        className="combined-flight-svg"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        role="img"
        aria-label="Combined flight chart"
      >
        <defs>
          <pattern id={gridPatternId} width="25" height="50" patternUnits="userSpaceOnUse">
            <path d="M 0 50 L 0 0 25 0" fill="none" stroke="var(--grid-color, #f1f5f9)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridPatternId})`} />

        {/* Distance markers based on the chart's max distance */}
        {distanceMarkers(chartMaxDistance).map((dist) => {
          const y = startY - (startY - endY) * (dist / chartMaxDistance);
          return (
            <g key={`marker-${dist}`}>
              <line x1="50" y1={y} x2="65" y2={y} stroke="var(--marker-color, #94a3b8)" strokeWidth="2" />
              <text x="45" y={y + 4} textAnchor="end" className="distance-marker" fill="var(--text-color, #6b7280)">
                {dist}ft
              </text>
            </g>
          );
        })}

        {/* Axes labels */}
        <text x={viewBoxWidth - 30} y={startY + 50} textAnchor="middle" className="direction-label" fill="var(--text-color, #9ca3af)" transform={`rotate(-90, ${viewBoxWidth - 30}, ${startY + 50})`}>
          Flight Direction →
        </text>

        {/* All disc flight paths */}
        {items.map(({ disc, color, path }, idx) => (
          <path
            key={`path-${disc.id}-${idx}`}
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="multi-flight-path"
            onClick={() => onSelectDisc?.(disc)}
          >
            <title>
              {`${disc.name} (${disc.brand}): ${disc.speed}|${disc.glide}|${disc.turn}|${disc.fade}`}
            </title>
          </path>
        ))}

        {/* Landing markers */}
        {items.map(({ disc, color, endX, endY: y }, idx) => (
          <g key={`marker-${disc.id}-${idx}`} style={{ cursor: 'pointer' }}>
            <circle
              cx={endX}
              cy={y}
              r="7"
              fill={color}
              stroke="white"
              strokeWidth="2"
              className="disc-marker"
              onClick={() => onSelectDisc?.(disc)}
            >
              <title>{`${disc.name} • ${disc.brand}`}</title>
            </circle>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="combined-legend" role="list">
        {items.map(({ disc, color }, idx) => (
          <button
            key={`legend-${disc.id}-${idx}`}
            className="legend-item"
            onClick={() => onSelectDisc?.(disc)}
            aria-label={`Show details for ${disc.name}`}
          >
            <span className="legend-chip" style={{ backgroundColor: color }} />
            <span className="legend-name">{disc.name}</span>
            <span className="legend-numbers">{disc.speed}|{disc.glide}|{disc.turn}|{disc.fade}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CombinedFlightChart;


