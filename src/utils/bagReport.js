// Bag report generation utilities

export function generateBagReport(bag) {
  const discs = bag.discs || [];
  
  if (discs.length === 0) {
    return {
      totalDiscs: 0,
      categories: [],
      brands: [],
      speedRange: { min: 0, max: 0, gaps: [] },
      categoryBreakdown: [],
      stabilityBreakdown: {},
      flightGrid: {}
    };
  }

  // Basic stats
  const totalDiscs = discs.length;
  const categories = [...new Set(discs.map(d => d.category))].sort();
  const brands = [...new Set(discs.map(d => d.brand))].sort();

  // Speed analysis
  const speeds = discs.map(d => parseInt(d.speed)).filter(s => !isNaN(s));
  const minSpeed = Math.min(...speeds);
  const maxSpeed = Math.max(...speeds);
  const speedGaps = [];
  
  for (let speed = minSpeed + 1; speed < maxSpeed; speed++) {
    if (!speeds.includes(speed)) {
      speedGaps.push(speed);
    }
  }

  const speedRange = {
    min: minSpeed,
    max: maxSpeed,
    gaps: speedGaps
  };

  // Category breakdown
  const categoryBreakdown = categories.map(category => {
    const categoryDiscs = discs.filter(d => d.category === category);
    return {
      name: category,
      count: categoryDiscs.length,
      discs: categoryDiscs
    };
  }).sort((a, b) => b.count - a.count);

  // Stability breakdown
  const stabilityBreakdown = {};
  discs.forEach(disc => {
    const stability = disc.stability || 'Unknown';
    stabilityBreakdown[stability] = (stabilityBreakdown[stability] || 0) + 1;
  });

  // Flight grid (15x7 grid: speed 1-15, turn+fade -3 to +3)
  const flightGrid = {};
  
  discs.forEach(disc => {
    const speed = parseInt(disc.speed);
    const turn = parseInt(disc.turn);
    const fade = parseInt(disc.fade);
    
    if (!isNaN(speed) && !isNaN(turn) && !isNaN(fade)) {
      // Map turn + fade to column (-3 to +3)
      const turnFadeValue = Math.max(-3, Math.min(3, turn + fade));
      const cellKey = `${speed}-${turnFadeValue}`;
      
      if (!flightGrid[cellKey]) {
        flightGrid[cellKey] = [];
      }
      flightGrid[cellKey].push(disc);
    }
  });

  return {
    totalDiscs,
    categories,
    brands,
    speedRange,
    categoryBreakdown,
    stabilityBreakdown,
    flightGrid
  };
}

// Get recommendations for filling gaps in the bag
export function getBagRecommendations(bag, allDiscs) {
  const report = generateBagReport(bag);
  const recommendations = [];

  // Speed gap recommendations
  if (report.speedRange.gaps.length > 0) {
    report.speedRange.gaps.forEach(speed => {
      const speedDiscs = allDiscs
        .filter(d => parseInt(d.speed) === speed)
        .slice(0, 3);
      
      if (speedDiscs.length > 0) {
        recommendations.push({
          type: 'speed_gap',
          title: `Speed ${speed} Disc`,
          description: `You're missing discs with speed ${speed}`,
          discs: speedDiscs
        });
      }
    });
  }

  // Stability balance recommendations
  const totalDiscs = report.totalDiscs;
  const overstableCount = (report.stabilityBreakdown['Overstable'] || 0) + 
                         (report.stabilityBreakdown['Very Overstable'] || 0);
  const understableCount = (report.stabilityBreakdown['Understable'] || 0) + 
                          (report.stabilityBreakdown['Very Understable'] || 0);
  
  const overstableRatio = overstableCount / totalDiscs;
  const understableRatio = understableCount / totalDiscs;
  
  if (overstableRatio < 0.2) {
    const overstableDiscs = allDiscs
      .filter(d => d.stability?.toLowerCase().includes('overstable'))
      .slice(0, 3);
    
    recommendations.push({
      type: 'stability_balance',
      title: 'More Overstable Discs',
      description: 'Consider adding more overstable discs for windy conditions',
      discs: overstableDiscs
    });
  }
  
  if (understableRatio < 0.2) {
    const understableDiscs = allDiscs
      .filter(d => d.stability?.toLowerCase().includes('understable'))
      .slice(0, 3);
    
    recommendations.push({
      type: 'stability_balance',
      title: 'More Understable Discs',
      description: 'Consider adding more understable discs for turnover shots',
      discs: understableDiscs
    });
  }

  // Category recommendations
  const hasDrivers = report.categories.some(cat => 
    cat.toLowerCase().includes('driver')
  );
  const hasMidrange = report.categories.some(cat => 
    cat.toLowerCase().includes('midrange')
  );
  const hasPutters = report.categories.some(cat => 
    cat.toLowerCase().includes('putter')
  );

  if (!hasDrivers && totalDiscs < 10) {
    recommendations.push({
      type: 'category_gap',
      title: 'Driver Recommendation',
      description: 'Consider adding a driver for longer distances',
      discs: allDiscs.filter(d => d.category?.toLowerCase().includes('driver')).slice(0, 3)
    });
  }

  if (!hasMidrange && totalDiscs < 10) {
    recommendations.push({
      type: 'category_gap',
      title: 'Midrange Recommendation',
      description: 'Consider adding a midrange for controlled approaches',
      discs: allDiscs.filter(d => d.category?.toLowerCase().includes('midrange')).slice(0, 3)
    });
  }

  if (!hasPutters && totalDiscs < 10) {
    recommendations.push({
      type: 'category_gap',
      title: 'Putter Recommendation',
      description: 'Consider adding a putter for short approaches and putting',
      discs: allDiscs.filter(d => d.category?.toLowerCase().includes('putter')).slice(0, 3)
    });
  }

  return recommendations.slice(0, 5); // Limit to 5 recommendations
}