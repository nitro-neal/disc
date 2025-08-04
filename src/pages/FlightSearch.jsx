import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { searchByFlightNumbers } from '../utils/fuzzySearch';
import DiscRow from '../components/DiscRow';
import RangeSlider from '../components/RangeSlider';
import './FlightSearch.css';

function FlightSearch() {
  const { state } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Flight number ranges
  const [speed, setSpeed] = useState([1, 15]);
  const [glide, setGlide] = useState([1, 7]);
  const [turn, setTurn] = useState([-5, 1]);
  const [fade, setFade] = useState([0, 5]);

  // Initialize from URL params
  useEffect(() => {
    const speedParam = searchParams.get('speed');
    const glideParam = searchParams.get('glide');
    const turnParam = searchParams.get('turn');
    const fadeParam = searchParams.get('fade');

    if (speedParam) {
      const value = parseInt(speedParam);
      if (!isNaN(value)) setSpeed([Math.max(1, value - 1), Math.min(15, value + 1)]);
    }
    if (glideParam) {
      const value = parseInt(glideParam);
      if (!isNaN(value)) setGlide([Math.max(1, value - 1), Math.min(7, value + 1)]);
    }
    if (turnParam) {
      const value = parseInt(turnParam);
      if (!isNaN(value)) setTurn([Math.max(-5, value - 1), Math.min(1, value + 1)]);
    }
    if (fadeParam) {
      const value = parseInt(fadeParam);
      if (!isNaN(value)) setFade([Math.max(0, value - 1), Math.min(5, value + 1)]);
    }
  }, [searchParams]);

  // Update URL when filters change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (speed[0] !== 1 || speed[1] !== 15) {
        params.set('speed_min', speed[0].toString());
        params.set('speed_max', speed[1].toString());
      }
      if (glide[0] !== 1 || glide[1] !== 7) {
        params.set('glide_min', glide[0].toString());
        params.set('glide_max', glide[1].toString());
      }
      if (turn[0] !== -5 || turn[1] !== 1) {
        params.set('turn_min', turn[0].toString());
        params.set('turn_max', turn[1].toString());
      }
      if (fade[0] !== 0 || fade[1] !== 5) {
        params.set('fade_min', fade[0].toString());
        params.set('fade_max', fade[1].toString());
      }
      setSearchParams(params, { replace: true });
    }, 150);

    return () => clearTimeout(timer);
  }, [speed, glide, turn, fade, setSearchParams]);

  // Search results
  const results = useMemo(() => {
    if (state.discs.length === 0) return [];

    const filters = {
      speed: speed[0] === 1 && speed[1] === 15 ? null : speed,
      glide: glide[0] === 1 && glide[1] === 7 ? null : glide,
      turn: turn[0] === -5 && turn[1] === 1 ? null : turn,
      fade: fade[0] === 0 && fade[1] === 5 ? null : fade
    };

    return searchByFlightNumbers(state.discs, filters);
  }, [state.discs, speed, glide, turn, fade]);

  const resetFilters = () => {
    setSpeed([1, 15]);
    setGlide([1, 7]);
    setTurn([-5, 1]);
    setFade([0, 5]);
  };

  const hasActiveFilters = () => {
    return !(speed[0] === 1 && speed[1] === 15 &&
             glide[0] === 1 && glide[1] === 7 &&
             turn[0] === -5 && turn[1] === 1 &&
             fade[0] === 0 && fade[1] === 5);
  };

  if (state.loading) {
    return (
      <div className="container">
        <div className="loading-page">
          <div className="spinner"></div>
          <p>Loading disc database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flight-search">
      <div className="container">
        <div className="page-header">
          <h1>Flight Search</h1>
          <p>Find discs by their flight characteristics</p>
        </div>

        {/* Flight Controls */}
        <div className="flight-controls">
          <div className="flight-sliders">
            <div className="slider-row">
              <RangeSlider
                label="Speed"
                min={1}
                max={15}
                value={speed}
                onChange={setSpeed}
                tooltip="How fast the disc flies through the air"
              />
              <RangeSlider
                label="Glide"
                min={1}
                max={7}
                value={glide}
                onChange={setGlide}
                tooltip="How well the disc maintains loft during flight"
              />
            </div>
            <div className="slider-row">
              <RangeSlider
                label="Turn"
                min={-5}
                max={1}
                value={turn}
                onChange={setTurn}
                tooltip="Initial flight path tendency (negative = right turn for RHBH)"
              />
              <RangeSlider
                label="Fade"
                min={0}
                max={5}
                value={fade}
                onChange={setFade}
                tooltip="End flight path tendency (positive = left hook for RHBH)"
              />
            </div>
          </div>

          <div className="flight-controls-footer">
            <div className="results-info">
              <span className="results-count">{results.length}</span> discs found
            </div>
            {hasActiveFilters() && (
              <button onClick={resetFilters} className="btn-outline">
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flight-results">
          {results.length > 0 ? (
            <div className="results-list">
              {results.map(disc => (
                <DiscRow key={disc.id} disc={disc} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              {hasActiveFilters() ? (
                <>
                  <h3>No discs match your criteria</h3>
                  <p>Try adjusting your flight number ranges to find more discs.</p>
                  <button onClick={resetFilters} className="btn-primary">
                    Reset All Filters
                  </button>
                </>
              ) : (
                <>
                  <h3>Search by Flight Numbers</h3>
                  <p>Use the sliders above to filter discs by speed, glide, turn, and fade.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlightSearch;