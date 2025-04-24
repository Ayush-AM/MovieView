import React, { useState } from 'react';

const MoviePoster = ({ posterUrl, title }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Default poster styling
  const posterStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
  };

  // Default fallback styling
  const fallbackStyle = {
    height: '100%',
    width: '100%',
    backgroundColor: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
    padding: '10px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #333 0%, #1a1a1a 100%)'
  };

  const fallbackTitleStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    padding: '15px',
    wordBreak: 'break-word'
  };

  // Ensure title is not null or undefined
  const safeTitle = title || 'Untitled Movie';

  return (
    <div className="poster-container" style={{ height: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      {posterUrl && !imageError ? (
        <img
          src={posterUrl}
          alt={safeTitle}
          className="movie-poster"
          onError={handleImageError}
          style={posterStyle}
          loading="lazy"
        />
      ) : (
        <div className="fallback-poster" style={fallbackStyle}>
          <div className="fallback-title" style={fallbackTitleStyle}>
            {safeTitle}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviePoster; 