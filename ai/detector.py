from ultralytics import YOLO

print("Loading YOLO model...")
model = YOLO("yolov8n.pt")
print("YOLO model loaded successfully!")

def detect(frame):
    try:
        results = model.predict(
            source=frame,
            conf=0.5,
            verbose=False
        )

        return results[0].plot()

    except Exception as e:
        print("YOLO ERROR:", e)
        return frame