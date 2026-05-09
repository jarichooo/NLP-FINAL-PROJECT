from flask import Blueprint, request, jsonify
from .model import detect_errors

bp = Blueprint("main", __name__)

@bp.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")

    result = detect_errors(text)
    return jsonify(result)
