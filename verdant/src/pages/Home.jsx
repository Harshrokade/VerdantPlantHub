import React, { useState } from 'react';
import { plants, categories } from '../data/plants';
import PlantCard from '../components/PlantCard';
import styles from './Home.module.css';

export default function Home({ favorites, onToggleFav, onOpenPlant, onNavigate, onFilterCategory }) {
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      onNavigate('plants', { search: search.trim() });
    }
  };

  const featuredPlants = plants.filter(p => p.featured);

  const stats = [
    { num: plants.length, label: 'Plants' },
    { num: categories.length - 1, label: 'Categories' },
    { num: 12, label: 'Remedies' },
    { num: '50+', label: 'Ailments' },
  ];

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroDecor} />
        <div className={styles.heroContent}>
          <div className={styles.heroPill}>🌿 Virtual Medicinal Plants Hub</div>
          <h1 className={styles.heroTitle}>
            Nature's <em>Pharmacy</em><br />at Your Fingertips
          </h1>
          <p className={styles.heroSub}>
            Explore traditional medicinal plants, time-tested remedies, and botanical wisdom
            from Ayurveda and herbal traditions worldwide.
          </p>
          <form className={styles.searchBox} onSubmit={handleSearch}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search plants, ailments, remedies…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <div className={styles.heroStats}>
            {stats.map(s => (
              <div key={s.label} className={styles.stat}>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className={styles.quickActions}>
        <div className="container">
          <div className={styles.actionGrid}>
            {[
              { icon: '🔍', title: 'Symptom Finder', desc: 'Enter symptoms to find matching plants & remedies', page: 'symptom' },
              { icon: '🫖', title: 'Browse Remedies', desc: 'Traditional preparations for common ailments', page: 'remedies' },
              { icon: '❤️', title: 'My Favorites', desc: `${favorites.length} saved plants`, page: 'favorites' },
              { icon: '📝', title: 'My Notes', desc: 'Personal notes & dosage tracking', page: 'notes' },
            ].map(a => (
              <button key={a.page} className={styles.actionCard} onClick={() => onNavigate(a.page)}>
                <span className={styles.actionIcon}>{a.icon}</span>
                <div>
                  <div className={styles.actionTitle}>{a.title}</div>
                  <div className={styles.actionDesc}>{a.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.catSection}>
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">Select a category to explore plants by their primary use</p>
          <div className={styles.catGrid}>
            {categories.filter(c => c.name !== 'All').map(cat => {
              const count = plants.filter(p => p.cat === cat.name).length;
              return (
                <button
                  key={cat.name}
                  className={styles.catCard}
                  onClick={() => onFilterCategory(cat.name)}
                >
                  <span className={styles.catIcon}>{cat.icon}</span>
                  <span className={styles.catName}>{cat.name}</span>
                  <span className={styles.catCount}>{count} plants</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured plants */}
      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Featured Plants</h2>
              <p className="section-subtitle">Highly revered herbs with proven healing properties</p>
            </div>
            <button className="btn-outline" onClick={() => onNavigate('plants')}>View All →</button>
          </div>
          <div className={styles.plantsGrid}>
            {featuredPlants.map(plant => (
              <PlantCard
                key={plant.id}
                plant={plant}
                isFav={favorites.includes(plant.id)}
                onToggleFav={onToggleFav}
                onClick={onOpenPlant}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
