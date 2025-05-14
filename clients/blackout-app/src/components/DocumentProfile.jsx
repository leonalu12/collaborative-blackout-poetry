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
              <button onClick={handlePublishToggle}>
                {selectedDoc.state === 'public' ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={handleEdit}>Edit</button>
            </>
          )}

          <div className="comment-section" style={{ marginTop: '1em' }}>
            <h4>Comments</h4>
            <ul>
              {comments.map((c, i) => (
                <li key={i}><strong>{c.userId}</strong>: {c.comment || c.text}</li>
              ))}
            </ul>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
            />
            <button onClick={handleComment}>Comment</button>
          </div>
        </div>

        {selectedDoc.state !== 'private' && (
          <>
            <div style={{ display: 'flex', gap: '0.5em', margin: '1em 0' }}>
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
              />
              <button className="post-btn" onClick={handleComment}>Post</button>
            </div>

            <div className="comment-display">
              <h4>Past comments :</h4>
              {comments.length > 0 ? (
                <ul>
                  {comments.map((c, i) => (
                    <li key={i}><strong>{c.userId}</strong>: {c.comment || c.text}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#aaa' }}>No comments yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}