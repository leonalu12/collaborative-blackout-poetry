import React from 'react';
import { useBlackout } from '../../context/BlackoutContext'; // Import the BlackoutContext to access the blackout state and functions


export default function TextInputPanel({
  value,
  onChange,
  onSubmit,
  onGenerate,
}) {
const{
  isGenerating,
  isInGame} = useBlackout();


  return (
    <div className="text-box">
      <textarea
        className="text-input"
        value={value}
        onChange={onChange}
        placeholder="Enter or paste your text here..."
      />
      <div className="button-group" style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          className="generate-btn"
          onClick={onGenerate}
          // disabled={isGenerating}
          disabled={isInGame}
        >
          {isGenerating ? "Generating…" : "Generate with ChatGPT"}
        </button>
        <button
          className="enter-text-btn"
          onClick={() => onSubmit(value)}
          disabled={isInGame} // Disable if in game mode
        >
          {isInGame?"Cannot Change Articale in Game" : "Submit to Editor"}
        </button>
      </div>
    </div>
  );
}