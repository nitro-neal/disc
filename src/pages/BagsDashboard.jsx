import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import Modal from '../components/Modal';
import './BagsDashboard.css';

function BagsDashboard() {
  const { state, actions } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [bagName, setBagName] = useState('');
  const [bagDescription, setBagDescription] = useState('');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCreateBag = (e) => {
    e.preventDefault();
    
    if (!bagName.trim()) return;

    const newBag = {
      id: uuidv4(),
      name: bagName.trim(),
      description: bagDescription.trim() || undefined,
      discs: [],
      updatedAt: new Date().toISOString()
    };

    actions.addBag(newBag);
    
    // Reset form
    setBagName('');
    setBagDescription('');
    setShowCreateModal(false);
  };

  const handleDeleteBag = (bagId) => {
    actions.deleteBag(bagId);
    setShowDeleteModal(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bags-dashboard">
      <div className="container">
        <div className="page-header">
          <div className="page-title-section">
            <h1>My Bags</h1>
            <p>Build and manage your disc golf bags</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary create-bag-btn"
          >
            + New Bag
          </button>
        </div>

        {state.bags.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎒</div>
            <h3>No bags yet</h3>
            <p>Create your first bag to start organizing your discs</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Bag
            </button>
          </div>
        ) : (
          <div className="bags-grid">
            {state.bags.map(bag => (
              <div key={bag.id} className="bag-card">
                <div className="bag-card-header">
                  <Link to={`/bag/${bag.id}`} className="bag-name">
                    {bag.name}
                  </Link>
                  <div className="bag-actions">
                    <Link
                      to={`/bag/${bag.id}/report`}
                      className="bag-action-btn"
                      title="View bag report"
                    >
                      📊
                    </Link>
                    <Link
                      to={`/bag/${bag.id}`}
                      className="bag-action-btn"
                      title="Add disc to bag"
                    >
                      ➕
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(bag.id)}
                      className="bag-action-btn delete-btn"
                      title="Delete bag"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {bag.description && (
                  <p className="bag-description">{bag.description}</p>
                )}

                <div className="bag-stats">
                  <div className="bag-stat">
                    <span className="stat-value">{bag.discs?.length || 0}</span>
                    <span className="stat-label">Discs</span>
                  </div>
                  
                  {bag.discs && bag.discs.length > 0 && (
                    <>
                      <div className="bag-stat">
                        <span className="stat-value">
                          {new Set(bag.discs.map(d => d.category)).size}
                        </span>
                        <span className="stat-label">Categories</span>
                      </div>
                      
                      <div className="bag-stat">
                        <span className="stat-value">
                          {Math.min(...bag.discs.map(d => parseInt(d.speed))) || 0}-{Math.max(...bag.discs.map(d => parseInt(d.speed))) || 0}
                        </span>
                        <span className="stat-label">Speed Range</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="bag-footer">
                  <span className="bag-updated">
                    Updated {formatDate(bag.updatedAt)}
                  </span>
                  <Link to={`/bag/${bag.id}`} className="edit-bag-link">
                    Edit →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Bag Modal */}
        {showCreateModal && (
          <Modal onClose={() => setShowCreateModal(false)} title="Create New Bag">
            <form onSubmit={handleCreateBag} className="create-bag-form">
              <div className="form-group">
                <label htmlFor="bag-name">Bag Name *</label>
                <input
                  id="bag-name"
                  type="text"
                  value={bagName}
                  onChange={(e) => setBagName(e.target.value)}
                  placeholder="e.g., Tournament Bag, Practice Rounds"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="bag-description">Description (optional)</label>
                <textarea
                  id="bag-description"
                  value={bagDescription}
                  onChange={(e) => setBagDescription(e.target.value)}
                  placeholder="What's this bag for?"
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Bag
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <Modal
            onClose={() => setShowDeleteModal(null)}
            title="Delete Bag"
          >
            <div className="delete-confirmation">
              <p>
                Are you sure you want to delete "{state.bags.find(b => b.id === showDeleteModal)?.name}"?
              </p>
              <p className="delete-warning">
                This action cannot be undone.
              </p>
              
              <div className="form-actions">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBag(showDeleteModal)}
                  className="btn-error"
                >
                  Delete Bag
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default BagsDashboard;