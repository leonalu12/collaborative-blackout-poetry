import React from 'react';

export default function TextInputPanel({ value, onChange, onSubmit }) {
  return (
    <div className="text-box">
      <textarea
        className="text-input"
        value={value}
        onChange={onChange}
        placeholder="Enter or paste your text here..."
      />
      <button className="enter-text-btn" onClick={onSubmit}>
        Enter Custom Text
      </button>
    </div>
  );
}
