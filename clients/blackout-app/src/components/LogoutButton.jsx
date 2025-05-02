import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LogoutButton.css'; 

const LogoutButton = ({ className = '' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className={`logout-btn ${className}`}
    >
      Logout
    </button>
  );
};

export default LogoutButton;