import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_poem.png';
import '../styles/Login.css';
import { login } from '../utils/api';

const Login = () => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Login - Blackout App';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_BASE}api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Login failed. Please try again.');
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src={logo} alt="Logo" />
        </div>
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Login</button>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </form>

        <div className="signup-section">
          <p>
            Don't have an account?{' '}
            <span className="signup-link" onClick={() => navigate('/signup')}>
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;