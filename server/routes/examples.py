from flask import Blueprint, jsonify, request

examples_bp = Blueprint('examples', __name__)

@examples_bp.route('/test', methods=['GET'])
def test_endpoint():
    """Test endpoint for frontend integration"""
    return jsonify({
        'message': 'Hello from Flask!',
        'data': {
            'server': 'Flask',
            'port': 5000,
            'frontend_url': 'http://localhost:3000'
        }
    })

@examples_bp.route('/example', methods=['POST'])
def example_post():
    """Example POST endpoint"""
    data = request.get_json()
    
    return jsonify({
        'message': 'Data received successfully',
        'received_data': data,
        'status': 'success'
    })
