# 👁️ AI-Powered Assistive Vision System for Visually Impaired People

An AI-powered computer vision application designed to assist visually impaired individuals by identifying objects, detecting faces, recognizing facial expressions, and assisting with currency identification through a camera-based system.

## 📌 Project Description

Visually impaired individuals often face challenges when identifying everyday objects, recognizing people, interpreting facial expressions, and distinguishing currency notes.

This project aims to address these challenges using computer vision and deep learning technologies. It integrates multiple AI models into a unified detection system that processes live camera input and provides visual recognition results.

The system uses OpenCV for image processing, YOLO for object detection, DeepFace for face and emotion analysis, and Tesseract OCR for text extraction.

## ✨ Key Features

- **Object Detection:** Identifies common objects in real time using YOLO.
- **Face Detection:** Detects human faces in camera frames.
- **Emotion Recognition:** Estimates facial expressions such as happiness, sadness, anger, and surprise using DeepFace.
- **Currency Assistance:** Uses OCR to extract text from currency notes as an initial step toward currency recognition.
- **Real-Time Camera Processing:** Processes live webcam input.
- **Integrated Detection Pipeline:** Combines multiple computer vision capabilities in one Python application.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| OpenCV | Image processing and webcam access |
| YOLOv8 | Real-time object detection |
| DeepFace | Face analysis and emotion recognition |
| NumPy | Numerical and array operations |
| Tesseract OCR | Text extraction from images |
| pip | Python package management |

## ⚙️ System Architecture

```text
Live Camera Input
       |
       v
 OpenCV Image Processing
       |
       v
  Detection Pipeline
       |
       +----> YOLOv8
       |       Object Detection
       |
       +----> DeepFace
       |       Face Detection
       |       Emotion Analysis
       |
       +----> Tesseract OCR
       |       Text Extraction
       |
       v
 Annotated Camera Output
```

## 🚀 Installation and Setup

### Prerequisites

- Python 3.10 or another version compatible with the selected dependencies
- A working webcam
- Internet connection for initial package and model downloads
- Tesseract OCR installed on your system

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
```

Replace the repository URL with your actual GitHub repository URL.

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies

```bash
python -m pip install --upgrade pip
python -m pip install opencv-python numpy deepface ultralytics pytesseract
```

### 4. Install Tesseract OCR

Download and install Tesseract OCR for Windows:

https://github.com/UB-Mannheim/tesseract/wiki

If Tesseract is not automatically detected, configure its executable path in your Python script.

Example:

```python
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)
```

Adjust the path to match your installation.

### 5. Run the Application

```bash
python main.py
```

Replace `main.py` with the actual name of your Python file.

Press **Q** to close the camera window.

## 📂 Project Structure

```text
assistive-vision-system/
│
├── main.py
├── README.md
├── requirements.txt
├── venv/
└── .gitignore
```

The structure above is a suggested layout. Adapt it to match your actual project files.

## 🔮 Future Enhancements

- **Voice Assistance:** Announce detected objects and recognition results using text-to-speech.
- **Indian Currency Recognition:** Identify Indian banknote denominations using a dedicated trained model.
- **Person Identification:** Enable consent-based recognition of known individuals.
- **Navigation Assistance:** Detect obstacles and provide audio alerts.
- **Multilingual Support:** Deliver voice feedback in multiple languages.
- **Mobile Integration:** Develop a portable Android application.
- **Offline Operation:** Optimize models for devices with limited connectivity.

## 🎯 Project Objective

To develop an accessible, AI-driven assistive vision system that helps visually impaired individuals interpret their surroundings and perform everyday tasks with greater independence.

## ⚠️ Current Limitations

- General object detection depends on the classes supported by the selected YOLO model.
- Emotion recognition estimates facial expressions and cannot reliably determine a person's actual emotional state.
- OCR text extraction alone does not reliably identify a currency denomination or verify whether a note is genuine.
- The current application requires performance testing before practical use by visually impaired individuals.

## 🤝 Contributing

Contributions, feature suggestions, and improvements are welcome. Fork the repository, create a feature branch, and submit a pull request.

## 📜 License

Choose an appropriate open-source license for your project, such as the MIT License, before distributing the software.

---

**Built with Python, Computer Vision, and AI to make everyday environments more accessible.**
