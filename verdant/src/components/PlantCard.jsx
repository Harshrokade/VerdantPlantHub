import React from 'react';
import styles from './PlantCard.module.css';

export default function PlantCard({ plant, isFav, onToggleFav, onClick }) {
  const handleFav = (e) => {
    e.stopPropagation();
    onToggleFav(plant.id);
  };

  return (
    <div className={styles.card} onClick={() => onClick(plant)}>
      <div className={styles.imgArea} style={{ background: plant.color + '55' }}>
        <span className={styles.emoji}>{plant.emoji}</span>
        <span className={styles.catBadge}>{plant.cat}</span>
        <button
          className={`${styles.favBtn} ${isFav ? styles.favActive : ''}`}
          onClick={handleFav}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{plant.name}</h3>
        <p className={styles.sci}>{plant.sci}</p>
        <div className={styles.tags}>
          {plant.tags.slice(0, 3).map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <p className={styles.desc}>{plant.desc.slice(0, 88)}…</p>
        <div className={styles.footer}>
          <span className={styles.rating}>
            {'★'.repeat(plant.rating)}{'☆'.repeat(5 - plant.rating)}
          </span>
          <span className={styles.learnMore}>View details →</span>
        </div>
      </div>
    </div>
  );
}
