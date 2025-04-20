"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  Camera,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AlphabetItem = {
  letter: string;
  videoUrl: string;
  description: string;
  completed: boolean;
};

// Function to get Google Drive embed URL
function getDriveEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

// Google Drive file IDs for each alphabet letter (A-Z)
// Replace these with your actual Google Drive file IDs
const alphabetVideoIds = {
  A: "1oWoalUPRYmgT2S9fyXZii_nrPkMD5mVW",
  B: "13ARAoi33_YlOIHYSwYJgQWMVLM49LsQz",
  C: "1BD9tBugQz51nzTE49Q0iObAezA_WSpgE",
  D: "1VSN2VpbO2YAG4inyCk8nNx7rqzIfZWmG",
  E: "1CKUkqEGuAUxohXGYX_FWcy_ALA-lJn1e",
  F: "1sfyRschvDa1YpI9hRokFZ-hbMpccHCYH",
  G: "1Ct_pqH9OjHutx8mPICWfYYxk-mXauQyD",
  H: "1AJApTPb-7qrKd2QaRfH7yboU_oD8aEbY",
  I: "1p_XHTzMBeoGffeMgdapHqmDza8mnSL2Y",
  J: "1JyDdGaKKUeHXDajAyurBOwyrZkjs1CHN",
  K: "1NkQrq_iw3oZcp5sEnfu6oeWbjJsPdsSU",
  L: "1-h0A15vVnNmdowJz-oiFDYHiDEy_i-Lj",
  M: "1l5xeKr5ER6iHbR766vn8OVrEWELdYGBv",
  N: "1yTf2UArVKCmS1dqG1_l7QU6trTVVO9uY",
  O: "189Tw5hYeXyU4swOH2OlS5mF5vNC6frI-",
  P: "1vveGR3kl-5XWPH3HepDKAW29l1JuVnQw",
  Q: "17RnN-k4vsqEznggsnd3_M8NVgbOF0cSm",
  R: "1oyxjH6g-YMiuEuw2fDjMHVyMNOV4WU6p",
  S: "1viFPbnhfy_Olij5shLZSAWuC_TKp3veh",
  T: "1XqjCnSgOVOwc6-qzf0w2kxl1A73PKyaX",
  U: "1gxrBtiZ1i4o_YdvtY-AhAm2JNBHBiuoA",
  V: "19ER68MnS568D0NAISLGPhAp4xRqXqi56",
  W: "18I2HDgcmmnmQojqirZ4y4QH0uxLo0byn",
  X: "1wrvWnNMlc6nDCp1NazLu0fDxZX9yCkyM",
  Y: "15CgDLm89vWi53hbm8DM_jdJ8O0_BaaLA",
  Z: "1cmuMh8E8zUywBHYeXjddE1G91uyg6wWx",
};

// Create alphabet items array with Google Drive video URLs
const alphabetItems: AlphabetItem[] = Array.from({ length: 26 }, (_, i) => {
  const letter = String.fromCharCode(65 + i); // A-Z
  return {
    letter,
    videoUrl: getDriveEmbedUrl(
      alphabetVideoIds[letter as keyof typeof alphabetVideoIds]
    ),
    description: `Hand sign for letter ${letter}`,
    completed: i < 3, // First few are completed for demo purposes
  };
});

