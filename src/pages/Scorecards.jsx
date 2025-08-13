import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import Modal from '../components/Modal';
import './BagsDashboard.css';
import './Scorecards.css';

function Scorecards() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [holes, setHoles] = useState(18);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleQuickCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = uuidv4();
    const scorecard = {
      id,
      name: name.trim(),
      location: location.trim() || undefined,
      holes: Number(holes) || 18,
      players: [],
      scores: {},
      currentHole: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    actions.addScorecard(scorecard);
    setShowCreateModal(false);
    setName('');
    setLocation('');
    setHoles(18);
    navigate(`/scorecards/new?id=${id}`);
  };

  const handleDelete = (id) => {
    actions.deleteScorecard(id);
    setShowDeleteModal(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="bags-dashboard">
      <div className="container">
        <div className="page-header">
          <div className="page-title-section">
            <h1>Scorecards</h1>
            <p>Track scores for your rounds</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary create-bag-btn"
          >
            + New Scorecard
          </button>
        </div>

        {state.scorecards.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No games yet</h3>
            <p>Start your first round and track your scores</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Play First Game!
            </button>
          </div>
        ) : (
          <div className="bags-grid">
            {state.scorecards.map(sc => (
              <div key={sc.id} className="bag-card clickable-card" onClick={(e) => {
                if (e.target.closest('.bag-actions') || e.target.closest('.bag-name')) return;
                navigate(`/scorecard/${sc.id}`);
              }}>
                <div className="bag-card-header">
                  <Link to={`/scorecard/${sc.id}`} className="bag-name">
                    {sc.name}
                  </Link>
                  <div className="bag-actions">
                    <button
                      onClick={() => setShowDeleteModal(sc.id)}
                      className="bag-action-btn delete-btn"
                      title="Delete scorecard"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {sc.location && (
                  <p className="bag-description">{sc.location}</p>
                )}
                <div className="bag-stats">
                  <div className="bag-stat">
                    <span className="stat-value">{sc.holes}</span>
                    <span className="stat-label">Holes</span>
                  </div>
                  <div className="bag-stat">
                    <span className="stat-value">{sc.players.length}</span>
                    <span className="stat-label">Players</span>
                  </div>
                </div>
                <div className="bag-footer">
                  <span className="bag-updated">Updated {formatDate(sc.updatedAt)}</span>
                  <Link to={`/scorecard/${sc.id}`} className="edit-bag-link">Open →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {showCreateModal && (
          <Modal onClose={() => setShowCreateModal(false)} title="Create New Scorecard">
            <form onSubmit={handleQuickCreate} className="create-bag-form">
              <div className="form-group">
                <label htmlFor="sc-name">Game Name *</label>
                <input
                  id="sc-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Saturday League, Casual Round"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="sc-location">Location (optional)</label>
                <input
                  id="sc-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Course name or location"
                />
              </div>
              <div className="form-group">
                <label htmlFor="sc-holes">Number of Holes</label>
                <select id="sc-holes" value={holes} onChange={(e) => setHoles(parseInt(e.target.value))}>
                  {[9, 12, 18, 21, 24, 27].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Next: Who's Playing</button>
              </div>
            </form>
          </Modal>
        )}

        {showDeleteModal && (
          <Modal onClose={() => setShowDeleteModal(null)} title="Delete Scorecard">
            <div className="delete-confirmation">
              <p>Delete "{state.scorecards.find(s => s.id === showDeleteModal)?.name}"?</p>
              <p className="delete-warning">This action cannot be undone.</p>
              <div className="form-actions">
                <button onClick={() => setShowDeleteModal(null)} className="btn-secondary">Cancel</button>
                <button onClick={() => handleDelete(showDeleteModal)} className="btn-error">Delete</button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Scorecards;


