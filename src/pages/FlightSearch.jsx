import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { searchByFlightNumbers } from '../utils/fuzzySearch';
import DiscRow from '../components/DiscRow';
import RangeSlider from '../components/RangeSlider';
import './FlightSearch.css';

const PAGE_SIZE = 100;

function FlightSearch() {
  const { state } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Flight number ranges
  const [speed, setSpeed] = useState([1, 15]);
  const [glide, setGlide] = useState([1, 7]);
  const [turn, setTurn] = useState([-5, 1]);
  const [fade, setFade] = useState([0, 5]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize from URL params
  useEffect(() => {
    // Handle range parameters (speed_min, speed_max, etc.)
    const speedMin = searchParams.get('speed_min');
    const speedMax = searchParams.get('speed_max');
    const glideMin = searchParams.get('glide_min');
    const glideMax = searchParams.get('glide_max');
    const turnMin = searchParams.get('turn_min');
    const turnMax = searchParams.get('turn_max');
    const fadeMin = searchParams.get('fade_min');
    const fadeMax = searchParams.get('fade_max');
    
    // Handle single value parameters (for backwards compatibility and "Find Similar" links)
    const speedParam = searchParams.get('speed');
    const glideParam = searchParams.get('glide');
    const turnParam = searchParams.get('turn');
    const fadeParam = searchParams.get('fade');

    // Speed: prioritize range params, fallback to single value
    if (speedMin && speedMax) {
      const min = parseInt(speedMin);
      const max = parseInt(speedMax);
      if (!isNaN(min) && !isNaN(max)) {
        setSpeed([Math.max(1, min), Math.min(15, max)]);
      }
    } else if (speedParam) {
      const value = parseInt(speedParam);
      if (!isNaN(value)) setSpeed([Math.max(1, value - 1), Math.min(15, value + 1)]);
    }
    
    // Glide: prioritize range params, fallback to single value
    if (glideMin && glideMax) {
      const min = parseInt(glideMin);
      const max = parseInt(glideMax);
      if (!isNaN(min) && !isNaN(max)) {
        setGlide([Math.max(1, min), Math.min(7, max)]);
      }
    } else if (glideParam) {
      const value = parseInt(glideParam);
      if (!isNaN(value)) setGlide([Math.max(1, value - 1), Math.min(7, value + 1)]);
    }
    
    // Turn: prioritize range params, fallback to single value
    if (turnMin && turnMax) {
      const min = parseInt(turnMin);
      const max = parseInt(turnMax);
      if (!isNaN(min) && !isNaN(max)) {
        setTurn([Math.max(-5, min), Math.min(1, max)]);
      }
    } else if (turnParam) {
      const value = parseInt(turnParam);
      if (!isNaN(value)) setTurn([Math.max(-5, value - 1), Math.min(1, value + 1)]);
    }
    
    // Fade: prioritize range params, fallback to single value
    if (fadeMin && fadeMax) {
      const min = parseInt(fadeMin);
      const max = parseInt(fadeMax);
      if (!isNaN(min) && !isNaN(max)) {
        setFade([Math.max(0, min), Math.min(5, max)]);
      }
    } else if (fadeParam) {
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
  const allResults = useMemo(() => {
    if (state.discs.length === 0) return [];

    const filters = {
      speed: speed[0] === 1 && speed[1] === 15 ? null : speed,
      glide: glide[0] === 1 && glide[1] === 7 ? null : glide,
      turn: turn[0] === -5 && turn[1] === 1 ? null : turn,
      fade: fade[0] === 0 && fade[1] === 5 ? null : fade
    };

    return searchByFlightNumbers(state.discs, filters);
  }, [state.discs, speed, glide, turn, fade]);

  // Pagination calculations
  const totalPages = Math.ceil(allResults.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedResults = allResults.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [speed, glide, turn, fade]);

  const resetFilters = () => {
    setSpeed([1, 15]);
    setGlide([1, 7]);
    setTurn([-5, 1]);
    setFade([0, 5]);
    setCurrentPage(1);
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
              <div className="slider-container">
                <RangeSlider
                  label="Speed"
                  min={1}
                  max={15}
                  value={speed}
                  onChange={setSpeed}
                  tooltip="Speed (1-15): How fast the disc needs to be thrown to fly properly. Higher numbers require more arm speed. Putters are typically 1-4, midranges 4-6, fairways 6-9, and drivers 9-15."
                />
              </div>
              <div className="slider-container">
                <RangeSlider
                  label="Glide"
                  min={1}
                  max={7}
                  value={glide}
                  onChange={setGlide}
                  tooltip="Glide (1-7): How well the disc maintains loft and stays in the air. Higher glide means the disc will fly farther with less effort. Great for beginners and maximizing distance."
                />
              </div>
            </div>
            <div className="slider-row">
              <div className="slider-container">
                <RangeSlider
                  label="Turn"
                  min={-5}
                  max={1}
                  value={turn}
                  onChange={setTurn}
                  tooltip="Turn (-5 to +1): The disc's tendency to turn right during the first part of flight (for RHBH throws). Negative numbers turn right more, positive numbers are more stable. Understable discs have more negative turn."
                />
              </div>
              <div className="slider-container">
                <RangeSlider
                  label="Fade"
                  min={0}
                  max={5}
                  value={fade}
                  onChange={setFade}
                  tooltip="Fade (0-5): How much the disc hooks left at the end of flight (for RHBH throws). Higher numbers mean a harder left finish. Essential for reliable landing zones and fighting wind."
                />
              </div>
            </div>
          </div>

          {hasActiveFilters() && (
            <div className="flight-controls-footer">
              <button onClick={resetFilters} className="btn-outline">
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="results-header">
          <div className="results-info">
            <span className="results-count">{allResults.length}</span> discs found
            {allResults.length > PAGE_SIZE && (
              <span className="pagination-info">
                (showing {startIndex + 1}-{Math.min(endIndex, allResults.length)})
              </span>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flight-results">
          {allResults.length > 0 ? (
            <>
              <div className="results-list">
                {paginatedResults.map(disc => (
                  <DiscRow key={disc.id} disc={disc} />
                ))}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-controls">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="btn-outline pagination-btn"
                  >
                    Previous
                  </button>
                  
                  <div className="pagination-info-detailed">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="btn-outline pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
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