from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return {
        "project": "Rakshak AI",
        "status": "Running",
        "version": "1.0.0"
    }

@app.route("/health")
def health():
    return {
        "server": "Healthy",
        "robot": "Disconnected",
        "ai": "Ready"
    }

if __name__ == "__main__":
    app.run(debug=True)