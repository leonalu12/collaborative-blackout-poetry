import React from 'react';

export default function CreationControls({ isBlackout, onBlackout, onSave }) {
  return (
    <div className="action-buttons">
      <button className="blackout-btn" onClick={onBlackout}>
        {isBlackout ? 'UnBlackout' : 'Blackout'}
      </button>
      <button className="save-btn" onClick={onSave}>Save</button>
    </div>
  );
}
