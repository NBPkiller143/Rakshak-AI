from flask import Flask, render_template, Response, jsonify
import cv2

from ai.detector import detect
import ai.detector as detector

app = Flask(__name__)

# ====================================
# Camera
# ====================================

camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)

if not camera.isOpened():
    print("❌ Camera failed to open")
else:
    print("✅ Camera opened successfully")

def generate_frames():

    while True:

        success, frame = camera.read()

        if not success:
            print("⚠️ Failed to grab frame")
            continue

        # Remove mirror effect
        frame = cv2.flip(frame, 1)

        frame = detect(frame)

        ret, buffer = cv2.imencode(".jpg", frame)

        if not ret:
            print("⚠️ Encoding Failed")
            continue

        frame_bytes = buffer.tobytes()

        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' +
            frame_bytes +
            b'\r\n'
        )

# ====================================
# Routes
# ====================================

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


@app.route("/person_count")
def person_count():
    return jsonify({
        "count": detector.person_count
    })


@app.route("/robot_status")
def robot_status():

    return jsonify(detector.get_robot_status())

@app.route("/detections")
def detections():

    return jsonify(detector.detections)

# ====================================

if __name__ == "__main__":

    app.run(
        debug=True,
        use_reloader=False
    )