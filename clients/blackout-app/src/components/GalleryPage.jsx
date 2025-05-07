import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../GalleryPage.css';
import '../PoemModal.css';

export default function GalleryPage() {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const [documents, setDocuments] = useState([]);
  const [filter, setFilter] = useState('public');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const itemsPerPage = 6;
  useEffect(() => {
    fetch(`${API_BASE}api/documents`)
      .then(res => res.json())
      .then(data => {
        console.log('后端返回的数据:', data);  //test
        console.log('当前用户 userId:', userId);
        data.forEach(doc => {
          if (doc.state === 'private') {
            console.log(' Private 文档名:', doc.documentName);
            console.log(' Collaborators:', doc.collaborators);
          }
        });
        const filteredDocs = data.filter(doc => {
          if (filter === 'public') {
            return doc.state === 'public';
          } else if (filter === 'private') {
            return doc.state === 'private' && doc.collaborators.some(c => c._id === userId);
          }
          return false;
        });
        setDocuments(filteredDocs);
      })
      .catch(err => {
        console.error('Failed to fetch documents:', err);
      });
  }, [filter]);

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
    filter === 'all' ? true : d.state === filter
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
              <div className="doc-card" key={doc._id} onClick={() => handleCardClick(doc)}>
                <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}>×
                </button>                <h3>{doc.documentName}</h3>
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