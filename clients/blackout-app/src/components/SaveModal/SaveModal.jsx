import React from 'react';
import './SaveModal.css';
import html2canvas from 'html2canvas';


const SaveModal = ({ isOpen, onClose, title, words, rawText, documentId }) => {

  const API_BASE = import.meta.env.VITE_API_BASE;
  if (!isOpen) return null;

const handleSaveToGallery = async () => {
  console.log("rawText:", rawText);
  if (!title?.trim()) {
    alert("Please enter a title before saving!");
    return;
  }

  if (!words || words.length === 0) {
    alert("No blackout words selected!");
    return;
  }

  const blackoutWordsArray = words
    .filter(word => !word.isBlackout)
    .map(word => ({ index: word.id, text: word.text }));

    console.log("Saving blackoutWords:", blackoutWordsArray.map(w => `${w.index}: ${w.text}`));

    const method = documentId ? 'PUT' : 'POST';
    const url = documentId ? `${API_BASE}api/documents/${documentId}` : `${API_BASE}api/documents`;

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentName: title,
        content: rawText,
        blackoutWords: blackoutWordsArray,
        state: "public",
      }),
    });

    if (!response.ok) throw new Error("Failed to save");

    alert("Saved to gallery successfully!");
    onClose();
  } catch (error) {
    console.error("Save error:", error);
    alert("Error saving document.");
  }
};


  const handleSaveAsJPG = async () => {
    try {
      const PreviewPanel = document.querySelector('.preview-box');
      const canvas = await html2canvas(PreviewPanel, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'blackout_poem.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Save as JPG failed:', error);
      alert('Failed to save as JPG. Please try again.');
    }
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
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default SaveModal;
