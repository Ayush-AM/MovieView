# MovieView

A modern movie recommendation platform that allows users to discover, search, and explore movies using The Movie Database (TMDB) API.

![MovieView Screenshot](screenshot.png)

## Features

- **Interactive UI**: Modern, Netflix-inspired user interface with responsive design
- **Movie Discovery**: Browse popular, top-rated, and latest movies
- **Search Functionality**: Find specific movies by title
- **Genre Filtering**: Filter movies by genre categories
- **Movie Details**: View comprehensive details for each movie:
  - Cast information
  - Movie ratings
  - Release date
  - Overview/plot summary
  - Streaming/watch providers
- **User Authentication**: Simple login system (username/password)
- **Personalization**: Like movies to get personalized recommendations
- **Responsive Design**: Works on both desktop and mobile devices

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn package manager

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/Ayush-AM/MovieView.git
cd MovieView
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your TMDB API credentials:
```
REACT_APP_TMDB_API_KEY=your_api_key_here
REACT_APP_TMDB_ACCESS_TOKEN=your_access_token_here
```

4. Start the development server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

- **Home Page**: Browse trending movies and featured content
- **Movies Page**: Explore movies by category (popular, latest, top-rated)
- **Search**: Use the search bar to find specific movies
- **Genre Filter**: Filter movies by specific genres using the dropdown
- **Movie Details**: Click on any movie poster to view detailed information
- **Like Movies**: Like movies to train the recommendation system

## Technologies Used

- **React.js**: Frontend library for building the user interface
- **React Router**: For navigation and routing
- **CSS**: Custom styling with responsive design
- **TMDB API**: For fetching movie data and information
- **React Icons**: For UI icons
- **LocalStorage**: For maintaining user preferences and login state

## API Information

This project uses The Movie Database (TMDB) API to fetch movie data. To use this application, you'll need to:

1. Sign up for a TMDB account at [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
2. Request an API key from your account settings
3. Get a read access token for API authentication

For more information about the TMDB API, visit their [documentation](https://developer.themoviedb.org/docs).

## Project Structure

```
MovieView/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── Home.js          # Home page component
│   │   ├── MovieList.js     # Movies browsing component
│   │   ├── MoviePoster.js   # Reusable movie poster component
│   │   └── ...
│   ├── App.js               # Main app component with routing
│   ├── App.css              # Global styles
│   ├── index.js             # App entry point
│   └── ...
├── .gitignore
├── package.json
└── README.md
```

## Login Credentials

For demo purposes, use the following credentials:
- Username: `user`
- Password: `password`

## Future Enhancements

- User registration system
- Movie trailers integration
- Advanced filtering options
- User reviews and ratings
- Watchlist functionality
- Improved recommendation algorithm

## License

MIT License

## Acknowledgements

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the API
- [React Icons](https://react-icons.github.io/react-icons/) for the icon set
- [Netflix](https://www.netflix.com/) for UI inspiration
