import Fuse from 'fuse.js';

// Fuse.js configuration for fuzzy searching
const fuseOptions = {
  threshold: 0.3, // 0.0 = perfect match, 1.0 = match anything
  keys: [
    {
      name: 'name',
      weight: 0.7
    },
    {
      name: 'brand',
      weight: 0.2
    },
    {
      name: 'category',
      weight: 0.1
    }
  ],
  includeScore: true,
  includeMatches: true
};

let fuseInstance = null;

export function initializeFuse(discs) {
  fuseInstance = new Fuse(discs, fuseOptions);
}

export function searchDiscs(discs, query) {
  if (!fuseInstance) {
    initializeFuse(discs);
  }
  
  if (!query || query.trim().length === 0) {
    return [];
  }

  const results = fuseInstance.search(query.trim());
  
  // Return the disc objects, sorted by score (best matches first)
  return results.map(result => result.item);
}

// Search discs by flight numbers
export function searchByFlightNumbers(discs, filters) {
  const { speed, glide, turn, fade } = filters;
  
  return discs.filter(disc => {
    const discSpeed = parseInt(disc.speed);
    const discGlide = parseInt(disc.glide);
    const discTurn = parseInt(disc.turn);
    const discFade = parseInt(disc.fade);
    
    // Check if disc matches all provided ranges
    if (speed && (discSpeed < speed[0] || discSpeed > speed[1])) return false;
    if (glide && (discGlide < glide[0] || discGlide > glide[1])) return false;
    if (turn && (discTurn < turn[0] || discTurn > turn[1])) return false;
    if (fade && (discFade < fade[0] || discFade > fade[1])) return false;
    
    return true;
  });
}

// Get similar discs using simple distance calculation
export function findSimilarDiscs(discs, targetDisc, limit = 10) {
  const targetSpeed = parseInt(targetDisc.speed);
  const targetGlide = parseInt(targetDisc.glide);
  const targetTurn = parseInt(targetDisc.turn);
  const targetFade = parseInt(targetDisc.fade);
  
  const candidates = discs
    .filter(disc => disc.id !== targetDisc.id) // Exclude the target disc
    .filter(disc => {
      // Pre-filter to discs within reasonable range (±1 on each attribute)
      const speed = parseInt(disc.speed);
      const glide = parseInt(disc.glide);
      const turn = parseInt(disc.turn);
      const fade = parseInt(disc.fade);
      
      return Math.abs(speed - targetSpeed) <= 1 &&
             Math.abs(glide - targetGlide) <= 1 &&
             Math.abs(turn - targetTurn) <= 1 &&
             Math.abs(fade - targetFade) <= 1;
    })
    .map(disc => {
      // Calculate simple Euclidean distance
      const speed = parseInt(disc.speed);
      const glide = parseInt(disc.glide);
      const turn = parseInt(disc.turn);
      const fade = parseInt(disc.fade);
      
      const distance = Math.sqrt(
        Math.pow(speed - targetSpeed, 2) +
        Math.pow(glide - targetGlide, 2) +
        Math.pow(turn - targetTurn, 2) +
        Math.pow(fade - targetFade, 2)
      );
      
      return { disc, distance };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(item => item.disc);
    
  return candidates;
}