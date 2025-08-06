import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAllPros } from '../data/proBags';
import './ProBags.css';

function ProBags() {
  const { state } = useApp();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (state.loading) {
    return (
      <div className="container">
        <div className="loading-page">
          <div className="spinner"></div>
          <p>Loading pro bags...</p>
        </div>
      </div>
    );
  }

  const pros = getAllPros();

  return (
    <div className="pro-bags-page">
      <div className="container">
        <div className="page-header">
          <h1>Pro Bags</h1>
          <p>Explore bags from {pros.length} professional disc golf players</p>
        </div>

        <div className="pro-grid">
          {pros.map(pro => (
            <Link
              key={pro.id}
              to={`/pro-bag/${pro.slug}`}
              className="pro-card"
              style={{
                '--pro-color': pro.color,
                '--pro-bg': pro.backgroundColor
              }}
            >
              <div className="pro-image">
                <div
                  className="pro-image-placeholder"
                  style={{
                    backgroundColor: pro.backgroundColor,
                    color: pro.color
                  }}
                >
                  {pro.name.split(' ').map(n => n.charAt(0)).join('')}
                </div>
              </div>
              
              <div className="pro-info">
                <h3 className="pro-name">{pro.name}</h3>
                <p className="pro-title">{pro.title}</p>
                <p className="pro-description">{pro.description}</p>
                <div className="pro-disc-count">
                  {pro.discIds ? pro.discIds.length : 0} discs in bag
                </div>
              </div>
              
              <div className="pro-card-arrow">
                →
              </div>
            </Link>
          ))}
        </div>

        {/* Pro Bags Info Section */}
        <section className="pro-bags-info">
          <h2>Learn from the Pros</h2>
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">🏆</div>
              <h4>Championship Bags</h4>
              <p>Discover the exact discs used by world champions to dominate the sport.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📊</div>
              <h4>Flight Numbers</h4>
              <p>See the speed, glide, turn, and fade ratings that pros rely on for different shots.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🎯</div>
              <h4>Add to Your Bag</h4>
              <p>Easily add entire pro bags or individual discs to your own collection.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProBags;