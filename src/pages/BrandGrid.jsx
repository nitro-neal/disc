import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getBrands } from '../utils/dataLoader';
import './BrandGrid.css';

function BrandGrid() {
  const { state } = useApp();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (state.loading) {
    return (
      <div className="container">
        <div className="loading-page">
          <div className="spinner"></div>
          <p>Loading brands...</p>
        </div>
      </div>
    );
  }

  const brands = getBrands(state.discs);

  return (
    <div className="brand-grid-page">
      <div className="container">
        <div className="page-header">
          <h1>Browse by Brand</h1>
          <p>Explore discs from {brands.length} manufacturers</p>
        </div>

        <div className="brand-grid">
          {brands.map(brand => (
            <Link
              key={brand.slug}
              to={`/brand/${brand.slug}`}
              className="brand-card"
              style={{
                '--brand-color': brand.color,
                '--brand-bg': brand.backgroundColor
              }}
            >
              <div className="brand-logo">
                <div
                  className="brand-logo-placeholder"
                  style={{
                    backgroundColor: brand.backgroundColor,
                    color: brand.color
                  }}
                >
                  {brand.name.charAt(0)}
                </div>
              </div>
              <div className="brand-info">
                <h3 className="brand-name">{brand.name}</h3>
                <p className="brand-count">{brand.discCount} discs</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrandGrid;