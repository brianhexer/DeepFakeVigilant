
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Eye,
  Zap,
  Lock,
  CheckCircle,
  Loader2,
  FileVideo,
  Shield,
  Activity,
  Cpu,
  Sparkles
} from "lucide-react";

const analysisSteps = [
  {
    id: "preprocessing",
    title: "Video Processing",
    description: "Extracting frames at 6 FPS for comprehensive analysis",
    icon: FileVideo,
    weight: 0.25, // Added weight
  },
  {
    id: "cnn",
    title: "CNN Analysis",
    description: "Analyzing pixel-level inconsistencies across all frames",
    icon: Brain,
    weight: 0.3, // Added weight
  },
  {
    id: "ela",
    title: "ELA Detection",
    description: "Scanning compression artifacts throughout video",
    icon: Eye,
    weight: 0.2, // Added weight
  },
  {
    id: "gan",
    title: "GAN Detection",
    description: "Identifying synthetic patterns across video sequence",
    icon: Zap,
    weight: 0.15, // Added weight
  },
  {
    id: "semantic",
    title: "Semantic Consistency Check",
    description: "Verifying logical consistency throughout video",
    icon: Lock,
    weight: 0.1, // Added weight
  }
];

const VideoScanVisual = ({ progress, totalFrames }) => {
  const scanPosition = `${progress}%`;
  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-blue-800 shadow-lg">
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <FileVideo className="w-16 h-16 text-blue-500 opacity-30" />
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-cyan-400/80 shadow-[0_0_10px_2px] shadow-cyan-400"
        style={{ left: scanPosition, transition: 'left 0.1s linear' }}
      ></div>
      <div className="absolute top-2 left-3 text-cyan-400 text-xs font-mono">SCANNING...</div>
      <div className="absolute bottom-2 right-3 text-cyan-400 text-xs font-mono">FRAME: {Math.floor((progress / 100) * totalFrames)}</div>
       <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(0, 150, 255, 0.3) 1px, transparent 1px), linear-gradient(to right, rgba(0, 150, 255, 0.3) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};


