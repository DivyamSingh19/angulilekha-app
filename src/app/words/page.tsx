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
  Grid,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryItem = {
  term: string;
  videoUrl: string;
  description: string;
  completed: boolean;
  category: string;
};

// Function to get Google Drive embed URL
function getDriveEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

// Categories and their items
const categories = [
  {
    name: "Colors",
    items: [
      "Black",
      "Blue",
      "Brown",
      "Green",
      "Pink",
      "Red",
      "White",
      "Yellow",
    ],
  },
  {
    name: "Days",
    items: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  {
    name: "Numbers",
    items: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "100",
      "1000",
    ],
  },
];

// Map of actual Google Drive file IDs
// Replace these placeholder IDs with your actual Google Drive file IDs
const driveVideoIds = {
  // Colors
  "Colors-Black": "1ds9OLcN3jSpZHznysfG9fip5s2CUB0lt",
  "Colors-Blue": "1-sE5la5okQ2M476PNj2f13I8hFQCa15-",
  "Colors-Brown": "1aXvEQ8PJBEIktgSROSa8A0v0PqTqNYi8",
  "Colors-Green": "1y20AuCR0eKpy1lGznLApNsL_ue_tLofb",
  "Colors-Pink": "1FidGk310RdkQT-xZ4B5KdGoi0e47XyLG",
  "Colors-Red": "1QlUQVxhoSYOfo6SAwDw8uK5TPcu4kheV",
  "Colors-White": "1Y0L3DF2jQP5roSpC3V8rWba_KCt7fQav",
  "Colors-Yellow": "1tHQI15gtQbPDOCV6jFwyq_ISb9mWXI1n",

  // Days
  "Days-Monday": "1_Xj4d10BsLXBl3vTU3jUTZ0LDuUJks8v",
  "Days-Tuesday": "1aaIjBx4qJHCVIDANBOm5HC3OFQSlMuG_",
  "Days-Wednesday": "1S6TzvwiG_dvVBfOae8XkxyaU0y8mG1Y3",
  "Days-Thursday": "1PJ5YOvW8vYVxR25nWg-HV-CmCKVUcVFS",
  "Days-Friday": "1DZz_nMjb_TBjEuUvFaaQjNtNLpA_vusK",
  "Days-Saturday": "13ceMA5LRSF9RFluU0DrszinIsZKX2Alk",
  "Days-Sunday": "1EtcXKXvg1WclH9XK0f0hZJ2aXa3ZCja4",

  // Numbers
  "Numbers-1": "10FjarQLvfIhK5JSjIu1uKQuO6anKLQ2V",
  "Numbers-2": "19-U3H6TACRrktGSIW0r1acRVueG-qdTG",
  "Numbers-3": "1q_4dx4qI-QPA_v8j9ELGdkQLU4Gx96nX",
  "Numbers-4": "12qFD25iTiyAvtjDNu_KzwjHUlIcHZEWA",
  "Numbers-5": "1aYK3aCOIhYY7oAHb_i--tlpXaGuLjNd8",
  "Numbers-6": "1B9C4HMQMD8z6dd_waZRpK4O1q-XDlUZc",
  "Numbers-7": "1P0PtVFEC192NWOP-w9XNjPL_G_gRLGpO",
  "Numbers-8": "11CiV2T9cPnMFLWd9h7N_3p63fQPHaQl9",
  "Numbers-9": "1w98bTtY0Z3w5Q4fLTYDnoGNA1NvdWxDC",
  "Numbers-10": "1Y6Rwc8zsxgfSdwE8NzJykbF1AcHnqpgi",
  "Numbers-11": "13jHLhL5rQSl8PJmIo6bxBtnuR8XC_LFy",
  "Numbers-12": "1AWKHyATRG89B6lPv44xYNPqOC00AiXX9",
  "Numbers-13": "1bS0u8itJ7yxpCjWyST89jL4rEqyVB7AO",
  "Numbers-14": "1t4vS4hBz43d8hoL8dMj8Eqsss0bGY8Ny",
  "Numbers-15": "1YZUyApfeo7I3bC4EkmWDl6p5leiTkW_1",
  "Numbers-100": "1K3uYk9UI4yuIcDdVhnomYu-EsRGFaK2t",
  "Numbers-1000": "1O8r3MyNTR1odLt2kJ3oEpvBEQ_iAPGfw",
};

// Function to get the actual Drive ID from the mapping
function getVideoId(category: string, term: string): string {
  const key = `${category}-${term}`;
  // Use the mapped ID if available, otherwise fallback to a default ID
  return driveVideoIds[key] || "DEFAULT_FALLBACK_ID"; // Replace DEFAULT_FALLBACK_ID with a valid ID
}

// Create category items array with Google Drive video URLs
const categoryItems: CategoryItem[] = [];
categories.forEach((category) => {
  category.items.forEach((item, index) => {
    categoryItems.push({
      term: item,
      videoUrl: getDriveEmbedUrl(getVideoId(category.name, item)),
      description: `Hand sign for "${item}" (${category.name})`,
      completed: index < 2, // First few items in each category are completed for demo
      category: category.name,
    });
  });
});

