import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { searchDiscs } from '../utils/fuzzySearch';
import Modal from '../components/Modal';
import DiscRow from '../components/DiscRow';
import './BagEditor.css';

function BagEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useApp();
  
  const [bag, setBag] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Find the bag
  useEffect(() => {
    const foundBag = state.bags.find(b => b.id === id);
    if (foundBag) {
      setBag(foundBag);
    }
  }, [id, state.bags]);

  // Search for discs to add
  useEffect(() => {
    if (searchQuery.trim() && state.discs.length > 0) {
      const results = searchDiscs(state.discs, searchQuery).slice(0, 20);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, state.discs]);

  // Auto-save bag changes
  useEffect(() => {
    if (bag && bag.id) {
      const timer = setTimeout(() => {
        const updatedBag = {
          ...bag,
          updatedAt: new Date().toISOString()
        };
        actions.updateBag(updatedBag);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [bag, actions]);

  if (state.loading) {
    return (
      <div className="container">
        <div className="loading-page">
          <div className="spinner"></div>
          <p>Loading bag...</p>
        </div>
      </div>
    );
  }

  if (!bag) {
    return (
      <div className="container">
        <div className="error-page">
          <h1>Bag Not Found</h1>
          <p>The bag you're looking for doesn't exist.</p>
          <Link to="/bags" className="btn-primary">Back to Bags</Link>
        </div>
      </div>
    );
  }

  const addDiscToBag = (disc) => {
    const updatedBag = {
      ...bag,
      discs: [...(bag.discs || []), disc]
    };
    setBag(updatedBag);
    setShowAddModal(false);
    setSearchQuery('');
  };

  const removeDiscFromBag = (discId) => {
    const updatedBag = {
      ...bag,
      discs: bag.discs.filter(d => d.id !== discId)
    };
    setBag(updatedBag);
  };

  const groupDiscsByCategory = () => {
    const groups = {};
    (bag.discs || []).forEach(disc => {
      const category = disc.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(disc);
    });
    return groups;
  };

  const discGroups = groupDiscsByCategory();
  const categories = Object.keys(discGroups).sort();

  const filteredResults = selectedCategory === 'all' 
    ? searchResults 
    : searchResults.filter(disc => disc.category === selectedCategory);

  const availableCategories = Array.from(new Set(state.discs.map(d => d.category))).sort();

  return (
    <div className="bag-editor">
      <div className="container">
        {/* Header */}
        <div className="bag-editor-header">
          <div className="bag-info">
            <Link to="/bags" className="back-link">← Back to Bags</Link>
            <h1 className="bag-title">{bag.name}</h1>
            {bag.description && (
              <p className="bag-description">{bag.description}</p>
            )}
            <div className="bag-stats">
              <span className="bag-stat">{bag.discs?.length || 0} discs</span>
              <span className="bag-stat">{categories.length} categories</span>
            </div>
          </div>
          
          <div className="bag-actions">
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              + Add Disc
            </button>
            <Link 
              to={`/bag/${bag.id}/report`} 
              className="btn-outline"
            >
              View Report
            </Link>
          </div>
        </div>

        {/* Bag Contents */}
        <div className="bag-contents">
          {categories.length > 0 ? (
            categories.map(category => (
              <div key={category} className="disc-category">
                <div className="category-header">
                  <h3 className="category-name">{category}</h3>
                  <span className="category-count">
                    {discGroups[category].length} disc{discGroups[category].length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="category-discs">
                  {discGroups[category].map((disc, index) => (
                    <div key={`${disc.id}-${index}`} className="bag-disc-row">
                      <DiscRow disc={disc} />
                      <button
                        onClick={() => removeDiscFromBag(disc.id)}
                        className="remove-disc-btn"
                        title="Remove from bag"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-bag">
              <div className="empty-icon">🥏</div>
              <h3>Empty Bag</h3>
              <p>Start building your bag by adding some discs</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
              >
                Add First Disc
              </button>
            </div>
          )}
        </div>

        {/* Add Disc Modal */}
        {showAddModal && (
          <Modal
            onClose={() => setShowAddModal(false)}
            title="Add Disc to Bag"
            maxWidth="600px"
          >
            <div className="add-disc-modal">
              {/* Search */}
              <div className="search-section">
                <input
                  type="text"
                  placeholder="Search for discs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="disc-search-input"
                  autoFocus
                />
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-filter"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Results */}
              <div className="search-results-section">
                {filteredResults.length > 0 ? (
                  <div className="search-results-list">
                    {filteredResults.map(disc => (
                      <div key={disc.id} className="search-result-item">
                        <DiscRow disc={disc} />
                        <button
                          onClick={() => addDiscToBag(disc)}
                          className="add-disc-btn"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="no-search-results">
                    <p>No discs found for "{searchQuery}"</p>
                    <p className="text-sm">Try a different search term or category</p>
                  </div>
                ) : (
                  <div className="search-placeholder">
                    <p>Search for discs to add to your bag</p>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default BagEditor;