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

## 🚨 Technical Debt & Security Issues

This application has accumulated significant technical debt and security vulnerabilities that should be addressed before production deployment or further development.

### 🔒 Security Vulnerabilities

#### **Critical Issues**
- **Hardcoded API Tokens**: TMDB API key is hardcoded in `importer/import.py` line 18
  ```python
  API_KEY = os.getenv('TMDB_API_KEY') or "eyJhbGciOiJIUzI1NiJ9..."
  ```
- **No Rate Limiting**: Backend lacks rate limiting, making it vulnerable to abuse
- **Overly Permissive CORS**: CORS configuration allows broad access without proper validation
- **No Input Validation**: API endpoints lack proper input sanitization and validation
- **Sensitive Data Exposure**: Large JSON files containing movie data are publicly accessible

#### **Medium Priority Issues**
- **No Authentication**: No user authentication or authorization mechanisms
- **Local Storage Security**: Favorites stored in browser localStorage without encryption
- **Error Information Disclosure**: Detailed error messages may expose system information
- **No HTTPS Enforcement**: No HTTPS redirect or HSTS headers

### 🏗️ Architecture Debt

#### **Performance Issues**
- **Memory Inefficiency**: Loading entire datasets into memory (O(n) space complexity)
- **Inefficient Filtering**: Linear search through all movies for each filter operation
- **No Caching**: No caching layer for frequently accessed data
- **Large File Handling**: 18MB+ JSON files loaded synchronously

#### **Code Quality Issues**
- **Incomplete TODO Items**: Multiple TODO comments indicating unfinished implementations
  ```python
  # TODO delete the body (lines 63, 80, 90, 100, 110 in app.py)
  # TODO don't read whole file into memory (line 66 in import.py)
  ```
- **Code Duplication**: Repetitive filtering logic across multiple functions
- **Hardcoded Values**: Magic numbers and hardcoded limits throughout the codebase
- **No Error Handling**: Minimal error handling and logging

#### **Scalability Concerns**
- **Single Point of Failure**: No load balancing or horizontal scaling capability
- **Database Dependency**: No proper database, relying on JSON files
- **No Monitoring**: No application monitoring or health checks
- **Resource Constraints**: Memory usage grows linearly with dataset size

### 🔧 Maintenance Debt

#### **Dependency Management**
- **Outdated Dependencies**: Using older versions of Flask and React
- **No Dependency Scanning**: No security scanning for vulnerable packages
- **Mixed Package Managers**: Using both pip and Poetry inconsistently

#### **Testing Gaps**
- **No Backend Tests**: No unit or integration tests for API endpoints
- **Limited Frontend Tests**: Only basic Create React App test setup
- **No API Testing**: No automated API testing or contract validation

#### **Documentation Issues**
- **Incomplete API Docs**: No OpenAPI/Swagger documentation
- **Missing Architecture Docs**: No system design or deployment documentation
- **No Troubleshooting Guide**: No runbook for common issues

### 🚀 Recommended Remediation Plan

#### **Phase 1: Security Fixes (Critical)**
1. **Remove Hardcoded Tokens**
   - Move all API keys to environment variables
   - Implement secure secret management (AWS Secrets Manager, HashiCorp Vault)
   - Add token rotation capabilities

2. **Implement Rate Limiting**
   - Add Flask-Limiter or similar rate limiting middleware
   - Configure appropriate limits per endpoint and user
   - Add IP-based and user-based rate limiting

3. **Secure CORS Configuration**
   - Restrict CORS origins to specific domains
   - Implement proper CORS validation
   - Add security headers (HSTS, CSP, etc.)

4. **Input Validation**
   - Add request validation using Marshmallow or similar
   - Implement proper error handling without information disclosure
   - Add request size limits

#### **Phase 2: Architecture Improvements**
1. **Database Migration**
   - Implement PostgreSQL or MongoDB for data storage
   - Add database indexing for efficient queries
   - Implement connection pooling

2. **Caching Layer**
   - Add Redis for caching frequently accessed data
   - Implement cache invalidation strategies
   - Add cache warming for popular endpoints

3. **API Optimization**
   - Implement pagination with cursor-based navigation
   - Add query optimization and database indexing
   - Implement GraphQL for flexible data fetching

#### **Phase 3: Code Quality**
1. **Testing Implementation**
   - Add comprehensive unit tests (pytest)
   - Implement integration tests for API endpoints
   - Add end-to-end tests for critical user flows

2. **Code Refactoring**
   - Remove TODO items and implement missing functionality
   - Refactor duplicate code into reusable functions
   - Implement proper error handling and logging

3. **Monitoring & Observability**
   - Add application performance monitoring (APM)
   - Implement structured logging
   - Add health checks and metrics collection

#### **Phase 4: Production Readiness**
1. **Deployment Improvements**
   - Implement CI/CD pipeline with security scanning
   - Add automated testing in deployment pipeline
   - Implement blue-green deployment strategy

2. **Security Hardening**
   - Add authentication and authorization
   - Implement proper session management
   - Add security headers and HTTPS enforcement

3. **Performance Optimization**
   - Implement CDN for static assets
   - Add database query optimization
   - Implement proper caching strategies

### 📊 Technical Debt Metrics

- **Code Coverage**: < 10% (estimated)
- **Security Vulnerabilities**: 5+ critical issues
- **Performance**: O(n) complexity for all operations
- **Maintainability**: Low (multiple TODO items, code duplication)
- **Scalability**: Poor (memory-bound, no horizontal scaling)

### 🎯 Priority Matrix

| Issue | Impact | Effort | Priority |
|-------|--------|--------|----------|
| Hardcoded API tokens | High | Low | Critical |
| Rate limiting | High | Medium | High |
| Input validation | High | Medium | High |
| Database migration | High | High | Medium |
| Testing implementation | Medium | High | Medium |
| Code refactoring | Medium | Medium | Low |

---

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
