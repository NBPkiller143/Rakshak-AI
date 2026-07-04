from flask import Flask, render_template, Response
import cv2
from ai.detector import detect

app = Flask(__name__)

# ==========================
# Camera Setup
# ==========================

camera = cv2.VideoCapture(0)

def generate_frames():

    while True:

        success, frame = camera.read()
        
        if not success:
            break

        # Flip horizontally (mirror remove/add depending on your camera)
        frame = cv2.flip(frame, 1)

        # YOLO Detection
        frame = detect(frame)

        # Convert frame to JPEG
        ret, buffer = cv2.imencode(".jpg", frame)

        if not ret:
            continue

        frame_bytes = buffer.tobytes()

        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' +
            frame_bytes +
            b'\r\n'
        )
# ==========================
# Routes
# ==========================

@app.route("/")
def login():
    return render_template("login.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )

# ==========================
# Main
# ==========================

if __name__ == "__main__":
    app.run(
        debug=False
    )