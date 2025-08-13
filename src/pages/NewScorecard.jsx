import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Scorecards.css';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function NewScorecard() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get('id');
  const scorecard = state.scorecards.find(s => s.id === id);

  const [newPlayerName, setNewPlayerName] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!scorecard) {
    return (
      <div className="container">
        <div className="error-page">
          <h1>Scorecard Not Found</h1>
          <p>Please start a new game from Scorecards.</p>
        </div>
      </div>
    );
  }

  const addPlayer = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (scorecard.players.includes(trimmed)) return;

    const updated = {
      ...scorecard,
      players: [...scorecard.players, trimmed],
      updatedAt: new Date().toISOString()
    };
    actions.updateScorecard(updated);
    const newSaved = Array.from(new Set([...(state.savedPlayers || []), trimmed]));
    actions.setSavedPlayers(newSaved);
  };

  const removePlayer = (name) => {
    const updated = {
      ...scorecard,
      players: scorecard.players.filter(p => p !== name),
      updatedAt: new Date().toISOString()
    };
    actions.updateScorecard(updated);
  };

  const startScoring = () => {
    navigate(`/scorecard/${scorecard.id}`);
  };

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Who's Playing?</h1>
          <p>Add players to "{scorecard.name}"</p>
        </div>
        <button className="btn-primary" onClick={startScoring} disabled={scorecard.players.length === 0}>Start</button>
      </div>

      <div className="who-grid">
        <div className="players-list">
          {scorecard.players.length === 0 && (
            <div className="empty-state" style={{ margin: 0 }}>
              <div className="empty-icon">👥</div>
              <h3>No players yet</h3>
              <p>Add players below or choose from saved</p>
            </div>
          )}

          {scorecard.players.map(name => (
            <div key={name} className="player-row">
              <div className="player-left">
                <div className="avatar-placeholder">{name.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{name}</div>
                </div>
              </div>
              <button className="btn-error" onClick={() => removePlayer(name)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="saved-players">
          <h3 style={{ marginTop: 0 }}>Saved Players</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {(state.savedPlayers || []).length === 0 && (
              <p style={{ color: 'var(--color-text-secondary)' }}>No saved players yet. Added names will be saved here.</p>
            )}
            {(state.savedPlayers || []).map(n => (
              <button key={n} className="saved-pill" onClick={() => addPlayer(n)}>{n} +</button>
            ))}
          </div>

          <div className="form-group" style={{ marginTop: 'var(--spacing-lg)' }}>
            <label htmlFor="player-name">Add New Player</label>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <input
                id="player-name"
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Player name"
              />
              <button className="btn-primary" type="button" onClick={() => { addPlayer(newPlayerName); setNewPlayerName(''); }}>Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewScorecard;


