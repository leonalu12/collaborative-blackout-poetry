import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../GalleryPage.css';
import '../PoemModal.css';
const mockDocuments = [
  
  { id: 1, title: 'Poem A', content: 'This is a public poem...', status: 'public' },
  { id: 2, title: 'Notes B', content: 'This is a private note...', status: 'private' },
  { id: 3, title: 'Poem C', content: 'Another public poem', status: 'public' },
  { id: 4, title: 'Secret D', content: 'Private poem 2.', status: 'private' },
  { id: 5, title: 'Notes Y', content: 'Random thought...', status: 'public' },
  { id: 6, title: 'Notes Z', content: 'More private note...', status: 'private' },
  { id: 7, title: 'Poem X', content: 'A mysterious piece...', status: 'public' },
  { id: 8, title: 'Idea W', content: 'This is a private note...', status: 'private' },
  { id: 9, title: 'Idea W', content: 'This is a private note...', status: 'private' },
  { id: 10, title: 'Idea W', content: 'AThis is a private note...', status: 'private' },
  { id: 11, title: 'Idea W', content: 'This is a private note.....', status: 'private' }
];

export default function GalleryPage() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [filter, setFilter] = useState('public');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState(null);             
  const itemsPerPage = 6;

  const handleFilter = (type) => {
    setFilter(type);
    setCurrentPage(1);
  };
  const handleDelete = (id) => {
    setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
  };
  const handleCardClick = (doc) => {
    setSelectedDoc(doc);
  };
  const closeModal = () => {
    setSelectedDoc(null); 
  };
  const filteredDocs = documents.filter(d =>
    filter === 'all' ? true : d.status === filter
  );  

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const currentDocs = filteredDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="gallery-page">
      <div className="sidebar">
        <Link to="/" className="nav-btn">Blackout</Link>
        <button className={`nav-btn ${filter === 'public' ? 'active' : ''}`} onClick={() => handleFilter('public')}>Public</button>
        <button className={`nav-btn ${filter === 'private' ? 'active' : ''}`} onClick={() => handleFilter('private')}>Private</button>
      </div>

      <div className="content-area">
        <h2>Gallery</h2>
        <div className="gallery-content-box">
          <div className="card-grid">
            {currentDocs.map(doc => (
              <div className="doc-card" key={doc.id} onClick={() => handleCardClick(doc)}>
                <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(doc.id);}}>×
</button>                <h3>{doc.title}</h3>
                <p>{doc.content}</p>
                <div className="doc-type"> ❤️ 1</div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index}
                  className={currentPage === index + 1 ? "active-page" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {selectedDoc && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={closeModal}>Back</button>
      <div className="modal-content">
        <h2>{selectedDoc.title}</h2>
        <p>{selectedDoc.content}</p>
      </div>
    </div>
  </div>
)}
    </div>
    
  );
}