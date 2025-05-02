import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_poem.png';
import '../styles/Signup.css';
import { signup } from '../utils/api';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Sign Up - Blackout App';
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    const { name, email, password } = form;
  
    // ✅ Handle empty fields
    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:5050/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!res.ok) {
        const errData = await res.json();
        if (res.status === 409) {
          setError('An account with this email already exists.');
        } else {
          setError(errData.error || 'Signup failed. Please try again.');
        }
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
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-logo">
          <img src={logo} alt="Logo" />
        </div>
        <h2 className="signup-title">Sign Up</h2>

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="signup-input"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="signup-input"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="signup-input"
            value={form.password}
            onChange={handleChange}
          />
          <button type="submit" className="signup-button">Sign Up</button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        <div className="login-section">
          <p>
            Already have an account?{' '}
            <span className="login-link" onClick={() => navigate('/login')}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;