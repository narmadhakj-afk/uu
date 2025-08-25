# Lookate Backend API

AI-Powered Multimodal Search, Task Management & Location Intelligence Backend

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Multimodal Search**: Text, image, and voice search capabilities
- **AI Chat Assistant**: Conversational AI powered by OpenAI GPT
- **Smart Task Management**: Location-linked tasks with geocoding
- **Location Services**: Nearby places discovery using Google Maps API
- **User Profiles**: Statistics and activity tracking

## Technology Stack

- **Framework**: Flask (Python web framework)
- **Database**: SQLAlchemy ORM (SQLite for development, PostgreSQL for production)
- **Authentication**: Flask-JWT-Extended
- **AI Services**: OpenAI GPT-3.5/4 and Whisper
- **Location Services**: Google Maps API
- **Image Processing**: Pillow (PIL)

## Setup Instructions

### 1. Environment Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key
OPENAI_API_KEY=your-openai-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
DATABASE_URL=sqlite:///lookate.db
```

### 3. Database Setup

```bash
# Initialize database
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

### 4. Run the Application

```bash
# Development server
python app.py

# Production server with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Search
- `POST /search/text` - Text-based search
- `POST /search/image` - Image-based search
- `POST /search/voice` - Voice-based search

### AI Chat
- `POST /chat` - Chat with AI assistant

### Task Management
- `GET /tasks` - Get user tasks
- `POST /tasks` - Create new task
- `PUT /tasks/{id}/toggle` - Toggle task completion

### Location Services
- `GET /locations/nearby` - Get nearby places

### User Profile
- `GET /user/profile` - Get user profile and statistics

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
  }'
```

### Text Search
```bash
curl -X POST http://localhost:5000/search/text \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "What are the best coffee shops nearby?"
  }'
```

### Image Search
```bash
curl -X POST http://localhost:5000/search/image \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "image": "base64_encoded_image_data",
    "query": "What type of flower is this?"
  }'
```

### Create Task
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "location": "Whole Foods Market",
    "due_time": "2:00 PM"
  }'
```

### Chat with AI
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "Help me identify plants in my garden"
  }'
```

### Get Nearby Places
```bash
curl "http://localhost:5000/locations/nearby?latitude=37.7749&longitude=-122.4194&radius=1000&type=restaurant" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Integration with React Native App

### API Client Setup

```javascript
// api/client.js
const API_BASE_URL = 'http://localhost:5000';

class LookateAPI {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response.json();
  }

  // Auth methods
  async register(email, password, name) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Search methods
  async textSearch(query) {
    return this.request('/search/text', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  async imageSearch(imageBase64, query = '') {
    return this.request('/search/image', {
      method: 'POST',
      body: JSON.stringify({ image: imageBase64, query }),
    });
  }

  // Task methods
  async getTasks() {
    return this.request('/tasks');
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async toggleTask(taskId) {
    return this.request(`/tasks/${taskId}/toggle`, {
      method: 'PUT',
    });
  }

  // Chat method
  async chatWithAI(message) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Location methods
  async getNearbyPlaces(latitude, longitude, radius = 1000, type = '') {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
    });
    
    if (type) params.append('type', type);
    
    return this.request(`/locations/nearby?${params}`);
  }

  // Profile method
  async getUserProfile() {
    return this.request('/user/profile');
  }
}

export default new LookateAPI();
```

### Usage in React Native Components

```javascript
// Example: Using the API in a React Native component
import LookateAPI from '../api/client';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await LookateAPI.login(email, password);
      if (response.access_token) {
        LookateAPI.setToken(response.access_token);
        setUser(response.user);
        // Store token securely (use AsyncStorage or Expo SecureStore)
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { user, login, loading };
};
```

## Production Deployment

### Using Docker

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

### Environment Variables for Production

```env
SECRET_KEY=production-secret-key
JWT_SECRET_KEY=production-jwt-secret
OPENAI_API_KEY=your-openai-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
DATABASE_URL=postgresql://user:password@localhost/lookate
```

## Security Considerations

- Always use HTTPS in production
- Store API keys securely using environment variables
- Implement rate limiting for API endpoints
- Validate and sanitize all user inputs
- Use secure password hashing (already implemented with Werkzeug)
- Implement proper CORS policies

## License

MIT License - See LICENSE file for details