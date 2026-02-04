from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load trained model
model = joblib.load("intent_model.pkl")

@app.route("/predict-intent", methods=["POST"])
def predict_intent():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    intent = model.predict([text])[0]

    return jsonify({"intent": intent})

if __name__ == "__main__":
    app.run(port=5001)
