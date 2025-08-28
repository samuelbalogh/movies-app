# 🎬 Movies App

A comprehensive movie discovery and browsing application that provides users with an intuitive interface to explore thousands of films from The Movie Database (TMDB). The app features advanced filtering, search capabilities, and a favorites system, all built with modern web technologies.

**Live Demo:** [movies.samu.space](https://movies.samu.space/)

## 🌟 Product Overview

The Movies App is a feature-rich movie browsing platform that transforms how users discover and interact with film content. Built with performance and user experience in mind, it offers:

- **Comprehensive Movie Database**: Access to thousands of movies with detailed information including cast, genres, ratings, and financial data
- **Advanced Filtering**: Browse movies by decade (70s, 80s, 90s), genre (Drama, Documentary, Sci-Fi), popularity, profitability, and more
- **Smart Search**: Real-time search functionality across movie titles and descriptions
- **Personal Favorites**: Save and manage your favorite movies with local storage
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS
- **Infinite Scroll**: Seamless browsing experience with lazy loading
- **Performance Optimized**: Fast loading times with efficient data handling

## 🏗️ Architecture

This is a full-stack application with three main components:

### 📊 Data Pipeline (`importer/`)
- **Purpose**: Fetches and processes movie data from TMDB API
- **Technology**: Python with concurrent processing
- **Features**:
  - Downloads daily movie ID exports from TMDB
  - Fetches detailed movie information using multi-threading
  - Processes and enriches data with cast information
  - Generates optimized JSON datasets for the backend

### 🔧 Backend API (`backend/`)
- **Purpose**: RESTful API serving movie data and filtering logic
- **Technology**: Flask (Python) with CORS support
- **Deployment**: Heroku with Gunicorn
- **Features**:
  - In-memory data loading for fast response times
  - Multiple filtering endpoints (by decade, genre, popularity, etc.)
  - Pagination support with offset/limit parameters
  - Search functionality across movie titles
  - CORS configuration for frontend integration

### 🎨 Frontend (`movies/`)
- **Purpose**: Modern React-based user interface
- **Technology**: React 17, TypeScript, Tailwind CSS
- **Features**:
  - Component-based architecture with reusable UI elements
  - Infinite scroll with intersection observer
  - Local storage for favorites management
  - Responsive design with mobile optimization
  - Loading states and error handling

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ (for frontend)
- Python 3.9+ (for backend and importer)
- TMDB API key (for data import)

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
# or with Poetry
poetry install

# Set environment variables
export MOVIES_ENV=development

# Run the Flask app
python app.py
```

### Frontend Setup
```bash
cd movies
npm install

# Start development server
npm start
```

### Data Import (Optional)
```bash
cd importer
pip install -r requirements.txt

# Set your TMDB API key
export TMDB_API_KEY=your_api_key_here

# Run the import script
python import.py
```

## 📡 API Endpoints

The backend provides the following endpoints:

- `GET /` - All movies with search support
- `GET /popular` - Most popular movies
- `GET /70s`, `/80s`, `/90s` - Movies by decade
- `GET /dramas`, `/documentaries`, `/sci-fi` - Movies by genre
- `GET /new` - Recent movies
- `GET /big-budget` - High-budget films
- `GET /profitable` - Most profitable movies
- `GET /grossing` - Highest grossing movies
- `GET /french` - French-produced movies
- `GET /random` - Random movie selection
- `GET /unpopular` - Least popular movies
- `GET /worst` - Lowest-rated movies

All endpoints support pagination with `?offset=X&limit=Y` parameters.

## 🛠️ Technical Details

### Performance Characteristics
- **Data Loading**: O(n) linear time complexity for filtering operations
- **Memory Usage**: Large JSON datasets loaded into memory for fast access
- **Response Times**: Sub-second response times for most operations
- **Scalability**: Designed for read-heavy workloads with in-memory data

### Data Structure
Each movie object contains:
```json
{
  "id": "movie_id",
  "title": "Movie Title",
  "original_title": "Original Title",
  "year": "2023",
  "genres": ["Action", "Drama"],
  "cast": ["Actor 1", "Actor 2"],
  "overview": "Movie description...",
  "poster": "poster_url",
  "budget": 50000000,
  "revenue": 200000000,
  "vote_average": 7.5,
  "vote_count": 1000,
  "runtime": 120
}
```

### Frontend Features
- **Infinite Scroll**: Uses `react-intersection-observer` for efficient lazy loading
- **Debounced Search**: 300ms debounce to prevent excessive API calls
- **Local Storage**: Favorites persist across browser sessions
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Graceful error handling with user feedback

### Backend Features
- **CORS Support**: Configured for production and development origins
- **Environment Configuration**: Different data loading strategies for staging/production
- **Data Validation**: Input sanitization and validation
- **Efficient Filtering**: Optimized filtering algorithms for large datasets

## 🚀 Deployment

### Backend (Heroku)
- Uses `Procfile` for Gunicorn configuration
- Environment variables for configuration
- Automatic deployment from Git repository

### Frontend
- Built with Create React App
- Static file hosting on any CDN
- Environment variables for API endpoint configuration

## 🔧 Development

### Code Style
- **Frontend**: TypeScript with ESLint and Prettier
- **Backend**: Python with PEP 8 compliance
- **Components**: Reusable React components with TypeScript interfaces

### Testing
- Frontend includes Jest and React Testing Library setup
- Backend includes basic error handling and validation

### Monitoring
- Application logs available through Heroku
- Frontend error tracking through browser console
- Performance monitoring through web vitals

## 📈 Future Enhancements

Potential improvements and features:
- User authentication and cloud-based favorites
- Advanced filtering (by director, actor, rating range)
- Movie recommendations based on viewing history
- Social features (reviews, ratings, sharing)
- Mobile app development
- Database migration for better scalability
- Caching layer for improved performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using React, Flask, and TMDB API**
