import React from 'react';
import { useBlackout  } from '../../context/BlackoutContext'; 

export default function PreviewPanel({ onWordClick}) {
 const{
  words
 } = useBlackout();
 
 return (
    <div className="preview-box">
    {/* style={{ backgroundColor: isBlackout ? 'black' : '#87f0df' }} */}
      {words.map((word,idx) => (
        <span 
          key={idx}
          className={`word ${word.isBlackout ? 'blackout' : ''}${word.isSelected ? 'true' : 'false'}`} 
          data-selected={word.isSelected? 'true' : 'false'}
          style={{ 
            border: word.isSelected ? `1px solid black` : word.isBlackout?'black':'transparent',
            backgroundColor: word.isBlackout ? 'black' : 'transparent',
            color: word.isBlackout ? 'black' : 'inherit',
          }}
          onClick={() => onWordClick(idx)}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
}