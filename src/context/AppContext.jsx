import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadDiscs } from '../utils/dataLoader';

const AppContext = createContext();

// Initial state
const initialState = {
  discs: [],
  bags: JSON.parse(localStorage.getItem('dg-bags') || '[]'),
  // Scorecards and saved players persisted locally
  scorecards: JSON.parse(localStorage.getItem('dg-scorecards') || '[]'),
  savedPlayers: JSON.parse(localStorage.getItem('dg-saved-players') || '[]'),
  loading: true,
  error: null,
  searchQuery: '',
  settings: JSON.parse(localStorage.getItem('dg-settings') || '{"theme":"dark"}')
};

// Action types
const ACTIONS = {
  SET_DISCS: 'SET_DISCS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  ADD_BAG: 'ADD_BAG',
  UPDATE_BAG: 'UPDATE_BAG',
  DELETE_BAG: 'DELETE_BAG',
  // Scorecards
  ADD_SCORECARD: 'ADD_SCORECARD',
  UPDATE_SCORECARD: 'UPDATE_SCORECARD',
  DELETE_SCORECARD: 'DELETE_SCORECARD',
  // Saved players
  SET_SAVED_PLAYERS: 'SET_SAVED_PLAYERS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_DISCS:
      return { ...state, discs: action.payload, loading: false };
    
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    
    case ACTIONS.ADD_BAG:
      const newBags = [...state.bags, action.payload];
      localStorage.setItem('dg-bags', JSON.stringify(newBags));
      return { ...state, bags: newBags };
    
    case ACTIONS.UPDATE_BAG:
      const updatedBags = state.bags.map(bag => 
        bag.id === action.payload.id ? action.payload : bag
      );
      localStorage.setItem('dg-bags', JSON.stringify(updatedBags));
      return { ...state, bags: updatedBags };
    
    case ACTIONS.DELETE_BAG:
      const filteredBags = state.bags.filter(bag => bag.id !== action.payload);
      localStorage.setItem('dg-bags', JSON.stringify(filteredBags));
      return { ...state, bags: filteredBags };
    
    case ACTIONS.UPDATE_SETTINGS:
      const newSettings = { ...state.settings, ...action.payload };
      localStorage.setItem('dg-settings', JSON.stringify(newSettings));
      return { ...state, settings: newSettings };
    
    // Scorecards
    case ACTIONS.ADD_SCORECARD: {
      const newScorecards = [...state.scorecards, action.payload];
      localStorage.setItem('dg-scorecards', JSON.stringify(newScorecards));
      return { ...state, scorecards: newScorecards };
    }
    case ACTIONS.UPDATE_SCORECARD: {
      const updatedScorecards = state.scorecards.map(sc => 
        sc.id === action.payload.id ? { ...sc, ...action.payload } : sc
      );
      localStorage.setItem('dg-scorecards', JSON.stringify(updatedScorecards));
      return { ...state, scorecards: updatedScorecards };
    }
    case ACTIONS.DELETE_SCORECARD: {
      const filtered = state.scorecards.filter(sc => sc.id !== action.payload);
      localStorage.setItem('dg-scorecards', JSON.stringify(filtered));
      return { ...state, scorecards: filtered };
    }
    
    // Saved players
    case ACTIONS.SET_SAVED_PLAYERS: {
      const unique = Array.from(new Set(action.payload.map(n => n.trim()))).filter(Boolean);
      localStorage.setItem('dg-saved-players', JSON.stringify(unique));
      return { ...state, savedPlayers: unique };
    }
    
    default:
      return state;
  }
}

// Context Provider
export function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load discs data on app start
  useEffect(() => {
    async function loadData() {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const discs = await loadDiscs();
        dispatch({ type: ACTIONS.SET_DISCS, payload: discs });
      } catch (error) {
        console.error('Failed to load discs:', error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load disc data' });
      }
    }
    loadData();
  }, []);

  // Apply theme to body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark-mode', state.settings.theme === 'dark');
    }
  }, [state.settings.theme]);

  // Action creators
  const actions = {
    setSearchQuery: (query) => dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: query }),
    
    addBag: (bag) => dispatch({ type: ACTIONS.ADD_BAG, payload: bag }),
    
    updateBag: (bag) => dispatch({ type: ACTIONS.UPDATE_BAG, payload: bag }),
    
    deleteBag: (bagId) => dispatch({ type: ACTIONS.DELETE_BAG, payload: bagId }),
    
    updateSettings: (settings) => dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: settings }),
    
    // Scorecards
    addScorecard: (scorecard) => dispatch({ type: ACTIONS.ADD_SCORECARD, payload: scorecard }),
    updateScorecard: (scorecard) => dispatch({ type: ACTIONS.UPDATE_SCORECARD, payload: scorecard }),
    deleteScorecard: (scorecardId) => dispatch({ type: ACTIONS.DELETE_SCORECARD, payload: scorecardId }),
    
    // Saved players
    setSavedPlayers: (names) => dispatch({ type: ACTIONS.SET_SAVED_PLAYERS, payload: names })
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within a ContextProvider');
  }
  return context;
}