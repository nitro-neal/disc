import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getDiscsByBrand } from '../utils/dataLoader';
import DiscRow from '../components/DiscRow';
import './BrandDetail.css';

function BrandDetail() {
  const { slug } = useParams();
  const { state } = useApp();
  const [sortBy, setSortBy] = useState('name');
  const [filterSpeed, setFilterSpeed] = useState('all');

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const brandDiscs = useMemo(() => {
    return getDiscsByBrand(state.discs, slug);
  }, [state.discs, slug]);

  const filteredAndSortedDiscs = useMemo(() => {
    let discs = [...brandDiscs];

    // Filter by speed
    if (filterSpeed !== 'all') {
      const speedRange = filterSpeed.split('-').map(Number);
      discs = discs.filter(disc => {
        const speed = parseInt(disc.speed);
        return speed >= speedRange[0] && speed <= speedRange[1];
      });
    }

    // Sort
    discs.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'speed':
          return parseInt(b.speed) - parseInt(a.speed);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return discs;
  }, [brandDiscs, sortBy, filterSpeed]);

  if (state.loading) {
    return (
      <div className="container">
        <div className="loading-page">
          <div className="spinner"></div>
          <p>Loading brand details...</p>
        </div>
      </div>
    );
  }

  if (brandDiscs.length === 0) {
    return (
      <div className="container">
        <div className="error-page">
          <h1>Brand Not Found</h1>
          <p>No discs found for this brand.</p>
          <Link to="/brand" className="btn-primary">Browse Brands</Link>
        </div>
      </div>
    );
  }

  const brand = brandDiscs[0]; // Get brand info from first disc

  return (
    <div className="brand-detail">
      <div className="container">
        {/* Brand Header */}
        <div className="brand-header">
          <div
            className="brand-logo-large"
            style={{
              backgroundColor: brand.background_color,
              color: brand.color
            }}
          >
            {brand.brand.charAt(0)}
          </div>
          <div className="brand-header-info">
            <h1 className="brand-title">{brand.brand}</h1>
            <p className="brand-stats">{brandDiscs.length} discs available</p>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="brand-controls">
          <div className="control-group">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="control-select"
            >
              <option value="name">Name</option>
              <option value="speed">Speed</option>
              <option value="category">Category</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="speed-filter">Speed:</label>
            <select
              id="speed-filter"
              value={filterSpeed}
              onChange={(e) => setFilterSpeed(e.target.value)}
              className="control-select"
            >
              <option value="all">All Speeds</option>
              <option value="1-3">1-3 (Putters)</option>
              <option value="4-6">4-6 (Midrange)</option>
              <option value="7-9">7-9 (Fairway)</option>
              <option value="10-15">10-15 (Drivers)</option>
            </select>
          </div>

          <div className="results-count">
            {filteredAndSortedDiscs.length} of {brandDiscs.length} discs
          </div>
        </div>

        {/* Disc List */}
        <div className="disc-list">
          {filteredAndSortedDiscs.length > 0 ? (
            filteredAndSortedDiscs.map(disc => (
              <DiscRow key={disc.id} disc={disc} />
            ))
          ) : (
            <div className="no-results">
              <p>No discs match your current filters.</p>
              <button
                onClick={() => {
                  setSortBy('name');
                  setFilterSpeed('all');
                }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrandDetail;