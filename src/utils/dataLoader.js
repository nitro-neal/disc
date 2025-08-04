import localforage from 'localforage';

const CACHE_KEY = 'dg-discs-cache';
const CACHE_EXPIRY_KEY = 'dg-discs-cache-expiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Initialize localforage
localforage.config({
  name: 'DiscGolfApp',
  storeName: 'discs'
});

export async function loadDiscs() {
  try {
    // Check if we have cached data that's still valid
    const cacheExpiry = await localforage.getItem(CACHE_EXPIRY_KEY);
    const now = Date.now();
    
    if (cacheExpiry && now < cacheExpiry) {
      const cachedDiscs = await localforage.getItem(CACHE_KEY);
      if (cachedDiscs) {
        console.log('Using cached disc data');
        return cachedDiscs;
      }
    }

    // Load fresh data from the JSON file
    console.log('Loading fresh disc data');
    const response = await fetch('/discs.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch discs: ${response.statusText}`);
    }

    const discs = await response.json();
    
    // Cache the data
    await localforage.setItem(CACHE_KEY, discs);
    await localforage.setItem(CACHE_EXPIRY_KEY, now + CACHE_DURATION);
    
    console.log(`Loaded ${discs.length} discs`);
    return discs;
    
  } catch (error) {
    console.error('Error loading discs:', error);
    
    // Try to fall back to cached data even if expired
    const cachedDiscs = await localforage.getItem(CACHE_KEY);
    if (cachedDiscs) {
      console.log('Using expired cached data as fallback');
      return cachedDiscs;
    }
    
    throw error;
  }
}

// Utility functions for disc data
export function getDiscBySlug(discs, slug) {
  return discs.find(disc => disc.name_slug === slug);
}

export function getDiscsByBrand(discs, brandSlug) {
  return discs.filter(disc => disc.brand_slug === brandSlug);
}

export function getBrands(discs) {
  const brands = {};
  discs.forEach(disc => {
    if (!brands[disc.brand_slug]) {
      brands[disc.brand_slug] = {
        name: disc.brand,
        slug: disc.brand_slug,
        color: disc.color,
        backgroundColor: disc.background_color,
        discCount: 0
      };
    }
    brands[disc.brand_slug].discCount++;
  });
  
  return Object.values(brands).sort((a, b) => a.name.localeCompare(b.name));
}

export function getCategories(discs) {
  const categories = {};
  discs.forEach(disc => {
    if (!categories[disc.category_slug]) {
      categories[disc.category_slug] = {
        name: disc.category,
        slug: disc.category_slug,
        discCount: 0
      };
    }
    categories[disc.category_slug].discCount++;
  });
  
  return Object.values(categories).sort((a, b) => a.name.localeCompare(b.name));
}