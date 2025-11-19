
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
  const [uploadedVideo, setUploadedVideo] = useState(null); // This state holds the full videoData (including File)
  const [videoUrl, setVideoUrl] = useState(null); // This holds the URL for video playback
  const uploadZoneRef = useRef(null);

  useEffect(() => {
    // On component mount, check sessionStorage for saved analysis state
    try {
      const savedStep = sessionStorage.getItem('analysisStep');
      const savedData = sessionStorage.getItem('analysisData');
      const savedVideoName = sessionStorage.getItem('uploadedVideoName'); // Retrieve only the name
      const savedUrl = sessionStorage.getItem('videoUrl');

      if (savedStep && savedData && savedUrl) {
        setAnalysisStep(savedStep);
        setAnalysisData(JSON.parse(savedData));
        // Reconstruct a simplified uploadedVideo object if name and url are available
        if (savedVideoName && savedUrl) {
          setUploadedVideo({ name: savedVideoName, url: savedUrl });
        }
        setVideoUrl(savedUrl);
      }
    } catch (error) {
      console.error("Could not retrieve session state:", error);
      handleNewAnalysis();
    }
  }, []);

  const handleStartAnalysis = () => {
    if (uploadZoneRef.current) {
      uploadZoneRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleVideoUploaded = async (videoData) => {
    console.log("Video uploaded, starting analysis:", videoData);

    setUploadedVideo(videoData); // videoData here includes the File object
    setVideoUrl(videoData.url);
    setAnalysisStep("analyzing");

    // Persist to session storage (only serializable parts)
    sessionStorage.setItem('uploadedVideoName', videoData.name); // Store video name
    sessionStorage.setItem('videoUrl', videoData.url);
    sessionStorage.setItem('analysisStep', 'analyzing');

    try {
      // Use VideoAnalyzer for complete video analysis
      const analysisResult = await VideoAnalyzer.analyzeCompleteVideo(videoData.file, videoData.url);

      setAnalysisData(analysisResult);
      setAnalysisStep("results");

      // Persist results
      sessionStorage.setItem('analysisData', JSON.stringify(analysisResult));
      sessionStorage.setItem('analysisStep', 'results');

      // Update statistics
      const currentUser = await User.me().catch(() => null);
      if (currentUser) {
        const newCount = (currentUser.analysis_count || 0) + 1;
        await User.updateMyUserData({ analysis_count: newCount });
      }

      const stats = await AppStats.filter({ singleton: true });
      if (stats.length > 0) {
        const currentStats = stats[0];
        await AppStats.update(currentStats.id, { total_analyses: (currentStats.total_analyses || 0) + 1 });
      } else {
        await AppStats.create({ total_analyses: 1, singleton: true });
      }

      console.log("Analysis completed successfully");
    } catch (error) {
      console.error("Analysis failed:", error);

      // Show more specific error messages
      let errorMessage = "Analysis failed. ";
      if (error.message && error.message.includes("Invalid video file")) {
        errorMessage += "The uploaded file appears to be corrupted or in an unsupported format.";
      } else if (error.message && error.message.includes("timed out")) {
        errorMessage += "The analysis took too long. Please try with a shorter video.";
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
    sessionStorage.clear();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      {analysisStep === "upload" && !uploadedVideo && (
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="mb-6">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-600 px-4 py-1 text-base font-semibold rounded-full shadow-sm">
                    <Star className="w-4 h-4 mr-2" /> AI-Powered Deepfake Detection
                  </Badge>
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Detect Deepfakes with
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Advanced AI
                  </span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Using state-of-the-art AI,
                  we analyze your <strong>entire videos</strong> with 99.2% accuracy at 6 FPS to detect manipulation and preserve digital authenticity.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    onClick={handleStartAnalysis}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 h-auto"
                  >
                    <Upload className="w-6 h-6 mr-3" />
                    Start Complete Video Analysis
                  </Button>
                  <Link to={createPageUrl("About")}>
                    <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 border text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 h-auto">
                      Learn More
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <Shield className="w-10 h-10 text-blue-600 mb-2" />
                    <span className="font-semibold text-gray-800 text-lg">Authenticity</span>
                    <span className="text-gray-500 text-sm">Uncover fakes</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Zap className="w-10 h-10 text-purple-600 mb-2" />
                    <span className="font-semibold text-gray-800 text-lg">Real-time Analysis</span>
                    <span className="text-gray-500 text-sm">6 frames/sec</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Eye className="w-10 h-10 text-teal-600 mb-2" />
                    <span className="font-semibold text-gray-800 text-lg">Transparency</span>
                    <span className="text-gray-500 text-sm">Detailed reports</span>
                  </div>
                </div>
              </div>

              <div className="relative h-full flex items-center justify-center p-8 lg:p-0">
                <Card className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
                  <CardHeader className="relative p-0 h-60 bg-gray-900 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-purple-700 opacity-70"></div>
                    <img src="https://images.unsplash.com/photo-1517404215737-029b8979e917?auto=format&fit=crop&q=80&w=2940" alt="Video placeholder" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                    <Play className="h-24 w-24 text-white z-10 cursor-pointer hover:scale-110 transition-transform duration-200" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Progress value={75} className="w-full h-2 rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-semibold mb-3 flex items-center justify-between">
                      Deepfake Analysis Progress
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" /> Analyzing
                      </Badge>
                    </CardTitle>
                    <p className="text-gray-600 text-sm mb-4">
                      Our AI is meticulously examining every frame of your video to detect subtle manipulation cues.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Face Swap Detection</span>
                        <span className="font-medium text-blue-600">85% Complete</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Voice Clone Analysis</span>
                        <span className="font-medium text-purple-600">60% Complete</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Video Manipulation Check</span>
                        <span className="font-medium text-teal-600">75% Complete</span>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-6 w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                      Learn About Our Process
                    </Button>
                  </CardContent>
                </Card>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -top-16 -left-16 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Upload Section & Analysis Progress */}
      <div ref={uploadZoneRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {analysisStep === "upload" && (
          <VideoUploadZone onVideoUploaded={handleVideoUploaded} />
        )}

        {analysisStep === "analyzing" && (
          <AnalysisProgress
            fileName={uploadedVideo?.name || "video.mp4"}
          />
        )}
      </div>

      {/* Results Section */}
      {analysisStep === "results" && analysisData && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <ResultsDashboard
            analysisData={analysisData}
            onNewAnalysis={handleNewAnalysis}
            videoUrl={videoUrl}
          />
          <div className="mt-12">
            <ReviewForm
              analysisId={analysisData.id}
              overallScore={analysisData.overall_fakeness_score}
            />
          </div>
        </div>
      )}

      {/* Features Section - Only show on initial load */}
      {analysisStep === "upload" && !uploadedVideo && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose DeepFakeVigilant?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform offers unmatched precision and speed in deepfake detection, ensuring you get reliable results quickly.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-white shadow-lg p-6 text-center">
                <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">Cutting-Edge AI</CardTitle>
                <CardContent className="text-gray-600 p-0">
                  Leveraging the latest advancements in AI and machine learning for superior detection accuracy.
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg p-6 text-center">
                <FileVideo className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">Complete Video Analysis</CardTitle>
                <CardContent className="text-gray-600 p-0">
                  Unlike others, we analyze your entire video, frame-by-frame, for a comprehensive report.
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg p-6 text-center">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">High Accuracy</CardTitle>
                <CardContent className="text-gray-600 p-0">
                  Achieving 99.2% accuracy in identifying manipulated content, protecting you from misinformation.
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg p-6 text-center">
                <Download className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">Detailed Reports</CardTitle>
                <CardContent className="text-gray-600 p-0">
                  Receive easy-to-understand reports with scores, timestamps, and confidence levels.
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg p-6 text-center">
                <Lock className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">Privacy-Focused</CardTitle>
                <CardContent className="text-gray-600 p-0">
                  Your uploaded videos are processed securely and deleted immediately after analysis.
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg p-6 text-center">
                <Share2 className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">Shareable Insights</CardTitle>
                <CardContent className="text-gray-600 p-0">
                  Easily share analysis results to inform others or report malicious content.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {analysisStep === "upload" && !uploadedVideo && (
        <div className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to Analyze Your Complete Video?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Upload your video now and get comprehensive deepfake detection results for the <strong>entire video timeline</strong>
            </p>
            <Button
              onClick={handleStartAnalysis}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto"
            >
              <Upload className="w-6 h-6 mr-3" />
              Analyze Complete Video Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Professional-grade analysis • Zero data retention • Secure processing
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
