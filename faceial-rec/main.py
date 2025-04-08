import cv2
import numpy as np

# Load the Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Initialize ORB detector
orb = cv2.ORB_create()

# Load the reference image (tovi.jpg) and convert to grayscale
reference_image = cv2.imread('tovi.jpg')  # Ensure 'tovi.jpg' is in the same directory
gray_reference = cv2.cvtColor(reference_image, cv2.COLOR_BGR2GRAY)

# Detect keypoints and descriptors in the reference image
kp_reference, des_reference = orb.detectAndCompute(gray_reference, None)

# Ensure the reference image has valid descriptors
if des_reference is None:
    print("Error: No descriptors found for the reference image!")
    exit()

# Start video capture (0 is the default webcam)
cap = cv2.VideoCapture(0)

while True:
    # Read a frame from the webcam
    ret, frame = cap.read()

    # Convert the frame to grayscale (required for feature detection)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the current frame
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    for (x, y, w, h) in faces:
        # Extract the detected face from the frame
        detected_face = gray[y:y + h, x:x + w]

        # Detect keypoints and descriptors in the detected face
        kp_face, des_face = orb.detectAndCompute(detected_face, None)

        # Ensure valid descriptors exist for the detected face
        if des_face is None:
            continue  # Skip this face if no descriptors were found

        # Match the keypoints between the detected face and the reference image
        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

        # Ensure the descriptors are of the same type and shape before matching
        if des_reference.shape[1] == des_face.shape[1]:
            matches = bf.match(des_reference, des_face)

            # Sort them based on distance (lower is better)
            matches = sorted(matches, key=lambda x: x.distance)

            # If the number of good matches is above a threshold, consider it a match
            if len(matches) > 10:  # Adjust the number of matches required
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)  # Green rectangle for match
                print (len(matches))
            else:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)  # Blue rectangle for non-match
                
        else:
            # If the descriptors have incompatible shapes, skip this face
            continue

    # Display the resulting frame
    cv2.imshow('Face Detection & Matching', frame)

    # Exit the loop when 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close all windows
cap.release()
cv2.destroyAllWindows()
