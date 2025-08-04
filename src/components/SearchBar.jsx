import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { searchDiscs } from '../utils/fuzzySearch';
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { state } = useApp();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Search when query changes
  useEffect(() => {
    if (query.trim() && state.discs.length > 0) {
      const searchResults = searchDiscs(state.discs, query);
      setResults(searchResults.slice(0, 8)); // Show max 8 results
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, state.discs]);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectDisc(results[selectedIndex]);
        } else if (results.length > 0) {
          selectDisc(results[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectDisc = (disc) => {
    navigate(`/disc/${disc.name_slug}`);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="search-highlight">{part}</mark> : 
        part
    );
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search discs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
          aria-label="Search discs"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="search-clear"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-results" ref={resultsRef} role="listbox">
          {results.map((disc, index) => (
            <div
              key={disc.id}
              className={`search-result ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => selectDisc(disc)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <div className="search-result-image">
                <div 
                  className="disc-placeholder"
                  style={{ 
                    backgroundColor: disc.background_color,
                    color: disc.color 
                  }}
                >
                  {disc.name.charAt(0)}
                </div>
              </div>
              <div className="search-result-info">
                <div className="search-result-name">
                  {highlightMatch(disc.name, query)}
                </div>
                <div className="search-result-brand">
                  {disc.brand}
                </div>
                <div className="search-result-numbers">
                  {disc.speed} | {disc.glide} | {disc.turn} | {disc.fade}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="search-results">
          <div className="search-no-results">
            <p>No discs found for "{query}"</p>
            <p className="text-sm text-gray">Try searching for a brand or disc type</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;