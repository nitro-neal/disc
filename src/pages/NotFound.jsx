import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './NotFound.css';

function NotFound() {
  const [discPosition, setDiscPosition] = useState({ x: 50, y: 50 });
  const [isFlying, setIsFlying] = useState(false);

  // Animate the disc floating gently when not throwing
  useEffect(() => {
    if (!isFlying) {
      const interval = setInterval(() => {
        setDiscPosition(prev => ({
          x: 50 + Math.sin(Date.now() * 0.001) * 5,
          y: 30 + Math.sin(Date.now() * 0.002) * 3
        }));
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isFlying]);

  const throwDisc = () => {
    if (isFlying) return; // Prevent multiple throws at once
    
    setIsFlying(true);
    setDiscPosition({ x: 10, y: 40 });
    
    // Animate the disc across the screen
    let progress = 0;
    const animationInterval = setInterval(() => {
      progress += 0.03;
      
      if (progress >= 1) {
        clearInterval(animationInterval);
        setIsFlying(false);
        setDiscPosition({ x: 50, y: 30 }); // Reset to floating position
      } else {
        // Parabolic flight path
        const x = 10 + (progress * 80);
        const y = 40 + Math.sin(progress * Math.PI) * -20;
        setDiscPosition({ x, y });
      }
    }, 50);
  };

  const discGolfJokes = [
    "This page went OB (Out of Bounds)!",
    "Looks like this page took a water hazard!",
    "404: Page not found in the fairway!",
    "This page got stuck in the trees!",
    "Seems like this page rolled into the rough!",
    "This page shanked left into the woods!",
    "404: Page aced right out of existence!",
    "This page took a skip and never came back!",
  ];

  const [currentJoke] = useState(
    discGolfJokes[Math.floor(Math.random() * discGolfJokes.length)]
  );

  const discGolfTips = [
    "Try searching for a specific disc or brand",
    "Check out our pro bags for inspiration",
    "Browse by flight characteristics",
    "Build your perfect bag",
    "Discover new disc brands",
  ];

  return (
    <div className="not-found-page">
      <div className="container">
        {/* Animated Disc */}
        <div 
          className={`flying-disc ${isFlying ? 'throwing' : ''}`}
          style={{
            left: `${discPosition.x}%`,
            top: `${discPosition.y}%`,
          }}
          onClick={throwDisc}
        >
          🥏
        </div>

        {/* Main Content */}
        <div className="not-found-content">
          <div className="error-code">404</div>
          
          <h1 className="error-title">Page Not Found!</h1>
          
          <p className="error-joke">{currentJoke}</p>
          
          <div className="error-description">
            <p>Don't worry, even the pros throw into the woods sometimes. Let's get you back on course!</p>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <Link to="/" className="btn-primary">
              🏠 Back to Home
            </Link>
            <Link to="/brand" className="btn-secondary">
              🔍 Browse Discs
            </Link>
            <Link to="/pro-bags" className="btn-secondary">
              🏆 Pro Bags
            </Link>
          </div>

          {/* Helpful Tips */}
          <div className="helpful-tips">
            <h3>🎯 Try These Instead:</h3>
            <ul>
              {discGolfTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Fun Stats */}
          <div className="fun-stats">
            <div className="stat-card">
              <div className="stat-number">∞</div>
              <div className="stat-label">Discs to Discover</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Pages Found Here</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1</div>
              <div className="stat-label">Way Back Home</div>
            </div>
          </div>

          {/* Interactive Element */}
          <div className="interactive-section">
            <p>Click the disc above to throw it! 🥏</p>
            <button onClick={throwDisc} className="throw-button">
              Throw Again!
            </button>
          </div>

          {/* Search Suggestion */}
          <div className="search-suggestion">
            <p>Looking for something specific?</p>
            <div className="quick-links">
              <Link to="/flight" className="quick-link">Flight Search</Link>
              <Link to="/bags" className="quick-link">My Bags</Link>
              <Link to="/get-good" className="quick-link">Get Good</Link>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="background-elements">
          <div className="tree tree-1">🌲</div>
          <div className="tree tree-2">🌳</div>
          <div className="tree tree-3">🌲</div>
          <div className="basket">🥅</div>
          <div className="water">💧</div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;