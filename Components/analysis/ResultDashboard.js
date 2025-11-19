
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Share2, 
  Eye, 
  Clock,
  FileVideo,
  Brain,
  RotateCcw,
  ExternalLink,
  Play,
  FileText
} from "lucide-react";
import { createPageUrl } from "@/utils";

export default function ResultsDashboard({ analysisData, onNewAnalysis, videoUrl }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAllFrames, setShowAllFrames] = useState(false);
  const [sharingResults, setSharingResults] = useState(false);

  // Calculate accuracy based on actual analysis results
  const fakeFramesPercent = (analysisData.fake_frames_count / analysisData.total_frames) * 100;
  const isFakeVideo = fakeFramesPercent > 30; // More than 30% fake frames = fake video
  
  // Use consistent FPS from analysis data
  const frameRate = analysisData.frame_rate || 6;

  const handleExportPDF = () => {
    // Save the latest data to session storage for the report page to access
    sessionStorage.setItem(`analysisResult-${analysisData.id}`, JSON.stringify(analysisData));
    // Open the printable report page in a new tab
    const reportUrl = createPageUrl(`PDFReport?id=${analysisData.id}`);
    window.open(reportUrl, '_blank');
  };

  const handleShareResults = async () => {
    setSharingResults(true);
    
    try {
      const fakeFrames = analysisData.analysis_results.filter(frame => frame.is_fake);
      const detailedResults = `🛡️ DEEPFAKEVIGILANT DETAILED ANALYSIS RESULTS

📁 Video: ${analysisData.video_filename}
⏱️ Duration: ${analysisData.video_duration?.toFixed(2) || 'N/A'} seconds
📊 Result: ${isFakeVideo ? '🚨 DEEPFAKE DETECTED' : '✅ AUTHENTIC VIDEO'}
🎯 Confidence: ${analysisData.overall_fakeness_score}%

📈 DETAILED ANALYSIS:
• Total Frames: ${analysisData.total_frames} (at ${frameRate} FPS)
• Fake Frames: ${analysisData.fake_frames_count} (${fakeFramesPercent.toFixed(1)}%)
• Real Frames: ${analysisData.total_frames - analysisData.fake_frames_count} (${(100-fakeFramesPercent).toFixed(1)}%)
• Processing Time: ${analysisData.processing_time}s
• Frame Rate: ${frameRate} FPS

🤖 AI TECHNOLOGY:
• CNN-ELA-GAN Fusion + Semantic Consistency Check
• Model Accuracy: 99.2%
• Complete Video Processing: YES

${fakeFrames.length > 0 ? `
🚨 DETECTED MANIPULATED FRAMES:
${fakeFrames.slice(0, 10).map(frame => 
`• Frame ${frame.frame_number} (${frame.timestamp}s): ${frame.manipulation_type} - ${frame.confidence_score}% confidence`
).join('\n')}
${fakeFrames.length > 10 ? `... and ${fakeFrames.length - 10} more detected fake frames` : ''}
` : ''}

TECHNICAL DETAILS:
• CNN Model: ${analysisData.model_versions.cnn_model}
• ELA Model: ${analysisData.model_versions.ela_model}
• GAN Detection: ${analysisData.model_versions.gan_model}
• Semantic Model: ${analysisData.model_versions.semantic_model}

🔗 Analyze your videos: https://deepfakevigilant.base44.app

© 2025 NetzSpaz / DeepFakeVigilant
Advanced AI-powered deepfake detection with 99.2% accuracy`;

      const shareData = {
        title: `🛡️ DeepFakeVigilant Analysis - ${analysisData.video_filename}`,
        text: detailedResults,
        url: 'https://deepfakevigilant.base44.app'
      };

      // Try native share API first
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(detailedResults);
          alert(`📋 Detailed Analysis Results Copied!

✅ Complete analysis results copied to clipboard!

📱 Share on any platform:
• WhatsApp • Telegram • Facebook Messenger
• Instagram • LinkedIn • Twitter/X • Email
• Discord • Slack • Any messaging app

The detailed ${analysisData.total_frames}-frame analysis is included!`);
        } else {
          // Final fallback
          const textArea = document.createElement('textarea');
          textArea.value = detailedResults;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('📋 Detailed analysis results copied to clipboard!');
        }
      }
    } catch (error) {
      console.error("Share failed:", error);
      alert('Please try copying the results manually or check your browser permissions.');
    } finally {
      setSharingResults(false);
    }
  };

  const shareAppWithFriends = async () => {
    try {
      const appShareData = {
        title: '🛡️ DeepFakeVigilant - Professional AI Video Analysis',
        text: `🛡️ DeepFakeVigilant - Advanced AI Video Analysis

✅ 99.2% accuracy with CNN-ELA-GAN Fusion + Semantic Consistency Check
⚡ Complete video analysis at ${frameRate} FPS
🔒 Zero data retention policy
💯 Completely free to use
🎯 Real-time detailed results
🛡️ Professional-grade detection

Perfect for:
• Content creators & media verification
• Digital forensics & investigation
• Academic research & analysis
• Social media authenticity checks
• News and journalism fact-checking

Try professional video analysis: https://deepfakevigilant.base44.app

© 2025 NetzSpaz / DeepFakeVigilant
#DeepfakeDetection #AITechnology #MediaAuthenticity`,
        url: 'https://deepfakevigilant.base44.app'
      };

      if (navigator.share && navigator.canShare && navigator.canShare(appShareData)) {
        await navigator.share(appShareData);
      } else {
        const shareText = appShareData.text;
        
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareText);
          alert('🛡️ DeepFakeVigilant app info copied! Share with friends on any platform.');
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = shareText;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('App info copied! Share on your favorite platform.');
        }
      }
    } catch (err) {
      console.error("Share app failed:", err);
      alert('Visit https://deepfakevigilant.base44.app for professional AI deepfake detection!');
    }
  };

  const displayedFakeFrames = showAllFrames ? 
    analysisData.analysis_results.filter(frame => frame.is_fake) : 
    analysisData.analysis_results.filter(frame => frame.is_fake).slice(0, 15);
    
  const displayedAuthenticFrames = showAllFrames ?
    analysisData.analysis_results.filter(frame => !frame.is_fake) :
    analysisData.analysis_results.filter(frame => !frame.is_fake).slice(0, 12);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center floating-animation ${
            isFakeVideo ? 'bg-red-100' : 'bg-green-100'
          }`}>
            {isFakeVideo ? (
              <AlertTriangle className="w-10 h-10 text-red-600" />
            ) : (
              <CheckCircle className="w-10 h-10 text-green-600" />
            )}
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Video Analysis Results</h2>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 flex-wrap">
          <Badge className={`text-base sm:text-lg px-4 py-2 ${
            isFakeVideo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {isFakeVideo ? 'Deepfake Detected' : 'Authentic Video'}
          </Badge>
          <Badge variant="outline" className="text-base sm:text-lg px-4 py-2">
            {analysisData.overall_fakeness_score}% Confidence
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 text-sm px-3 py-1">
            {frameRate} FPS Analysis
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Button 
            onClick={handleExportPDF} 
            variant="outline"
            className="flex items-center gap-2 floating-animation w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            Export PDF Report
          </Button>
          
          <Button 
            onClick={handleShareResults}
            disabled={sharingResults}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 floating-animation w-full sm:w-auto"
          >
            <Share2 className={`w-4 h-4 ${sharingResults ? 'animate-spin' : ''}`} />
            {sharingResults ? 'Sharing...' : 'Share Complete Results'}
          </Button>
          
          <Button onClick={onNewAnalysis} variant="outline" className="floating-animation w-full sm:w-auto">
            <RotateCcw className="w-4 h-4 mr-2" />
            Analyze New Video
          </Button>
        </div>
      </div>

      {/* Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="frames">Frames</TabsTrigger>
          <TabsTrigger value="technical" className="hidden sm:inline-flex">Technical</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="floating-animation">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Overall Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {analysisData.overall_fakeness_score}%
                </div>
                <Progress 
                  value={analysisData.overall_fakeness_score} 
                  className={`h-2 ${isFakeVideo ? 'bg-red-100' : 'bg-green-100'}`}
                />
                <p className="text-sm text-gray-600 mt-2">
                  {isFakeVideo ? 'High probability of manipulation' : 'Appears authentic'}
                </p>
              </CardContent>
            </Card>

            <Card className="floating-animation">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Frame Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {analysisData.total_frames}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  @ {frameRate} FPS × {analysisData.video_duration?.toFixed(1) || (analysisData.total_frames / frameRate).toFixed(1)}s
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Fake: {analysisData.fake_frames_count}</span>
                  <span>Real: {analysisData.total_frames - analysisData.fake_frames_count}</span>
                </div>
                <Progress value={fakeFramesPercent} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="floating-animation">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {analysisData.processing_time}s
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{(analysisData.total_frames / analysisData.processing_time).toFixed(1)} FPS</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Complete analysis processed</p>
              </CardContent>
            </Card>

            <Card className="floating-animation">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Detection Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold text-gray-900 mb-2">
                  CNN-ELA-GAN Fusion
                </div>
                <div className="text-xs text-gray-600">
                  + Semantic Consistency Check
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs mt-2">
                  99.2% Accuracy
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Video Preview */}
          {videoUrl && (
            <Card className="floating-animation">
              <CardHeader>
                <CardTitle>Video Analysis Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center p-2 bg-gray-100 rounded-lg">
                  <video 
                    key={videoUrl}
                    src={videoUrl} 
                    controls 
                    className="max-w-full max-h-96 rounded-md shadow-lg"
                    style={{ maxHeight: '400px' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Analyzed at {frameRate} FPS • {analysisData.total_frames} frames • {analysisData.video_duration?.toFixed(1)}s duration
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="floating-animation">
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FileVideo className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{analysisData.video_filename}</div>
                      <div className="text-sm text-gray-600">
                        {analysisData.video_duration?.toFixed(1) || 'N/A'}s • {analysisData.total_frames} frames @ {frameRate} FPS
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">CNN-ELA-GAN Fusion</div>
                      <div className="text-sm text-gray-600">With Semantic Consistency Check</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{frameRate} FPS Analysis</div>
                      <div className="text-sm text-gray-600">Complete video processing</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-900">Privacy Protected</div>
                      <div className="text-sm text-gray-600">Zero data retention policy</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frames" className="space-y-6">
            <Card className="floating-animation">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Detected Fake Frames ({analysisData.fake_frames_count} total)
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Frames showing signs of manipulation detected at {frameRate} FPS analysis.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {displayedFakeFrames.map((frame, index) => (
                        <div key={`fake-${index}`} className="border rounded-lg p-3 bg-red-50 border-red-200 hover:shadow-md transition-all duration-200 hover:scale-105">
                            <div className="aspect-video bg-gray-200 rounded mb-2 overflow-hidden relative">
                                {videoUrl ? (
                                  <video
                                    src={videoUrl}
                                    className="w-full h-full object-cover"
                                    style={{ filter: 'contrast(1.1) saturate(0.9)' }}
                                    muted
                                    preload="metadata"
                                    onLoadedData={(e) => {
                                      e.target.currentTime = frame.frame_number / frameRate;
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                                    <FileVideo className="w-8 h-8 text-red-400" />
                                  </div>
                                )}
                                <div className="absolute top-1 right-1">
                                  <AlertTriangle className="w-4 h-4 text-red-600 bg-white rounded-full p-0.5" />
                                </div>
                                <div className="absolute bottom-1 left-1 right-1">
                                  <div className="bg-red-600 text-white text-xs px-1 py-0.5 rounded text-center">
                                    {frame.confidence_score}% Fake
                                  </div>
                                </div>
                            </div>
                            <div className="text-xs space-y-1">
                              <div className="font-medium">Frame #{frame.frame_number}</div>
                              <div className="text-gray-600 truncate" title={frame.manipulation_type}>
                                {frame.manipulation_type}
                              </div>
                              <div className="text-gray-500">@ {frame.timestamp}s</div>
                              {frame.manipulated_regions && frame.manipulated_regions.length > 0 && (
                                <div className="text-xs text-orange-600 truncate" title={frame.manipulated_regions.join(', ')}>
                                  {frame.manipulated_regions.join(', ')}
                                </div>
                              )}
                            </div>
                        </div>
                        ))}
                    </div>
                    {analysisData.fake_frames_count === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                        <p className="font-medium text-lg">✅ No Fake Frames Detected</p>
                        <p>This video appears to be completely authentic.</p>
                      </div>
                    )}
                </CardContent>
            </Card>

            <Card className="floating-animation">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Real Frames ({analysisData.total_frames - analysisData.fake_frames_count} total)
                    </CardTitle>
                    <p className="text-sm text-gray-600">Frames that appear authentic at {frameRate} FPS analysis.</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {displayedAuthenticFrames.map((frame, index) => (
                          <div key={`real-${index}`} className="border rounded-lg p-3 bg-green-50 border-green-200 hover:shadow-md transition-all duration-200 hover:scale-105">
                            <div className="aspect-video bg-gray-200 rounded mb-2 overflow-hidden relative">
                              {videoUrl ? (
                                <video
                                  src={videoUrl}
                                  className="w-full h-full object-cover"
                                  muted
                                  preload="metadata"
                                  onLoadedData={(e) => {
                                    e.target.currentTime = frame.frame_number / frameRate;
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                                  <FileVideo className="w-8 h-8 text-green-400" />
                                </div>
                              )}
                              <div className="absolute top-1 right-1">
                                <CheckCircle className="w-4 h-4 text-green-600 bg-white rounded-full" />
                              </div>
                              <div className="absolute bottom-1 left-1 right-1">
                                <div className="bg-green-600 text-white text-xs px-1 py-0.5 rounded text-center">
                                  {frame.confidence_score}% Real
                                </div>
                              </div>
                            </div>
                            <div className="text-xs space-y-1">
                              <div className="font-medium">Frame #{frame.frame_number}</div>
                              <div className="text-green-600 font-medium">Authentic Content</div>
                              <div className="text-gray-500">@ {frame.timestamp}s</div>
                            </div>
                          </div>
                        ))}
                    </div>
                     {analysisData.analysis_results.filter(f => !f.is_fake).length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                        <p className="font-medium text-lg">⚠️ No Authentic Frames Found</p>
                        <p>All frames show signs of manipulation.</p>
                      </div>
                    )}
                </CardContent>
            </Card>

            <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">
                Showing {displayedFakeFrames.length} of {analysisData.fake_frames_count} fake frames and {displayedAuthenticFrames.length} of {analysisData.total_frames - analysisData.fake_frames_count} authentic frames from {frameRate} FPS analysis.
                </p>
                {!showAllFrames && (analysisData.fake_frames_count > 15 || analysisData.analysis_results.filter(f => !f.is_fake).length > 12) && (
                <Button onClick={() => setShowAllFrames(true)} variant="outline" className="mr-2">
                    <Eye className="w-4 h-4 mr-2" />
                    Load All {analysisData.total_frames} Frames
                </Button>
                )}
                {showAllFrames && (
                <Button onClick={() => setShowAllFrames(false)} variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Show Sample Only
                </Button>
                )}
            </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <Card className="floating-animation">
            <CardHeader>
              <CardTitle>AI Model Versions & Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">CNN Model</span>
                    <Badge variant="outline">{analysisData.model_versions.cnn_model}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">ELA Model</span>
                    <Badge variant="outline">{analysisData.model_versions.ela_model}</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">GAN Detection</span>
                    <Badge variant="outline">{analysisData.model_versions.gan_model}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Semantic Consistency Check</span>
                    <Badge variant="outline">{analysisData.model_versions.semantic_model}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Processing Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Analysis Rate</div>
                    <div className="text-blue-700">{frameRate} FPS</div>
                  </div>
                  <div>
                    <div className="font-medium">Processing Speed</div>
                    <div className="text-blue-700">{(analysisData.total_frames / analysisData.processing_time).toFixed(1)} FPS</div>
                  </div>
                  <div>
                    <div className="font-medium">Model Accuracy</div>
                    <div className="text-blue-700">99.2%</div>
                  </div>
                  <div>
                    <div className="font-medium">Frames Processed</div>
                    <div className="text-blue-700">{analysisData.total_frames}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Share App */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none floating-animation">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Share DeepFakeVigilant with Friends</h3>
          <p className="text-gray-600 mb-6">
            Help others protect themselves from deepfakes with our advanced AI analysis technology.
          </p>
          <Button 
            onClick={shareAppWithFriends}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share App with Friends
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
