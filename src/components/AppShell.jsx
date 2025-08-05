import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import './AppShell.css';

function AppShell({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <span className="logo-text">DiscFinder</span>
            </Link>
            
            <SearchBar />
            
            <nav className="desktop-nav">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Home
              </Link>
              <Link 
                to="/brand" 
                className={`nav-link ${isActive('/brand') ? 'active' : ''}`}
              >
                Brands
              </Link>
              <Link 
                to="/flight" 
                className={`nav-link ${isActive('/flight') ? 'active' : ''}`}
              >
                Flight Search
              </Link>
              <Link 
                to="/get-good" 
                className={`nav-link ${isActive('/get-good') ? 'active' : ''}`}
              >
                Get Good
              </Link>

              <Link 
                to="/bags" 
                className={`nav-link ${isActive('/bags') ? 'active' : ''}`}
              >
                My Bags
              </Link>
            </nav>

            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="mobile-nav">
          <div className="container">
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/brand" 
              className={`mobile-nav-link ${isActive('/brand') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Brands
            </Link>
            <Link 
              to="/flight" 
              className={`mobile-nav-link ${isActive('/flight') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Flight Search
            </Link>
            <Link 
              to="/bags" 
              className={`mobile-nav-link ${isActive('/bags') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Bags
            </Link>
            <Link 
              to="/get-good" 
              className={`mobile-nav-link ${isActive('/get-good') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Get Good
            </Link>
          </div>
        </nav>
      )}

      <main className="app-main">
        {children}
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2025 DiscFinder. Built for disc golf enthusiasts.</p>
            <div className="footer-links">
              <a href="#" target="_blank" rel="noopener noreferrer">About</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppShell;