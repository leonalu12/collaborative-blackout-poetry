import React, { useState, useRef } from 'react';
import ColorPicker from './ColorPicker';
import TextInputPanel from './CreationArea/TextInputPanel';
import PreviewPanel from './CreationArea/PreviewPanel';
import CreationControls from './CreationArea/CreationControls';
import UploadArticle from './CreationArea/UploadArticle';

import SaveModal from './SaveModal/SaveModal';
import '../BlackoutPage.css';

export default function BlackoutPage() {
  const [rawText, setRawText] = useState('This is a sample text for blackout. You can edit or replace it.');
  const [formattedText, setFormattedText] = useState('');
  const [selectedColor, setSelectedColor] = useState('black');
  const [isBlackout, setIsBlackout] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const fileInputRef = useRef();

  const handleBlackout = () => {
    if (!isBlackout) {
      const result = rawText.split(' ').map(
        word => `<span style="background-color:${selectedColor};color:${selectedColor};padding:2px;">${word}</span>`
      ).join(' ');
      setFormattedText(result);
    } else {
      setFormattedText(rawText);
    }
    setIsBlackout(!isBlackout);
  };

  const handleLoadExample = () => {
    const newText = 'Every word you blackout reveals a new layer of meaning.';
    setRawText(newText);
    setFormattedText('');
    setIsBlackout(false);
  };


  const handleUploadText = (text) => {
    setRawText(text);
    setFormattedText('');
    setIsBlackout(false);
    setShowUploadPopup(false); // Close the popup after confirmation
  };

  const handleSubmitInputText = (text) => {
    if (!text) return;
    // Check if the text is empty or contains only whitespace
    setRawText(text);
    setFormattedText(text);
    setIsBlackout(false);
  }

  return (
    <div className="blackout-page">
      <div className="sidebar">
        <button className="nav-btn active">Blackout</button>
        <button className="nav-btn">Gallery</button>
      </div>

      <div className="editor-area">
        <div className="top-buttons">
          <button className="round-btn" onClick={handleLoadExample}>Get Random Poem</button>
          <button className="round-btn" onClick={() => setShowUploadPopup(true)}>
            Upload your own article
          </button>
        </div>

        {showUploadPopup && (
          <div className="upload-popup">
            <div className="upload-popup-content">
              <h3>Upload a .txt file</h3>
              <UploadArticle ref={fileInputRef} onConfirm={handleUploadText} />
              <button className="close-btn" onClick={() => setShowUploadPopup(false)}>Close</button>
            </div>
          </div>
        )}

        <TextInputPanel
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
          }}
          onSubmit={handleSubmitInputText }
        />

        <ColorPicker onColorChange={setSelectedColor} />
        <button className="custom-color-btn">Your Color</button>
      </div>

      <div className="preview-area">
        <PreviewPanel html={formattedText} />
        <CreationControls
          isBlackout={isBlackout}
          onBlackout={handleBlackout}
          onSave={() => setShowSaveConfirmation(true)}
        />
      </div>

      {/* Save confirmation popup */}
      <SaveModal
        isOpen={showSaveConfirmation}
        onClose={() => setShowSaveConfirmation(false)}
      />
    </div>
  );
}
