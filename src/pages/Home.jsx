import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Home.css';

function Home() {
  const { state } = useApp();

  const menuItems = [
    {
      title: 'Brand Search',
      description: 'Browse discs by manufacturer',
      path: '/brand',
      icon: '🏷️'
    },
    {
      title: 'Flight Search',
      description: 'Find discs by flight characteristics',
      path: '/flight',
      icon: '📈'
    },
    {
      title: 'Get Good',
      description: 'Learn how to improve your disc golf game',
      path: '/get-good',
      icon: '🏆'
    },
    {
      title: 'My Bags',
      description: 'Build and manage your disc bags',
      path: '/bags',
      icon: '🎒'
    }
  ];



  return (
    <div className="home">
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <h1 className="hero-title">
            Find Your Perfect Disc
          </h1>
          <p className="hero-subtitle">
            Search thousands of discs, compare flight paths, and build the perfect bag for your game.
          </p>
          
          {state.loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Loading disc database...</p>
            </div>
          )}
        </section>

        {/* Main Menu Grid */}
        <section className="menu-grid">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="menu-card"
            >
              <div className="menu-card-icon">{item.icon}</div>
              <h3 className="menu-card-title">{item.title}</h3>
              <p className="menu-card-description">{item.description}</p>
            </Link>
          ))}
        </section>

        {/* Recent Activity */}
        {state.bags.length > 0 && (
          <section className="recent-activity">
            <h2>Recent Bags</h2>
            <div className="recent-bags">
              {state.bags.slice(0, 3).map(bag => (
                <Link key={bag.id} to={`/bag/${bag.id}`} className="recent-bag">
                  <div className="recent-bag-info">
                    <h4>{bag.name}</h4>
                    <p>{bag.discs?.length || 0} discs</p>
                  </div>
                  <div className="recent-bag-arrow">→</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Getting Started */}
        {state.bags.length === 0 && !state.loading && (
          <section className="getting-started">
            <h2>New to DiscFinder?</h2>
            <div className="getting-started-cards">
              <div className="getting-started-card">
                <h4>🔍 Search for Discs</h4>
                <p>Use the search bar above to find discs by name or browse by brand.</p>
              </div>
              <div className="getting-started-card">
                <h4>📊 Compare Flight Paths</h4>
                <p>Use flight search to find discs with specific speed, glide, turn, and fade.</p>
              </div>
              <div className="getting-started-card">
                <h4>🎒 Build Your Bag</h4>
                <p>Create custom bags to organize your discs and visualize your coverage.</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Home;