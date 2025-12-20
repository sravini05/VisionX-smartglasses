import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import * as faceapi from '@vladmandic/face-api';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs"; // IMPORTANT: Initializes TensorFlow backend

const VoiceOperatedCamera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Say 'start camera' or use the buttons");
  const [expression, setExpression] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cocoModel, setCocoModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const lastSpokenExpression = useRef("");

  // Load face-api.js + COCO-SSD models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        const loadedCoco = await cocoSsd.load();
        setCocoModel(loadedCoco);
        setModelsLoaded(true);
        console.log("✅ All models loaded");
      } catch (err) {
        console.error("❌ Model load error:", err);
      }
    };
    loadModels();
  }, []);

  // Voice Commands
  useEffect(() => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("🎙 Voice Command:", command);
      if (command.includes("start camera")) startCamera();
      else if (command.includes("stop camera")) stopCamera();
    };

    recognition.start();
    return () => recognition.stop();
  }, []);

  const speakExpression = (text: string) => {
    if (text !== lastSpokenExpression.current) {
      const utterance = new SpeechSynthesisUtterance(`You look ${text}`);
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      lastSpokenExpression.current = text;
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraOn(true);
        setStatusMessage("Camera started");
        detectLoop();
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setStatusMessage("Camera stopped");
    setExpression("");
    lastSpokenExpression.current = "";
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const detectLoop = () => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const displaySize = { width: video.videoWidth, height: video.videoHeight };

    faceapi.matchDimensions(canvas, displaySize);

    const detect = async () => {
      if (!modelsLoaded || !cocoModel || video.paused || video.ended) return;

      // Face detection
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceExpressions();
      const resized = faceapi.resizeResults(detections, displaySize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resized);
      faceapi.draw.drawFaceLandmarks(canvas, resized);
      faceapi.draw.drawFaceExpressions(canvas, resized);

      if (resized.length > 0) {
        const expressionsObj = resized[0].expressions;
        const maxExpression = Object.keys(expressionsObj).reduce((a, b) =>
          (expressionsObj[a as keyof typeof expressionsObj] ?? 0) >
          (expressionsObj[b as keyof typeof expressionsObj] ?? 0)
            ? a
            : b
        );
        const confidence = (
          (Number(expressionsObj[maxExpression as keyof typeof expressionsObj]) || 0) * 100
        ).toFixed(2);

        setExpression(`${maxExpression} (${confidence}%)`);
        speakExpression(maxExpression);
        const box = resized[0].detection.box;
        ctx.fillStyle = "blue";
        ctx.font = "16px Arial";
        ctx.fillText(`${maxExpression} (${confidence}%)`, box.x, box.y - 10);
      } else {
        setExpression("No face detected");
        lastSpokenExpression.current = "";
      }

      // Object detection
      const predictions = await cocoModel.detect(video);
      predictions.forEach((pred) => {
        ctx.beginPath();
        ctx.rect(...pred.bbox);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "lime";
        ctx.stroke();
        ctx.fillStyle = "lime";
        ctx.font = "14px Arial";
        ctx.fillText(`${pred.class} (${Math.round(pred.score * 100)}%)`, pred.bbox[0], pred.bbox[1] - 5);
      });

      requestAnimationFrame(detect);
    };

    detect();
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🎥 Voice Operated Camera with Face & Object Detection</h2>
      <p>{modelsLoaded ? statusMessage : "Loading models..."}</p>
      <p>
        Status:{" "}
        <strong style={{ color: isCameraOn ? "green" : "red" }}>
          {isCameraOn ? "Camera ON" : "Camera OFF"}
        </strong>
      </p>

      <div style={{ position: "relative", width: "640px", height: "480px" }}>
  <video
    ref={videoRef}
    width="640"
    height="480"
    muted
    autoPlay
    playsInline
    style={{
      position: "absolute",
      zIndex: 0, // Set to 0 to go under canvas
      objectFit: "cover",
      backgroundColor: "black",
      borderRadius: "8px"
    }}
  />
  <canvas
    ref={canvasRef}
    width="640"
    height="480"
    style={{
      position: "absolute",
      zIndex: 1,
      pointerEvents: "none",
    }}
  />
</div>

      {expression && (
        <p>
          Expression: <strong>{expression}</strong>
        </p>
      )}

      <div style={{ marginTop: "10px" }}>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={stopCamera} style={{ marginLeft: "10px" }}>
          Stop Camera
        </button>
      </div>
    </div>
  );
};

export default VoiceOperatedCamera;