export default function AnalysisProgress({ videoData, processingTime }) { // Added processingTime prop
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [estimatedFrames, setEstimatedFrames] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [processingFrames, setProcessingFrames] = useState(0);

  useEffect(() => {
    if (videoData?.duration) {
      setEstimatedFrames(Math.ceil(videoData.duration * 6));
    }
  }, [videoData]);

  useEffect(() => {
    if (!processingTime || processingTime <= 0) return; // Ensure processingTime is valid

    const totalDurationMs = processingTime * 1000;
    let currentOverallProgress = 0; // Represents 0-100% of total time
    let activeStepIndex = 0; // Internal tracker for which step is logically active within this effect's closure

    // 1. Overall Progress and Frame Processing Update
    const progressInterval = setInterval(() => {
      // Update overall progress based on processingTime, e.g., 100% over 'processingTime' seconds
      currentOverallProgress = Math.min(100, currentOverallProgress + (100 / (processingTime * 10))); // (100 / total_seconds) * 0.1s update interval
      setProgress(currentOverallProgress);

      // Simulate frame processing specifically for the "Video Processing" step (index 0)
      if (activeStepIndex === 0 && estimatedFrames > 0) {
        // Calculate the progress point (0-100%) at which the first step completes its weighted share
        const firstStepWeight = analysisSteps[0].weight;
        const firstStepEndOverallProgress = firstStepWeight * 100;
        // Determine the progress specific to the first step (0-100% for frames)
        const progressWithinFirstStep = Math.min(100, (currentOverallProgress / firstStepEndOverallProgress) * 100);
        setProcessingFrames(Math.floor((progressWithinFirstStep / 100) * estimatedFrames));
      }

      // If overall progress hits 100, clear this interval and ensure final step status
      if (currentOverallProgress >= 100) {
        clearInterval(progressInterval);
        setCurrentStep(analysisSteps.length); // Mark all steps as logically complete for UI
        activeStepIndex = analysisSteps.length;
      }
    }, 100); // Update progress every 100ms

    // 2. Step Advancement Logic
    let cumulativeDelayMs = 0;
    const stepTimeouts = [];
    analysisSteps.forEach((step, index) => {
      const stepDurationMs = totalDurationMs * step.weight;
      const timeoutId = setTimeout(() => {
        setCurrentStep(index); // Update React state for current step for UI changes
        activeStepIndex = index; // Update internal tracker
      }, cumulativeDelayMs); // Set timeout for when this step *should begin*

      stepTimeouts.push(timeoutId);
      cumulativeDelayMs += stepDurationMs;
    });

    // 3. Animation Phase (remains unchanged)
    const animationInterval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 800);

    // Cleanup function
    return () => {
      clearInterval(progressInterval);
      clearInterval(animationInterval);
      stepTimeouts.forEach(clearTimeout);
    };
  }, [processingTime, estimatedFrames]); // Dependencies: only external props that should trigger re-run.

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
      <div className="text-center">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6">
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white relative z-10" />
            {/* Animated scanning effect */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20 animate-scan"
                   style={{animation: 'scan 2s linear infinite'}}></div>
            </div>
            {/* Pulsing rings */}
            <div className={`absolute inset-0 rounded-2xl border-4 border-blue-400 ${animationPhase === 0 ? 'opacity-75' : 'opacity-0'}`}
                 style={{animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'}}></div>
            <div className={`absolute inset-0 rounded-2xl border-4 border-purple-400 ${animationPhase === 1 ? 'opacity-75' : 'opacity-0'}`}
                 style={{animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '0.3s'}}></div>
          </div>
          {/* Orbiting particles */}
          <div className="absolute inset-0">
            <Sparkles className={`absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 text-blue-500 ${animationPhase % 2 === 0 ? 'opacity-100' : 'opacity-30'} transition-opacity`} />
            <Sparkles className={`absolute -bottom-2 -left-2 w-4 h-4 sm:w-5 sm:h-5 text-purple-500 ${animationPhase % 2 === 1 ? 'opacity-100' : 'opacity-30'} transition-opacity`} />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 px-4">Analyzing Video with Advanced AI</h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Processing your video at 6 FPS using CNN-ELA-GAN Fusion with Semantic Consistency Check.
          Analysis typically takes {processingTime ? `${processingTime} seconds` : '30-60 seconds'}.
        </p>

        <div className="mt-4 flex justify-center items-center gap-2 text-xs sm:text-sm text-gray-500 px-4">
          <FileVideo className="w-4 h-4" />
          <span>Processing {estimatedFrames} frames</span>
          {currentStep === 0 && estimatedFrames > 0 && (
            <Badge className="bg-blue-100 text-blue-800 text-xs animate-pulse ml-2">
              {processingFrames}/{estimatedFrames} frames
            </Badge>
          )}
          <Activity className={`w-4 h-4 ml-2 ${animationPhase % 2 === 0 ? 'text-blue-600' : 'text-purple-600'} transition-colors`} />
        </div>
      </div>

      <Card className="border-none shadow-xl floating-animation">
        <CardContent className="p-4 sm:p-8">
          <div className="space-y-6">
            <VideoScanVisual progress={progress} totalFrames={estimatedFrames} />
            {/* Video Info */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileVideo className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">{videoData?.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {videoData?.size && `${(videoData.size / 1024 / 1024).toFixed(1)} MB`} • Complete Video Analysis
                  </p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800 text-xs sm:text-sm">
                <Cpu className="w-3 h-3 mr-1 animate-pulse" />
                6 FPS
              </Badge>
            </div>

            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-medium">Analysis Progress</span>
                <span className="font-bold text-blue-600">{Math.round(progress)}%</span>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-3 sm:h-4" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-1 w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Frame-by-frame detection • 99.2% accuracy
              </p>
            </div>

            {/* Analysis Steps */}
            <div className="space-y-3 sm:space-y-4">
              {analysisSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;
                const isPending = index > currentStep;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg transition-all duration-500 transform ${
                      isActive ? 'bg-blue-50 border border-blue-200 scale-105 shadow-md' :
                      isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-all duration-500 relative flex-shrink-0 ${
                      isCompleted ? 'bg-green-100 scale-110' :
                      isActive ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 animate-bounce" />
                      ) : isActive ? (
                        <>
                          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 animate-spin" />
                          <div className="absolute -bottom-1 -right-1">
                            <div className={`w-2 h-2 bg-blue-600 rounded-full animate-pulse ${animationPhase === index ? 'opacity-100' : 'opacity-50'}`}></div>
                          </div>
                        </>
                      ) : (
                        <StepIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm sm:text-base transition-colors truncate ${
                        isActive ? 'text-blue-900' :
                        isCompleted ? 'text-green-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h4>
                      <p className={`text-xs sm:text-sm transition-colors truncate ${
                        isActive ? 'text-blue-600' :
                        isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                      {isActive && (
                        <div className="mt-2">
                          <div className="h-1 bg-blue-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full"
                                 style={{
                                   width: '100%',
                                   animation: `loadbar ${processingTime * step.weight}s linear forwards`
                                 }}></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-800 text-xs animate-bounce">✓ Done</Badge>
                      )}
                      {isActive && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Processing
                        </Badge>
                      )}
                      {isPending && (
                        <Badge variant="outline" className="text-xs">Pending</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Models Info */}
            <div className="pt-4 sm:pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">AI Models Processing Your Video</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
                {[
                  { name: "CNN v2.1", type: "Neural Network", color: "blue" },
                  { name: "ELA v1.8", type: "Error Analysis", color: "purple" },
                  { name: "GAN v3.2", type: "Synthetic Detection", color: "green" },
                  { name: "Semantic v1.5", type: "Consistency", color: "amber" }
                ].map((model, index) => (
                  <div key={model.name} className={`p-2 sm:p-3 bg-gray-50 rounded-lg transition-all duration-500 hover:bg-${model.color}-50 ${
                    currentStep >= index ? `animate-pulse bg-${model.color}-50` : ''
                  }`}>
                    <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{model.name}</div>
                    <div className="text-[10px] sm:text-xs text-gray-600 truncate">{model.type}</div>
                    {currentStep >= index && (
                      <div className={`w-2 h-2 bg-${model.color}-500 rounded-full mx-auto mt-1 animate-pulse`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-xs sm:text-sm text-gray-500 pt-4 border-t">
              <p className={`transition-colors ${animationPhase % 2 === 0 ? 'text-blue-600' : 'text-purple-600'}`}>
                🛡️ Your video is being processed securely with zero data retention
              </p>
              <p className="mt-1">© 2025 NetzSpaz / DeepFakeVigilant</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes loadbar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
