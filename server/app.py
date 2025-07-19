from flask import Flask
from flask_cors import CORS
from routes.blueprint_registry import register_blueprints

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for Next.js frontend (localhost:3000)
    CORS(app, origins=["http://localhost:3000"])
    
    # Register all blueprints
    register_blueprints(app)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5001)
