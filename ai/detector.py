from unittest import result

from matplotlib.pyplot import box
from ultralytics import YOLO
from datetime import datetime
import cv2

# ==========================================
# LOAD YOLO MODEL
# ==========================================

print("\n======================================")
print(" Loading Rakshak AI Detector...")
print("======================================")

model = YOLO("yolov8n.pt")

print(" YOLO Model Loaded Successfully")
print("======================================\n")

# ==========================================
# GLOBAL VARIABLES
# ==========================================

person_count = 0

detections = []

MAX_DETECTIONS = 15

# ==========================================
# COLORS
# ==========================================

GREEN = (0, 255, 0)

ORANGE = (0, 165, 255)

RED = (0, 0, 255)

WHITE = (255, 255, 255)

BLACK = (25, 25, 25)

# ==========================================
# CAMERA INFO
# ==========================================

CAMERA_NAME = "Main Gate"

LOCATION = "PM SHRI KV ASC CENTRE"

# ==========================================
# THREAT ENGINE
# ==========================================

def get_threat_level(count):

    if count >= 5:

        return "HIGH", RED

    elif count >= 3:

        return "MEDIUM", ORANGE

    return "LOW", GREEN

# ==========================================
# EVENT LOGGER
# ==========================================

def add_detection(label, confidence, threat):

    global detections

    event = {

        "time": datetime.now().strftime("%H:%M:%S"),

        "label": f"{label.title()} Detected",

        "confidence": confidence,

        "camera": CAMERA_NAME,

        "location": LOCATION,

        "threat": threat

    }

    if len(detections) == 0:

        detections.insert(0, event)

        return

    latest = detections[0]

    if (

        latest["label"] != event["label"]

        or latest["threat"] != event["threat"]

        or latest["confidence"] != event["confidence"]

    ):

        detections.insert(0, event)

    detections = detections[:MAX_DETECTIONS]
    # ==========================================
    # DRAW BOUNDING BOX
    # ==========================================

def draw_box(frame, box, confidence, color, label):

    x1, y1, x2, y2 = map(int, box.xyxy[0])

    cv2.rectangle(
        frame,
        (x1, y1),
        (x2, y2),
        color,
        2
    )

    cv2.rectangle(
        frame,
        (x1, y1 - 28),
        (x2, y1),
        color,
        -1
    )

    cv2.putText(
        frame,
        f"{label.title()} {confidence:.1f}%",
        (x1 + 5, y1 - 8),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        WHITE,
        2
    )


# ==========================================
# DRAW AI STATUS PANEL
# ==========================================

def draw_status_panel(frame, threat):

    _, threat_color = get_threat_level(person_count)

    cv2.rectangle(
        frame,
        (10, 10),
        (340, 115),
        BLACK,
        -1
    )

    cv2.putText(
        frame,
        f"People : {person_count}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        WHITE,
        2
    )

    cv2.putText(
        frame,
        f"Threat : {threat}",
        (20, 70),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        threat_color,
        2
    )

    cv2.putText(
        frame,
        CAMERA_NAME,
        (20, 100),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        WHITE,
        2
    )
    # ==========================================
# MAIN DETECTION FUNCTION
# ==========================================

def detect(frame):

    frame = cv2.flip(frame, 1)

    global person_count

    try:

        person_count = 0

        results = model.predict(

            source=frame,

            conf=0.45,

            imgsz=640,

            verbose=False

        )

        result = results[0]

        for box in result.boxes:

            cls = int(box.cls[0])

            class_name = model.names[cls]

            confidence = round(float(box.conf[0]) * 100, 1)

            if class_name == "person":

                person_count += 1

                threat, color = get_threat_level(person_count)

                draw_box(
                    frame,
                    box,
                    confidence,
                    color,
                    class_name
                )

                add_detection(
                    class_name,
                    confidence,
                    threat
                )

            else:

                draw_box(
                    frame,
                    box,
                    confidence,
                    GREEN,
                    class_name
                )

        threat, _ = get_threat_level(person_count)

        global current_threat
        global robot_dispatch
        global dispatch_camera

        current_threat = threat

        if threat == "HIGH":

            robot_dispatch = True

            dispatch_camera = CAMERA_NAME
            
        else:
            robot_dispatch = False

            dispatch_camera = None
        #draw_status_panel(

        #    frame,

        #    threat

        #)

        return frame

    except Exception as e:

        print("Detector Error:", e)

        return frame
    # ==========================================
    # ROBOT DISPATCH VARIABLES
    # ==========================================

robot_dispatch = False

dispatch_camera = None

current_threat = "LOW"

# ==========================================
# GET ROBOT STATUS
# ==========================================

def get_robot_status():

    return {

        "dispatch": robot_dispatch,

        "camera": dispatch_camera,

        "threat": current_threat,

        "people": person_count

    }

# ==========================================
# RESET DETECTIONS
# ==========================================

def clear_detections():

    global detections
    global person_count
    global robot_dispatch
    global dispatch_camera
    global current_threat

    detections.clear()

    person_count = 0

    robot_dispatch = False

    dispatch_camera = None

    current_threat = "LOW"