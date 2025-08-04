// Flight path generation utility based on disc flight numbers
// Generates SVG path data for visualizing disc flight

export function generateFlightPath(disc) {
  const speed = parseInt(disc.speed);
  const glide = parseInt(disc.glide);
  const turn = parseInt(disc.turn);
  const fade = parseInt(disc.fade);

  // SVG dimensions (matches FlightPathSVG component)
  const width = 600;
  const height = 200;
  const startX = 50;
  const endX = width - 50;
  const centerY = height / 2;

  // Calculate flight characteristics
  const distance = speed * 30; // Base distance scaling
  const totalDistance = Math.min(distance, endX - startX);
  
  // Initial angle based on turn (-5 to +1 maps to angles)
  const initialAngle = turn * -5; // degrees
  
  // Fade arc starts at 60% of path length
  const fadeStartPercent = 0.6;
  const fadeStartX = startX + (totalDistance * fadeStartPercent);
  
  // Generate path points
  const points = [];
  const numPoints = 20;
  
  for (let i = 0; i <= numPoints; i++) {
    const progress = i / numPoints;
    const x = startX + (totalDistance * progress);
    
    let y = centerY;
    
    // Phase 1: Initial turn (first 60% of flight)
    if (progress <= fadeStartPercent) {
      const turnProgress = progress / fadeStartPercent;
      // Turn curve - negative turn means right turn (higher Y), positive means left (lower Y)
      const turnAmount = Math.sin(turnProgress * Math.PI) * turn * -8;
      
      // Glide affects how much the disc stays aloft
      const glideBonus = (glide - 4) * 3; // Relative to neutral glide of 4
      const glideEffect = Math.sin(turnProgress * Math.PI * 0.5) * glideBonus;
      
      y = centerY + turnAmount - glideEffect;
    }
    // Phase 2: Fade (last 40% of flight)
    else {
      const fadeProgress = (progress - fadeStartPercent) / (1 - fadeStartPercent);
      
      // Continue from where turn phase ended
      const endTurnY = centerY + Math.sin(1 * Math.PI) * turn * -8 - (glide - 4) * 3 * Math.sin(1 * Math.PI * 0.5);
      
      // Fade curve - always hooks left for RHBH (positive Y direction in our coordinate system)
      const fadeAmount = fadeProgress * fade * 12;
      
      // Gravity effect increases during fade
      const gravityEffect = fadeProgress * fadeProgress * 20;
      
      y = endTurnY + fadeAmount + gravityEffect;
    }
    
    // Constrain Y to reasonable bounds
    y = Math.max(20, Math.min(height - 40, y));
    
    points.push({ x, y });
  }
  
  // Convert points to SVG path data
  const pathData = [];
  
  // Move to start point
  pathData.push(`M ${points[0].x} ${points[0].y}`);
  
  // Create smooth curve using quadratic bezier curves
  for (let i = 1; i < points.length; i++) {
    if (i === 1) {
      // First curve segment
      pathData.push(`Q ${points[i].x} ${points[i].y} ${points[i].x} ${points[i].y}`);
    } else {
      // Smooth curve between points
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      
      // Control point for smooth curve
      const controlX = (prevPoint.x + currentPoint.x) / 2;
      const controlY = (prevPoint.y + currentPoint.y) / 2;
      
      pathData.push(`Q ${controlX} ${controlY} ${currentPoint.x} ${currentPoint.y}`);
    }
  }
  
  return pathData;
}

// Get flight path description in words
export function getFlightDescription(disc) {
  const speed = parseInt(disc.speed);
  const glide = parseInt(disc.glide);
  const turn = parseInt(disc.turn);
  const fade = parseInt(disc.fade);
  
  let description = [];
  
  // Speed description
  if (speed >= 13) description.push("very fast");
  else if (speed >= 10) description.push("fast");
  else if (speed >= 7) description.push("moderate speed");
  else if (speed >= 4) description.push("slow");
  else description.push("very slow");
  
  // Turn description
  if (turn <= -3) description.push("with strong right turn");
  else if (turn <= -1) description.push("with right turn");
  else if (turn === 0) description.push("flying straight");
  else description.push("with left turn");
  
  // Fade description
  if (fade >= 4) description.push("finishing with hard left hook");
  else if (fade >= 2) description.push("finishing with left hook");
  else if (fade === 1) description.push("finishing with slight left hook");
  else description.push("finishing straight");
  
  return description.join(" ");
}