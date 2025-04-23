import React, { useState } from 'react';

const MoviePoster = ({ posterUrl, title }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="poster-container" style={{ height: '100%' }}>
      {!imageError ? (
        <img
          src={posterUrl}
          alt={title}
          className="movie-poster"
          onError={handleImageError}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div className="fallback-poster" style={{ height: '100%' }}>
          <div className="fallback-title">{title}</div>
        </div>
      )}
    </div>
  );
};

export default MoviePoster; 