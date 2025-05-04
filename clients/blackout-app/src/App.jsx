import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlackoutPage from './components/BlackoutPage';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected route */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <BlackoutPage />
            </ProtectedRoute>
          }
        />
        <Route 
           path="/gallery" 
           element={
             <ProtectedRoute>
              <GalleryPage />
             </ProtectedRoute>
           } 
         />
      </Routes>
    </Router>
  );
}

export default App;
