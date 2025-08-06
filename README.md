# 🥏 DiscBagPro - Disc Golf Webapp

A comprehensive disc golf webapp that helps players find discs, compare flight paths, and build the perfect bag for their game.

## ✨ Features

- **🔍 Smart Search**: Fuzzy search across 5,000+ discs with intelligent matching
- **🏷️ Brand Browser**: Explore discs by manufacturer with filtering
- **📊 Flight Search**: Interactive sliders to find discs by flight characteristics
- **🎒 Bag Builder**: Create and manage multiple disc bags with autosave
- **📈 Bag Reports**: Visual flight chart and coverage analysis
- **✈️ Flight Visualization**: SVG flight path curves based on disc numbers
- **📱 Responsive**: Mobile-first design that works on all devices
- **⚡ Fast**: IndexedDB caching and optimized performance
- **♿ Accessible**: WCAG compliant with keyboard navigation

## 🚀 Live Demo

Visit the live app: **[https://yourusername.github.io/discgolfpro/](https://yourusername.github.io/discgolfpro/)**

## 🛠️ Tech Stack

- **React 18** - Modern functional components with hooks
- **React Router v6** - Client-side routing for SPA
- **Fuse.js** - Fuzzy search functionality
- **LocalForage** - IndexedDB caching for offline support
- **Plain CSS** - Responsive design with CSS custom properties
- **Vite** - Fast development and build tooling

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/discgolfpro.git
   cd discgolfpro
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AppShell.jsx     # Main app layout
│   ├── SearchBar.jsx    # Global search functionality
│   ├── DiscRow.jsx      # Disc list item
│   ├── FlightPathSVG.jsx # SVG flight visualization
│   └── ...
├── pages/               # Route components
│   ├── Home.jsx         # Landing page
│   ├── DiscDetail.jsx   # Individual disc details
│   ├── FlightSearch.jsx # Flight number search
│   ├── BagEditor.jsx    # Bag management
│   └── ...
├── context/             # React Context for state
├── utils/               # Helper functions
│   ├── dataLoader.js    # Disc data fetching
│   ├── fuzzySearch.js   # Search algorithms
│   ├── flightPath.js    # Flight visualization
│   └── bagReport.js     # Bag analysis
└── App.jsx              # Main app component
```

## 🎯 Key Features Explained

### Smart Search

- Fuzzy matching on disc names, brands, and categories
- Keyboard navigation with arrow keys
- Real-time results with highlighting

### Flight Search

- Interactive range sliders for Speed, Glide, Turn, Fade
- URL parameter sync for shareable searches
- Debounced filtering for smooth performance

### Bag Builder

- Local storage persistence
- Category-based organization
- Auto-save every 1 second
- Duplicate disc support

### Bag Reports

- 15×7 visual flight chart
- Speed coverage analysis
- Stability balance recommendations
- Category breakdown

### Flight Visualization

- Dynamic SVG curves based on flight numbers
- Physically accurate flight paths
- Interactive tooltips and labels

## 🚀 Deployment

The app is configured for automatic deployment to GitHub Pages via GitHub Actions.

### Automatic Deployment

1. Push to `main` branch
2. GitHub Actions builds and deploys automatically
3. Available at `https://yourusername.github.io/discgolfpro/`

### Manual Deployment

```bash
npm run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Disc data sourced from disc golf manufacturers
- Built following modern React best practices
- Designed with accessibility and performance in mind

## 📞 Support

If you have any questions or issues, please [open an issue](https://github.com/yourusername/discgolfpro/issues) on GitHub.

---

Made with ❤️ for the disc golf community
