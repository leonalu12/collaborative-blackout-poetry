import React, { useState, forwardRef } from 'react';

const UploadArticle = forwardRef(({ onConfirm }, ref) => {
  const [tempText, setTempText] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      alert('Only .txt files are allowed!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result;
      if (!/^[\x00-\x7F]*$/.test(content)) {
        alert('Only English text files are supported!');
        return;
      }
      setTempText(content); // Temporarily store the content
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input
        type="file"
        accept=".txt"
        style={{ display: 'block', margin: '10px auto' }}
        ref={ref}
        onChange={handleFileChange}
      />
      {tempText && (
        <>
          <p style={{
            whiteSpace: 'pre-wrap',
            maxHeight: '150px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '10px',
            fontFamily: 'monospace'
          }}>
            {tempText}
          </p>
          <button onClick={() => onConfirm(tempText)}>
            Confirm Selection
          </button>
        </>
      )}
    </div>
  );
});

export default UploadArticle;
