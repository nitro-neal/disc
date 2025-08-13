// Flight path generation utility based on disc flight numbers
// Generates SVG path data for visualizing disc flight

function computeFlightPoints(disc, distance = 300, maxDistance = 500) {
  const speed = parseInt(disc.speed);
  const glide = parseInt(disc.glide);
  const turn = parseInt(disc.turn);
  const fade = parseInt(disc.fade);

  // SVG dimensions (vertical layout)
  const width = 400;
  const height = 600;
  const centerX = width / 2;
  const startY = height - 100; // Release point at bottom
  const endY = 50; // Landing point at top

  // Calculate vertical flight path based on distance
  const flightDistance = Math.min(distance, maxDistance);
  const totalFlightY = Math.abs(endY - startY) * (flightDistance / maxDistance);
  
  // Generate more points for smoother curves
  const points = [];
  const numPoints = 40; // More points for smoother curves
  
  // Calculate flight characteristics based on disc flight numbers
  // Turn: negative = right turn, 0 = straight, positive = left turn (rare)
  // Fade: positive = left hook at end of flight
  const turnStrength = Math.abs(turn) * 12; // How far the disc turns
  const fadeStrength = fade * 15; // How far left the disc fades back
  
  for (let i = 0; i <= numPoints; i++) {
    const progress = i / numPoints;
    // Y goes from startY (bottom) towards endY (top)
    const y = startY - (totalFlightY * progress);
    
    let x = centerX;
    
    // Create smooth S-curve using realistic disc flight physics
    if (progress <= 0.65) {
      // Early flight phase - turn dominates
      // Use smooth ease-in curve for natural turn
      const turnProgress = progress / 0.65;
      const easeIn = turnProgress * turnProgress * (3 - 2 * turnProgress); // Smooth S-curve
      
      // Turn effect: negative turn = right turn for RHBH (move right = positive X)
      if (turn < 0) {
        // Understable disc - turns right (positive X direction)
        x = centerX + (easeIn * turnStrength);
      } else if (turn > 0) {
        // Overstable disc - turns left (negative X direction) - rare
        x = centerX - (easeIn * turnStrength);
      } else {
        // Stable disc - flies straight
        x = centerX;
      }
      
      // Glide effect - affects how much the disc drifts during flight
      // High glide discs tend to drift more in their turn direction
      if (turn !== 0) {
        const glideEffect = (glide - 4) * 2;
        const glideDrift = easeIn * glideEffect * (turn < 0 ? 1 : -1);
        x += glideDrift;
      }
      
    } else {
      // Late flight phase - fade takes over
      const fadeProgress = (progress - 0.65) / 0.35;
      const easeOut = fadeProgress * fadeProgress * (3 - 2 * fadeProgress); // Smooth S-curve
      
      // Calculate max turn position (where fade starts from)
      let maxTurnPosition = centerX;
      if (turn < 0) {
        maxTurnPosition = centerX + turnStrength;
        // Add glide drift if applicable
        if (glide !== 4) {
          const glideEffect = (glide - 4) * 2;
          maxTurnPosition += glideEffect; // Glide continues the turn direction
        }
      } else if (turn > 0) {
        maxTurnPosition = centerX - turnStrength;
        if (glide !== 4) {
          const glideEffect = (glide - 4) * 2;
          maxTurnPosition -= glideEffect;
        }
      }
      
      // Fade brings disc back left (negative X direction)
      const fadeAmount = easeOut * fadeStrength;
      x = maxTurnPosition - fadeAmount;
    }
    
    // Constrain X to reasonable bounds with some padding
    x = Math.max(80, Math.min(width - 80, x));
    
    points.push({ x, y });
  }
  return { points, width, height };
}

export function generateFlightGeometry(disc, distance = 300, maxDistance = 500) {
  const { points } = computeFlightPoints(disc, distance, maxDistance);
  if (points.length === 0) {
    return { pathData: '', endPoint: { x: 0, y: 0 } };
  }
  // Create smooth SVG path using cubic Bezier curves
  const pathDataParts = [];
  // Move to start point
  pathDataParts.push(`M ${points[0].x} ${points[0].y}`);
  // Use cubic Bezier curves for maximum smoothness
  for (let i = 1; i < points.length; i++) {
    const current = points[i];
    const prev = points[i - 1];
    if (i === 1) {
      // First segment - use quadratic for smooth start
      const controlX = prev.x + (current.x - prev.x) * 0.5;
      const controlY = prev.y + (current.y - prev.y) * 0.3;
      pathDataParts.push(`Q ${controlX} ${controlY} ${current.x} ${current.y}`);
    } else if (i === points.length - 1) {
      // Last segment - use quadratic for smooth end
      const controlX = prev.x + (current.x - prev.x) * 0.7;
      const controlY = prev.y + (current.y - prev.y) * 0.5;
      pathDataParts.push(`Q ${controlX} ${controlY} ${current.x} ${current.y}`);
    } else {
      // Middle segments - use cubic Bezier for maximum smoothness
      const next = points[i + 1] || current;
      const prevPrev = points[i - 2] || prev;
      const control1X = prev.x + (current.x - prevPrev.x) * 0.25;
      const control1Y = prev.y + (current.y - prevPrev.y) * 0.25;
      const control2X = current.x - (next.x - prev.x) * 0.25;
      const control2Y = current.y - (next.y - prev.y) * 0.25;
      pathDataParts.push(`C ${control1X} ${control1Y} ${control2X} ${control2Y} ${current.x} ${current.y}`);
    }
  }
  const pathData = pathDataParts.join(' ');
  const endPoint = points[points.length - 1];
  return { pathData, endPoint };
}

export function generateFlightPath(disc, distance = 300, maxDistance = 500) {
  // Backward compatible function that returns only path commands array
  const { pathData } = generateFlightGeometry(disc, distance, maxDistance);
  return pathData.split(' ');
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