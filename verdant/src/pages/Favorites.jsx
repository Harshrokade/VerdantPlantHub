import React from 'react';
import { plants } from '../data/plants';
import PlantCard from '../components/PlantCard';
import styles from './Favorites.module.css';

export default function Favorites({ favorites, onToggleFav, onOpenPlant, onNavigate }) {
  const favPlants = plants.filter(p => favorites.includes(p.id));

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className={styles.header}>
          <div>
            <h1 className="section-title">My Favorites</h1>
            <p className="section-subtitle">
              {favPlants.length > 0
                ? `${favPlants.length} saved plant${favPlants.length !== 1 ? 's' : ''}`
                : 'Plants you save will appear here'}
            </p>
          </div>
          {favPlants.length > 0 && (
            <span className={styles.heartCount}>❤️ {favPlants.length}</span>
          )}
        </div>

        {favPlants.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIllustration}>
              <span className={styles.emptyIcon}>🌿</span>
              <span className={styles.heartIcon}>🤍</span>
            </div>
            <h3>No favorites yet</h3>
            <p>Tap the heart icon on any plant card to save it here for quick access.</p>
            <button className="btn-primary" onClick={() => onNavigate('plants')}>
              Browse Plants →
            </button>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {favPlants.map(plant => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  isFav={true}
                  onToggleFav={onToggleFav}
                  onClick={onOpenPlant}
                />
              ))}
            </div>
            <div className={styles.tip}>
              <span>💡</span>
              <p>Tip: Click on any card to view detailed preparation, dosage, and safety information.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
