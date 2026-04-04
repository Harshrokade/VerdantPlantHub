import React, { useState, useMemo } from 'react';
import { plants, categories } from '../data/plants';
import PlantCard from '../components/PlantCard';
import styles from './Plants.module.css';

export default function Plants({ favorites, onToggleFav, onOpenPlant, initialFilter, initialSearch }) {
  const [activeFilter, setActiveFilter] = useState(initialFilter || 'All');
  const [search, setSearch] = useState(initialSearch || '');

  const filtered = useMemo(() => {
    let list = plants;
    if (activeFilter !== 'All') list = list.filter(p => p.cat === activeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sci.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.desc.toLowerCase().includes(q) ||
        p.symptoms.some(s => s.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeFilter, search]);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <h1 className="section-title">Medicinal Plants</h1>
        <p className="section-subtitle">Explore {plants.length} plants with detailed profiles, dosage, and safety notes</p>

        {/* Search */}
        <div className={styles.searchWrap}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search by name, ailment, or symptom…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')}>✕</button>}
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          {categories.map(cat => (
            <button
              key={cat.name}
              className={`${styles.filterPill} ${activeFilter === cat.name ? styles.active : ''}`}
              onClick={() => setActiveFilter(cat.name)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className={styles.resultCount}>
          Showing <strong>{filtered.length}</strong> plant{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map(plant => (
              <PlantCard
                key={plant.id}
                plant={plant}
                isFav={favorites.includes(plant.id)}
                onToggleFav={onToggleFav}
                onClick={onOpenPlant}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🌾</div>
            <h3>No plants found</h3>
            <p>Try a different search term or category filter.</p>
            <button className="btn-outline" onClick={() => { setSearch(''); setActiveFilter('All'); }}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
