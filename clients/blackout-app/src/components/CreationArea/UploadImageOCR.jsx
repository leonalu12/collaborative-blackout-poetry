import React, { useRef } from 'react';
import Tesseract from 'tesseract.js';

export default function UploadImageOCR({ onConfirm }) {
  const fileInputRef = useRef();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file!');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const { data: { text } } = await Tesseract.recognize(reader.result, 'eng');
      onConfirm(text); 
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} />
    </div>
  );
}