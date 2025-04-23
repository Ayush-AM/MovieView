import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import MovieList from './components/MovieList';
import './App.css';

function App() {
  return (
    <Router>
      {/* Modern Navbar */}
      <nav className="navbar">
        <div className="nav-buttons">
          <Link to="/home"><button className="nav-btn">Home</button></Link>
          <Link to="/login"><button className="nav-btn">Login</button></Link>
          <Link to="/register"><button className="nav-btn">Register</button></Link>
          <Link to="/movies"><button className="nav-btn">Movies</button></Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;