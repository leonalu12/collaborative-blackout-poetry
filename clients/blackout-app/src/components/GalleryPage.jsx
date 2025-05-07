import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const handleFilter = (type) => {
    setFilter(type);
    setCurrentPage(1);
  };
  const handleDelete = (id) => {
    setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
  };
  const handleCardClick = (doc) => {
    setSelectedDoc(doc);
    setComments([]);
    setLikeCount(0);
    setLiked(false);
  };
  const closeModal = () => {
    setSelectedDoc(null);
    setComments([]);
    setCommentInput('');
    setLikeCount(0);
    setLiked(false);
  };
  const handlePostComment = () => {
    if (!commentInput.trim()) return;
    setComments(prev => [
      { id: Date.now(), username: 'You', comment: commentInput },
      ...prev
    ]);
    setCommentInput('');
  };
  const handleLike = () => {
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };
  const handlePublish = () => {
    if (!selectedDoc) return;
    setDocuments(prevDocs =>
      prevDocs.map(doc =>
        doc.id === selectedDoc.id ? { ...doc, status: 'public' } : doc
      )
    );
    setSelectedDoc({ ...selectedDoc, status: 'public' });
  };
  const handleEdit = () => {
    closeModal();
    navigate('/', { state: { poemToEdit: selectedDoc } });
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
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>Back</button>
            <div className="modal-content">
              <h2>{selectedDoc.title}</h2>
              <p>{selectedDoc.content}</p>
              {selectedDoc.status === 'private' && (
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <button
                    style={{
                      background: '#00B2FF',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 24px',
                      fontWeight: 700,
                      fontSize: 18,
                      cursor: 'pointer'
                    }}
                    onClick={handlePublish}
                  >
                    Publish
                  </button>
                  <button
                    style={{
                      background: '#fff',
                      color: '#00B2FF',
                      border: '2px solid #00B2FF',
                      borderRadius: 8,
                      padding: '10px 24px',
                      fontWeight: 700,
                      fontSize: 18,
                      cursor: 'pointer'
                    }}
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
            {selectedDoc.status === 'public' && (
              <div style={{ background: '#00B2FF', borderRadius: 20, padding: 20, marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <button
                    style={{ background: 'white', borderRadius: 8, padding: '6px 16px', marginRight: 8, fontWeight: 600, fontSize: 18, color: liked ? '#e74c3c' : '#444', border: 'none', cursor: 'pointer' }}
                    onClick={handleLike}
                  >
                    ♥ {likeCount}
                  </button>
                  <input
                    style={{ flex: 1, borderRadius: 8, border: 'none', padding: '8px 12px', marginRight: 8 }}
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handlePostComment(); }}
                  />
                  <button
                    style={{ background: 'white', color: '#00B2FF', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}
                    onClick={handlePostComment}
                  >
                    Post
                  </button>
                </div>
                <div style={{ background: 'white', borderRadius: 12, padding: 16, minHeight: 60, marginTop: 8 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Past comments :</div>
                  {comments.length === 0 ? (
                    <div style={{ color: '#aaa', fontStyle: 'italic' }}>No comments yet.</div>
                  ) : (
                    comments.map(c => (
                      <div key={c.id} style={{ marginBottom: 6 }}>
                        <b>{c.username}:</b> {c.comment}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    
  );
}