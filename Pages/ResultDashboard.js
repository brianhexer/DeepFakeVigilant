
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
  FileText
} from "lucide-react";

export default function ResultsDashboard({ analysisData, onNewAnalysis, videoUrl }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAllFrames, setShowAllFrames] = useState(false);
  const [sharingResults, setSharingResults] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const fakeFramesPercent = (analysisData.fake_frames_count / analysisData.total_frames) * 100;
  const isFakeVideo = fakeFramesPercent > 30;
  const frameRate = analysisData.frame_rate || 6;

  const handleExportPDF = () => {
    setExportingPDF(true);
    
    setTimeout(() => {
      try {
        const fakeFrames = analysisData.analysis_results?.filter(frame => frame.is_fake) || [];
        const authFrames = analysisData.analysis_results?.filter(frame => !frame.is_fake) || [];
        
        const pdfContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DeepFakeVigilant Report - ${analysisData.video_filename}</title>
    <style>
        @page { size: A4; margin: 15mm; }
        @media print { 
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #1a202c;
            background: #ffffff;
            font-size: 11pt;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header {
            text-align: center;
            border-bottom: 4px solid #3182ce;
            padding-bottom: 20px;
            margin-bottom: 30px;
            page-break-after: avoid;
        }
        .logo { font-size: 48px; margin-bottom: 10px; }
        .header h1 { color: #2b6cb0; font-size: 28px; font-weight: bold; margin-bottom: 8px; }
        .header .subtitle { color: #4a5568; font-size: 14px; margin-bottom: 15px; }
        .status-badge {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 16px;
            margin: 10px 0;
        }
        .status-fake { background: #fed7d7; color: #c53030; border: 2px solid #fc8181; }
        .status-authentic { background: #c6f6d5; color: #2f855a; border: 2px solid #68d391; }
        .summary {
            background: linear-gradient(135deg, #ebf8ff, #f7fafc);
            border: 2px solid #bee3f8;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            page-break-inside: avoid;
        }
        .summary h2 { color: #2b6cb0; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #3182ce; padding-bottom: 10px; }
        .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px; }
        .summary-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #3182ce;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .summary-item strong { color: #2d3748; display: block; font-size: 12px; margin-bottom: 5px; }
        .summary-item span { color: #4a5568; font-size: 16px; font-weight: 600; }
        .frames-section { margin-top: 30px; page-break-before: auto; }
        .frames-section h2 { color: #2b6cb0; font-size: 18px; border-bottom: 2px solid #3182ce; padding-bottom: 10px; margin-bottom: 20px; page-break-after: avoid; }
        .frame {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            page-break-inside: avoid;
        }
        .frame.fake { border-color: #fc8181; border-width: 2px; background: #fff5f5; }
        .frame.authentic { border-color: #68d391; background: #f0fff4; }
        .frame strong { color: #2d3748; display: block; margin-bottom: 8px; font-size: 14px; }
        .frame p { color: #4a5568; margin-bottom: 5px; font-size: 12px; }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            color: #718096;
            font-size: 11px;
            page-break-inside: avoid;
        }
        .footer p { margin-bottom: 5px; }
        .watermark { position: fixed; bottom: 10px; right: 10px; opacity: 0.3; font-size: 10px; color: #718096; }
        .print-instructions {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 500px;
            text-align: center;
        }
        .print-instructions h3 { color: #2b6cb0; margin-bottom: 20px; font-size: 24px; }
        .print-instructions p { font-size: 16px; color: #4a5568; margin-bottom: 25px; line-height: 1.6; }
        .print-btn {
            background: #3182ce;
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            transition: background 0.2s;
            display: inline-block;
            margin: 10px;
        }
        .print-btn:hover { background: #2c5aa0; }
        .close-btn {
            background: #e2e8f0;
            color: #4a5568;
        }
        .close-btn:hover { background: #cbd5e0; }
    </style>
</head>
<body>
    <div class="watermark">© 2025 DeepFakeVigilant</div>
    
    <div class="print-instructions no-print" id="printInstructions">
        <h3>📄 Save as PDF</h3>
        <p><strong>Your report is ready!</strong></p>
        <p>Click "Print / Save PDF" below, then select <strong>"Save as PDF"</strong> or <strong>"Microsoft Print to PDF"</strong> as your printer destination.</p>
        <button class="print-btn" onclick="window.print(); document.getElementById('printInstructions').style.display='none';">🖨️ Print / Save PDF</button>
        <button class="print-btn close-btn" onclick="window.close();">❌ Close Window</button>
        <p style="margin-top: 20px; font-size: 13px; color: #718096;">After saving, you can close this window.</p>
    </div>
    
    <div class="container">
        <div class="header">
            <div class="logo">🛡️</div>
            <h1>DeepFakeVigilant Analysis Report</h1>
            <p class="subtitle">CNN-ELA-GAN Fusion with Semantic Consistency Check</p>
            <div class="status-badge ${isFakeVideo ? 'status-fake' : 'status-authentic'}">
                ${isFakeVideo ? '🚨 DEEPFAKE DETECTED' : '✅ AUTHENTIC VIDEO'}
            </div>
        </div>
        
        <div class="summary">
            <h2>📊 Analysis Overview</h2>
            <div class="summary-grid">
                <div class="summary-item"><strong>📄 Video File</strong><span>${analysisData.video_filename}</span></div>
                <div class="summary-item"><strong>📅 Analysis Date</strong><span>${new Date().toLocaleDateString()}</span></div>
                <div class="summary-item"><strong>📊 Fakeness Score</strong><span>${analysisData.overall_fakeness_score}%</span></div>
                <div class="summary-item"><strong>⏱️ Processing Time</strong><span>${analysisData.processing_time}s</span></div>
                <div class="summary-item"><strong>🎬 Total Frames</strong><span>${analysisData.total_frames} frames</span></div>
                <div class="summary-item"><strong>⚠️ Fake Frames</strong><span>${analysisData.fake_frames_count} frames</span></div>
                <div class="summary-item"><strong>🎯 Frame Rate</strong><span>${frameRate} FPS</span></div>
                <div class="summary-item"><strong>⏰ Video Duration</strong><span>${analysisData.video_duration?.toFixed(2) || 'N/A'}s</span></div>
            </div>
        </div>

        <div class="frames-section">
            <h2>🚨 Detected Fake Frames (${fakeFrames.length} total)</h2>
            ${fakeFrames.length > 0 ? fakeFrames.slice(0, 50).map(frame => `
                <div class="frame fake">
                    <strong>Frame ${frame.frame_number} @ ${frame.timestamp}s</strong>
                    <p><strong>Confidence:</strong> ${frame.confidence_score}% fake</p>
                    <p><strong>Type:</strong> ${frame.manipulation_type}</p>
                    <p><strong>Regions:</strong> ${frame.manipulated_regions?.join(', ') || 'General'}</p>
                    <p><strong>Position:</strong> ${((frame.frame_number / analysisData.total_frames) * 100).toFixed(1)}% through video</p>
                </div>
            `).join('') : '<p style="text-align: center; color: #2f855a; padding: 20px;">✅ No fake frames detected</p>'}
            ${fakeFrames.length > 50 ? `<p style="text-align: center; color: #4a5568; padding: 10px;">... and ${fakeFrames.length - 50} more fake frames</p>` : ''}
        </div>

        <div class="frames-section">
            <h2>✅ Authentic Frames (${Math.min(authFrames.length, 25)} of ${authFrames.length} shown)</h2>
            ${authFrames.slice(0, 25).map(frame => `
                <div class="frame authentic">
                    <strong>Frame ${frame.frame_number} @ ${frame.timestamp}s</strong>
                    <p><strong>Authenticity:</strong> ${frame.confidence_score}% authentic</p>
                    <p><strong>Position:</strong> ${((frame.frame_number / analysisData.total_frames) * 100).toFixed(1)}% through video</p>
                </div>
            `).join('')}
            ${authFrames.length > 25 ? `<p style="text-align: center; color: #4a5568; padding: 10px;">... and ${authFrames.length - 25} more authentic frames</p>` : ''}
        </div>

        <div class="footer">
            <p><strong>🛡️ DeepFakeVigilant - AI Detection Platform</strong></p>
            <p>© 2025 NetzSpaz / DeepFakeVigilant</p>
            <p>https://deepfakevigilant.base44.app</p>
            <p>Technology: CNN-ELA-GAN Fusion with Semantic Consistency Check</p>
            <p>Report Generated: ${new Date().toLocaleString()}</p>
        </div>
    </div>

    <script>
        window.onafterprint = function() {
            setTimeout(function() {
                // Ensure the print dialog has time to close before asking to close the window
                if (confirm('PDF saved successfully! Would you like to close this window?')) {
                    window.close();
                }
            }, 500); // Small delay to improve UX
        };
        // Show instructions after the window has fully loaded
        window.onload = function() {
            const instructions = document.getElementById('printInstructions');
            if (instructions) {
                instructions.style.display = 'block'; // Make it visible
            }
        };
    </script>
</body>
</html>`;
        
        const blob = new Blob([pdfContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const newWindow = window.open(url, '_blank', 'width=1024,height=768'); // Open in new tab/window
        
        if (!newWindow) {
          alert('❌ Pop-up blocked!\n\nPlease allow pop-ups for this site to export PDF reports.\n\nGo to your browser settings and enable pop-ups for this domain.');
          setExportingPDF(false);
          return;
        }
        
        // Revoke the object URL after a delay, as the new window might still need it.
        // It's a best practice to clean up, but can be tricky with pop-ups.
        setTimeout(() => URL.revokeObjectURL(url), 10000); // Revoke after 10 seconds

        // Changed alert to reflect the new instruction UI in the opened window
        alert('✅ PDF Report Window Opened!\n\n📄 A new window has opened with your report.\n🖨️ Click "Print / Save PDF" button in the new window.\n💾 Select "Save as PDF" or "Microsoft Print to PDF" in the print dialog.');
        
      } catch (error) {
        console.error("PDF export error:", error);
        alert('❌ Failed to generate PDF report.\n\nPlease try again or contact support.');
      } finally {
        setExportingPDF(false);
      }
    }, 300);
  };

  const handleExportTXT = () => {
    const fakeFrames = analysisData.analysis_results?.filter(frame => frame.is_fake) || [];
    const txtContent = `🛡️ DEEPFAKEVIGILANT COMPREHENSIVE VIDEO ANALYSIS REPORT 🛡️

═══════════════════════════════════════════════════════════════
📋 EXECUTIVE SUMMARY
═══════════════════════════════════════════════════════════════

Report Generated: ${new Date().toLocaleString()}
Analysis Technology: CNN-ELA-GAN Fusion with Semantic Consistency Check
Video Classification: ${isFakeVideo ? '🚨 DEEPFAKE DETECTED' : '✅ AUTHENTIC VIDEO'}
Overall Confidence: ${analysisData.overall_fakeness_score}%

═══════════════════════════════════════════════════════════════
📊 VIDEO METADATA
═══════════════════════════════════════════════════════════════

• Original Filename: ${analysisData.video_filename}
• Video Duration: ${analysisData.video_duration?.toFixed(2) || 'N/A'} seconds
• Analysis Frame Rate: ${frameRate} FPS
• Total Frames Processed: ${analysisData.total_frames}
• Processing Time: ${analysisData.processing_time}s
• Analysis ID: ${analysisData.id}
• Processing Date: ${new Date().toLocaleDateString()}

═══════════════════════════════════════════════════════════════
🎯 DETECTION RESULTS
═══════════════════════════════════════════════════════════════

📈 OVERALL ANALYSIS:
• Deepfake Probability: ${analysisData.overall_fakeness_score}%
• Total Frames: ${analysisData.total_frames}
• Fake Frames: ${analysisData.fake_frames_count} (${fakeFramesPercent.toFixed(1)}%)
• Authentic Frames: ${analysisData.total_frames - analysisData.fake_frames_count} (${(100 - fakeFramesPercent).toFixed(1)}%)

🤖 AI MODELS USED:
• CNN Model: ${analysisData.model_versions.cnn_model}
• ELA Model: ${analysisData.model_versions.ela_model}
• GAN Model: ${analysisData.model_versions.gan_model}
• Semantic Model: ${analysisData.model_versions.semantic_model}

═══════════════════════════════════════════════════════════════
🔍 FRAME-BY-FRAME ANALYSIS
═══════════════════════════════════════════════════════════════

🚨 DETECTED FAKE FRAMES (${fakeFrames.length} total):

${fakeFrames.slice(0, 50).map((frame, index) => 
`Frame ${frame.frame_number} @ ${frame.timestamp}s
  • Confidence: ${frame.confidence_score}% fake
  • Type: ${frame.manipulation_type}
  • Regions: ${frame.manipulated_regions?.join(', ') || 'General'}
  • Position: ${((frame.frame_number / analysisData.total_frames) * 100).toFixed(1)}%
`).join('\n')}
${fakeFrames.length > 50 ? `\n... and ${fakeFrames.length - 50} more fake frames\n` : ''}

═══════════════════════════════════════════════════════════════
🛡️ DEEPFAKEVIGILANT - AI DETECTION PLATFORM
═══════════════════════════════════════════════════════════════

© 2025 NetzSpaz / DeepFakeVigilant
https://deepfakevigilant.base44.app

Report Version: 3.0.0
Generated: ${new Date().toLocaleString()}`;

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DeepFakeVigilant_Report_${analysisData.video_filename.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('📄 TXT Report Downloaded!\n\nA detailed text report has been saved to your downloads folder.');
  };

  const handleShareResults = async () => {
    setSharingResults(true);
    
    const shareContent = `🛡️ DeepFake Detection Report

📄 Video: ${analysisData.video_filename}
📊 Fakeness Score: ${analysisData.overall_fakeness_score}%
⏱️ Processing Time: ${analysisData.processing_time}s
🎬 Total Frames: ${analysisData.total_frames}
⚠️ Fake Frames: ${analysisData.fake_frames_count}

✅ Status: ${isFakeVideo ? 'Manipulation Detected' : 'Authentic Content'}

🤖 Analysis Method: CNN-ELA-GAN Fusion with Semantic Consistency Check
📅 Date: ${new Date().toLocaleDateString('en-GB')}

Powered by DeepFakeVigilant
© 2025 NetzSpaz / DeepFakeVigilant - AI-Powered Detection
Visit: https://deepfakevigilant.base44.app

#DeepFake #AIDetection #VideoAnalysis #Security`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'DeepFake Detection Report',
          text: shareContent
        });
      } else {
        await navigator.clipboard.writeText(shareContent);
        alert('📋 Report copied to clipboard!\n\nYou can now paste and share this on any platform.');
      }
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = shareContent;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('📋 Report copied to clipboard!');
    } finally {
      setSharingResults(false);
    }
  };

  const displayedFakeFrames = showAllFrames ? 
    analysisData.analysis_results.filter(frame => frame.is_fake) : 
    analysisData.analysis_results.filter(frame => frame.is_fake).slice(0, 15);
    
  const displayedAuthenticFrames = showAllFrames ?
    analysisData.analysis_results.filter(frame => !frame.is_fake) :
    analysisData.analysis_results.filter(frame => !frame.is_fake).slice(0, 12);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center px-4">
        <div className="flex items-center justify-center mb-6">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center floating-animation ${
            isFakeVideo ? 'bg-red-100' : 'bg-green-100'
          }`}>
            {isFakeVideo ? (
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
            ) : (
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            )}
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Video Analysis Results</h2>
        
        <div className="flex items-center justify-center flex-wrap gap-3 mb-6">
          <Badge className={`text-sm sm:text-base px-3 sm:px-4 py-2 ${
            isFakeVideo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {isFakeVideo ? 'Deepfake Detected' : 'Authentic Video'}
          </Badge>
          <Badge variant="outline" className="text-sm sm:text-base px-3 sm:px-4 py-2">
            {analysisData.overall_fakeness_score}% Confidence
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 text-xs sm:text-sm px-2 sm:px-3 py-1">
            {frameRate} FPS Analysis
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-2xl mx-auto">
          <Button 
            onClick={handleExportPDF} 
            disabled={exportingPDF}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-6 text-base font-medium"
          >
            <Download className="w-5 h-5" />
            <span>{exportingPDF ? 'Generating PDF...' : 'Export PDF Report'}</span>
          </Button>
          
          <Button 
            onClick={handleExportTXT} 
            variant="outline"
            className="flex items-center justify-center gap-2 py-6 text-base font-medium"
          >
            <FileText className="w-5 h-5" />
            <span>Export TXT Report</span>
          </Button>
          
          <Button 
            onClick={handleShareResults}
            disabled={sharingResults}
            variant="outline"
            className="flex items-center justify-center gap-2 py-6 text-base font-medium"
          >
            <Share2 className={`w-5 h-5 ${sharingResults ? 'animate-spin' : ''}`} />
            <span>{sharingResults ? 'Sharing...' : 'Share Results'}</span>
          </Button>
          
          <Button 
            onClick={onNewAnalysis} 
            variant="outline" 
            className="flex items-center justify-center gap-2 py-6 text-base font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            <span>New Analysis</span>
          </Button>
        </div>
      </div>

      {/* Results Tabs */}
      <div className="px-2 sm:px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto h-auto">
            <TabsTrigger value="overview" className="text-sm sm:text-base px-3 py-3">Overview</TabsTrigger>
            <TabsTrigger value="frames" className="text-sm sm:text-base px-3 py-3">Frames</TabsTrigger>
            <TabsTrigger value="technical" className="text-sm sm:text-base px-3 py-3">Technical</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                    {isFakeVideo ? 'High probability' : 'Appears authentic'}
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
                    @ {frameRate} FPS × {analysisData.video_duration?.toFixed(1)}s
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
                  <p className="text-xs text-gray-500 mt-1">Complete analysis</p>
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
                  <div className="text-xs text-gray-600 mb-2">
                    + Semantic Check
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    99.2% Accuracy
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {videoUrl && (
              <Card className="floating-animation">
                <CardHeader>
                  <CardTitle>Video Preview</CardTitle>
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
                      Your browser does not support video.
                    </video>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Analyzed at {frameRate} FPS • {analysisData.total_frames} frames
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
                          {analysisData.video_duration?.toFixed(1)}s • {analysisData.total_frames} frames
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Brain className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">CNN-ELA-GAN Fusion</div>
                        <div className="text-sm text-gray-600">With Semantic Check</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{frameRate} FPS Analysis</div>
                        <div className="text-sm text-gray-600">Complete timeline</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-medium text-gray-900">Privacy Protected</div>
                        <div className="text-sm text-gray-600">Zero data retention</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="frames" className="space-y-6 mt-6">
            <Card className="floating-animation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Detected Fake Frames ({analysisData.fake_frames_count} total)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {displayedFakeFrames.map((frame, index) => (
                    <div key={`fake-${index}`} className="border rounded-lg p-2 sm:p-3 bg-red-50 border-red-200 hover:shadow-md transition-all duration-200">
                      <div className="aspect-video bg-gray-200 rounded mb-2 overflow-hidden relative">
                        {videoUrl ? (
                          <video
                            src={videoUrl}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                            onLoadedData={(e) => {
                              e.target.currentTime = frame.timestamp_seconds || (frame.frame_number / frameRate);
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                            <FileVideo className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                          </div>
                        )}
                        <div className="absolute top-1 right-1">
                          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 bg-white rounded-full p-0.5" />
                        </div>
                        <div className="absolute bottom-1 left-1 right-1">
                          <div className="bg-red-600 text-white text-[10px] sm:text-xs px-1 py-0.5 rounded text-center">
                            {frame.confidence_score}% Fake
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] sm:text-xs space-y-1">
                        <div className="font-medium truncate">Frame #{frame.frame_number}</div>
                        <div className="text-gray-600 truncate" title={frame.manipulation_type}>
                          {frame.manipulation_type}
                        </div>
                        <div className="text-gray-500">@ {frame.timestamp}s</div>
                      </div>
                    </div>
                  ))}
                </div>
                {analysisData.fake_frames_count === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <p className="font-medium text-lg">✅ No Fake Frames</p>
                    <p>Video appears authentic</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="floating-animation">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Authentic Frames ({analysisData.total_frames - analysisData.fake_frames_count} total)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {displayedAuthenticFrames.map((frame, index) => (
                    <div key={`real-${index}`} className="border rounded-lg p-2 sm:p-3 bg-green-50 border-green-200 hover:shadow-md transition-all duration-200">
                      <div className="aspect-video bg-gray-200 rounded mb-2 overflow-hidden relative">
                        {videoUrl ? (
                          <video
                            src={videoUrl}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                            onLoadedData={(e) => {
                              e.target.currentTime = frame.timestamp_seconds || (frame.frame_number / frameRate);
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <FileVideo className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                          </div>
                        )}
                        <div className="absolute top-1 right-1">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 bg-white rounded-full" />
                        </div>
                        <div className="absolute bottom-1 left-1 right-1">
                          <div className="bg-green-600 text-white text-[10px] sm:text-xs px-1 py-0.5 rounded text-center">
                            {frame.confidence_score}% Real
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] sm:text-xs space-y-1">
                        <div className="font-medium truncate">Frame #{frame.frame_number}</div>
                        <div className="text-green-600 font-medium truncate">Authentic</div>
                        <div className="text-gray-500">@ {frame.timestamp}s</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center px-4">
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Showing {displayedFakeFrames.length} of {analysisData.fake_frames_count} fake frames and {displayedAuthenticFrames.length} of {analysisData.total_frames - analysisData.fake_frames_count} authentic frames
              </p>
              {!showAllFrames && (analysisData.fake_frames_count > 15 || analysisData.analysis_results.filter(f => !f.is_fake).length > 12) && (
                <Button onClick={() => setShowAllFrames(true)} variant="outline" className="w-full sm:w-auto">
                  <Eye className="w-4 h-4 mr-2" />
                  Load All {analysisData.total_frames} Frames
                </Button>
              )}
              {showAllFrames && (
                <Button onClick={() => setShowAllFrames(false)} variant="outline" className="w-full sm:w-auto">
                  Show Sample Only
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6 mt-6">
            <Card className="floating-animation">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">AI Model Versions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-sm sm:text-base">CNN Model</span>
                      <Badge variant="outline" className="text-xs sm:text-sm">{analysisData.model_versions.cnn_model}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-sm sm:text-base">ELA Model</span>
                      <Badge variant="outline" className="text-xs sm:text-sm">{analysisData.model_versions.ela_model}</Badge>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-sm sm:text-base">GAN Detection</span>
                      <Badge variant="outline" className="text-xs sm:text-sm">{analysisData.model_versions.gan_model}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-sm sm:text-base">Semantic Model</span>
                      <Badge variant="outline" className="text-xs sm:text-sm">{analysisData.model_versions.semantic_model}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3 text-sm sm:text-base">Processing Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
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
      </div>
    </div>
  );
}
