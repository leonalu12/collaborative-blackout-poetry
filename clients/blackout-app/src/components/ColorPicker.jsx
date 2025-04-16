
import React from 'react';

const colors = ['black', 'pink', 'purple', 'orange', 'green'];

export default function ColorPicker({ onColorChange }) {
  return (
    <div style={{ marginTop: '1em' }}>
      {colors.map(color => (
        <button
          key={color}
          onClick={() => onColorChange(color)}
          style={{
            backgroundColor: color,
            border: 'none',
            marginRight: '8px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            cursor: 'pointer'
          }}
        />
      ))}
    </div>
  );
}
