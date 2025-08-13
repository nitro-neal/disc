import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Scorecards.css';

function Scorecard() {
  const { id } = useParams();
  const { state, actions } = useApp();
  const scorecard = state.scorecards.find(s => s.id === id);
  const [slideDir, setSlideDir] = useState(''); // 'forward' | 'back' | ''

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const holesArray = useMemo(() => {
    const total = scorecard?.holes || 18;
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [scorecard]);

  if (!scorecard) {
    return (
      <div className="container">
        <div className="error-page">
          <h1>Scorecard Not Found</h1>
          <p>Go back to Scorecards and start a new game.</p>
        </div>
      </div>
    );
  }

  const currentHole = scorecard.currentHole || 1;

  const setCurrentHole = (n) => {
    if (!scorecard) return;
    const dir = n > (scorecard.currentHole || 1) ? 'forward' : 'back';
    setSlideDir(dir);
    actions.updateScorecard({ ...scorecard, currentHole: n, updatedAt: new Date().toISOString() });
  };

  const updateScore = (player, delta) => {
    const holeKey = String(currentHole);
    const currentValue = scorecard.scores?.[player]?.[holeKey];
    let newValue = currentValue ?? 0; // dash -> 0
    if (currentValue == null) {
      // first click: - sets to 2, + sets to 3
      newValue = delta < 0 ? 2 : 3;
    } else {
      newValue = Math.max(0, newValue + delta);
    }
    const playerScores = { ...(scorecard.scores?.[player] || {}), [holeKey]: newValue };
    const newScores = { ...scorecard.scores, [player]: playerScores };
    actions.updateScorecard({ ...scorecard, scores: newScores, updatedAt: new Date().toISOString() });
  };

  const visibleTabs = () => {
    const total = holesArray.length;
    const c = currentHole;
    if (total <= 5) return holesArray;
    if (c <= 3) return holesArray.slice(0, 5);
    if (c >= total - 2) return holesArray.slice(total - 5, total);
    return [c - 2, c - 1, c, c + 1, c + 2];
  };

  const sumToHole = (player, upto) => {
    const ps = scorecard.scores?.[player] || {};
    return Array.from({ length: upto }, (_, i) => i + 1).reduce((acc, h) => acc + (ps[String(h)] || 0), 0);
  };

  const renderReportBanner = () => {
    if (currentHole !== 9 && currentHole !== 18) return null;
    return (
      <div className="bag-editor-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="bag-info">
          <h2 className="bag-title" style={{ marginBottom: 0 }}>Score Report - Hole {currentHole}</h2>
          <div className="bag-stats" style={{ marginTop: 'var(--spacing-sm)' }}>
            {scorecard.players.map(p => (
              <span key={p} className="bag-stat">{p}: {sumToHole(p, currentHole)}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="page-header">
        <div className="page-title-section">
          <h1>{scorecard.name}</h1>
          <p>{scorecard.location || 'No location'} • {scorecard.holes} holes</p>
          <div className="current-hole-display">Hole {currentHole}</div>
        </div>
      </div>

      {renderReportBanner()}

      <div 
        key={currentHole}
        className={`players-list players-viewport ${slideDir === 'forward' ? 'slide-forward' : slideDir === 'back' ? 'slide-back' : ''}`}
        style={{ marginBottom: '96px' }}
      >
        {scorecard.players.map(p => {
          const holeKey = String(currentHole);
          const value = scorecard.scores?.[p]?.[holeKey];
          return (
            <div key={p} className="player-row">
              <div className="player-left">
                <div className="avatar-placeholder">{p.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{p}</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Hole {currentHole}</div>
                </div>
              </div>

              <div className="score-controls">
                <button aria-label="decrease" onClick={() => updateScore(p, -1)}>-</button>
                <div className="score-value">{value == null ? '—' : value}</div>
                <button aria-label="increase" onClick={() => updateScore(p, 1)}>+</button>
              </div>
            </div>
          );
        })}
        {scorecard.players.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No players set</h3>
            <p>Add players on the previous step</p>
          </div>
        )}
      </div>

      <div className="scorecard-tabs">
        {visibleTabs().map(n => (
          <button key={n} className={`scorecard-tab ${n === currentHole ? 'active' : ''}`} onClick={() => setCurrentHole(n)}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Scorecard;


