import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/LikeButton.css'; // Assuming you have a CSS file for styling
export default function LikeButton({ documentId, initialLikes = [], userId }) {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes.length);

  useEffect(() => {
    setLiked(initialLikes.includes(userId));
  }, [initialLikes, userId]);

const toggleLike = async () => {
  try {
    await axios.put(`${API_BASE}api/community/${documentId}/like`, { userId });

    // Fetch updated likes from the server to resolve conflicts
    const res = await axios.get(`${API_BASE}api/community/${documentId}/likes`);
    const updatedLikes = res.data.likes || [];

    setLiked(updatedLikes.includes(userId));
    setCount(updatedLikes.length);
  } catch (err) {
    console.error('Like toggle failed', err);
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