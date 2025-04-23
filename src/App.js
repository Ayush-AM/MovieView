import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FaFilm, FaHome, FaVideo, FaSignOutAlt } from 'react-icons/fa';
import Home from './components/Home';
import MovieList from './components/MovieList';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Hardcoded credentials
  const validCredentials = {
    username: 'user',
    password: 'password'
  };
  
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    } else {
      // Automatically show login form if user is not logged in
      setShowLoginForm(true);
    }
  }, []);
  
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (loginForm.username === validCredentials.username && 
        loginForm.password === validCredentials.password) {
      setIsLoggedIn(true);
      setLoginError('');
      setShowLoginForm(false);
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      setLoginError('Invalid username or password');
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    // Show login form when user logs out
    setShowLoginForm(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Router>
      {/* Modern Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/home" className="navbar-logo">
            <FaFilm className="logo-icon" />
            <span className="logo-text">MovieView</span>
          </Link>
          
          <div className="nav-buttons">
            <Link to="/home" className="nav-link">
              <button className="nav-btn">
                <FaHome className="nav-icon" />
                <span>Home</span>
              </button>
            </Link>
            <Link to="/movies" className="nav-link">
              <button className="nav-btn">
                <FaVideo className="nav-icon" />
                <span>Movies</span>
              </button>
            </Link>
            {isLoggedIn ? (
              <button className="nav-btn logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="nav-icon" />
                <span>Logout</span>
              </button>
            ) : (
              <button className="nav-btn login-btn" onClick={() => setShowLoginForm(true)}>
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginForm && (
        <div className="login-modal">
          <div className="login-modal-content">
            {/* Only show close button if user is already logged in */}
            {isLoggedIn && <button className="modal-close" onClick={() => setShowLoginForm(false)}>×</button>}
            <h2>Login</h2>
            {loginError && <div className="login-error">{loginError}</div>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  value={loginForm.username} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={loginForm.password} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <button type="submit" className="login-submit-btn">Login</button>
            </form>
            <p className="login-hint">Hint: use "user" and "password"</p>
          </div>
        </div>
      )}

      {/* Routes */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/movies" element={isLoggedIn ? <MovieList /> : <Navigate to="/home" />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;