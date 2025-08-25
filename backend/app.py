"""
Lookate Backend API - Python Flask Application
AI-Powered Multimodal Search, Task Management & Location Intelligence

This backend provides REST API endpoints for:
- User authentication and management
- Multimodal search (text, voice, image)
- AI chat assistant integration
- Smart task management with location linking
- Location-based services and recommendations
- Real-time data synchronization

Technology Stack:
- Flask (Web Framework)
- SQLAlchemy (Database ORM)
- OpenAI/Google AI APIs (AI Services)
- Google Maps API (Location Services)
- JWT (Authentication)
- Redis (Caching & Sessions)
"""

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import openai
import requests
import base64
import os
from PIL import Image
import io

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///lookate.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# OpenAI Configuration
openai.api_key = os.environ.get('OPENAI_API_KEY', 'your-openai-api-key')

# Google Maps API Key
GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY', 'your-google-maps-api-key')

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    searches = db.relationship('Search', backref='user', lazy=True)
    tasks = db.relationship('Task', backref='user', lazy=True)

class Search(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    query = db.Column(db.Text, nullable=False)
    search_type = db.Column(db.String(50), nullable=False)  # text, image, voice
    result = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    completed = db.Column(db.Boolean, default=False)
    due_time = db.Column(db.String(50))
    location = db.Column(db.String(200))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Authentication Routes
@app.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate input
        if not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        user = User(
            email=data['email'],
            name=data['name'],
            password_hash=generate_password_hash(data['password'])
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            access_token = create_access_token(identity=user.id)
            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name
                }
            }), 200
        
        return jsonify({'error': 'Invalid credentials'}), 401
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Multimodal Search Routes
@app.route('/search/text', methods=['POST'])
@jwt_required()
def text_search():
    try:
        data = request.get_json()
        query = data.get('query', '')
        user_id = get_jwt_identity()
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # Use OpenAI for intelligent search
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant for Lookate, an AI-powered discovery app. Provide accurate, helpful responses about the user's query."},
                {"role": "user", "content": query}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        result = response.choices[0].message.content
        
        # Save search to database
        search = Search(
            user_id=user_id,
            query=query,
            search_type='text',
            result=result
        )
        db.session.add(search)
        db.session.commit()
        
        return jsonify({
            'result': result,
            'search_id': search.id,
            'suggestions': generate_suggestions(query)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/search/image', methods=['POST'])
@jwt_required()
def image_search():
    try:
        data = request.get_json()
        image_data = data.get('image')  # Base64 encoded image
        query = data.get('query', '')
        user_id = get_jwt_identity()
        
        if not image_data:
            return jsonify({'error': 'Image data is required'}), 400
        
        # Process image with OpenAI Vision API
        response = openai.ChatCompletion.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"Analyze this image and provide detailed information. User query: {query}"},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_data}"}}
                    ]
                }
            ],
            max_tokens=500
        )
        
        result = response.choices[0].message.content
        
        # Save search to database
        search = Search(
            user_id=user_id,
            query=f"Image search: {query}" if query else "Image identification",
            search_type='image',
            result=result
        )
        db.session.add(search)
        db.session.commit()
        
        return jsonify({
            'result': result,
            'search_id': search.id,
            'confidence': 0.85,  # Mock confidence score
            'objects_detected': extract_objects(result)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/search/voice', methods=['POST'])
@jwt_required()
def voice_search():
    try:
        # Handle voice transcription and search
        audio_file = request.files.get('audio')
        user_id = get_jwt_identity()
        
        if not audio_file:
            return jsonify({'error': 'Audio file is required'}), 400
        
        # Transcribe audio using OpenAI Whisper
        transcript = openai.Audio.transcribe("whisper-1", audio_file)
        query = transcript['text']
        
        # Process the transcribed query
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant for voice queries. Provide concise, accurate responses."},
                {"role": "user", "content": query}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        result = response.choices[0].message.content
        
        # Save search to database
        search = Search(
            user_id=user_id,
            query=query,
            search_type='voice',
            result=result
        )
        db.session.add(search)
        db.session.commit()
        
        return jsonify({
            'transcript': query,
            'result': result,
            'search_id': search.id
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# AI Chat Routes
@app.route('/chat', methods=['POST'])
@jwt_required()
def chat_with_ai():
    try:
        data = request.get_json()
        message = data.get('message', '')
        user_id = get_jwt_identity()
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get conversation history
        recent_messages = ChatMessage.query.filter_by(user_id=user_id)\
                                         .order_by(ChatMessage.created_at.desc())\
                                         .limit(5).all()
        
        # Build context for AI
        context_messages = [
            {"role": "system", "content": "You are Lookate's AI assistant. Help users with discovery, task management, and location-based queries. Be helpful, concise, and engaging."}
        ]
        
        for msg in reversed(recent_messages):
            context_messages.append({"role": "user", "content": msg.message})
            context_messages.append({"role": "assistant", "content": msg.response})
        
        context_messages.append({"role": "user", "content": message})
        
        # Get AI response
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=context_messages,
            max_tokens=400,
            temperature=0.8
        )
        
        ai_response = response.choices[0].message.content
        
        # Save chat message
        chat_message = ChatMessage(
            user_id=user_id,
            message=message,
            response=ai_response
        )
        db.session.add(chat_message)
        db.session.commit()
        
        return jsonify({
            'response': ai_response,
            'message_id': chat_message.id
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Task Management Routes
@app.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    try:
        user_id = get_jwt_identity()
        tasks = Task.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'tasks': [{
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'completed': task.completed,
                'due_time': task.due_time,
                'location': task.location,
                'latitude': task.latitude,
                'longitude': task.longitude,
                'created_at': task.created_at.isoformat()
            } for task in tasks]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        # Extract location coordinates if location is provided
        latitude, longitude = None, None
        if data.get('location'):
            coords = geocode_location(data['location'])
            if coords:
                latitude, longitude = coords
        
        task = Task(
            user_id=user_id,
            title=data.get('title', ''),
            description=data.get('description', ''),
            due_time=data.get('due_time'),
            location=data.get('location'),
            latitude=latitude,
            longitude=longitude
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify({
            'message': 'Task created successfully',
            'task': {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'completed': task.completed,
                'due_time': task.due_time,
                'location': task.location,
                'latitude': task.latitude,
                'longitude': task.longitude
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/tasks/<int:task_id>/toggle', methods=['PUT'])
@jwt_required()
def toggle_task(task_id):
    try:
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()
        
        if not task:
            return jsonify({'error': 'Task not found'}), 404
        
        task.completed = not task.completed
        db.session.commit()
        
        return jsonify({
            'message': 'Task updated successfully',
            'completed': task.completed
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Location Services Routes
@app.route('/locations/nearby', methods=['GET'])
@jwt_required()
def get_nearby_locations():
    try:
        latitude = request.args.get('latitude', type=float)
        longitude = request.args.get('longitude', type=float)
        radius = request.args.get('radius', 1000, type=int)  # meters
        place_type = request.args.get('type', '')
        
        if not latitude or not longitude:
            return jsonify({'error': 'Latitude and longitude are required'}), 400
        
        # Use Google Places API
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            'location': f"{latitude},{longitude}",
            'radius': radius,
            'key': GOOGLE_MAPS_API_KEY
        }
        
        if place_type:
            params['type'] = place_type
        
        response = requests.get(url, params=params)
        places_data = response.json()
        
        locations = []
        for place in places_data.get('results', []):
            locations.append({
                'place_id': place.get('place_id'),
                'name': place.get('name'),
                'rating': place.get('rating'),
                'price_level': place.get('price_level'),
                'types': place.get('types', []),
                'location': place.get('geometry', {}).get('location'),
                'vicinity': place.get('vicinity'),
                'opening_hours': place.get('opening_hours', {}).get('open_now')
            })
        
        return jsonify({'locations': locations}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user statistics
        search_count = Search.query.filter_by(user_id=user_id).count()
        completed_tasks = Task.query.filter_by(user_id=user_id, completed=True).count()
        total_tasks = Task.query.filter_by(user_id=user_id).count()
        
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'created_at': user.created_at.isoformat()
            },
            'stats': {
                'searches': search_count,
                'tasks_completed': completed_tasks,
                'total_tasks': total_tasks,
                'discoveries': search_count  # Mock discovery count
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Utility Functions
def generate_suggestions(query):
    """Generate smart suggestions based on the query"""
    suggestions = [
        f"Find {query} nearby",
        f"Best {query} in the area",
        f"Reviews for {query}",
        f"Alternatives to {query}"
    ]
    return suggestions[:3]

def extract_objects(ai_result):
    """Extract detected objects from AI response"""
    # Mock object detection - in production, use computer vision APIs
    return ["object1", "object2", "object3"]

def geocode_location(location_name):
    """Convert location name to coordinates"""
    try:
        url = "https://maps.googleapis.com/maps/api/geocode/json"
        params = {
            'address': location_name,
            'key': GOOGLE_MAPS_API_KEY
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if data['results']:
            location = data['results'][0]['geometry']['location']
            return (location['lat'], location['lng'])
        
        return None
    except:
        return None

# Error Handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Initialize database
@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)