export default function AlphabetTutorial() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const currentItem = alphabetItems[currentIndex];

  // Handle video loading
  const handleVideoLoad = () => {
    setVideoLoading(false);
  };

  // Handle video error
  const handleVideoError = () => {
    console.error(`Error loading video for letter ${currentItem.letter}`);
    setVideoLoading(false);
  };

  // Reset video loading state when changing letters
  useEffect(() => {
    setVideoLoading(true);
  }, [currentIndex]);

  // Start camera
  const startCamera = async () => {
    try {
      // Reset any previous errors
      setCameraError(null);

      // Request access to the user's camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      // Store stream reference for cleanup
      streamRef.current = stream;

      // Set video source to the camera stream
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
        cameraRef.current.play();
      }

      setCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError("Could not access camera. Please check permissions.");
      setCameraActive(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Clear video element
    if (cameraRef.current) {
      cameraRef.current.srcObject = null;
    }

    setCameraActive(false);
    setAccuracy(null);
    setShowSuccess(false);
    setCountdown(null);
  };

  // Toggle camera
  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Clean up camera on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Simulate gesture recognition
  const startRecognition = () => {
    if (!cameraActive) return;

    setRecognizing(true);
    setCountdown(3);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          simulateRecognitionProcess();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  // Simulate the recognition process
  const simulateRecognitionProcess = () => {
    // Simulate processing time
    setTimeout(() => {
      // Generate random accuracy between 50-100 for demo
      const simulatedAccuracy = Math.floor(Math.random() * 51) + 50;
      setAccuracy(simulatedAccuracy);
      setRecognizing(false);

      // If accuracy is above threshold, mark as successful
      if (simulatedAccuracy >= 80) {
        setShowSuccess(true);

        // Auto-advance after success shown for a while
        setTimeout(() => {
          if (currentIndex < alphabetItems.length - 1) {
            alphabetItems[currentIndex].completed = true;
            goToNextItem();
          } else {
            // Complete the level if all items are done
            alphabetItems[currentIndex].completed = true;
            // Here you would update progress in database
            router.push("/tutorial/levels");
          }
        }, 2000);
      }
    }, 2000);
  };

  const goToPreviousItem = () => {
    if (currentIndex > 0) {
      resetState();
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNextItem = () => {
    if (currentIndex < alphabetItems.length - 1) {
      resetState();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const resetState = () => {
    stopCamera();
    setAccuracy(null);
    setShowSuccess(false);
    setRecognizing(false);
    setCountdown(null);
  };

  // Calculate progress percentage
  const progressPercentage =
    (alphabetItems.filter((item) => item.completed).length /
      alphabetItems.length) *
    100;

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Header with back button */}
      <header className="p-4 flex items-center justify-between border-b border-white/10">
        <button
          onClick={() => router.push("/level")}
          className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Levels</span>
        </button>
        <div className="text-sm font-medium text-white/70">
          Beginner Level: Alphabets
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-white/70 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Alphabet navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {alphabetItems.map((item, idx) => (
              <button
                key={item.letter}
                onClick={() => {
                  resetState();
                  setCurrentIndex(idx);
                }}
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-all",
                  currentIndex === idx
                    ? "bg-white text-[#030303]"
                    : item.completed
                    ? "bg-green-500/20 text-green-500"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                )}
              >
                {item.letter}
              </button>
            ))}
          </div>
        </div>

        {/* Current alphabet content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Tutorial video section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-xl font-semibold">
                    Tutorial: Letter {currentItem.letter}
                  </h2>
                </div>
                <button className="flex items-center space-x-1 text-sm text-white/70 hover:text-white">
                  <Volume2 className="h-4 w-4" />
                  <span>Audio</span>
                </button>
              </div>
            </div>

            <div className="aspect-video bg-black/40 relative flex items-center justify-center">
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Loader2 className="h-8 w-8 text-white/70 animate-spin" />
                </div>
              )}

              {/* Google Drive embedded iframe for video */}
              <iframe
                src={currentItem.videoUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`Letter ${currentItem.letter} tutorial`}
                onLoad={handleVideoLoad}
                onError={handleVideoError}
              />
            </div>

            <div className="p-4">
              <p className="text-white/70">{currentItem.description}</p>
              <div className="mt-4 flex items-center space-x-2 text-sm text-white/60">
                <div className="bg-white/10 px-2 py-1 rounded">Tips</div>
                <p>
                  Watch the finger positions carefully and practice the motion
                </p>
              </div>
            </div>
          </motion.div>

          {/* Practice section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 flex flex-col"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-rose-400" />
                <h2 className="text-xl font-semibold">
                  Practice: Letter {currentItem.letter}
                </h2>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="aspect-video bg-black/40 relative">
                {cameraActive ? (
                  <>
                    {/* Actual camera feed video element */}
                    <video
                      ref={cameraRef}
                      className="absolute inset-0 h-full w-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />

                    {/* Recognition UI overlays */}
                    {recognizing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        {countdown ? (
                          <div className="text-6xl font-bold text-white">
                            {countdown}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Loader2 className="h-12 w-12 text-white animate-spin mb-2" />
                            <p className="text-white">
                              Analyzing your gesture...
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {showSuccess && (
                      <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
                          <p className="text-white text-xl font-bold">
                            Great job!
                          </p>
                        </div>
                      </div>
                    )}

                    {accuracy !== null && !showSuccess && (
                      <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <XCircle className="h-16 w-16 text-red-500 mb-2" />
                          <p className="text-white text-xl font-bold">
                            Try again
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {cameraError ? (
                      <div className="text-center p-4">
                        <XCircle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                        <p className="text-rose-300 mb-2">{cameraError}</p>
                        <button
                          onClick={startCamera}
                          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={toggleCamera}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <Camera className="h-5 w-5" />
                        <span>Start Camera</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 flex-1">
                {cameraActive && accuracy !== null && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Accuracy</span>
                      <span
                        className={
                          accuracy >= 80 ? "text-green-500" : "text-rose-500"
                        }
                      >
                        {accuracy}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          accuracy >= 80 ? "bg-green-500" : "bg-rose-500"
                        )}
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                    {accuracy < 80 && (
                      <p className="text-sm text-white/70 mt-2">
                        Try to match your hand position more closely with the
                        tutorial.
                      </p>
                    )}
                  </div>
                )}

                <div className="flex space-x-3">
                  {cameraActive && !recognizing && !showSuccess && (
                    <button
                      onClick={startRecognition}
                      className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                      Recognize Gesture
                    </button>
                  )}

                  {cameraActive && (
                    <button
                      onClick={toggleCamera}
                      className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Stop Camera
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation controls */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={goToPreviousItem}
            disabled={currentIndex === 0}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
              currentIndex === 0
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Previous</span>
          </button>

          <button
            onClick={goToNextItem}
            disabled={currentIndex === alphabetItems.length - 1}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
              currentIndex === alphabetItems.length - 1
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            <span>Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
