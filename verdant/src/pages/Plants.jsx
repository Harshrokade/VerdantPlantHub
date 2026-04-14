import React, { useState, useEffect, useMemo, useRef } from 'react';
import PlantCard from '../components/PlantCard';
import styles from './Plants.module.css';

const API_BASE = "http://localhost:5001";

export default function Plants({ favorites, onToggleFav, onOpenPlant, initialFilter, initialSearch }) {
  const [activeFilter, setActiveFilter] = useState(initialFilter || 'All');
  const [search, setSearch] = useState(initialSearch || '');
  
  // Dynamic state for Atlas plants (to show all 27)
  const [atlasPlants, setAtlasPlants] = useState([]); 
  const [sqlResults, setSqlResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const fileInputRef = useRef(null);

  // --- 1. Load ALL Plants from Atlas on Mount ---
  useEffect(() => {
    const fetchAtlasPlants = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/plants`); // Fetches default Atlas list
        const data = await response.json();
        if (data.success) {
          setAtlasPlants(data.plants); // Stores all 27 plants from Atlas
        }
      } catch (error) {
        console.error("Atlas Load Error:", error);
      }
    };
    fetchAtlasPlants();
  }, []);

  // --- 2. Text Search Logic (MySQL) ---
  useEffect(() => {
    const fetchSQLData = async () => {
      if (!search.trim()) {
        setSqlResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await fetch(`${API_BASE}/api/plants?search=${encodeURIComponent(search)}`);
        const data = await response.json();
        if (data.success) {
          setSqlResults(data.plants || []);
        }
      } catch (error) {
        console.error("SQL Search Error:", error);
        setSqlResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchSQLData, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  // --- 3. Image Search Logic (AI) ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsAiLoading(true);
    setSearch(''); 
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(",")[1];
      try {
        const response = await fetch(`${API_BASE}/api/identify-plant`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_data: base64Data }),
        });
        const data = await response.json();
        setSqlResults(data.plants || (data.plant ? [data.plant] : []));
        if (data.plant?.name) setSearch(data.plant.name);
      } catch (err) {
        alert("AI identification failed.");
      } finally {
        setIsAiLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- 4. Dynamic Display List ---
  const displayList = useMemo(() => {
    // If searching, show SQL/AI results
    if (search.trim() || sqlResults.length > 0) {
      return sqlResults;
    }
    
    // Otherwise, filter the 27 plants fetched from Atlas
    let list = atlasPlants;
    if (activeFilter !== 'All') {
      // Atlas uses 'category', check both 'cat' and 'category' for safety
      list = list.filter(p => (p.category === activeFilter || p.cat === activeFilter));
    }
    return list;
  }, [activeFilter, search, sqlResults, atlasPlants]);

  // --- 5. Extract Categories Dynamically from Atlas Data ---
  const dynamicCategories = useMemo(() => {
    const cats = new Set(atlasPlants.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [atlasPlants]);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <h1 className="section-title">Medicinal Plants Hub</h1>
        
        <div className={styles.searchContainer}>
            <div className={styles.searchWrap}>
              <span>{isSearching || isAiLoading ? '⏳' : '🔍'}</span>
              <input
                type="text"
                placeholder="Search database..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <button className={styles.clearBtn} onClick={() => {setSearch(''); setSqlResults([]);}}>✕</button>}
            </div>

            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
            <button className={styles.aiButton} onClick={() => fileInputRef.current.click()}>📸</button>
        </div>

        {!search && sqlResults.length === 0 && (
          <div className={styles.filters}>
            {dynamicCategories.map(cat => (
              <button
                key={cat}
                className={`${styles.filterPill} ${activeFilter === cat ? styles.active : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <p className={styles.resultCount}>
          Showing <strong>{displayList.length}</strong> results
        </p>

        <div className={styles.grid}>
          {displayList.map((plant, index) => (
            <PlantCard
              key={plant._id || plant.id || index}
              plant={plant}
              isFav={favorites.includes(plant._id || plant.id)}
              onToggleFav={onToggleFav}
              onClick={onOpenPlant}
            />
          ))}
        </div>
      </div>
    </div>
  );
}