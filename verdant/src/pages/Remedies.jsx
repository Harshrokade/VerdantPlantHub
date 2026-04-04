import React, { useState } from 'react';
import { remedies, plants } from '../data/plants';
import styles from './Remedies.module.css';

export default function Remedies({ onOpenPlant }) {
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  const findPlant = (name) => plants.find(p => p.name === name);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <h1 className="section-title">Traditional Remedies</h1>
        <p className="section-subtitle">Time-tested preparations from Ayurveda and world herbal traditions. Always consult a healthcare professional before use.</p>

        <div className={styles.list}>
          {remedies.map(remedy => (
            <div key={remedy.id} className={`${styles.card} ${expanded === remedy.id ? styles.open : ''}`}>
              <button className={styles.header} onClick={() => toggle(remedy.id)}>
                <span className={styles.icon}>{remedy.icon}</span>
                <div className={styles.headerText}>
                  <h3 className={styles.name}>{remedy.name}</h3>
                  <p className={styles.ailment}>{remedy.ailment}</p>
                </div>
                <div className={styles.headerRight}>
                  <span className={styles.timeBadge}>⏱ {remedy.time}</span>
                  <span className={styles.diffBadge}>{remedy.difficulty}</span>
                  <span className={styles.chevron}>{expanded === remedy.id ? '▲' : '▼'}</span>
                </div>
              </button>

              {expanded === remedy.id && (
                <div className={styles.body}>
                  <div className={styles.plantTags}>
                    <span className={styles.plantsLabel}>Ingredients:</span>
                    {remedy.plants.map(name => {
                      const p = findPlant(name);
                      return (
                        <button
                          key={name}
                          className={styles.plantTag}
                          onClick={() => p && onOpenPlant(p)}
                        >
                          {p?.emoji} {name}
                        </button>
                      );
                    })}
                  </div>
                  <div className={styles.prep}>
                    <h4 className={styles.prepLabel}>Preparation Method</h4>
                    <p>{remedy.prep}</p>
                  </div>
                  <div className={styles.symptomTags}>
                    <span className={styles.plantsLabel}>Helps with:</span>
                    {remedy.symptoms.slice(0, 6).map(s => (
                      <span key={s} className="tag" style={{ textTransform: 'capitalize' }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.disclaimer}>
          <span>⚠️</span>
          <p>These remedies are for informational and educational purposes only. They are not intended to diagnose, treat, cure, or prevent any disease. Please consult a qualified Ayurvedic practitioner or healthcare provider before starting any herbal regimen.</p>
        </div>
      </div>
    </div>
  );
}
