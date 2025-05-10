import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [commentText, setCommentText] = useState('');
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}api/documents`)
      .then(res => res.json())
      .then(data => {
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
    setCommentText('');
  };

  const handleLike = async (docId) => {
    try {
      await axios.put(`${API_BASE}api/interactions/${docId}/like`, { userId });
    } catch (err) {
      console.error('Error liking:', err);
    }
  };

  const handleComment = async (docId) => {
    if (!commentText.trim()) return;
    try {
      await axios.post(`${API_BASE}api/interactions/${docId}/comments`, {
        userId,
        comment: commentText
      });
      setCommentText('');
    } catch (err) {
      console.error('Error commenting:', err);
    }
  };

  const handlePublishToggle = async (docId, currentState) => {
    try {
      const newState = currentState === 'private' ? 'public' : 'private';
      const res = await axios.put(`${API_BASE}api/documents/${docId}/publish`, { state: newState });

      if (filter === 'private' && res.data.state === 'public') {
        setDocuments(prev => prev.filter(doc => doc._id !== docId));
      }
    } catch (err) {
      console.error('Error toggling publish state:', err);
    }
  };

  const handleEdit = async (doc) => {
    try {
      const res = await axios.get(`${API_BASE}api/documents/${doc._id}`);
      const data = res.data;
      localStorage.setItem('editPoemData', JSON.stringify({
        documentId: data._id,
        originalText: data.originalText || data.content,
        redactedText: data.redactedText || '',
        title: data.documentName
      }));
      navigate('/blackout');
    } catch (err) {
      console.error('Error fetching document for editing:', err);
    }
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
                <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}>×</button>
                <h3>{doc.documentName}</h3>
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
              <h2>{selectedDoc.title || selectedDoc.documentName}</h2>
              <p>{selectedDoc.content}</p>

              {filter === 'private' && (
                <>
                  <button onClick={() => handlePublishToggle(selectedDoc._id, selectedDoc.state)}>
                    {selectedDoc.state === 'public' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => handleEdit(selectedDoc)}>Edit</button>
                </>
              )}

              <div className="comment-section" style={{ marginTop: '1em' }}>
                <h4>Comments</h4>
                <ul>
                  {selectedDoc.comments?.map((c, i) => (
                    <li key={i}><strong>{c.userId}</strong>: {c.text}</li>
                  ))}
                </ul>
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                />
                <button onClick={() => handleComment(selectedDoc._id)}>Comment</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
