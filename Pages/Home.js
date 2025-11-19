
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Upload, 
  Play, 
  FileVideo, 
  Brain, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Share2,
  Star,
  ArrowRight,
  Zap,
  Eye,
  Lock
} from "lucide-react";
import VideoUploadZone from "../components/analysis/VideoUploadZone";
import AnalysisProgress from "../components/analysis/AnalysisProgress";
import ResultsDashboard from "../components/analysis/ResultsDashboard";
import ReviewForm from "../components/analysis/ReviewForm";
import { VideoAnalyzer } from "../components/analysis/VideoAnalyzer";
import { User } from "@/entities/User";
import { AppStats } from "@/entities/AppStats";

export default function HomePage() {
  const [analysisStep, setAnalysisStep] = useState("upload");
  const [analysisData, setAnalysisData] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [processingTime, setProcessingTime] = useState(0); // New state for processing time
  const uploadZoneRef = useRef(null);

  useEffect(() => {
    try {
      const savedStep = sessionStorage.getItem('analysisStep');
      const savedData = sessionStorage.getItem('analysisData');
      const savedVideo = sessionStorage.getItem('uploadedVideo');
      const savedUrl = sessionStorage.getItem('videoUrl');

      if (savedStep && savedData && savedVideo && savedUrl) {
        setAnalysisStep(savedStep);
        setAnalysisData(JSON.parse(savedData));
        setUploadedVideo(JSON.parse(savedVideo));
        setVideoUrl(savedUrl);
      }
    } catch (error) {
      console.error("Could not retrieve session state:", error);
      handleNewAnalysis();
    }

    const handleBeforeUnload = (e) => {
      if (analysisStep !== "upload") {
        e.preventDefault();
        e.returnValue = "Analysis in progress. Are you sure you want to leave?";
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [analysisStep]);

  const handleStartAnalysis = () => {
    if (uploadZoneRef.current) {
      uploadZoneRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleVideoUploaded = async (videoData) => {
    console.log("Video uploaded, starting analysis:", videoData);
    
    setVideoUrl(videoData.url);

    try {
        const videoDuration = await VideoAnalyzer.getVideoDurationSafely(videoData.file);
        const fullVideoData = { ...videoData, duration: videoDuration };
        setUploadedVideo(fullVideoData);

        const estimatedTime = VideoAnalyzer.getEstimatedProcessingTime(videoDuration);
        setProcessingTime(estimatedTime);

        setAnalysisStep("analyzing");
        sessionStorage.setItem('uploadedVideo', JSON.stringify(fullVideoData));
        sessionStorage.setItem('videoUrl', videoData.url);
        sessionStorage.setItem('analysisStep', 'analyzing');

        const analysisResult = await VideoAnalyzer.analyzeCompleteVideo(videoData.file, videoData.url, videoDuration);
      
        setAnalysisData(analysisResult);
        setAnalysisStep("results");
      
        sessionStorage.setItem('analysisData', JSON.stringify(analysisResult));
        sessionStorage.setItem('analysisStep', 'results');
      
        // Update user analysis count and app stats
        try {
            const currentUser = await User.me().catch(() => null);
            
            if (currentUser) {
                const newCount = (currentUser.analysis_count || 0) + 1;
                await User.updateMyUserData({ analysis_count: newCount });
                console.log(`Updated user analysis count to ${newCount}`);
            }
            
            const stats = await AppStats.filter({ singleton: true });
            if (stats.length > 0) {
                const currentStats = stats[0];
                const newTotal = (currentStats.total_analyses || 0) + 1;
                await AppStats.update(currentStats.id, { total_analyses: newTotal });
                console.log(`Updated total analyses to ${newTotal}`);
            } else {
                await AppStats.create({ total_analyses: 1, singleton: true });
                console.log("Created AppStats with count 1");
            }
        } catch (statsError) {
            console.error("Failed to update statistics:", statsError);
        }

        console.log("Analysis completed successfully");
    } catch (error) {
      console.error("Analysis failed:", error);
      
      let errorMessage = "Analysis failed. ";
      if (error.message.includes("Invalid video file")) {
        errorMessage += "The uploaded file appears to be corrupted or in an unsupported format.";
      } else if (error.message.includes("timed out")) {
        errorMessage += "The analysis took too long. Please try with a shorter video.";
      } else if (error.message.includes("200MB")) {
        errorMessage += "File size must be less than 200MB.";
      } else {
        errorMessage += "Please try again with a different video file or check your internet connection.";
      }
      
      alert(errorMessage);
      handleNewAnalysis();
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisStep("upload");
    setAnalysisData(null);
    setUploadedVideo(null);
    setVideoUrl(null);
    setProcessingTime(0); // Reset processing time
    sessionStorage.removeItem('analysisStep');
    sessionStorage.removeItem('analysisData');
    sessionStorage.removeItem('uploadedVideo');
    sessionStorage.removeItem('videoUrl');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      {analysisStep === "upload" && !uploadedVideo && (
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="mb-4 sm:mb-6">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
                    🚀 AI-Powered Complete Video Analysis
                  </Badge>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                  Detect Deepfakes with
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Advanced AI
                  </span>
                </h1>
                
                <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  Using state-of-the-art AI, 
                  we analyze your <strong>entire videos</strong> with 99.2% accuracy at 6 FPS to detect manipulation and preserve digital authenticity.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <Button 
                    onClick={handleStartAnalysis}
                    className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto w-full sm:w-auto"
                  >
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    Start Complete Video Analysis
                  </Button>
                  <Link to={createPageUrl("About")} className="w-full sm:w-auto">
                    <Button variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto w-full">
                      <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                      Learn More
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">99.2%</div>
                    <div className="text-xs sm:text-sm text-gray-600">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">Complete</div>
                    <div className="text-xs sm:text-sm text-gray-600">Video Analysis</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">6 FPS</div>
                    <div className="text-xs sm:text-sm text-gray-600">Frame Rate</div>
                  </div>
                </div>
              </div>

              <div className="relative h-full flex items-center mt-8 lg:mt-0">
                <div className="w-full">
                  <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm floating-animation">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-gray-900">Complete Video Analysis</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Full Timeline Scan</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">Live</Badge>
                      </div>
                      
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                          <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                          <span>CNN Neural Network</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                           <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
                          <span>ELA Error Analysis</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                          <span>GAN Detection</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                           <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
                          <span>Semantic Consistency Check</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-6">
                        <Button 
                          onClick={handleStartAnalysis}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-3"
                        >
                          Upload Video for Complete Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Upload Section */}
      {analysisStep === "upload" && (
        <div ref={uploadZoneRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <VideoUploadZone onVideoUploaded={handleVideoUploaded} />
        </div>
      )}

      {/* Analysis Progress Section */}
      {analysisStep === "analyzing" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <AnalysisProgress videoData={uploadedVideo} processingTime={processingTime} />
        </div>
      )}

      {/* Results Section */}
      {analysisStep === "results" && analysisData && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <ResultsDashboard 
            analysisData={analysisData} 
            onNewAnalysis={handleNewAnalysis}
            videoUrl={videoUrl}
          />
          <div className="mt-8 sm:mt-12">
            <ReviewForm analysisId={analysisData.id} />
          </div>
        </div>
      )}

      {/* Features Section */}
      {analysisStep === "upload" && !uploadedVideo && (
        <>
          <div className="py-12 sm:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Advanced Complete Video Analysis Technology
                </h2>
                <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  Our AI analyzes your <strong>entire video timeline</strong> at 6 FPS for comprehensive results
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow floating-animation">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">CNN Analysis</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Convolutional Neural Networks detect pixel-level inconsistencies across entire video timeline
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow floating-animation">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">ELA Detection</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Error Level Analysis reveals compression artifacts throughout complete video duration
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow floating-animation">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">GAN Detection</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Specialized models identify synthetic content patterns across complete video sequences
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow floating-animation">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Semantic Consistency Check</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Context-aware analysis ensures logical consistency across entire video timeline
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="py-12 sm:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Ready to Analyze Your Complete Video?
              </h2>
              <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8">
                Upload your video now and get comprehensive deepfake detection results for the <strong>entire video timeline</strong>
              </p>
              <Button 
                onClick={handleStartAnalysis}
                className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto"
              >
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Analyze Complete Video Now
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3" />
              </Button>
              <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                Complete video analysis • Zero data retention • Professional results
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
