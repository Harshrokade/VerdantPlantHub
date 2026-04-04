import React, { useEffect } from 'react';
import styles from './PlantModal.module.css';

export default function PlantModal({ plant, isFav, onToggleFav, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!plant) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Hero */}
        <div className={styles.hero} style={{ background: `linear-gradient(135deg, ${plant.color}88 0%, ${plant.color}44 100%)` }}>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
          <button
            className={`${styles.favBtnHero} ${isFav ? styles.favActive : ''}`}
            onClick={() => onToggleFav(plant.id)}
          >
            {isFav ? '❤️ Saved' : '🤍 Save'}
          </button>
          <div className={styles.heroEmoji}>{plant.emoji}</div>
          <h2 className={styles.heroName}>{plant.name}</h2>
          <p className={styles.heroSci}>{plant.sci}</p>
          <div className={styles.heroTags}>
            {plant.tags.map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <section className={styles.section}>
            <h4 className={styles.sectionLabel}>About</h4>
            <p className={styles.sectionText}>{plant.desc}</p>
          </section>

          <div className={styles.propsGrid}>
            {[
              { label: 'Origin', val: plant.origin },
              { label: 'Part Used', val: plant.part },
              { label: 'Flavor', val: plant.flavor },
              { label: 'Category', val: plant.cat },
            ].map(p => (
              <div key={p.label} className={styles.propItem}>
                <span className={styles.propLabel}>{p.label}</span>
                <span className={styles.propVal}>{p.val}</span>
              </div>
            ))}
          </div>

          <section className={styles.section}>
            <h4 className={styles.sectionLabel}>Preparation</h4>
            <p className={styles.sectionText}>{plant.preparation}</p>
          </section>

          <section className={styles.section}>
            <h4 className={styles.sectionLabel}>Dosage</h4>
            <p className={styles.sectionText}>{plant.dosage}</p>
          </section>

          <div className={styles.rating}>
            {'★'.repeat(plant.rating)}{'☆'.repeat(5 - plant.rating)}
            <span className={styles.ratingLabel}>Efficacy rating</span>
          </div>

          <div className={styles.cautionBox}>
            <strong>⚠ Caution &amp; Contraindications</strong>
            <p>{plant.caution}</p>
          </div>

          <p className={styles.disclaimer}>
            This information is for educational purposes only. Always consult a qualified healthcare practitioner before using any medicinal herb.
          </p>
        </div>
      </div>
    </div>
  );
}
