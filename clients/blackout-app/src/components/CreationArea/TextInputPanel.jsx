import React from 'react';

export default function TextInputPanel({
  value,
  onChange,
  onSubmit,
  onGenerate,
  isGenerating,      // new
}) {
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
          disabled={isGenerating}
        >
          {isGenerating ? "Generating…" : "Generate with ChatGPT"}
        </button>
        <button
          className="enter-text-btn"
          onClick={() => onSubmit(value)}
        >
          Submit to Editor
        </button>
      </div>
    </div>
  );
}