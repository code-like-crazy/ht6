from flask import Blueprint, jsonify

hello_bp = Blueprint('hello', __name__)

@hello_bp.route('/hello', methods=['GET'])
def hello():
    """Simple hello endpoint"""
    return jsonify({
        'result': 'world'
    })
