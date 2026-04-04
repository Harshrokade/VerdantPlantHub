import React, { useState } from 'react';
import { glossary } from '../data/plants';
import styles from './Glossary.module.css';

export default function Glossary() {
  const [search, setSearch] = useState('');

  const filtered = glossary.filter(g =>
    g.term.toLowerCase().includes(search.toLowerCase()) ||
    g.def.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className={styles.topArea}>
          <div>
            <h1 className="section-title">Botanical Glossary</h1>
            <p className="section-subtitle">{glossary.length} essential terms from herbal and Ayurvedic medicine</p>
          </div>
          <div className={styles.searchWrap}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search terms…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>No terms match your search.</div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((item, i) => (
              <div key={item.term} className={styles.card} style={{ animationDelay: `${i * 0.04}s` }}>
                <div className={styles.termRow}>
                  <h3 className={styles.term}>{item.term}</h3>
                  <span className={styles.index}>{i + 1}</span>
                </div>
                <p className={styles.def}>{item.def}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
