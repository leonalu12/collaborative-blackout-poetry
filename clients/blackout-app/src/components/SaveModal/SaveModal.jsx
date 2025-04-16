import React from 'react';
import './SaveModal.css';

const SaveModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSaveToGallery = () => {
    console.log('Save to Gallery clicked');
    onClose();
  };

  const handleSaveAsJPG = () => {
    console.log('Save as JPG clicked');
    onClose();
  };

  return (
    <div className="save-confirmation-popup">
      <div className="save-confirmation-content">
        <h3>Where would you like to save your blackout poem?</h3>
        <div className="save-buttons">
          <button onClick={handleSaveToGallery}>
            Save to Gallery
          </button>
          <button onClick={handleSaveAsJPG}>
            Save as JPG
          </button>
        </div>
        <button className="close-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default SaveModal;