export default function CategoryTutorial() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(categories[0].name);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);

  // Filter items by active category
  const currentCategoryItems = categoryItems.filter(
    (item) => item.category === activeCategory
  );
  const currentItem = currentCategoryItems[currentIndex];

  // Update current index when category changes
  useEffect(() => {
    setCurrentIndex(0);
    resetState();
  }, [activeCategory]);

  // Handle video loading
  const handleVideoLoad = () => {
    setVideoLoading(false);
  };

  // Handle video error
  const handleVideoError = () => {
    console.error(`Error loading video for "${currentItem.term}"`);
    setVideoLoading(false);
  };

  // Reset video loading state when changing items
  useEffect(() => {
    setVideoLoading(true);
  }, [currentIndex, activeCategory]);

  // Simulate camera activation
  const toggleCamera = () => {
    setCameraActive(!cameraActive);
    setAccuracy(null);
    setShowSuccess(false);
    setCountdown(null);
  };

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
          if (currentIndex < currentCategoryItems.length - 1) {
            // Mark current item as completed
            const itemIndex = categoryItems.findIndex(
              (item) =>
                item.category === activeCategory &&
                item.term === currentCategoryItems[currentIndex].term
            );
            if (itemIndex !== -1) {
              categoryItems[itemIndex].completed = true;
            }
            goToNextItem();
          } else {
            // Mark current item as completed
            const itemIndex = categoryItems.findIndex(
              (item) =>
                item.category === activeCategory &&
                item.term === currentCategoryItems[currentIndex].term
            );
            if (itemIndex !== -1) {
              categoryItems[itemIndex].completed = true;
            }
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
    if (currentIndex < currentCategoryItems.length - 1) {
      resetState();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const resetState = () => {
    setCameraActive(false);
    setAccuracy(null);
    setShowSuccess(false);
    setRecognizing(false);
    setCountdown(null);
  };

  // Calculate progress percentage for current category
  const progressPercentage =
    (currentCategoryItems.filter((item) => item.completed).length /
      currentCategoryItems.length) *
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
          Advanced Level: Basic Concepts
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Category selector */}
        <div className="mb-6 relative">
          <button
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            className="flex items-center justify-between w-full md:w-64 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/15 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Grid className="h-5 w-5 text-indigo-400" />
              <span>{activeCategory}</span>
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 transition-transform",
                categoryDropdownOpen ? "transform rotate-180" : ""
              )}
            />
          </button>

          {categoryDropdownOpen && (
            <div className="absolute mt-1 w-full md:w-64 bg-[#121212] border border-white/10 rounded-lg shadow-lg z-10">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => {
                    setActiveCategory(category.name);
                    setCategoryDropdownOpen(false);
                  }}
                  className={cn(
                    "block w-full text-left px-4 py-2 hover:bg-white/10 transition-colors",
                    activeCategory === category.name &&
                      "bg-white/5 text-indigo-400"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-white/70 mb-2">
            <span>{activeCategory} Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Item navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex flex-wrap gap-2 pb-2">
            {currentCategoryItems.map((item, idx) => (
              <button
                key={item.term}
                onClick={() => {
                  resetState();
                  setCurrentIndex(idx);
                }}
                className={cn(
                  "px-3 py-2 rounded-lg flex items-center justify-center font-medium transition-all",
                  currentIndex === idx
                    ? "bg-white text-[#030303]"
                    : item.completed
                    ? "bg-green-500/20 text-green-500"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                )}
              >
                {item.term}
              </button>
            ))}
          </div>
        </div>

        {/* Current item content */}
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
                    Tutorial: "{currentItem?.term}"
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
                src={currentItem?.videoUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${activeCategory} - ${currentItem?.term} tutorial`}
                onLoad={handleVideoLoad}
                onError={handleVideoError}
              />
            </div>

            <div className="p-4">
              <p className="text-white/70">{currentItem?.description}</p>
              <div className="mt-4 flex items-center space-x-2 text-sm text-white/60">
                <div className="bg-white/10 px-2 py-1 rounded">Tips</div>
                <p>
                  {activeCategory === "Numbers"
                    ? "For numbers, note the specific finger positions and how they change between values."
                    : activeCategory === "Colors"
                    ? "Color signs often relate to distinctive features of the color or objects associated with it."
                    : "Day signs follow a weekly pattern. Notice the relationship between consecutive days."}
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
                  Practice: "{currentItem?.term}"
                </h2>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="aspect-video bg-black/40 relative">
                {cameraActive ? (
                  <>
                    {/* This would be your actual camera feed */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src="/api/placeholder/400/320"
                        alt="Camera feed"
                        className="max-h-full max-w-full"
                      />
                    </div>

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
                    <button
                      onClick={toggleCamera}
                      className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Camera className="h-5 w-5" />
                      <span>Start Camera</span>
                    </button>
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
                        {activeCategory === "Numbers"
                          ? "Check your finger positioning and count. Numbers require precise hand shapes."
                          : "Try to match the motion and hand position more closely with the tutorial."}
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
            disabled={currentIndex === currentCategoryItems.length - 1}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
              currentIndex === currentCategoryItems.length - 1
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
