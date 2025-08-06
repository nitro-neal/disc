import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { getProBySlug } from '../data/proBags';
import { getDiscsByIds } from '../utils/dataLoader';
import './ProBagDetail.css';

function ProBagDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [showAddAllToBag, setShowAddAllToBag] = useState(false);
  const dropdownRef = useRef(null);

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (state.loading) {
    return (
      <div className="container">
        <div className="loading-page">
          <div className="spinner"></div>
          <p>Loading pro bag...</p>
        </div>
      </div>
    );
  }

  const pro = getProBySlug(slug);
  const [proDiscs, setProDiscs] = useState([]);

  // Load actual disc data for this pro
  useEffect(() => {
    if (pro && pro.discIds && state.discs) {
      const discData = getDiscsByIds(state.discs, pro.discIds);
      setProDiscs(discData);
    }
  }, [pro, state.discs]);

  if (!pro) {
    return (
      <div className="container">
        <div className="error-page">
          <h1>Pro Not Found</h1>
          <p>The pro you're looking for doesn't exist.</p>
          <Link to="/pro-bags" className="btn-primary">Back to Pro Bags</Link>
        </div>
      </div>
    );
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAddAllToBag(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddAllToBag = (bagId) => {
    if (!pro || !proDiscs || proDiscs.length === 0) return;

    const bag = state.bags.find(b => b.id === bagId);
    if (!bag) return;

    // Filter out discs that are already in the bag
    const existingDiscIds = new Set(bag.discs.map(d => d.id));
    const newDiscs = proDiscs.filter(disc => !existingDiscIds.has(disc.id));

    if (newDiscs.length === 0) {
      alert('All discs from this pro bag are already in your bag!');
      return;
    }

    // Add all new discs to bag
    const updatedBag = {
      ...bag,
      discs: [...bag.discs, ...newDiscs],
      updatedAt: new Date().toISOString()
    };

    actions.updateBag(updatedBag);
    setShowAddAllToBag(false);
    
    // Show success message
    alert(`Added ${newDiscs.length} discs from ${pro.name}'s bag to ${bag.name}!`);
  };

  const getStabilityFromNumbers = (turn, fade) => {
    const stability = turn + fade;
    if (stability >= 3) return 'Very Overstable';
    if (stability >= 1) return 'Overstable';
    if (stability >= -1) return 'Stable';
    if (stability >= -3) return 'Understable';
    return 'Very Understable';
  };

  const getStabilityColor = (stability) => {
    switch (stability?.toLowerCase()) {
      case 'very overstable': return 'var(--color-error)';
      case 'overstable': return '#f59e0b';
      case 'stable': return 'var(--color-success)';
      case 'understable': return '#3b82f6';
      case 'very understable': return '#8b5cf6';
      default: return 'var(--color-secondary)';
    }
  };

  const handleDiscClick = (disc) => {
    // Navigate using the actual disc slug from the database
    navigate(`/disc/${disc.name_slug}`);
  };

  const getDiscLetter = (name) => {
    // Handle special characters like ( and # by finding the first letter
    const firstLetter = name.match(/[A-Za-z]/);
    return firstLetter ? firstLetter[0].toUpperCase() : name.charAt(0).toUpperCase();
  };

  const groupDiscsByCategory = () => {
    const groups = {};
    proDiscs.forEach(disc => {
      const category = disc.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(disc);
    });
    return groups;
  };

  const discGroups = groupDiscsByCategory();
  const categoryOrder = ['Distance Driver', 'Control Driver', 'Hybrid Driver', 'Midrange', 'Approach Discs', 'Putter'];

  return (
    <div className="pro-bag-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/pro-bags" className="breadcrumb-link">Pro Bags</Link>
          <span className="breadcrumb-separator">→</span>
          <span className="breadcrumb-current">{pro.name}</span>
        </nav>

        {/* Pro Header */}
        <div className="pro-header">
          <div className="pro-image-large">
            <div
              className="pro-image-placeholder-large"
              style={{
                backgroundColor: pro.backgroundColor,
                color: pro.color
              }}
            >
              {pro.name.split(' ').map(n => n.charAt(0)).join('')}
            </div>
          </div>
          
          <div className="pro-header-info">
            <h1 className="pro-name-large">{pro.name}</h1>
            <div className="pro-title-large">{pro.title}</div>
            <div className="pro-description-large">{pro.description}</div>
            
            <div className="pro-stats">
              <div className="pro-stat">
                <div className="pro-stat-value">{proDiscs.length}</div>
                <div className="pro-stat-label">Discs in Bag</div>
              </div>
              <div className="pro-stat">
                <div className="pro-stat-value">{new Set(proDiscs.map(d => d.brand)).size}</div>
                <div className="pro-stat-label">Brands</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pro-actions">
          <Link to="/pro-bags" className="btn-secondary">
            ← Back to Pro Bags
          </Link>
          
          {/* Add All to Bag Dropdown */}
          {state.bags.length > 0 && (
            <div className="add-all-to-bag-dropdown" ref={dropdownRef}>
              <button
                onClick={() => setShowAddAllToBag(!showAddAllToBag)}
                className="btn-primary"
              >
                Add All to Bag ▼
              </button>
              
              {showAddAllToBag && (
                <div className="dropdown-menu">
                  {state.bags.map(bag => (
                    <button
                      key={bag.id}
                      onClick={() => handleAddAllToBag(bag.id)}
                      className="dropdown-item"
                    >
                      <span className="bag-name">{bag.name}</span>
                      <span className="bag-count">({bag.discs?.length || 0} discs)</span>
                    </button>
                  ))}
                  <div className="dropdown-divider"></div>
                  <Link
                    to="/bags"
                    className="dropdown-item create-bag-link"
                    onClick={() => setShowAddAllToBag(false)}
                  >
                    + Create New Bag
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Disc Categories */}
        {proDiscs.length === 0 ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading {pro.name}'s disc bag...</p>
          </div>
        ) : (
          <div className="disc-categories">
            {categoryOrder.map(category => {
              const discs = discGroups[category];
              if (!discs || discs.length === 0) return null;

            return (
              <div key={category} className="disc-category">
                <h2 className="category-title">{category}</h2>
                <div className="disc-grid">
                  {discs.map((disc, index) => (
                    <div 
                      key={index} 
                      className="disc-card"
                      onClick={() => handleDiscClick(disc)}
                    >
                      <div className="disc-card-header">
                        <div
                          className="pro-disc-placeholder"
                          style={{
                            backgroundColor: disc.background_color,
                            color: disc.color
                          }}
                        >
                          {getDiscLetter(disc.name)}
                        </div>
                        <div className="pro-disc-info">
                          <div className="pro-disc-name">{disc.name}</div>
                          <div className="pro-disc-brand">{disc.brand}</div>
                        </div>
                      </div>
                      
                      <div className="pro-disc-numbers">
                        <div className="flight-number">
                          <span className="flight-label">Speed</span>
                          <span className="flight-value">{disc.speed}</span>
                        </div>
                        <div className="flight-number">
                          <span className="flight-label">Glide</span>
                          <span className="flight-value">{disc.glide}</span>
                        </div>
                        <div className="flight-number">
                          <span className="flight-label">Turn</span>
                          <span className="flight-value">{disc.turn}</span>
                        </div>
                        <div className="flight-number">
                          <span className="flight-label">Fade</span>
                          <span className="flight-value">{disc.fade}</span>
                        </div>
                      </div>
                      
                      <div 
                        className="pro-disc-stability"
                        style={{ color: getStabilityColor(disc.stability) }}
                      >
                        {disc.stability}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProBagDetail;