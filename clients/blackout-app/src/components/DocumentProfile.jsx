import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DocumentProfile({ selectedDoc, userId, closeModal, filter }) {
  const API_BASE = import.meta.env.VITE_API_BASE;

  const [commentText, setCommentText] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (selectedDoc) {
      setLikeCount(selectedDoc.likes?.length || 0);
      setLiked(selectedDoc.likes?.includes(userId) || false);
      setComments(selectedDoc.comments || []);
      setCommentText('');
    }
  }, [selectedDoc]);

  const handleLike = async () => {
    try {
      await axios.put(`${API_BASE}api/community/${selectedDoc._id}/like`, { userId });
      const res = await axios.get(`${API_BASE}api/community/${selectedDoc._id}/likes`);
      const updatedLikes = res.data.likes || [];
      setLikeCount(updatedLikes.length);
      setLiked(updatedLikes.includes(userId));
    } catch (err) {
      console.error('Error liking:', err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post(`${API_BASE}api/community/${selectedDoc._id}/comments`, {
        userId,
        comment: commentText
      });
      const updated = await axios.get(`${API_BASE}api/community/${selectedDoc._id}/comments`);
      setComments(updated.data.comments || []);
      setCommentText('');
    } catch (err) {
      console.error('Error commenting:', err);
    }
  };

  const handlePublishToggle = async () => {
    try {
      const newState = selectedDoc.state === 'private' ? 'public' : 'private';
      await axios.put(`${API_BASE}api/documents/${selectedDoc._id}/publish`, { state: newState });
      closeModal();
    } catch (err) {
      console.error('Error toggling publish state:', err);
    }
  };

  const handleEdit = async () => {
    try {
      const res = await axios.get(`${API_BASE}api/documents/${selectedDoc._id}`);
      const data = res.data;
      localStorage.setItem('editPoemData', JSON.stringify({
        documentId: data._id,
        originalText: data.originalText || data.content,
        redactedText: data.redactedText || '',
        title: data.documentName
      }));
      window.location.href = '/blackout';
    } catch (err) {
      console.error('Error fetching document for editing:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 800,
          width: '96vw',
          minWidth: 320,
          minHeight: '600px',
          height: '80vh',
          background: '#D2C0AB',
          borderRadius: 18,
          padding: '1.5em 2em',
          margin: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '1em'
        }}
      >
        <button className="close-btn" onClick={closeModal}>Back</button>

        <div className="modal-content" style={{ 
          backgroundColor: '#fff', 
          borderRadius: 12, 
          padding: '1.5em',
          flex: '2 1 auto',
          overflowY: 'auto',
          marginBottom: '1em'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1em' }}>{selectedDoc.documentName}</h2>
          <p style={{ textAlign: 'center' }}>{selectedDoc.content}</p>

          {filter === 'private' && (
            <>
              <button onClick={handlePublishToggle}>
                {selectedDoc.state === 'public' ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={handleEdit}>Edit</button>
            </>
          )}
        </div>

        {selectedDoc.state !== 'private' && (
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ display: 'flex', gap: '0.5em', marginBottom: '1em' }}>
              <button
                className={`like-btn ${liked ? 'liked' : ''}`}
                onClick={handleLike}
              >
                ♥ {likeCount}
              </button>
              <input
                className="comment-input"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ flex: 1 }}
              />
              <button className="post-btn" onClick={handleComment}>Post</button>
            </div>

            <div className="comment-display" style={{ 
              maxHeight: '250px',
              overflowY: 'auto',
              marginTop: '1em'
            }}>
              <h4>Past comments :</h4>
              {comments.length > 0 ? (
                <ul style={{ margin: '0.5em 0', padding: 0, listStyle: 'none' }}>
                  {comments.map((c, i) => (
                    <li key={i} style={{ padding: '0.3em 0' }}><strong>{c.userId}</strong>: {c.comment || c.text}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#aaa' }}>No comments yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
