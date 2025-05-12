// ModalWindow for showing article detail
import React from 'react';
import '../styles/PoemModal.css';

export default function PoemModal({ isOpen, onClose, poem }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>Back</button>
        <h2>{poem.title}</h2>
        <p>{poem.content}</p>
      </div>
    </div>
  );
}