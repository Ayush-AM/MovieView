import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStar, FaThumbsUp, FaClock, FaFire, FaFilter, FaHeart, FaUser, FaTimes, FaPlayCircle, FaLink, FaCalendarAlt, FaTv, FaSearch, FaPlay, FaExternalLinkAlt, FaGlobe, FaImdb } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import MoviePoster from './MoviePoster';
import '../App.css';

// TMDB API key and URLs
const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c'; // This is a demo key for testing
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

const MovieList = () => {
  const navigate = useNavigate();
  
  // State for movies
  const [popularMovies, setPopularMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Cast information cache
  const [castInfo, setCastInfo] = useState({});
  
  // Movie detail popup state
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  
  // User preferences for recommendations
  const [userPreferences, setUserPreferences] = useState({
    favoriteGenres: [],
    likedMovies: []
  });

  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(0); // 0 means all genres
  const [genres, setGenres] = useState([]);
  const [activeTab, setActiveTab] = useState('popular');

  // Search for movies
  const searchMovies = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
      );
      const data = await response.json();
      
      // Transform search results
      const transformedResults = transformMovieData(data.results);
      setSearchResults(transformedResults);
      
      // Fetch cast for search results
      transformedResults.forEach(movie => {
        if (!castInfo[movie.id]) {
          fetchMovieCast(movie.id);
        }
      });
    } catch (error) {
      console.error("Error searching movies:", error);
      setSearchResults([]);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(() => {
      searchMovies(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        const data = await response.json();
        setGenres([{ id: 0, name: 'All' }, ...data.genres]);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };
    
    fetchGenres();
  }, []);

  // Transform movie data to our format
  const transformMovieData = (movies) => {
    return movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown',
      rating: movie.vote_average,
      genre: movie.genre_ids,
      poster: movie.poster_path ? `${IMG_URL}${movie.poster_path}` : null,
      overview: movie.overview,
      release_date: movie.release_date
    }));
  };

  // Fetch cast for a movie
  const fetchMovieCast = async (movieId) => {
    // Check if we already have the cast information
    if (castInfo[movieId]) return;
    
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
      );
      const data = await response.json();
      
      // Get top 3 cast members
      const cast = data.cast.slice(0, 3).map(actor => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profile: actor.profile_path ? `${IMG_URL}${actor.profile_path}` : null
      }));
      
      // Update cast info state
      setCastInfo(prev => ({
        ...prev,
        [movieId]: cast
      }));
    } catch (error) {
      console.error(`Error fetching cast for movie ${movieId}:`, error);
    }
  };

  // Fetch detailed movie information
  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,similar`
      );
      const data = await response.json();
      setMovieDetails(data);
      
      // Also fetch watch providers
      fetchWatchProviders(movieId);
    } catch (error) {
      console.error(`Error fetching movie details for movie ${movieId}:`, error);
    }
  };

  // Fetch watch providers for a movie
  const fetchWatchProviders = async (movieId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`
      );
      const data = await response.json();
      
      // Store the entire results object, not just a specific country
      setWatchProviders(data);
      console.log("Watch providers data:", data); // Debug log
    } catch (error) {
      console.error(`Error fetching watch providers for movie ${movieId}:`, error);
      setWatchProviders(null);
    }
  };

  // Open movie details popup
  const openMovieDetails = (movie) => {
    setSelectedMovie(movie);
    fetchMovieDetails(movie.id);
    
    // If we don't have cast info for this movie yet, fetch it
    if (!castInfo[movie.id]) {
      fetchMovieCast(movie.id);
    }
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Close movie details popup
  const closeMovieDetails = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
    setWatchProviders(null);
    
    // Re-enable body scrolling
    document.body.style.overflow = 'auto';
  };

  // Fetch popular movies
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Popular movies
        let popularUrl = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        if (selectedGenre !== 0) {
          popularUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&sort_by=popularity.desc`;
        }
        const popularResponse = await fetch(popularUrl);
        const popularData = await popularResponse.json();
        
        // Latest movies (now playing)
        let latestUrl = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
        if (selectedGenre !== 0) {
          latestUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&sort_by=release_date.desc`;
        }
        const latestResponse = await fetch(latestUrl);
        const latestData = await latestResponse.json();
        
        // Top rated movies
        let topRatedUrl = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
        if (selectedGenre !== 0) {
          topRatedUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&sort_by=vote_average.desc&vote_count.gte=1000`;
        }
        const topRatedResponse = await fetch(topRatedUrl);
        const topRatedData = await topRatedResponse.json();
        
        const popularMoviesData = transformMovieData(popularData.results);
        const latestMoviesData = transformMovieData(latestData.results);
        const topRatedMoviesData = transformMovieData(topRatedData.results);
        
        setPopularMovies(popularMoviesData);
        setLatestMovies(latestMoviesData);
        setTopRatedMovies(topRatedMoviesData);
        
        // Fetch cast for all movies
        const allMovies = [
          ...popularMoviesData,
          ...latestMoviesData,
          ...topRatedMoviesData
        ];
        
        // Create a Set of unique movie IDs
        const uniqueMovieIds = new Set(allMovies.map(movie => movie.id));
        
        // Fetch cast for each unique movie
        uniqueMovieIds.forEach(id => {
          fetchMovieCast(id);
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [selectedGenre]);

  // Like/favorite a movie
  const likeMovie = (movieId) => {
    // Find the movie in any of our lists
    const movie = 
      popularMovies.find(m => m.id === movieId) || 
      latestMovies.find(m => m.id === movieId) || 
      topRatedMovies.find(m => m.id === movieId);

    if (movie) {
      // Add movie to liked movies
      const likedMovies = [...userPreferences.likedMovies, movieId];
      
      // Update favorite genres based on this movie
      const movieGenres = movie.genre;
      const favoriteGenres = [...new Set([...userPreferences.favoriteGenres, ...movieGenres])];
      
      setUserPreferences({
        favoriteGenres,
        likedMovies
      });
    }
  };

  // Get all available movies for recommendations
  const getAllMovies = () => {
    // Combine all movies and remove duplicates
    const allMovies = [...popularMovies, ...latestMovies, ...topRatedMovies];
    const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());
    return uniqueMovies;
  };

  // Generate recommendations based on user preferences
  useEffect(() => {
    if (userPreferences.favoriteGenres.length > 0) {
      const allMovies = getAllMovies();
      
      // Get recommendations based on favorite genres and not already liked
      const recommendations = allMovies
        .filter(movie => !userPreferences.likedMovies.includes(movie.id))
        .filter(movie => {
          return movie.genre.some(genre => userPreferences.favoriteGenres.includes(genre));
        })
        .sort((a, b) => b.rating - a.rating); // Sort by rating
      
      setRecommendedMovies(recommendations);
    }
  }, [userPreferences, popularMovies, latestMovies, topRatedMovies]);

  // Function to get genre names for a movie
  const getGenreNames = (genreIds) => {
    if (!genres.length || !genreIds) return 'Unknown';
    
    return genreIds
      .map(id => {
        const genre = genres.find(g => g.id === id);
        return genre ? genre.name : null;
      })
      .filter(Boolean)
      .join(', ');
  };

  // Get current movies based on active tab
  const getCurrentMovies = () => {
    switch(activeTab) {
      case 'latest':
        return latestMovies;
      case 'topRated':
        return topRatedMovies;
      case 'popular':
      default:
        return popularMovies;
    }
  };

  // Render cast for a movie
  const renderCast = (movieId) => {
    const cast = castInfo[movieId];
    
    if (!cast || cast.length === 0) {
      return <p className="movie-cast-loading">Loading cast...</p>;
    }
    
    return (
      <div className="movie-cast">
        <div className="cast-header">
          <FaUser className="cast-icon" /> Cast
        </div>
        <div className="cast-list">
          {cast.map(actor => (
            <div key={actor.id} className="cast-item">
              {actor.name} {actor.character && <span className="character-name">as {actor.character}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const openWatchLink = (url) => {
    window.open(url, '_blank');
  };

  const renderProviderLogos = (providers, title) => {
    if (!providers || providers.length === 0) return null;
    
    return (
      <div className="provider-section">
        <h4>{title}</h4>
        <div className="provider-logos">
          {providers.slice(0, 4).map((provider, index) => (
            <img 
              key={index}
              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
              alt={provider.provider_name}
              title={provider.provider_name}
              className="provider-logo"
              onClick={() => openWatchLink(provider.link || selectedMovie.homepage)}
              style={{ width: '40px', height: '40px', margin: '0 5px 5px 0', borderRadius: '8px' }}
            />
          ))}
        </div>
      </div>
    );
  };

  // Render movie details popup
  const renderMovieDetailsPopup = () => {
    if (!selectedMovie) return null;
    
    // Handle like from the popup
    const handleLikeMovie = () => {
      likeMovie(selectedMovie.id);
    };
    
    // Open watch provider link
    const openWatchLink = (url) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Close popup when clicking outside content
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        closeMovieDetails();
      }
    };
    
    return (
      <div className="movie-details-popup" onClick={handleBackdropClick} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
        backdropFilter: 'blur(5px)'
      }}>
        <div className="movie-details-content" style={{
          position: 'relative',
          width: '90%',
          maxWidth: '900px',
          maxHeight: '90vh',
          backgroundColor: '#141414',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          overflowY: 'auto',
          animation: 'modalFadeIn 0.3s ease-out'
        }}>
          <button className="close-popup" onClick={closeMovieDetails} style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
            fontSize: '1.2rem'
          }}>
            <FaTimes />
          </button>
          
          {movieDetails ? (
            <>
              <div 
                className="movie-details-backdrop" 
                style={{ 
                  backgroundImage: movieDetails.backdrop_path 
                    ? `url(${BACKDROP_URL}${movieDetails.backdrop_path})` 
                    : 'none',
                  height: '380px',
                  position: 'relative',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '0 20px 20px'
                }}
              >
                <div className="backdrop-overlay" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to bottom, rgba(20, 20, 20, 0.4) 0%, rgba(20, 20, 20, 0.8) 80%, #141414 100%)'
                }}></div>
                <div className="movie-details-poster-container" style={{
                  position: 'relative',
                  width: '160px',
                  height: '240px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
                  zIndex: 2
                }}>
                  {movieDetails.poster_path ? (
                    <img 
                      src={`${IMG_URL}${movieDetails.poster_path}`} 
                      alt={movieDetails.title} 
                      className="movie-details-poster" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div className="movie-details-poster-fallback" style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, #1f1f1f, #333)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      textAlign: 'center',
                      padding: '10px'
                    }}>
                      {movieDetails.title}
                    </div>
                  )}
                </div>
                
                <div className="movie-details-header" style={{
                  flex: '1',
                  marginLeft: '20px',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <h2 className="movie-details-title" style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    margin: '0 0 10px',
                    color: 'white'
                  }}>
                    {movieDetails.title} 
                    <span className="movie-details-year" style={{
                      fontWeight: 'normal',
                      opacity: '0.7',
                      marginLeft: '10px',
                      fontSize: '1.4rem'
                    }}>
                      ({movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : 'Unknown'})
                    </span>
                  </h2>
                  
                  <div className="movie-details-meta" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '15px',
                    fontSize: '0.9rem',
                    color: '#ccc'
                  }}>
                    <div className="movie-details-rating" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <FaStar className="rating-icon" style={{color: '#e50914'}} /> 
                      {movieDetails.vote_average.toFixed(1)}
                    </div>
                    <div className="movie-details-runtime">
                      {movieDetails.runtime && `${movieDetails.runtime} min`}
                    </div>
                    <div className="movie-details-release" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <FaCalendarAlt className="calendar-icon" style={{color: '#e50914'}} /> 
                      {movieDetails.release_date}
                    </div>
                  </div>
                  
                  <div className="movie-details-genres" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {movieDetails.genres.map(genre => (
                      <span key={genre.id} className="movie-details-genre" style={{
                        backgroundColor: 'rgba(229, 9, 20, 0.2)',
                        color: '#e50914',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        border: '1px solid rgba(229, 9, 20, 0.4)'
                      }}>
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="movie-details-body" style={{padding: '20px', color: 'white'}}>
                <div className="movie-details-overview" style={{marginBottom: '25px'}}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    margin: '0 0 10px',
                    color: '#e50914'
                  }}>Overview</h3>
                  <p style={{lineHeight: '1.6', fontSize: '0.95rem'}}>{movieDetails.overview}</p>
                </div>
                
                {/* Cast section */}
                <div className="movie-details-cast" style={{marginBottom: '25px'}}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    margin: '0 0 15px',
                    color: '#e50914'
                  }}>Cast</h3>
                  <div className="details-cast-list" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '15px'
                  }}>
                    {castInfo[selectedMovie.id] ? 
                      castInfo[selectedMovie.id].map(actor => (
                        <div key={actor.id} className="details-cast-item" style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          width: 'calc(50% - 8px)',
                          '@media (max-width: 768px)': {
                            width: '100%'
                          }
                        }}>
                          <div className="cast-profile" style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            backgroundColor: '#333'
                          }}>
                            {actor.profile ? (
                              <img src={actor.profile} alt={actor.name} style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }} />
                            ) : (
                              <div className="cast-profile-placeholder" style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#333',
                                color: 'white',
                                fontSize: '1.5rem'
                              }}>
                                {actor.name.substring(0, 1)}
                              </div>
                            )}
                          </div>
                          <div className="cast-info" style={{flex: '1'}}>
                            <div className="cast-name" style={{
                              fontWeight: '600',
                              marginBottom: '3px',
                              color: 'white'
                            }}>{actor.name}</div>
                            <div className="cast-character" style={{
                              fontSize: '0.85rem',
                              color: '#ccc',
                              fontStyle: 'italic'
                            }}>{actor.character}</div>
                          </div>
                        </div>
                      )) : 
                      <p>Loading cast information...</p>
                    }
                  </div>
                </div>
                
                {/* Watch providers section - Fixed to respond properly */}
                {watchProviders && (
                  <div className="movie-details-links" style={{
                    marginBottom: '25px',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px'
                  }}>
                    <h3 style={{
                      fontSize: '1.3rem',
                      margin: '0 0 15px',
                      color: '#e50914'
                    }}>Where to Watch</h3>
                    
                    {console.log("Current watchProviders state:", watchProviders)}
                    
                    {!watchProviders.results ? (
                      <p>Loading watch options...</p>
                    ) : (
                      (() => {
                        // Try US first, then fallback to other regions if available
                        const regionCodes = ['US', 'GB', 'CA', 'AU'];
                        let availableRegion = null;
                        
                        // Find the first available region
                        for (const code of regionCodes) {
                          if (watchProviders.results[code]) {
                            availableRegion = code;
                            break;
                          }
                        }
                        
                        if (!availableRegion) {
                          // If no primary regions, just take the first available one
                          const availableRegions = Object.keys(watchProviders.results);
                          if (availableRegions.length > 0) {
                            availableRegion = availableRegions[0];
                          }
                        }
                        
                        if (availableRegion) {
                          const regionData = watchProviders.results[availableRegion];
                          return (
                            <>
                              {regionData.flatrate && regionData.flatrate.length > 0 && (
                                <div style={{marginBottom: '15px'}}>
                                  <h4 style={{
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    color: '#ddd'
                                  }}>Stream on</h4>
                                  <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                    marginBottom: '12px'
                                  }}>
                                    {regionData.flatrate.slice(0, 4).map((provider, index) => (
                                      <div 
                                        key={index}
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          margin: '0 10px 10px 0',
                                          width: '70px',
                                          textAlign: 'center'
                                        }}
                                      >
                                        <img 
                                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                          alt={provider.provider_name}
                                          title={provider.provider_name}
                                          style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            border: '2px solid transparent',
                                            marginBottom: '5px'
                                          }}
                                          onClick={() => regionData.link && openWatchLink(regionData.link)}
                                        />
                                        <span style={{
                                          fontSize: '11px',
                                          color: '#ddd',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          width: '100%'
                                        }}>
                                          {provider.provider_name}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {regionData.rent && regionData.rent.length > 0 && (
                                <div style={{marginBottom: '15px'}}>
                                  <h4 style={{
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    color: '#ddd'
                                  }}>Rent from</h4>
                                  <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                    marginBottom: '12px'
                                  }}>
                                    {regionData.rent.slice(0, 4).map((provider, index) => (
                                      <div 
                                        key={index}
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          margin: '0 10px 10px 0',
                                          width: '70px',
                                          textAlign: 'center'
                                        }}
                                      >
                                        <img 
                                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                          alt={provider.provider_name}
                                          title={provider.provider_name}
                                          style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            border: '2px solid transparent',
                                            marginBottom: '5px'
                                          }}
                                          onClick={() => regionData.link && openWatchLink(regionData.link)}
                                        />
                                        <span style={{
                                          fontSize: '11px',
                                          color: '#ddd',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          width: '100%'
                                        }}>
                                          {provider.provider_name}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {regionData.buy && regionData.buy.length > 0 && (
                                <div style={{marginBottom: '15px'}}>
                                  <h4 style={{
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    color: '#ddd'
                                  }}>Buy from</h4>
                                  <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                    marginBottom: '12px'
                                  }}>
                                    {regionData.buy.slice(0, 4).map((provider, index) => (
                                      <div 
                                        key={index}
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          margin: '0 10px 10px 0',
                                          width: '70px',
                                          textAlign: 'center'
                                        }}
                                      >
                                        <img 
                                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                          alt={provider.provider_name}
                                          title={provider.provider_name}
                                          style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            border: '2px solid transparent',
                                            marginBottom: '5px'
                                          }}
                                          onClick={() => regionData.link && openWatchLink(regionData.link)}
                                        />
                                        <span style={{
                                          fontSize: '11px',
                                          color: '#ddd',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          width: '100%'
                                        }}>
                                          {provider.provider_name}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Display a link to JustWatch or similar aggregator */}
                              {regionData.link && (
                                <a 
                                  href={regionData.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-block',
                                    color: '#e50914',
                                    textDecoration: 'none',
                                    marginTop: '10px',
                                    fontSize: '0.9rem'
                                  }}
                                >
                                  <FaExternalLinkAlt style={{marginRight: '5px'}} /> 
                                  View all watch options
                                </a>
                              )}
                            </>
                          );
                        } else {
                          return <p>No watch options available for your region.</p>;
                        }
                      })()
                    )}
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="movie-details-actions" style={{
                  display: 'flex',
                  gap: '15px',
                  marginTop: '20px',
                  marginBottom: '20px'
                }}>
                  <button onClick={handleLikeMovie} className="like-button" style={{
                    backgroundColor: userPreferences.likedMovies.includes(selectedMovie.id) ? '#e50914' : '#333',
                    padding: '12px 24px',
                    borderRadius: '5px',
                    flex: '1',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}>
                    {userPreferences.likedMovies.includes(selectedMovie.id) ? <FaHeart /> : <FaRegHeart />} 
                    {userPreferences.likedMovies.includes(selectedMovie.id) ? 'Liked' : 'Like'}
                  </button>
                  
                  {watchProviders && 
                   watchProviders.results && 
                   (() => {
                     // Try to find the first region with streaming options
                     const regions = Object.keys(watchProviders.results);
                     for (const region of regions) {
                       const regionData = watchProviders.results[region];
                       if (regionData.flatrate && regionData.flatrate.length > 0 && regionData.link) {
                         return (
                           <a 
                             href={regionData.link} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="watch-now-button"
                             style={{
                               backgroundColor: '#e50914',
                               padding: '12px 24px',
                               borderRadius: '5px',
                               textDecoration: 'none',
                               color: 'white',
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               gap: '8px',
                               flex: '1',
                               fontSize: '1rem',
                               fontWeight: '600'
                             }}
                           >
                             <FaPlay /> Watch Now
                           </a>
                         );
                       }
                     }
                     return null;
                   })()
                  }
                </div>
              </div>
            </>
          ) : (
            <div className="movie-details-loading" style={{
              height: '500px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1.2rem',
              color: 'white'
            }}>
              <p>Loading movie details...</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading && !isSearching) return <div className="movie-page-loading">Loading movies<span>.</span><span>.</span><span>.</span></div>;
  if (error) return <div className="movie-page-error">{error}</div>;

  return (
    <div className="movie-page">
      <div className="movie-container">
        <div className="movie-header">
          <div className="back-button" onClick={() => navigate("/home")}>
            <FaArrowLeft />
            <span>Back to Home</span>
          </div>
          
          <h1 className="movie-title">Discover Movies</h1>
          
          <div className="movie-actions">
            {/* Search Bar */}
            <div className="search-container">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input 
                  type="text"
                  placeholder="Search for movies..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchQuery && (
                  <button className="clear-search" onClick={clearSearch}>
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
            
            {/* Genre Filter */}
            <div className="genre-filter">
              <FaFilter className="filter-icon" />
              <select 
                value={selectedGenre} 
                onChange={(e) => setSelectedGenre(Number(e.target.value))}
                className="genre-select"
              >
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Search Results */}
        {isSearching && (
          <div className="search-results">
            <h2 className="section-title">
              <FaSearch className="section-icon" /> 
              {searchResults.length > 0 ? 
                `Search Results for "${searchQuery}" (${searchResults.length})` : 
                `No results found for "${searchQuery}"`}
            </h2>
            <div className="movie-grid">
              {searchResults.map(movie => (
                <div key={`search-${movie.id}`} className="movie-card" onClick={() => openMovieDetails(movie)}>
                  <div className="movie-poster-wrapper">
                    <MoviePoster posterUrl={movie.poster} title={movie.title} />
                    <div className="movie-poster-overlay">
                      <div className="movie-poster-rating">
                        <FaStar /> {movie.rating.toFixed(1)}
                      </div>
                    </div>

                    {/* Like button overlay on poster */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        likeMovie(movie.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: userPreferences.likedMovies.includes(movie.id) ? '#e50914' : 'white',
                        border: 'none',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        zIndex: 5,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {userPreferences.likedMovies.includes(movie.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-card-title">{movie.title} <span className="movie-year">({movie.year})</span></h3>
                    <p className="movie-genres">{getGenreNames(movie.genre)}</p>
                    {renderCast(movie.id)}

                    {/* Like button at the bottom of the card */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        likeMovie(movie.id);
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: userPreferences.likedMovies.includes(movie.id) ? '#e50914' : 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 0',
                        marginTop: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {userPreferences.likedMovies.includes(movie.id) ? <FaHeart /> : <FaRegHeart />}
                      {userPreferences.likedMovies.includes(movie.id) ? 'Liked' : 'Like'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Recommended Movies Section */}
        {!isSearching && recommendedMovies.length > 0 && (
          <div className="recommended-section">
            <h2 className="section-title">
              <FaHeart className="section-icon" /> 
              Recommended For You
            </h2>
            <div className="movie-grid">
              {recommendedMovies.slice(0, 4).map(movie => (
                <div key={`rec-${movie.id}`} className="movie-card" onClick={() => openMovieDetails(movie)}>
                  <div className="movie-poster-wrapper">
                    <MoviePoster posterUrl={movie.poster} title={movie.title} />
                    <div className="movie-poster-overlay">
                      <div className="movie-poster-rating">
                        <FaStar /> {movie.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-card-title">{movie.title} <span className="movie-year">({movie.year})</span></h3>
                    <p className="movie-genres">{getGenreNames(movie.genre)}</p>
                    {renderCast(movie.id)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Movie Categories Tabs - Only show if not searching */}
        {!isSearching && (
          <>
            <div className="movie-tabs">
              <button 
                className={`tab-button ${activeTab === 'popular' ? 'active' : ''}`}
                onClick={() => setActiveTab('popular')}
              >
                <FaFire className="tab-icon" /> Popular
              </button>
              <button 
                className={`tab-button ${activeTab === 'latest' ? 'active' : ''}`}
                onClick={() => setActiveTab('latest')}
              >
                <FaClock className="tab-icon" /> Latest Releases
              </button>
              <button 
                className={`tab-button ${activeTab === 'topRated' ? 'active' : ''}`}
                onClick={() => setActiveTab('topRated')}
              >
                <FaStar className="tab-icon" /> Top Rated
              </button>
            </div>
            
            {/* Movies Grid */}
            <div className="movie-grid">
              {getCurrentMovies().map(movie => (
                <div key={movie.id} className="movie-card" onClick={() => openMovieDetails(movie)}>
                  <div className="movie-poster-wrapper">
                    <MoviePoster posterUrl={movie.poster} title={movie.title} />
                    <div className="movie-poster-overlay">
                      <div className="movie-poster-rating">
                        <FaStar /> {movie.rating.toFixed(1)}
                      </div>
                    </div>
                    
                    {/* Like button overlay on poster */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        likeMovie(movie.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: userPreferences.likedMovies.includes(movie.id) ? '#e50914' : 'white',
                        border: 'none',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        zIndex: 5,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {userPreferences.likedMovies.includes(movie.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-card-title">{movie.title} <span className="movie-year">({movie.year})</span></h3>
                    <p className="movie-genres">{getGenreNames(movie.genre)}</p>
                    {renderCast(movie.id)}
                    
                    {/* Like button at the bottom of the card */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        likeMovie(movie.id);
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: userPreferences.likedMovies.includes(movie.id) ? '#e50914' : 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 0',
                        marginTop: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {userPreferences.likedMovies.includes(movie.id) ? <FaHeart /> : <FaRegHeart />}
                      {userPreferences.likedMovies.includes(movie.id) ? 'Liked' : 'Like'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Movie Details Popup */}
      {renderMovieDetailsPopup()}
    </div>
  );
};

export default MovieList;
