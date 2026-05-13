from flask import Blueprint, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from .model import detect_errors

bp = Blueprint("main", __name__)
limiter = Limiter(key_func=get_remote_address)

@bp.route("/api/process", methods=["POST"])
@limiter.limit("9 per 2 minutes")
def process():
    data = request.get_json()
    text = data.get("text", "")

    result = detect_errors(text)
    return jsonify(result)
