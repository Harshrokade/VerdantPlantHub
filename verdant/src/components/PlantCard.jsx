import React, { useState } from 'react';
import PlantModal from './PlantModal';
import './PlantCard.css';

const PlantCard = ({ plant }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!plant) return null;

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Determine the correct image source
  // Atlas uses 'image', MySQL uses 'image_url', some Atlas fallbacks use 'img'
  const imageSrc = plant.image || plant.image_url || plant.img;
  const plantName = plant.name || plant.common_name;

  return (
    <>
      <div className="plant-card" onClick={toggleModal}>
        <img 
          src={imageSrc} 
          alt={plantName} 
          loading="lazy"
        />
        
        <div className="plant-card-body">
          <div className="plant-card-info">
            <h3>{plantName}</h3>
            <p className="scientific-name">{plant.scientific_name || plant.sci || "Medicinal Plant"}</p>
          </div>
          
          <div className="plant-card-footer">
            <span>View Details</span>
            <span className="arrow">➔</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <PlantModal 
          plant={plant} 
          onClose={toggleModal} 
        />
      )}
    </>
  );
};

export default PlantCard;