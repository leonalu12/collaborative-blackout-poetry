import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/GalleryPage.css';
import '../styles/PoemModal.css';

export default function GalleryPage() {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const [documents, setDocuments] = useState([]);
  const [filter, setFilter] = useState('public');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const itemsPerPage = 6;

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

  useEffect(() => {
    if (selectedDoc) {
      setLikeCount(selectedDoc.likes?.length || 0);
      setLiked(selectedDoc.likes?.includes(userId) || false);
      setComments(selectedDoc.comments || []);
      setCommentText('');
    }
  }, [selectedDoc]);

  const handleFilter = (type) => {
    setFilter(type);
    setCurrentPage(1);
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

  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const currentDocs = documents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

                <h3>{doc.documentName}</h3>
                <p>{doc.content?.slice(0, 80)}...</p>
                <div className="doc-type">❤️ {doc.likes?.length || 0}</div>
                <Link to={`/${doc._id}`}>
                  <button
                    type="button"
                    className="open-btn"
                    onClick={e => e.stopPropagation()}  // prevent the card’s onClick if you want
                  >
                    Open
                  </button>
                </Link>
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
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 480,
              width: '96vw',
              minWidth: 280,
              background: '#03a9f4',
              borderRadius: 18,
              padding: '1.2em 1em',
              margin: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
            }}
          >
            <button className="close-btn" onClick={closeModal}>Back</button>

            <div className="modal-content" style={{ backgroundColor: '#fff', borderRadius: 12, padding: '1em' }}>
              <h2 style={{ textAlign: 'center' }}>{selectedDoc.documentName}</h2>
              <p style={{ textAlign: 'center' }}>{selectedDoc.content}</p>

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

            {selectedDoc.state === 'private' ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1em' }}>
                <button onClick={() => handlePublishToggle(selectedDoc._id, selectedDoc.state)}>Publish</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '0.5em', margin: '1em 0' }}>
                  <button
                    className={`like-btn ${liked ? 'liked' : ''}`}
                    onClick={() => handleLike(selectedDoc._id)}
                  >
                    ♥ {likeCount}
                  </button>
                  <input
                    className="comment-input"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button className="post-btn" onClick={() => handleComment(selectedDoc._id)}>Post</button>
                </div>

                <div className="comment-display">
                  <h4>Past comments :</h4>
                  {comments.length > 0 ? (
                    <ul>
                      {comments.map((c, i) => (
                        <li key={i}><strong>{c.userId}</strong>: {c.comment}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#aaa' }}>No comments yet.</p>
                  )}
                </div>
              </>
            )}

            {filter === 'private' && (
              <div style={{ marginTop: '1em' }}>
                <button onClick={() => handleEdit(selectedDoc)}>Edit</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
