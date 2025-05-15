import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { tokenize } from '../utils/tokenize';
import '../styles/DocumentProfile.css';

export default function DocumentProfile({ selectedDoc, selectedDocBlackoutWords, userId, closeModal, filter }) {
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
function renderBlackoutText(content, blackoutWords = []) {
  if (!content) return null;

  const tokens = tokenize(content); // e.g. splits into words, punctuation, whitespace, "\n"…
  const elements = [];
  let buffer = '';
  let isBlocking = false;

  const flushBuffer = () => {
    if (isBlocking && buffer) {
      elements.push(
        <span key={`blk-${elements.length}`} className="document-profile-blackout-word">
          {buffer}
        </span>
      );
      buffer = '';
      isBlocking = false;
    }
  };

  tokens.forEach((tok, idx) => {
    if (tok === '\n') {
      // hard line-break: flush any pending blackout, then emit <br/>
      flushBuffer();
      elements.push(<br key={`br-${idx}`} />);
      return;
    }

    const shouldShow = blackoutWords.some(bw =>
      idx >= bw.index && idx < bw.index + (bw.length || 1)
    );

    if (shouldShow) {
      // visible token → flush blackout, then render itself
      flushBuffer();
      elements.push(
        <span key={`vis-${idx}`} className="document-profile-visible-word">
          {tok}
        </span>
      );
    } else {
      // hidden token → accumulate
      buffer += tok;
      isBlocking = true;
    }
  });

  // flush any leftover at end
  flushBuffer();

  return (
    <p className="document-profile-blackout-text" style={{ whiteSpace: 'pre-wrap' }}>
      {elements}
    </p>
  );
}


  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={closeModal}>Back</button>

        <div className="modal-content">
          <h2>{selectedDoc.documentName}</h2>
          {renderBlackoutText(selectedDoc.content, selectedDocBlackoutWords || [])}

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
          <div className="comment-section">
            <div className="comment-actions">
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

            <div className="comment-display">
              
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
          </div>
        )}
      </div>
    </div>
  );
}
