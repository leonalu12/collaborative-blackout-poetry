import React from 'react';
import { useBlackout  } from '../../context/BlackoutContext'; // Import the BlackoutContext to access the blackout state and functions

export default function PreviewPanel({ onWordClick}) {
  // This component is responsible for displaying the preview of the blackout text.
 // It receives the words array and a function to handle word clicks as props.
 const{
  words,
  selectedColor
 } = useBlackout();
 
 return (
    <div className="preview-box">
    {/* style={{ backgroundColor: isBlackout ? 'black' : '#87f0df' }} */}
      {words.map((word,idx) => (
        <span 
          key={idx}
          className={`word ${word.isBlackout ? 'blackout' : ''}${word.isSelected ? 'true' : 'false'}`} 
          data-selected={word.isSelected? 'true' : 'false'}//data-* attribute to indicate if the word is selected
          style={{ 
            border: word.isSelected ? `1px solid ${selectedColor}` : word.isBlackout?'black':'transparent',//selected border color is the selectedColor, if not selected, border color is transparent or black if blackout.
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