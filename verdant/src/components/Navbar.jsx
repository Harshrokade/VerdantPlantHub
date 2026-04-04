import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { key: 'home',      label: 'Home',      icon: '🏡' },
  { key: 'plants',    label: 'Plants',    icon: '🌿' },
  { key: 'remedies',  label: 'Remedies',  icon: '🫖' },
  { key: 'symptom',   label: 'Symptom Finder', icon: '🔍' },
  { key: 'favorites', label: 'Favorites', icon: '❤️' },
  { key: 'notes',     label: 'My Notes',  icon: '📝' },
  { key: 'glossary',  label: 'Glossary',  icon: '📖' },
];

export default function Navbar({ currentPage, onNavigate, favCount, onImageSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ NEW: image state
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // ✅ NEW: handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);

      // send image to parent (API call can be done there)
      if (onImageSearch) {
        onImageSearch(file);
      }
    }
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <button className={styles.logo} onClick={() => onNavigate('home')}>
          <span className={styles.logoLeaf}>🌿</span>
          <span className={styles.logoText}>Verdant</span>
        </button>

        {/* ✅ NEW: Image Search Button */}
        <label className={styles.imageSearch}>
          📷
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            hidden 
          />
        </label>

        {/* Desktop links */}
        <ul className={styles.links}>
          {NAV_ITEMS.map(item => (
            <li key={item.key}>
              <button
                className={`${styles.navBtn} ${currentPage === item.key ? styles.active : ''}`}
                onClick={() => onNavigate(item.key)}
              >
                {item.label}
                {item.key === 'favorites' && favCount > 0 && (
                  <span className={styles.badge}>{favCount}</span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>

      {/* ✅ NEW: Image Preview (optional UI) */}
      {imagePreview && (
        <div className={styles.imagePreview}>
          <img src={imagePreview} alt="preview" />
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={`${styles.mobileNavBtn} ${currentPage === item.key ? styles.active : ''}`}
              onClick={() => { onNavigate(item.key); setMenuOpen(false); }}
            >
              <span>{item.icon}</span> {item.label}
              {item.key === 'favorites' && favCount > 0 && (
                <span className={styles.badge}>{favCount}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}