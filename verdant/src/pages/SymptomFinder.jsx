import React, { useState, useMemo } from 'react';
import { plants, remedies } from '../data/plants';
import styles from './SymptomFinder.module.css';

const COMMON_SYMPTOMS = [
  'stress', 'anxiety', 'insomnia', 'fatigue', 'inflammation',
  'cold', 'cough', 'fever', 'indigestion', 'bloating',
  'joint pain', 'headache', 'acne', 'hair loss', 'poor memory',
  'high cholesterol', 'nausea', 'low immunity', 'hormonal imbalance', 'brain fog'
];

export default function SymptomFinder({ onOpenPlant, onNavigate }) {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState([]);
  const [searched, setSearched] = useState(false);

  const addSymptom = (s) => {
    const clean = s.trim().toLowerCase();
    if (clean && !selected.includes(clean)) {
      setSelected(prev => [...prev, clean]);
    }
    setInput('');
  };

  const removeSymptom = (s) => setSelected(prev => prev.filter(x => x !== s));

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      addSymptom(input);
    }
  };

  const results = useMemo(() => {
    if (selected.length === 0) return { plants: [], remedies: [] };

    const matchedPlants = plants.map(p => {
      const matches = selected.filter(sym =>
        p.symptoms.some(s => s.includes(sym) || sym.includes(s)) ||
        p.tags.some(t => t.toLowerCase().includes(sym)) ||
        p.desc.toLowerCase().includes(sym)
      );
      return { ...p, matchCount: matches.length, matchedSymptoms: matches };
    }).filter(p => p.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    const matchedRemedies = remedies.map(r => {
      const matches = selected.filter(sym =>
        r.symptoms.some(s => s.includes(sym) || sym.includes(s)) ||
        r.ailment.toLowerCase().includes(sym)
      );
      return { ...r, matchCount: matches.length };
    }).filter(r => r.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    return { plants: matchedPlants, remedies: matchedRemedies };
  }, [selected]);

  const handleSearch = () => {
    if (input.trim()) addSymptom(input);
    setSearched(true);
  };

  const hasResults = results.plants.length > 0 || results.remedies.length > 0;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className={styles.headerArea}>
          <div className={styles.iconWrap}>🔍</div>
          <h1 className="section-title">Symptom Finder</h1>
          <p className="section-subtitle">
            Enter your symptoms to discover matching medicinal plants and traditional remedies
          </p>
        </div>

        {/* Input area */}
        <div className={styles.inputCard}>
          <p className={styles.inputLabel}>What symptoms are you experiencing?</p>
          <div className={styles.inputWrap}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a symptom and press Enter…"
              className={styles.input}
            />
            <button
              className={styles.addBtn}
              onClick={() => input.trim() && addSymptom(input)}
              disabled={!input.trim()}
            >
              + Add
            </button>
          </div>

          {/* Selected chips */}
          {selected.length > 0 && (
            <div className={styles.chips}>
              {selected.map(s => (
                <span key={s} className={styles.chip}>
                  {s}
                  <button onClick={() => removeSymptom(s)}>✕</button>
                </span>
              ))}
              <button className={styles.clearAll} onClick={() => { setSelected([]); setSearched(false); }}>
                Clear all
              </button>
            </div>
          )}

          {/* Common symptoms */}
          <div className={styles.commonWrap}>
            <p className={styles.commonLabel}>Common symptoms:</p>
            <div className={styles.commonList}>
              {COMMON_SYMPTOMS.map(s => (
                <button
                  key={s}
                  className={`${styles.commonBtn} ${selected.includes(s) ? styles.commonSelected : ''}`}
                  onClick={() => selected.includes(s) ? removeSymptom(s) : addSymptom(s)}
                >
                  {selected.includes(s) ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
          </div>

          <button
            className={styles.searchBtn}
            onClick={handleSearch}
            disabled={selected.length === 0 && !input.trim()}
          >
            🔍 Find Plants &amp; Remedies
          </button>
        </div>

        {/* Results */}
        {searched && selected.length > 0 && (
          <div className={styles.results}>
            {!hasResults ? (
              <div className={styles.noResults}>
                <span>🌾</span>
                <p>No matches found. Try different or broader symptom terms.</p>
              </div>
            ) : (
              <>
                {/* Matching Plants */}
                {results.plants.length > 0 && (
                  <section className={styles.resultSection}>
                    <h2 className={styles.resultTitle}>
                      🌿 Matching Plants
                      <span className={styles.resultCount}>{results.plants.length} found</span>
                    </h2>
                    <div className={styles.plantList}>
                      {results.plants.slice(0, 8).map(plant => (
                        <button
                          key={plant.id}
                          className={styles.plantRow}
                          onClick={() => onOpenPlant(plant)}
                        >
                          <span className={styles.plantEmoji}>{plant.emoji}</span>
                          <div className={styles.plantInfo}>
                            <div className={styles.plantName}>{plant.name}</div>
                            <div className={styles.plantSci}>{plant.sci}</div>
                            <div className={styles.matchedSymptoms}>
                              {plant.matchedSymptoms.map(sym => (
                                <span key={sym} className={styles.matchChip}>{sym}</span>
                              ))}
                            </div>
                          </div>
                          <div className={styles.matchScore}>
                            <div className={styles.scoreNum}>{plant.matchCount}</div>
                            <div className={styles.scoreLabel}>match{plant.matchCount !== 1 ? 'es' : ''}</div>
                          </div>
                          <span className={styles.arrow}>→</span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {/* Matching Remedies */}
                {results.remedies.length > 0 && (
                  <section className={styles.resultSection}>
                    <h2 className={styles.resultTitle}>
                      🫖 Matching Remedies
                      <span className={styles.resultCount}>{results.remedies.length} found</span>
                    </h2>
                    <div className={styles.remedyList}>
                      {results.remedies.map(r => (
                        <button
                          key={r.id}
                          className={styles.remedyRow}
                          onClick={() => onNavigate('remedies')}
                        >
                          <span className={styles.remedyIcon}>{r.icon}</span>
                          <div className={styles.remedyInfo}>
                            <div className={styles.remedyName}>{r.name}</div>
                            <div className={styles.remedyAilment}>{r.ailment}</div>
                          </div>
                          <span className={styles.viewBtn}>View recipe →</span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
