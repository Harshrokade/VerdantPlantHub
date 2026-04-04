import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PlantModal from './components/PlantModal';
import Home from './pages/Home';
import Plants from './pages/Plants';
import Remedies from './pages/Remedies';
import SymptomFinder from './pages/SymptomFinder';
import Favorites from './pages/Favorites';
import Notes from './pages/Notes';
import Glossary from './pages/Glossary';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ToastProvider, useToast } from './hooks/useToast';
import './styles/globals.css';

function AppInner() {
  const [page, setPage] = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [favorites, setFavorites] = useLocalStorage('verdant_favorites', []);
  const showToast = useToast();

  const navigate = (target, params = {}) => {
    setPage(target);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFav = (id) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      showToast(isFav ? 'Removed from favorites' : 'Added to favorites', isFav ? '🤍' : '❤️');
      return isFav ? prev.filter(x => x !== id) : [...prev, id];
    });
  };

  const openPlant = (plant) => setSelectedPlant(plant);
  const closePlant = () => setSelectedPlant(null);

  const filterCategory = (cat) => navigate('plants', { filter: cat });

  const renderPage = () => {
    switch (page) {
      case 'home':
        return (
          <Home
            favorites={favorites}
            onToggleFav={toggleFav}
            onOpenPlant={openPlant}
            onNavigate={navigate}
            onFilterCategory={filterCategory}
          />
        );
      case 'plants':
        return (
          <Plants
            favorites={favorites}
            onToggleFav={toggleFav}
            onOpenPlant={openPlant}
            initialFilter={pageParams.filter || 'All'}
            initialSearch={pageParams.search || ''}
          />
        );
      case 'remedies':
        return <Remedies onOpenPlant={openPlant} />;
      case 'symptom':
        return <SymptomFinder onOpenPlant={openPlant} onNavigate={navigate} />;
      case 'favorites':
        return (
          <Favorites
            favorites={favorites}
            onToggleFav={toggleFav}
            onOpenPlant={openPlant}
            onNavigate={navigate}
          />
        );
      case 'notes':
        return <Notes />;
      case 'glossary':
        return <Glossary />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar
        currentPage={page}
        onNavigate={navigate}
        favCount={favorites.length}
      />

      <main>{renderPage()}</main>

      <footer style={{
        background: 'var(--dark-green-900)',
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        padding: '2.5rem 1.5rem',
        fontSize: '0.82rem',
        lineHeight: '1.8',
        marginTop: '2rem'
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--parrot-green-300)', marginBottom: '6px' }}>
          🌿 Verdant — Virtual Medicinal Plants Hub
        </div>
        <div>For educational purposes only. Always consult a qualified healthcare practitioner before using any herbal remedy.</div>
        <div style={{ marginTop: '4px', color: 'rgba(255,255,255,0.28)' }}>
          Built with React • Data from Ayurvedic &amp; herbal traditions worldwide
        </div>
      </footer>

      {selectedPlant && (
        <PlantModal
          plant={selectedPlant}
          isFav={favorites.includes(selectedPlant.id)}
          onToggleFav={toggleFav}
          onClose={closePlant}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}
