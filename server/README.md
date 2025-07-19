# Flask Backend Server

A minimal Flask backend server designed to work with the Next.js frontend application.

## Project Structure

```
server/
├── app.py                    # Main Flask application
├── config.py                 # Configuration settings
├── requirements.txt          # Python dependencies
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
└── routes/
    ├── __init__.py          # Routes package
    ├── blueprint_registry.py # Centralized blueprint registration
    ├── hello.py             # Hello endpoint
    ├── health.py            # Health check endpoints
    └── examples.py          # Example endpoints
```

## Setup

1. **Create a virtual environment:**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env file as needed
   ```

4. **Run the server:**
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## Available Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/hello` - Simple hello endpoint (returns `{"result": "world"}`)
- `GET /api/test` - Test endpoint for frontend integration
- `POST /api/example` - Example POST endpoint

## Adding New Endpoints

The Flask app is organized with separate blueprint files for better scalability:

### Method 1: Create a new blueprint file (Recommended for new features)

1. **Create a new file** in `routes/` (e.g., `routes/users.py`):
   ```python
   from flask import Blueprint, jsonify, request

   users_bp = Blueprint('users', __name__)

   @users_bp.route('/users', methods=['GET'])
   def get_users():
       return jsonify({'users': []})

   @users_bp.route('/users', methods=['POST'])
   def create_user():
       data = request.get_json()
       return jsonify({'message': 'User created', 'data': data})
   ```

2. **Register the blueprint** in `routes/blueprint_registry.py`:
   ```python
   from .users import users_bp

   BLUEPRINTS = [
       (hello_bp, '/api'),
       (health_bp, '/api'),
       (examples_bp, '/api'),
       (users_bp, '/api'),  # Add your new blueprint here
   ]
   ```

### Method 2: Add to existing blueprint files

Add endpoints to existing files like `routes/examples.py`, `routes/hello.py`, etc.

## CORS Configuration

The server is configured to accept requests from `http://localhost:3000` (Next.js frontend). To modify CORS settings, edit the `CORS` configuration in `app.py`.

## Development

- The server runs in debug mode by default
- Auto-reloads on file changes
- CORS enabled for frontend integration
- Organized with Flask blueprints for scalability
