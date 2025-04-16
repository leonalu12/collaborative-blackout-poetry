import React, { useState } from 'react';
import ColorPicker from './ColorPicker';
import TextInputPanel from './CreationArea/TextInputPanel';
import PreviewPanel from './CreationArea/PreviewPanel';
import CreationControls from './CreationArea/CreationControls';
import '../BlackoutPage.css';

export default function BlackoutPage() {
  const [rawText, setRawText] = useState('This is a sample text for blackout. You can edit or replace it.');
  const [formattedText, setFormattedText] = useState('');
  const [selectedColor, setSelectedColor] = useState('black');
  const [isBlackout, setIsBlackout] = useState(false);

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
    setFormattedText(newText);
    setIsBlackout(false);
  };

  return (
    <div className="blackout-page">
      <div className="sidebar">
        <button className="nav-btn active">Blackout</button>
        <button className="nav-btn">Gallery</button>
      </div>

      <div className="editor-area">
        <div className="top-buttons">
          <button className="round-btn" onClick={handleLoadExample}>Get Random Poem</button>
          <button className="round-btn">Upload your own article</button>
        </div>

        <TextInputPanel
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            setFormattedText(e.target.value);
            setIsBlackout(false);
          }}
          onSubmit={() => {}}
        />

        <ColorPicker onColorChange={setSelectedColor} />
        <button className="custom-color-btn">Your Color</button>
      </div>

      <div className="preview-area">
        <PreviewPanel html={formattedText} />
        <CreationControls
          isBlackout={isBlackout}
          onBlackout={handleBlackout}
          onSave={() => alert('Not implemented yet')}
        />
      </div>
    </div>
  );
}
