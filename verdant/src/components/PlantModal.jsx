import React from 'react';
import './PlantModal.css';

const PlantModal = ({ plant, onClose }) => {
  if (!plant) return null;

  const data = {
    name: plant.name || plant.common_name,
    sci: plant.scientific_name || plant.sci, // If this is missing, it shows N/A
    desc: plant.description || plant.desc,
    img: plant.image || plant.image_url || plant.img,
    care: plant.careInfo 
      ? `Water: ${plant.careInfo.water} | Sun: ${plant.careInfo.sunlight} | Soil: ${plant.careInfo.soil}`
      : (plant.care_guide || "General care guide provided"),
    cat: plant.category || plant.cat || "Medicinal",
    loc: plant.location || "Native Regions",
    regional: plant.regional_name || "Varies by region",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-hero">
          <button className="close-btn" onClick={onClose}>&times;</button>
          <img src={data.img} alt={data.name} />
        </div>

        <div className="modal-scroll-body">
          <div className="modal-header">
            <h2 className="hero-name">{data.name}</h2>
            {/* FIX: Only show scientific name if it exists, otherwise show nothing */}
            {data.sci && <p className="hero-sci">{data.sci}</p>}
          </div>

          {/* NEW: Description moved directly after the Name section */}
          <div className="description-top">
            <h2 className="label">Description </h2>
            <p className="section-text">{data.desc}</p>
          </div>

          <div className="info-grid">
            <div className="grid-card">
              <span className="label">Regional Name</span>
              <span className="value">{data.regional}</span>
            </div>
            <div className="grid-card">
              <span className="label">Category</span>
              <span className="value">{data.cat}</span>
            </div>
            <div className="grid-card">
              <span className="label">Care Information</span>
              <span className="value">{data.care}</span>
            </div>
            <div className="grid-card">
              <span className="label">Location / Origin</span>
              <span className="value">{data.loc}</span>
            </div>
          </div>

          <div className="modal-footer">
            <p className="disclaimer">
              * Always consult a professional before using medicinal herbs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantModal;