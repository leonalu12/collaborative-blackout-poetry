// src/components/PreviewPanel.jsx
import React from 'react';
import '../../styles/PreviewPanel.css';

/**
 * PreviewPanel displays text with certain words blacked out,
 * allows clicks on any word, and supports selection styling via data-selected.
 *
 * Props:
 * - text: string of full text
 * - blackoutWords: Array of { index: number, length?: number } to hide
 * - selectedWords: Array of indices that are currently selected (for border styling)
 * - onWordClick: (wordIndex: number) => void
 */
export default function PreviewPanel({
  text = '',
  blackoutWords = [],
  selectedWords = [],
  onWordClick = () => {}
}) {
  // Build a set of word‐indexes to hide
  const hideSet = new Set();
  blackoutWords.forEach(({ index, length = 1 }) => {
    for (let i = 0; i < length; i++) hideSet.add(index + i);
  });

  // Create tokens: words and spaces
  const tokens = text.split(/(\s+)/);
  let wordIndex = -1;

  return (
    <div className="preview-panel">
      {tokens.map((token, i) => {
        // Preserve whitespace tokens
        if (/\s+/.test(token)) {
          return <span key={i}>{token}</span>;
        }

        // Real word token
        wordIndex += 1;
        const isHidden = hideSet.has(wordIndex);
        const isSelected = selectedWords.includes(wordIndex);

        return (
          <span
            key={i}
            className={isHidden ? 'blackout-word' : 'clickable-word'}
            data-selected={isSelected}
            onClick={() => onWordClick(wordIndex)}
          >
            {token}
          </span>
        );
      })}
    </div>
  );
}
