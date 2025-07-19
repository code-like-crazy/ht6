"""
Blueprint registry for automatic blueprint registration.
Add new blueprints here to automatically register them with the Flask app.
"""

from .hello import hello_bp
from .health import health_bp
from .examples import examples_bp

# List of all blueprints to register
BLUEPRINTS = [
    (hello_bp, '/api'),
    (health_bp, '/api'),
    (examples_bp, '/api'),
]

def register_blueprints(app):
    """Register all blueprints with the Flask app"""
    for blueprint, url_prefix in BLUEPRINTS:
        app.register_blueprint(blueprint, url_prefix=url_prefix)
