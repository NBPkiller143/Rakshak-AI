from flask import Flask, render_template, Response, jsonify, request, redirect, session
import cv2
import os
from datetime import datetime
from ai.detector import detect
import ai.detector as detector
from database import initialize_database
from database import get_detection_count
from database import save_snapshot
from database import save_recording
from database import save_report

app = Flask(__name__)

app.secret_key = "rakshak-ai-2026"

# ====================================
# Camera
# ====================================

camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)

latest_frame = None

recording = False

video_writer = None

recording_filename = ""

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

        global latest_frame

        latest_frame = frame.copy()

        global recording
        global video_writer

        if recording and video_writer is not None:

            video_writer.write(frame)

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

@app.route("/", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "").strip()

        valid_login = (
            (email == "principal@rakshakai.edu" and password == "Rakshak@2026")
            or
            (email == "tech@rakshakai.edu" and password == "Tech@2026")
            or
            (email == "admin@rakshakai.edu" and password == "Admin@2026")
        )

        if valid_login:

            session["logged_in"] = True
            session["user"] = email

            return redirect("/dashboard")

        return render_template(
            "login.html",
            error="Invalid email or password."
        )

    return render_template("login.html")


@app.route("/dashboard")
def dashboard():
    
    if not session.get("logged_in"):
        return redirect("/")

    return render_template("dashboard.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@app.route("/video_feed")
def video_feed():

    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )

@app.route("/snapshot", methods=["POST"])
def snapshot():

    print("📸 Snapshot API Called")

    global latest_frame

    if latest_frame is None:

        return jsonify({
            "success": False
        })

    os.makedirs("snapshots", exist_ok=True)

    filename = datetime.now().strftime("%Y%m%d_%H%M%S.jpg")

    path = os.path.join("snapshots", filename)

    saved=cv2.imwrite(path, latest_frame)

    save_snapshot(path)

    print("Saved:", saved)
    print("Path:", path)

    return jsonify({

        "success": True,

        "filename": filename

    })

@app.route("/start_recording", methods=["POST"])
def start_recording():

    global recording
    global video_writer
    global recording_filename

    if recording:

        return jsonify({
            "success": False,
            "message": "Already Recording"
        })

    os.makedirs("recordings", exist_ok=True)

    recording_filename = datetime.now().strftime("RK_%Y%m%d_%H%M%S.mp4")

    path = os.path.join("recordings", recording_filename)

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")

    width = int(camera.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(camera.get(cv2.CAP_PROP_FRAME_HEIGHT))

    video_writer = cv2.VideoWriter(

        path,

        fourcc,

        20,

        (width, height)

    )

    recording = True

    print("🎥 Recording Started")

    return jsonify({

        "success": True,

        "filename": recording_filename

    })

@app.route("/stop_recording", methods=["POST"])
def stop_recording():

    global recording
    global video_writer
    global recording_filename

    if not recording:

        return jsonify({
            "success": False,
            "message": "Recording not running"
        })

    recording = False

    if video_writer is not None:

        video_writer.release()

        video_writer = None

        save_recording(
            recording_filename,
            "Main Gate"
        )

    print("💾 Recording Saved :", recording_filename)

    return jsonify({

        "success": True,

        "filename": recording_filename

    })

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

@app.route("/api/stats")
def api_stats():

    return {
        "totalDetections": get_detection_count()
    }

initialize_database()

# ====================================

if __name__ == "__main__":

    app.run(
        debug=True,
        use_reloader=False
    )