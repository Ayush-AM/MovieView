import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaFilm, FaThumbsUp, FaStar, FaSearch, FaPlay, FaInfoCircle, FaChevronLeft, FaChevronRight, FaPlayCircle, FaHeart, FaRegHeart } from "react-icons/fa";
import '../App.css';

// TMDB API key and URLs
const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c'; // This is a demo key for testing
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

const Home = () => {
  const navigate = useNavigate();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [featuredMovieIndex, setFeaturedMovieIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTrendingPage, setActiveTrendingPage] = useState(0);
  const [likedMovies, setLikedMovies] = useState([]);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
        );
        const data = await response.json();
        
        // Filter movies with a backdrop
        const moviesWithBackdrop = data.results.filter(m => m.backdrop_path);
        setTrendingMovies(moviesWithBackdrop);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
    
    // Load liked movies from local storage if available
    const savedLikedMovies = localStorage.getItem('likedMovies');
    if (savedLikedMovies) {
      setLikedMovies(JSON.parse(savedLikedMovies));
    }
  }, []);

  // Auto-carousel effect for hero section
  useEffect(() => {
    // Only start carousel if we have movies
    if (trendingMovies.length > 0) {
      const carouselInterval = setInterval(() => {
        setFeaturedMovieIndex(prevIndex => 
          prevIndex === trendingMovies.length - 1 ? 0 : prevIndex + 1
        );
      }, 6000); // Change movie every 6 seconds
      
      // Clean up interval on component unmount
      return () => clearInterval(carouselInterval);
    }
  }, [trendingMovies]);

  // Save liked movies to local storage
  useEffect(() => {
    localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
  }, [likedMovies]);

  // Toggle like status for a movie
  const toggleLike = (movieId) => {
    setLikedMovies(prevLiked => {
      if (prevLiked.includes(movieId)) {
        return prevLiked.filter(id => id !== movieId);
      } else {
        return [...prevLiked, movieId];
      }
    });
  };

  // Navigate to previous movie
  const goToPrevMovie = () => {
    setFeaturedMovieIndex(prevIndex => 
      prevIndex === 0 ? trendingMovies.length - 1 : prevIndex - 1
    );
  };

  // Navigate to next movie
  const goToNextMovie = () => {
    setFeaturedMovieIndex(prevIndex => 
      prevIndex === trendingMovies.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle trending carousel
  const showNextTrendingPage = () => {
    const maxPages = Math.ceil(trendingMovies.length / 6) - 1;
    setActiveTrendingPage(prev => (prev === maxPages ? 0 : prev + 1));
  };

  const showPrevTrendingPage = () => {
    const maxPages = Math.ceil(trendingMovies.length / 6) - 1;
    setActiveTrendingPage(prev => (prev === 0 ? maxPages : prev - 1));
  };

  // Current featured movie
  const featuredMovie = trendingMovies[featuredMovieIndex];

  // Calculate trending movies for current page
  const currentTrendingMovies = trendingMovies.slice(
    activeTrendingPage * 6, 
    (activeTrendingPage * 6) + 6
  );

  return (
    <div className="home-page">
      {/* Hero Section with Featured Movie */}
      {featuredMovie && (
        <div 
          className="hero-section" 
          style={{ 
            position: 'relative',
            height: '70vh',
            backgroundImage: `url(${BACKDROP_URL}${featuredMovie.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 1s ease-in-out'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
              zIndex: 1
            }}
          />
          
          {/* Hero Navigation Arrows */}
          <button className="hero-nav-arrow hero-prev" onClick={goToPrevMovie} style={{zIndex: 2}}>
            <FaChevronLeft />
          </button>
          <button className="hero-nav-arrow hero-next" onClick={goToNextMovie} style={{zIndex: 2}}>
            <FaChevronRight />
          </button>
          
          <div className="hero-content" style={{
            position: 'relative',
            zIndex: 2,
            padding: '0 10%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}>
            <div className="hero-carousel-indicator" style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              {trendingMovies.map((_, index) => (
                <span 
                  key={index} 
                  className={`carousel-dot ${index === featuredMovieIndex ? 'active' : ''}`}
                  onClick={() => setFeaturedMovieIndex(index)}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: index === featuredMovieIndex ? 'rgba(229, 9, 20, 1)' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                ></span>
              ))}
            </div>
            <h1 className="hero-title" style={{
              fontSize: '3rem',
              marginBottom: '10px',
              fontWeight: '700'
            }}>{featuredMovie.title}</h1>
            <div className="hero-meta" style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '15px',
              fontSize: '1.1rem'
            }}>
              <span className="hero-year">
                {featuredMovie.release_date ? new Date(featuredMovie.release_date).getFullYear() : ''}
              </span>
              <span className="hero-rating" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <FaStar style={{color: '#f5c518'}} /> {featuredMovie.vote_average.toFixed(1)}
              </span>
            </div>
            <p className="hero-overview" style={{
              fontSize: '1.1rem',
              maxWidth: '700px',
              marginBottom: '25px',
              lineHeight: '1.6'
            }}>{featuredMovie.overview}</p>
            <div className="hero-buttons" style={{
              display: 'flex',
              gap: '15px'
            }}>
              <button 
                className="hero-btn primary-btn"
                onClick={() => navigate('/movies')}
                style={{
                  backgroundColor: '#e50914',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <FaPlay /> Watch Now
              </button>
              <button 
                className="hero-btn secondary-btn"
                onClick={() => navigate('/movies')}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  padding: '12px 24px',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <FaInfoCircle /> More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="home-main" style={{
        backgroundColor: '#141414',
        color: 'white',
        padding: '40px 0'
      }}>
        <div className="home-section welcome-section" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px 40px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h2 className="section-title" style={{
            fontSize: '2rem',
            marginBottom: '15px',
            textAlign: 'center'
          }}>Welcome to MovieView</h2>
          <p className="section-subtitle" style={{
            fontSize: '1.2rem',
            marginBottom: '40px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)'
          }}>Your ultimate destination for discovering amazing movies</p>
        
          <div className="feature-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            <div className="feature-card" style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '10px',
              padding: '25px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}>
              <div className="feature-icon-wrapper" style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'rgba(229,9,20,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <FaFilm className="feature-icon" style={{fontSize: '30px', color: '#e50914'}} />
              </div>
              <h3 style={{marginBottom: '15px', fontSize: '1.3rem'}}>Personalized Recommendations</h3>
              <p style={{color: 'rgba(255,255,255,0.7)', lineHeight: '1.6'}}>Discover movies tailored to your unique taste through our advanced recommendation system</p>
            </div>
            
            <div className="feature-card" style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '10px',
              padding: '25px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}>
              <div className="feature-icon-wrapper" style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'rgba(229,9,20,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <FaThumbsUp className="feature-icon" style={{fontSize: '30px', color: '#e50914'}} />
              </div>
              <h3 style={{marginBottom: '15px', fontSize: '1.3rem'}}>Like & Save</h3>
              <p style={{color: 'rgba(255,255,255,0.7)', lineHeight: '1.6'}}>Like movies to train our algorithm to understand your preferences better</p>
            </div>
            
            <div className="feature-card" style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '10px',
              padding: '25px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}>
              <div className="feature-icon-wrapper" style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'rgba(229,9,20,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <FaSearch className="feature-icon" style={{fontSize: '30px', color: '#e50914'}} />
              </div>
              <h3 style={{marginBottom: '15px', fontSize: '1.3rem'}}>Browse by Genre</h3>
              <p style={{color: 'rgba(255,255,255,0.7)', lineHeight: '1.6'}}>Filter movies by genre to find exactly what you're in the mood for</p>
            </div>
          </div>
        </div>

        {/* Trending Section */}
        {!loading && trendingMovies.length > 0 && (
          <div className="home-section trending-section" style={{
            maxWidth: '1200px',
            margin: '40px auto 0',
            padding: '40px 20px'
          }}>
            <div className="trending-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 className="section-title" style={{
                fontSize: '1.8rem',
                margin: 0,
                fontWeight: '600'
              }}>Trending This Week</h2>
              <div className="trending-navigation" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <button className="trending-nav-btn" onClick={showPrevTrendingPage} style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <FaChevronLeft />
                </button>
                <div className="trending-indicators" style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  {Array.from({ length: Math.ceil(trendingMovies.length / 6) }).map((_, index) => (
                    <span 
                      key={index} 
                      className={`trending-indicator ${index === activeTrendingPage ? 'active' : ''}`}
                      onClick={() => setActiveTrendingPage(index)}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: index === activeTrendingPage ? '#e50914' : 'rgba(255,255,255,0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    ></span>
                  ))}
                </div>
                <button className="trending-nav-btn" onClick={showNextTrendingPage} style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <FaChevronRight />
                </button>
              </div>
            </div>
            <div className="trending-carousel" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '20px',
              marginTop: '20px'
            }}>
              {currentTrendingMovies.map(movie => (
                <div key={movie.id} className="trending-card" style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  {/* Movie poster and overlay */}
                  <div className="trending-poster-wrapper" style={{
                    position: 'relative',
                    aspectRatio: '2/3',
                    overflow: 'hidden'
                  }} onClick={() => navigate('/movies')}>
                    <img 
                      src={movie.poster_path ? `${IMG_URL}${movie.poster_path}` : "/default-movie.jpg"} 
                      alt={movie.title} 
                      className="trending-poster"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                    <div className="trending-overlay" style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)',
                      opacity: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'opacity 0.3s ease'
                    }}>
                      <button className="trending-play-btn" onClick={(e) => {
                        e.stopPropagation();
                        navigate('/movies');
                      }} style={{
                        backgroundColor: '#e50914',
                        color: 'white',
                        border: 'none',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '20px',
                        cursor: 'pointer',
                        transform: 'scale(0.8)',
                        transition: 'all 0.3s ease'
                      }}>
                        <FaPlay />
                      </button>
                    </div>
                    
                    {/* Like button positioned on the poster */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(movie.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: likedMovies.includes(movie.id) ? '#e50914' : 'white',
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
                      {likedMovies.includes(movie.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  </div>
                  
                  {/* Movie info */}
                  <div style={{padding: '12px'}}>
                    <h4 className="trending-title" style={{
                      fontSize: '1rem',
                      margin: '0 0 5px 0',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{movie.title}</h4>
                    <div className="trending-meta" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.8rem'
                    }}>
                      <span className="trending-year">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : ''}
                      </span>
                      <span className="trending-rating" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <FaStar style={{color: '#f5c518'}} /> {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                    
                    {/* Like/unlike button in card footer */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(movie.id);
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: likedMovies.includes(movie.id) ? '#e50914' : 'rgba(255,255,255,0.1)',
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
                      {likedMovies.includes(movie.id) ? <FaHeart /> : <FaRegHeart />}
                      {likedMovies.includes(movie.id) ? 'Liked' : 'Like'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* CTA Section */}
        <div className="home-section cta-section" style={{
          margin: '40px auto',
          maxWidth: '1200px',
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          padding: '0',
          height: '400px',
          boxShadow: '0 15px 30px rgba(0,0,0,0.3)'
        }}>
          <div className="cta-background" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("https://image.tmdb.org/t/p/original/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
            transition: 'transform 0.5s ease',
            animation: 'slowZoom 20s infinite alternate'
          }}>
            <div className="cta-overlay" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(229, 9, 20, 0.8) 50%, rgba(76, 8, 13, 0.9) 100%)',
              zIndex: 1
            }}></div>
          </div>
          <div className="cta-content" style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 20px',
            boxSizing: 'border-box'
          }}>
            <div style={{
              maxWidth: '600px',
              textAlign: 'center'
            }}>
              <h2 className="cta-title" style={{
                fontSize: '2.8rem',
                marginBottom: '20px',
                fontWeight: '800',
                backgroundImage: 'linear-gradient(to right, #ffffff, #f0f0f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>Ready to Explore?</h2>
              <p className="cta-text" style={{
                fontSize: '1.2rem',
                marginBottom: '30px',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.6'
              }}>
                Login to discover and enjoy thousands of movies from our MovieView collection. Get personalized recommendations based on your taste.
              </p>
              <div className="cta-buttons" style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                marginTop: '10px'
              }}>
                <button 
                  className="cta-button primary-cta" 
                  onClick={() => navigate("/movies")}
                  style={{
                    backgroundColor: 'white',
                    color: '#e50914',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                  }}
                >
                  Explore Movies <FaArrowRight />
                </button>
                <button 
                  className="cta-button secondary-cta" 
                  onClick={() => navigate("/movies")}
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    padding: '14px 28px',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(4px)',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  }}
                >
                  <FaPlayCircle /> Top Picks
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
