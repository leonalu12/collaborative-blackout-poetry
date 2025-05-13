import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LikeButton({ documentId, initialLikes = [], userId }) {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes.length);

  useEffect(() => {
    setLiked(initialLikes.includes(userId));
  }, [initialLikes, userId]);

  const toggleLike = async () => {
    try {
      // optimistically update UI
      setLiked(v => !v);
      setCount(c => c + (liked ? -1 : 1));

      // hit the server
      await axios.put(
        `${API_BASE}api/community/${documentId}/like`,
        { userId }
      );
    } catch (err) {
      console.error('Like toggle failed', err);
      // rollback on error
      setLiked(v => !v);
      setCount(c => c + (liked ? 1 : -1));
    }
  };

  return (
    <button
      className={`like-btn ${liked ? 'liked' : ''}`}
      onClick={toggleLike}
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      {liked ? '❤️' : '🩶'} {count}
    </button>
  );
}