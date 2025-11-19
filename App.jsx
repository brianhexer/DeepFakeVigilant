import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Shield, Home, Menu, X, Settings, LogIn, LogOut, UserCircle, 
  Upload, FileVideo, Brain, CheckCircle, AlertTriangle, Download, 
  Share2, RotateCcw, Clock, Eye, FileText, Star, Send, 
  MapPin, Link as LinkIcon, Users, Award, Globe, Zap, Lock, 
  Plus, Edit3, Camera, Trash2, Calendar, Search, Filter, BarChart3, Crown,
  TrendingUp, Microscope, BookOpen, ArrowLeft
} from "lucide-react";


// --- MOCKED SHADCN COMPONENTS (required for single file environment) ---
const Card = ({ className = "", children }) => <div className={`bg-white rounded-xl shadow-lg ${className}`}>{children}</div>;
const CardContent = ({ className = "", children }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardHeader = ({ className = "", children }) => <div className={`p-6 pb-0 ${className}`}>{children}</div>;
const CardTitle = ({ className = "", children }) => <h3 className={`text-xl font-bold ${className}`}>{children}</h3>;
const CardDescription = ({ className = "", children }) => <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
const Button = ({ children, onClick, disabled, variant = "default", size = "default", className = "" }) => {
  let baseStyle = "px-4 py-2 font-medium rounded-lg transition-colors duration-200";
  let variantStyle = "bg-blue-600 text-white hover:bg-blue-700";
  if (variant === "outline") variantStyle = "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100";
  if (variant === "destructive") variantStyle = "bg-red-600 text-white hover:bg-red-700";

  let sizeStyle = "";
  if (size === "sm") sizeStyle = "px-3 py-1.5 text-sm";
  if (size === "icon") sizeStyle = "p-2";
  if (size === "lg") sizeStyle = "px-6 py-3 text-lg";
  
  if (disabled) className += " opacity-50 cursor-not-allowed";

  return <button className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`} onClick={onClick} disabled={disabled}>{children}</button>;
};
const Badge = ({ children, className = "", variant = "default" }) => {
  let baseStyle = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors";
  let variantStyle = "bg-blue-100 text-blue-800";
  if (variant === "secondary") variantStyle = "bg-gray-100 text-gray-800";
  if (variant === "outline") variantStyle = "border border-gray-300 text-gray-700";
  
  return <span className={`${baseStyle} ${variantStyle} ${className}`}>{children}</span>;
};
const Input = ({ type = "text", value, onChange, onBlur, placeholder, className = "", disabled }) => 
  <input type={type} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} disabled={disabled}
         className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`} />;

const Textarea = ({ value, onChange, onBlur, placeholder, rows, className = "", disabled }) =>
  <textarea value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} rows={rows} disabled={disabled}
            className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`} />;

const Label = ({ children, htmlFor, className = "" }) => <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>{children}</label>;

const Progress = ({ value, className = "" }) => 
  <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
    <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${value}%` }}></div>
  </div>;

const Checkbox = ({ id, checked, onCheckedChange }) => 
  <input type="checkbox" id={id} checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} 
         className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />;

const Tabs = ({ value, onValueChange, children, className = "" }) => 
  <div className={className}><div className="flex space-x-2" role="tablist">{children}</div></div>;
const TabsList = ({ className = "", children }) => <div className={`flex justify-center bg-gray-100 rounded-lg p-1 ${className}`}>{children}</div>;
const TabsTrigger = ({ value, onClick, children, className = "", active }) => <button className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${active ? 'bg-white shadow text-blue-600' : 'hover:bg-gray-200 text-gray-600'} ${className}`} onClick={() => onClick(value)}>{children}</button>;
const TabsContent = ({ value, children, className = "" }) => <div className={`pt-4 ${className}`}>{children}</div>;

const Select = ({ value, onValueChange, children }) => {
    const handleChange = (e) => onValueChange(e.target.value);
    return <select value={value} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">{children}</select>;
};
const SelectTrigger = ({ children, className = "" }) => <div className={`p-2 border border-gray-300 rounded-lg bg-white ${className}`}>{children}</div>;
const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ value, children }) => <option value={value} className="p-2">{children}</option>;


// --- MOCKED DEPENDENCIES AND UTILS ---

const createPageUrl = (pageName, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return `#/${pageName}${query ? `?${query}` : ''}`;
};
const getPageNameFromHash = (hash) => {
    if (!hash || hash === '#/') return 'Home';
    const match = hash.match(/#\/([^?]*)/);
    return match ? (match[1] || 'Home') : 'Home';
};
const getParamsFromHash = (hash) => {
    const match = hash.match(/\?(.+)$/);
    if (!match) return {};
    return Object.fromEntries(new URLSearchParams(match[1]));
};

// --- MOCKED DATABASE/API ---

const MOCKED_DB = {
    'team-1': { id: 'team-1', name: "BRIAN", role: "Founder of NetzSpaz & Lead AI Researcher", description: "Leading innovation in deepfake detection and AI security research and founder of NetzSpaz", profile_image: "https://placehold.co/100x100/A0BFFF/0D47A1?text=B", display_order: 1 },
    'team-2': { id: 'team-2', name: "Alice J.", role: "Lead Data Scientist", description: "Specializes in GAN and semantic consistency modeling.", profile_image: "https://placehold.co/100x100/F0FFF4/15803D?text=A", display_order: 2 },
};
const MOCKED_APP_STATS = { 'stats-1': { id: 'stats-1', total_analyses: 12456, singleton: true } };
const MOCKED_REVIEWS = [
    { id: 'rev-1', analysis_id: 'a-1', rating: 5, comment: 'Great tool!', accuracy_feedback: 'very_accurate', created_date: Date.now() - 86400000 },
    { id: 'rev-2', analysis_id: 'a-2', rating: 4, comment: 'Very fast analysis.', accuracy_feedback: 'accurate', created_date: Date.now() - 172800000 },
];
const MOCKED_MESSAGES = [
    { id: 'msg-1', name: 'John Doe', email: 'john@example.com', subject: 'Technical Question', message: 'The analysis progress bar seemed stuck at 90%...', created_date: Date.now() - 3600000 }
];
const MOCKED_USERS = [
    { id: 'user-123', email: 'admin@deepfakevigilant.com', full_name: 'Brian Admin', role: 'admin', admin_level: 'primary', analysis_count: 42, created_date: Date.now() - 31536000000, last_login: Date.now(), visit_count: 150 },
    { id: 'user-456', email: 'test@user.com', full_name: 'Test User', role: 'user', admin_level: 'none', analysis_count: 5, created_date: Date.now() - 7776000000, last_login: Date.now(), visit_count: 10 },
];

let CURRENT_USER_ID = 'user-123'; // Default to signed-in primary admin

const createMockEntity = (collection) => ({
  list: async (sortField) => {
    await new Promise(r => setTimeout(r, 100)); // Simulate delay
    let data = Object.values(collection).sort((a, b) => {
        if (!sortField) return 0;
        const asc = !sortField.startsWith('-');
        const field = asc ? sortField : sortField.substring(1);
        
        // Handle nested created_date for reviews/messages
        const aVal = a[field] || a.created_date;
        const bVal = b[field] || b.created_date;

        if (aVal < bVal) return asc ? -1 : 1;
        if (aVal > bVal) return asc ? 1 : -1;
        return 0;
    });
    return data;
  },
  filter: async (criteria) => {
    await new Promise(r => setTimeout(r, 100));
    if (criteria.singleton) return Object.values(collection).filter(d => d.singleton);
    return Object.values(collection);
  },
  update: async (id, data) => {
    await new Promise(r => setTimeout(r, 100));
    if (collection[id]) {
      collection[id] = { ...collection[id], ...data };
      return collection[id];
    }
    throw new Error("Not Found");
  },
  create: async (data) => {
    await new Promise(r => setTimeout(r, 100));
    const id = `${data.name?.toLowerCase().replace(/\s/g, '_') || 'new'}-${Date.now()}`;
    const newEntry = { ...data, id, created_date: Date.now() };
    collection[id] = newEntry;
    return newEntry;
  },
  delete: async (id) => {
    await new Promise(r => setTimeout(r, 100));
    if (collection[id]) {
        delete collection[id];
        return true;
    }
    throw new Error("Not Found");
  }
});

const UserEntity = {
  me: async () => {
    await new Promise(r => setTimeout(r, 100));
    return MOCKED_USERS.find(u => u.id === CURRENT_USER_ID) || { id: "anon", role: "user", admin_level: "none", email: "anonymous", full_name: "Anonymous User" };
  },
  list: async () => createMockEntity(MOCKED_USERS).list(),
  update: async (userId, data) => createMockEntity(MOCKED_USERS).update(userId, data),
  updateMyUserData: async (data) => createMockEntity(MOCKED_USERS).update(CURRENT_USER_ID, data),
};
const AppStats = createMockEntity(MOCKED_APP_STATS);
const ContactMessage = createMockEntity(MOCKED_MESSAGES);
const Review = createMockEntity(MOCKED_REVIEWS);
const TeamMember = createMockEntity(MOCKED_DB);

const base44 = {
  auth: {
    me: async () => UserEntity.me(),
    redirectToLogin: async (redirectUrl) => {
        console.log("Mock Login: Simulating sign in.");
        CURRENT_USER_ID = MOCKED_USERS[0].id; // Simulate successful login as admin
        setTimeout(() => window.location.hash = getPageNameFromHash(redirectUrl) === 'SignIn' ? createPageUrl('Home') : redirectUrl, 100);
    },
    logout: async () => {
        console.log("Mock logout successful.");
        CURRENT_USER_ID = 'anon';
        setTimeout(() => window.location.hash = createPageUrl("SignIn"), 100);
    }
  }
};

const UploadFile = async ({ file }) => {
  await new Promise(r => setTimeout(r, 500));
  return { file_url: `https://placehold.co/100x100/A0BFFF/0D47A1?text=UPLOADED_${file.name.substring(0,3)}` };
};

// Mock VideoAnalyzer Class (from components/analysis/VideoAnalyzer.js)
class VideoAnalyzer {
  static getEstimatedProcessingTime(videoDuration) {
    return Math.min(60, Math.floor(videoDuration * 0.8) + 10);
  }

  static async getVideoDurationSafely(videoFile) {
    return new Promise(resolve => {
        resolve(Math.min(60, Math.max(5, Math.floor(videoFile.size / 1024 / 1024) * 2 || 15)));
    });
  }

  static generateCompleteVideoAnalysis(totalFrames, videoDuration, videoUrl, processingTime) {
    const results = [];
    const frameRate = 6;
    
    for (let i = 0; i < totalFrames; i++) {
      const timestampSeconds = i / frameRate;
      const isFake = Math.random() > 0.75; // 25% fake frames
      
      results.push({
        frame_number: i + 1,
        timestamp: `${Math.floor(timestampSeconds / 60)}:${(timestampSeconds % 60).toFixed(2).padStart(5, '0')}`,
        timestamp_seconds: timestampSeconds,
        is_fake: isFake,
        confidence_score: isFake ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 30) + 20,
        manipulation_type: isFake ? 
          ["Face Swap", "Expression Manipulation", "Background Replace", "Lip Sync Fake", "AI Generated"][Math.floor(Math.random() * 5)] : 
          "Authentic",
        manipulated_regions: isFake ? [
          ["Face", "Eyes", "Mouth"],
          ["Facial Features", "Skin Texture"], 
          ["Background", "Lighting"],
          ["Lip Movement", "Audio Sync"],
          ["Full Frame", "Color Grading"]
        ][Math.floor(Math.random() * 5)] : [],
        detailed_metrics: {
          cnn_score: Math.random() * 100,
          ela_score: Math.random() * 100,
          gan_score: Math.random() * 100,
          semantic_score: Math.random() * 100
        }
      });
    }

    const fakeFramesCount = results.filter(frame => frame.is_fake).length;
    
    return {
      overall_fakeness_score: Math.floor((fakeFramesCount / totalFrames) * 100),
      total_frames: totalFrames,
      fake_frames_count: fakeFramesCount,
      processing_time: processingTime,
      analysis_results: results
    };
  }
  
  static async analyzeCompleteVideo(videoFile, videoUrl, duration) {
    const videoDuration = duration || (await this.getVideoDurationSafely(videoFile));
    const frameRate = 6;
    const totalFrames = Math.ceil(videoDuration * frameRate);
    const processingTime = this.getEstimatedProcessingTime(videoDuration);

    await new Promise(resolve => setTimeout(resolve, processingTime * 1000));

    const analysisResult = this.generateCompleteVideoAnalysis(totalFrames, videoDuration, videoUrl, processingTime);

    return {
      ...analysisResult,
      id: "analysis_" + Date.now(),
      video_filename: videoFile ? videoFile.name : "uploaded_video.mp4",
      video_url: videoUrl,
      video_duration: videoDuration,
      frame_rate: frameRate,
      model_versions: {
        cnn_model: "CNN-v2.1",
        ela_model: "ELA-v1.8", 
        gan_model: "GAN-Detect-v3.2",
        semantic_model: "Semantic-v1.5"
      }
    };
  }
}

// --- VideoUploadZone Component (logic from user file) ---
function VideoUploadZone({ onVideoUploaded }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFile = useCallback((file) => {
    setError(null);
    
    // Check file size limit (200MB, as per VideoAnalyzer.js implementation)
    const MAX_FILE_SIZE = 209715200; // 200 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) {
        setError("File size must be less than 200MB for analysis.");
        return;
    }

    const allowedTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(mp4|avi|mov|mkv|webm|ogg)$/)) {
      setError("Please select a valid video file (MP4, AVI, MOV, MKV, WebM, OGG)");
      return;
    }
    
    const videoData = {
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file), // Use local blob URL
      type: file.type,
      file: file,
      lastModified: file.lastModified || Date.now()
    };
    
    onVideoUploaded(videoData);
  }, [onVideoUploaded, setError]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile, setDragActive]);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
    e.target.value = null; 
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-8 px-2 sm:px-0">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Load Your Video for Analysis</h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Select a video file to analyze for deepfake content. Your video is processed entirely in your browser and is never uploaded.
        </p>
      </div>

      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors floating-animation">
        <CardContent className="p-0">
          <div
            className={`transition-colors ${dragActive ? 'bg-blue-50' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept="video/mp4,video/avi,video/quicktime,video/x-msvideo,video/x-matroska,video/webm,video/ogg,.mp4,.avi,.mov,.mkv,.webm,.ogg"
              onChange={handleFileSelect}
              className="hidden"
              id="video-upload"
            />
            <div className="block text-center cursor-pointer p-8 sm:p-12" onClick={handleButtonClick}>
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
              </div>
              
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Drop your video here or click to browse
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Supports MP4, AVI, MOV, MKV, WebM, OGG • Max size 200MB
              </p>
              
              <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base px-6 py-4 sm:py-5 h-auto">
                <FileVideo className="w-5 h-5 mr-2" />
                Select Video File
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-6 sm:p-12 pt-0 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Private & Secure</h4>
          <p className="text-sm text-gray-600">Your video is processed locally and never leaves your computer</p>
        </div>
        
        <div className="p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <FileVideo className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Zero Data Retention</h4>
          <p className="text-sm text-gray-600">We do not store or see any of your videos or data</p>
        </div>
        
        <div className="p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Instant Processing</h4>
          <p className="text-sm text-gray-600">Analysis begins immediately without any uploads</p>
        </div>
      </div>
    </div>
  );
}

// --- AnalysisProgress Component (logic from user file) ---
const analysisSteps = [
  { id: "preprocessing", title: "Video Processing", description: "Extracting frames at 6 FPS for comprehensive analysis", icon: FileVideo, weight: 0.25 },
  { id: "cnn", title: "CNN Analysis", description: "Analyzing pixel-level inconsistencies across all frames", icon: Brain, weight: 0.3 },
  { id: "ela", title: "ELA Detection", description: "Scanning compression artifacts throughout video", icon: Eye, weight: 0.2 },
  { id: "gan", title: "GAN Detection", description: "Identifying synthetic patterns across video sequence", icon: Zap, weight: 0.15 },
  { id: "semantic", title: "Semantic Consistency Check", description: "Verifying logical consistency throughout video", icon: Lock, weight: 0.1 }
];

const VideoScanVisual = ({ progress, totalFrames }) => {
  const scanPosition = `${progress}%`;
  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-blue-800 shadow-lg">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(0, 150, 255, 0.3) 1px, transparent 1px), linear-gradient(to right, rgba(0, 150, 255, 0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <FileVideo className="w-16 h-16 text-blue-500 opacity-30" />
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-cyan-400/80 shadow-[0_0_10px_2px] shadow-cyan-400"
        style={{ left: scanPosition, transition: 'left 0.1s linear' }}
      ></div>
      <div className="absolute top-2 left-3 text-cyan-400 text-xs font-mono">SCANNING...</div>
      <div className="absolute bottom-2 right-3 text-cyan-400 text-xs font-mono">FRAME: {Math.floor((progress / 100) * totalFrames)}</div>
    </div>
  );
};

function AnalysisProgress({ videoData, processingTime }) {
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
    if (!processingTime || processingTime <= 0) return;

    const totalDurationMs = processingTime * 1000;
    let currentOverallProgress = 0;
    let activeStepIndex = 0;

    const progressInterval = setInterval(() => {
      currentOverallProgress = Math.min(100, currentOverallProgress + (100 / (processingTime * 10)));
      setProgress(currentOverallProgress);

      if (activeStepIndex === 0 && estimatedFrames > 0) {
        const firstStepWeight = analysisSteps[0].weight;
        const firstStepEndOverallProgress = firstStepWeight * 100;
        const progressWithinFirstStep = Math.min(100, (currentOverallProgress / firstStepEndOverallProgress) * 100);
        setProcessingFrames(Math.floor((progressWithinFirstStep / 100) * estimatedFrames));
      }

      if (currentOverallProgress >= 100) {
        clearInterval(progressInterval);
        setCurrentStep(analysisSteps.length);
        activeStepIndex = analysisSteps.length;
      }
    }, 100);

    let cumulativeDelayMs = 0;
    const stepTimeouts = [];
    analysisSteps.forEach((step, index) => {
      const stepDurationMs = totalDurationMs * step.weight;
      const timeoutId = setTimeout(() => {
        setCurrentStep(index);
        activeStepIndex = index;
      }, cumulativeDelayMs);

      stepTimeouts.push(timeoutId);
      cumulativeDelayMs += stepDurationMs;
    });

    const animationInterval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(animationInterval);
      stepTimeouts.forEach(clearTimeout);
    };
  }, [processingTime, estimatedFrames, videoData]);

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
      <div className="text-center">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6">
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white relative z-10" />
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20"
                   style={{animation: 'scan 2s linear infinite'}}></div>
            </div>
            <div className={`absolute inset-0 rounded-2xl border-4 border-blue-400 ${animationPhase === 0 ? 'opacity-75' : 'opacity-0'}`}
                 style={{animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'}}></div>
            <div className={`absolute inset-0 rounded-2xl border-4 border-purple-400 ${animationPhase === 1 ? 'opacity-75' : 'opacity-0'}`}
                 style={{animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '0.3s'}}></div>
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
            <Clock className={`w-4 h-4 ml-2 ${animationPhase % 2 === 0 ? 'text-blue-600' : 'text-purple-600'} transition-colors`} />
          </div>
        </div>

        <Card className="border-none shadow-xl floating-animation">
          <CardContent className="p-4 sm:p-8">
            <div className="space-y-6">
              <VideoScanVisual progress={progress} totalFrames={estimatedFrames} />
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

              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="font-medium">Analysis Progress</span>
                  <span className="font-bold text-blue-600">{Math.round(progress)}%</span>
                </div>
                <div className="relative">
                  <Progress value={progress} className="h-3 sm:h-4" />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Frame-by-frame detection • 99.2% accuracy
                </p>
              </div>

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
            </div>
          </CardContent>
        </Card>
      </div>
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}

// --- ReviewForm Component (logic from user file) ---
function ReviewForm({ analysisId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Please select a rating before submitting.");
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const reviewData = {
        analysis_id: analysisId,
        rating: rating,
        accuracy_feedback: accuracy || undefined
      };
      
      if (comment.trim()) {
        reviewData.comment = comment.trim();
      }
      
      if (email.trim()) {
        reviewData.user_email = email.trim();
      }
      
      await Review.create(reviewData);
      setSubmitted(true);
      
      setRating(0);
      setComment("");
      setAccuracy("");
      setEmail("");
      
    } catch (error) {
      console.error("Review submission error:", error);
      setError("Failed to submit review. Please ensure you are signed in or try again later.");
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-4">
            Your feedback helps us improve our CNN-ELA-GAN Fusion with Semantic Consistency Check AI detection accuracy. 
            We appreciate your input on our complete video analysis system!
          </p>
          <p className="text-sm text-gray-500">
            © 2025 NetzSpaz / DeepFakeVigilant
          </p>
          <Button 
            onClick={() => setSubmitted(false)}
            variant="outline"
            className="mt-4"
          >
            Submit Another Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Rate This Complete Video Analysis
        </CardTitle>
        <p className="text-sm text-gray-600">
          Help us improve our 6 FPS complete video detection technology
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">
              How would you rate the accuracy of this complete analysis? *
            </Label>
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      star <= rating 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {rating === 0 && "Click to rate"}
              {rating === 1 && "Very poor"}
              {rating === 2 && "Poor"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very good"}
              {rating === 5 && "Excellent"}
            </p>
          </div>

          <div>
            <Label htmlFor="accuracy">How accurate was the complete video analysis?</Label>
            <Select value={accuracy} onValueChange={setAccuracy}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select accuracy level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="very_accurate">Very Accurate</SelectItem>
                <SelectItem value="accurate">Accurate</SelectItem>
                <SelectItem value="somewhat_accurate">Somewhat Accurate</SelectItem>
                <SelectItem value="inaccurate">Inaccurate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="comment">Comments about the analysis (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with our complete video analysis using CNN-ELA-GAN Fusion with Semantic Consistency Check technology..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email (Optional - for follow-up)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll only use this to follow up on your feedback if needed
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={rating === 0 || submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          Your feedback helps improve our AI models for better complete video deepfake detection<br />
          © 2025 NetzSpaz / DeepFakeVigilant
        </p>
      </CardContent>
    </Card>
  );
}

// --- ResultsDashboard Component (logic from user file) ---
function ResultsDashboard({ analysisData, onNewAnalysis, videoUrl, navigateTo }) {
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
            sessionStorage.setItem(`analysisResult-${analysisData.id}`, JSON.stringify(analysisData));
            navigateTo('PDFReport', { id: analysisData.id });
        } catch (error) {
            console.error("PDF export error:", error);
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
    
    console.log('TXT Report Downloaded successfully.');
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

🔗 Analyze your videos: ${window.location.origin}

© 2025 NetzSpaz / DeepFakeVigilant
Advanced AI-powered deepfake detection with 99.2% accuracy`;

      const shareData = {
        title: `🛡️ DeepFakeVigilant Analysis - ${analysisData.video_filename}`,
        text: detailedResults,
        url: window.location.origin
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(detailedResults);
          console.log('Detailed Analysis Results Copied to clipboard!');
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = detailedResults;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          console.log('Detailed analysis results copied to clipboard via fallback!');
        }
      }
    } catch (error) {
      console.error("Share failed:", error);
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

Try professional video analysis: ${window.location.origin}

© 2025 NetzSpaz / DeepFakeVigilant
#DeepfakeDetection #AITechnology #MediaAuthenticity`,
        url: window.location.origin
      };

      if (navigator.share && navigator.canShare && navigator.canShare(appShareData)) {
        await navigator.share(appShareData);
      } else {
        const shareText = appShareData.text;
        
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareText);
          console.log('DeepFakeVigilant app info copied! Share with friends on any platform.');
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = shareText;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          console.log('App info copied! Share on your favorite platform.');
        }
      }
    } catch (err) {
      console.error("Share app failed:", err);
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
            disabled={exportingPDF}
            className="flex items-center gap-2 floating-animation w-full sm:w-auto"
          >
            <Download className={`w-4 h-4 ${exportingPDF ? 'animate-spin' : ''}`} />
            {exportingPDF ? 'Generating Report...' : 'Export PDF Report'}
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
          <TabsTrigger value="overview" onClick={setActiveTab} active={activeTab === 'overview'}>Overview</TabsTrigger>
          <TabsTrigger value="frames" onClick={setActiveTab} active={activeTab === 'frames'}>Frames</TabsTrigger>
          <TabsTrigger value="technical" onClick={setActiveTab} active={activeTab === 'technical'} className="hidden sm:inline-flex">Technical</TabsTrigger>
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

// --- HomePage Component (logic from Pages/Home.js) ---
function HomePage({ navigateTo }) {
  const [analysisStep, setAnalysisStep] = useState("upload");
  const [analysisData, setAnalysisData] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [processingTime, setProcessingTime] = useState(0);
  const uploadZoneRef = useRef(null);

  useEffect(() => {
    try {
      const savedStep = sessionStorage.getItem('analysisStep');
      const savedData = sessionStorage.getItem('analysisData');
      const savedVideoName = sessionStorage.getItem('uploadedVideoName');
      const savedUrl = sessionStorage.getItem('videoUrl');

      if (savedStep && savedData && savedUrl) {
        setAnalysisStep(savedStep);
        setAnalysisData(JSON.parse(savedData));
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
    setVideoUrl(videoData.url);

    try {
        const videoDuration = await VideoAnalyzer.getVideoDurationSafely(videoData.file);
        const fullVideoData = { ...videoData, duration: videoDuration };
        setUploadedVideo(fullVideoData);

        const estimatedTime = VideoAnalyzer.getEstimatedProcessingTime(videoDuration);
        setProcessingTime(estimatedTime);

        setAnalysisStep("analyzing");
        sessionStorage.setItem('uploadedVideoName', fullVideoData.name);
        sessionStorage.setItem('videoUrl', videoData.url);
        sessionStorage.setItem('analysisStep', 'analyzing');

        const analysisResult = await VideoAnalyzer.analyzeCompleteVideo(videoData.file, videoData.url, videoDuration);
      
        setAnalysisData(analysisResult);
        setAnalysisStep("results");
      
        sessionStorage.setItem('analysisData', JSON.stringify(analysisResult));
        sessionStorage.setItem('analysisStep', 'results');
      
        // Update user analysis count and app stats (MOCKED)
        const currentUser = await UserEntity.me().catch(() => null);
        if (currentUser && currentUser.id !== 'anon') {
            const newCount = (currentUser.analysis_count || 0) + 1;
            await UserEntity.updateMyUserData({ analysis_count: newCount });
        }
        const stats = await AppStats.filter({ singleton: true });
        if (stats.length > 0) {
            const currentStats = stats[0];
            const newTotal = (currentStats.total_analyses || 0) + 1;
            await AppStats.update(currentStats.id, { total_analyses: newTotal });
        } else {
            await AppStats.create({ total_analyses: 1, singleton: true });
        }

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
    setProcessingTime(0);
    sessionStorage.removeItem('analysisStep');
    sessionStorage.removeItem('analysisData');
    sessionStorage.removeItem('uploadedVideoName');
    sessionStorage.removeItem('videoUrl');
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
                  <a href={createPageUrl("About")}>
                    <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 border text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 h-auto">
                      Learn More
                    </Button>
                  </a>
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
                    <img src="https://placehold.co/400x240/1f2937/FFFFFF?text=Video+Preview" alt="Video placeholder" className="absolute inset-0 w-full h-full object-cover opacity-30" />
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
                <div className="absolute -top-16 -left-16 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{animationDelay: '2s'}}></div>
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
            videoData={uploadedVideo}
            processingTime={processingTime}
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
            navigateTo={navigateTo}
          />
          <div className="mt-12">
            <ReviewForm
              analysisId={analysisData.id}
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
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
      `}</style>
    </div>
  );
}

// --- AboutPage Component (logic from Pages/About.js) ---
function AboutPage({ user }) {
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [teamMembers, setTeamMembers] = useState(Object.values(MOCKED_DB));
  const [totalAnalyses, setTotalAnalyses] = useState(MOCKED_APP_STATS['stats-1'].total_analyses);
  const [loadingStats, setLoadingStats] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", role: "", description: "", profile_image: null });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [teamContainer, setTeamContainer] = useState(null);

  const loadTeamMembers = async () => {
    setTeamMembers(await TeamMember.list('display_order'));
  };

  const loadTotalAnalyses = async () => {
    setLoadingStats(true);
    try {
      const stats = await AppStats.list();
      if (stats.length > 0) {
        setTotalAnalyses(stats.reduce((sum, stat) => sum + (stat.total_analyses || 0), 0));
      } else {
        setTotalAnalyses(0);
      }
    } catch (error) {
      console.error("Could not load total analyses:", error);
      setTotalAnalyses(0);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadTeamMembers();
    loadTotalAnalyses();
  }, []);

  const isAdmin = user && (user.role === 'admin' || user.admin_level === 'primary');

  const handleImageUpload = async (file, memberId = null) => {
    if (!file) return null;
    
    setUploadingImage(true);
    try {
      const result = await UploadFile({ file });
      
      if (memberId) {
        await TeamMember.update(memberId, { profile_image: result.file_url });
        loadTeamMembers();
      } else {
        setNewMember(prev => ({ ...prev, profile_image: result.file_url }));
      }
      return result.file_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Please try again.");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddMember = async () => {
    if (newMember.name && newMember.role) {
      try {
        await TeamMember.create({
          ...newMember,
          display_order: teamMembers.length + 1
        });
        setNewMember({ name: "", role: "", description: "", profile_image: null });
        loadTeamMembers();
      } catch (error) {
        console.error("Could not add team member:", error);
        alert("Failed to add team member. Please try again.");
      }
    }
  };

  const handleRemoveMember = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await TeamMember.delete(id);
        loadTeamMembers();
      } catch (error) {
        console.error("Could not remove team member:", error);
        alert("Failed to remove team member. Please try again.");
      }
    }
  };

  const handleUpdateMember = async (id, updates) => {
    try {
      await TeamMember.update(id, updates);
      loadTeamMembers();
    } catch (error) {
      console.error("Could not update team member:", error);
    }
  };

  const handleDoneEditing = () => {
    setIsEditingTeam(false);
    loadTeamMembers();
  };

  const achievements = [
    { metric: "99.2%", label: "Detection Accuracy", icon: Award },
    { 
      metric: loadingStats ? "..." : totalAnalyses.toLocaleString(), 
      label: "Videos Analyzed", 
      icon: Globe 
    },
    { metric: "6 FPS", label: "Complete Analysis", icon: Zap },
    { metric: "100%", label: "Privacy Protection", icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              About DeepFakeVigilant
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              We're on a mission to protect digital authenticity through cutting-edge AI technology. 
              Our advanced CNN-ELA-GAN Fusion with Semantic Consistency Check model analyzes complete videos at 6 FPS to identify deepfake content with unprecedented accuracy.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{achievement.metric}</div>
                    <div className="text-sm text-gray-600">{achievement.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our AI Detection Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CNN-ELA-GAN Fusion with Semantic Consistency Check - Complete video analysis at 6 FPS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">CNN Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  Convolutional Neural Networks analyze pixel-level patterns across all frames at 6 FPS to detect inconsistencies in facial features, lighting, and textures.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">ELA Detection</h3>
                <p className="text-gray-600 leading-relaxed">
                  Error Level Analysis reveals compression artifacts and identifies regions that have been digitally altered throughout the complete video timeline.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">GAN Detection</h3>
                <p className="text-gray-600 leading-relaxed">
                  Specialized models trained to identify synthetic content patterns generated by Generative Adversarial Networks across entire video sequences.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Semantic Consistency Check</h3>
                <p className="text-gray-600 leading-relaxed">
                  Context-aware analysis ensures logical consistency across complete video sequences, detecting temporal inconsistencies throughout the entire timeline.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                In an era of increasing digital manipulation, we believe everyone deserves access to reliable tools for verifying video authenticity. Our mission is to democratize deepfake detection technology through complete video analysis at 6 FPS and protect digital truth through advanced AI research.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Complete Analysis</h4>
                    <p className="text-gray-600">Full video detection at 6 FPS for comprehensive results</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Privacy First</h4>
                    <p className="text-gray-600">Zero data retention policy - your videos are deleted after analysis</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Continuous Innovation</h4>
                    <p className="text-gray-600">Regular model updates to stay ahead of evolving deepfake technology</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card className="border-none shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Complete Video Analysis Matters</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Media Integrity</h4>
                        <p className="text-gray-600 text-sm">
                          Comprehensive analysis protects journalism and public discourse from sophisticated manipulation
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Globe className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Digital Safety</h4>
                        <p className="text-gray-600 text-sm">
                          Frame-by-frame verification empowers users to detect even subtle manipulation attempts
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Trust & Security</h4>
                        <p className="text-gray-600 text-sm">
                          Complete video analysis ensures no manipulated segment goes undetected
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Meet Our Team
              </h2>
              {isAdmin && (
                <Button 
                  onClick={() => isEditingTeam ? handleDoneEditing() : setIsEditingTeam(true)}
                  variant="outline"
                  size="sm"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditingTeam ? 'Done' : 'Edit Team'}
                </Button>
              )}
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Led by experts in computer vision and artificial intelligence
            </p>
          </div>

          <div 
            ref={setTeamContainer}
            className="overflow-x-auto pb-4 mb-8"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 #f7fafc' }}
          >
            <div className="flex gap-8 min-w-max px-4" style={{ justifyContent: teamMembers.length <= 3 ? 'center' : 'flex-start' }}>
              {teamMembers.map((member) => (
                <Card key={member.id} className="border-none shadow-lg relative flex-shrink-0 w-80 hover:shadow-xl transition-all duration-300 hover:scale-105 floating-animation">
                  <CardContent className="p-8 text-center">
                    {isEditingTeam && isAdmin && (
                      <Button
                        onClick={() => handleRemoveMember(member.id)}
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <div className="relative mx-auto mb-6">
                      {member.profile_image ? (
                        <img 
                          src={member.profile_image} 
                          alt={member.name}
                          className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                          <span className="text-2xl font-bold text-white">{member.name[0]}</span>
                        </div>
                      )}
                      
                      {isEditingTeam && isAdmin && (
                        <div className="absolute -bottom-2 -right-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], member.id)}
                            className="hidden"
                            id={`upload-${member.id}`}
                          />
                          <label
                            htmlFor={`upload-${member.id}`}
                            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg flex items-center justify-center"
                          >
                            {uploadingImage ? (
                              <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                              <Camera className="w-4 h-4" />
                            )}
                          </label>
                        </div>
                      )}
                    </div>
                    
                    {isEditingTeam && isAdmin ? (
                      <div className="space-y-3">
                        <Input
                          value={member.name}
                          onChange={(e) => handleUpdateMember(member.id, { name: e.target.value })}
                          placeholder="Name"
                          className="text-center"
                        />
                        <Input
                          value={member.role}
                          onChange={(e) => handleUpdateMember(member.id, { role: e.target.value })}
                          placeholder="Role"
                          className="text-center text-sm"
                        />
                        <Textarea
                          value={member.description}
                          onChange={(e) => handleUpdateMember(member.id, { description: e.target.value })}
                          placeholder="Description"
                          className="text-center text-sm"
                          rows={2}
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                        <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                        <p className="text-gray-600 leading-relaxed">{member.description}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}

              {isEditingTeam && isAdmin && (
                <Card className="border-2 border-dashed border-gray-300 flex-shrink-0 w-80 hover:border-blue-400 transition-colors">
                  <CardContent className="p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Add Team Member</h3>
                    
                    <div className="mb-4 text-center">
                      {newMember.profile_image ? (
                        <img 
                          src={newMember.profile_image} 
                          alt="New member"
                          className="w-20 h-20 rounded-full mx-auto object-cover mb-2"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <UserCircle className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                        className="hidden"
                        id="upload-new"
                      />
                      <label
                        htmlFor="upload-new"
                        className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm flex items-center justify-center gap-1"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Photo
                      </label>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="newMemberName">Name</Label>
                        <Input
                          id="newMemberName"
                          value={newMember.name}
                          onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                          placeholder="Full Name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newMemberRole">Role</Label>
                        <Input
                          id="newMemberRole"
                          value={newMember.role}
                          onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                          placeholder="Job Title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newMemberDescription">Description</Label>
                        <Textarea
                          id="newMemberDescription"
                          value={newMember.description}
                          onChange={(e) => setNewMember({...newMember, description: e.target.value})}
                          placeholder="Brief description"
                          rows={3}
                        />
                      </div>
                      <Button onClick={handleAddMember} className="w-full" disabled={uploadingImage}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Member
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {teamMembers.length > 3 && (
            <div className="text-center text-sm text-gray-500">
              Scroll horizontally to see all team members
            </div>
          )}
        </div>
      </div>

      <div className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Analyze Your Complete Video?
          </h2>
          <a href={createPageUrl("Home")}>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto">
              Start Complete Analysis
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

// --- ContactPage Component (logic from Pages/Contact.js) ---
function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await ContactMessage.create({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our deepfake detection technology? Need support with an analysis? 
            We're here to help you protect digital authenticity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-8">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">General Support</h3>
                      <a 
                        href="mailto:deepfakevigilant@gmail.com" 
                        className="text-blue-600 hover:underline break-all"
                      >
                        deepfakevigilant@gmail.com
                      </a>
                      <p className="text-sm text-gray-500 mt-1">24/7 response within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Research Collaboration</h3>
                      <a 
                        href="mailto:researchdeepfakevigilant@gmail.com" 
                        className="text-blue-600 hover:underline break-all"
                      >
                        researchdeepfakevigilant@gmail.com
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Academic partnerships & research</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Office Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Coimbatore, Tamil Nadu, IN</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <LinkIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700 break-all">
                      https://deepfakevigilant.base44.app
                    </span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    © 2025 NetzSpaz / DeepFakeVigilant<br />
                    Protecting digital authenticity worldwide
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                    <Button 
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="mt-1"
                        placeholder="Tell us about your inquiry, feedback, or how we can assist you..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                      disabled={submitting}
                    >
                      {submitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ResearchPage Component (logic from Pages/Research.js) ---
function ResearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
              <Microscope className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Research & Development
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Advancing the state-of-the-art in deepfake detection through rigorous research, 
              open collaboration, and cutting-edge AI development.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">15+</div>
                <div className="text-sm text-gray-600">Publications</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Citations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">10+</div>
                <div className="text-sm text-gray-600">Collaborations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">99.2%</div>
                <div className="text-sm text-gray-600">Model Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Research Focus
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Multi-Modal Fusion</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Combining CNN, ELA, GAN detection, and Semantic Consistency Check analysis for superior accuracy in deepfake identification.
                </p>
                <Badge className="bg-blue-100 text-blue-800">Core Technology</Badge>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Real-time Detection</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Developing efficient algorithms for live video stream analysis and instant deepfake detection at 60 FPS processing rates.
                </p>
                <Badge className="bg-purple-100 text-purple-800">Advanced Research</Badge>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Cross-Platform Analysis</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Investigating manipulation techniques across different social media platforms, compression formats, and delivery networks.
                </p>
                <Badge className="bg-green-100 text-green-800">Applied Research</Badge>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Semantic Consistency Check</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Advanced context-aware analysis ensuring logical consistency across video sequences and temporal coherence validation.
                </p>
                <Badge className="bg-amber-100 text-amber-800">Innovation</Badge>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">AI Ethics & Safety</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Research into responsible AI deployment, bias mitigation, and ensuring equitable access to deepfake detection technology.
                </p>
                <Badge className="bg-red-100 text-red-800">Ethics Research</Badge>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                  <Microscope className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Forensic Applications</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Developing specialized tools for digital forensics, legal evidence processing, and media authentication in critical applications.
                </p>
                <Badge className="bg-indigo-100 text-indigo-800">Forensics</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Collaborate with Us
          </h2>
          <a href={createPageUrl("Contact")}>
            <Button className="bg-white text-purple-600 hover:bg-gray-100">
              <Users className="w-5 h-5 mr-2" />
              Research Partnerships
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

// --- AdminPortalPage Component (logic from Pages/AdminPortal.js) ---
function AdminPortalPage({ user }) {
  const [loading, setLoading] = useState(true);
  const [contactMessages, setContactMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("messages");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [messages, reviewsData, usersData, stats] = await Promise.all([
        ContactMessage.list('-created_date'),
        Review.list('-created_date'),
        UserEntity.list('-created_date'),
        AppStats.filter({ singleton: true })
      ]);
      
      setContactMessages(messages);
      setReviews(reviewsData);
      setUsers(usersData);
      
      const userAnalysesSum = usersData.reduce((sum, userData) => sum + (userData.analysis_count || 0), 0);
      const appStatsTotal = stats.length > 0 ? (stats[0].total_analyses || 0) : 0;
      setTotalAnalyses(Math.max(userAnalysesSum, appStatsTotal));
      
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  }, []);

  const checkAdminAccess = useCallback(async () => {
    try {
      const currentUser = await UserEntity.me();
      if (currentUser.role !== 'admin' && currentUser.admin_level !== 'primary' && currentUser.admin_level !== 'secondary') {
        window.location.hash = createPageUrl('Home'); // Redirect to home on mock
        return;
      }
      // Re-fetch user to get the latest access level
      const updatedUser = MOCKED_USERS.find(u => u.id === currentUser.id) || currentUser;
      
      // Update the current user object to ensure display is correct
      if (user) {
        user.admin_level = updatedUser.admin_level;
        user.role = updatedUser.role;
      }

      await loadData();
    } catch (error) {
      window.location.hash = createPageUrl('Home');
    } finally {
      setLoading(false);
    }
  }, [loadData, user]);

  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDeleteMessage = async (id) => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        await ContactMessage.delete(id);
        loadData();
      } catch (error) {
        console.error("Failed to delete message:", error);
        alert("Failed to delete message.");
      }
    }
  };

  const handleDeleteReview = async (id) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await Review.delete(id);
        loadData();
      } catch (error) {
        console.error("Failed to delete review:", error);
        alert("Failed to delete review.");
      }
    }
  };

  const handleUpdateUserAccess = async (userId, adminLevel) => {
    try {
      const permissions = adminLevel === 'primary' 
        ? ["users", "messages", "reviews", "team", "research", "analytics"] 
        : adminLevel === 'secondary' 
        ? ["messages", "reviews"] 
        : [];
      
      await UserEntity.update(userId, {
        admin_level: adminLevel,
        admin_permissions: permissions
      });
      await loadData();
      alert(`User access updated to ${adminLevel} successfully!`);
    } catch (error) {
      console.error("Failed to update user access:", error);
      alert("Failed to update user access. Please try again.");
    }
  };

  const isPrimaryAdmin = user && (user.role === 'admin' || user.admin_level === 'primary');

  const filteredMessages = contactMessages.filter(message =>
    message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReviews = reviews.filter(review =>
    review.analysis_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (review.comment && review.comment.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (review.user_email && review.user_email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredUsers = users.filter(userData =>
    userData.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userData.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "N/A";
  
  const statsData = [
    { title: "Total Messages", value: contactMessages.length, icon: MessageSquare, color: "text-blue-600 bg-blue-100" },
    { title: "Total Reviews", value: reviews.length, icon: Star, color: "text-yellow-600 bg-yellow-100" },
    { title: "Total Users", value: users.length, icon: Users, color: "text-purple-600 bg-purple-100" },
    { title: "Total Analyses", value: totalAnalyses, icon: BarChart3, color: "text-green-600 bg-green-100" },
    { title: "Avg Rating", value: avgRating, icon: Star, color: "text-orange-600 bg-orange-100" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center floating-animation">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Portal</h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {isPrimaryAdmin ? 'Full access to all data' : 'Messages & reviews access'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isPrimaryAdmin ? (
                <Badge className="bg-yellow-100 text-yellow-800 px-3 py-2 text-xs sm:text-sm">
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Primary Admin
                </Badge>
              ) : (
                <Badge className="bg-blue-100 text-blue-800 px-3 py-2 text-xs sm:text-sm">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Secondary Admin
                </Badge>
              )}
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statsData.map((stat, index) => (
            <Card key={index} className="border-none shadow-lg floating-animation hover:shadow-xl transition-all duration-300">
              <CardContent className="p-3 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${stat.color} mb-2`}>
                    <stat.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-lg mb-6 floating-animation">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search messages, reviews, users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl floating-animation">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-gray-200 px-4 sm:px-6 pt-4 sm:pt-6">
                <TabsList className={`grid w-full max-w-lg ${isPrimaryAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  <TabsTrigger value="messages" onClick={setActiveTab} active={activeTab === 'messages'} className="text-xs sm:text-sm">
                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Messages </span>({filteredMessages.length})
                  </TabsTrigger>
                  <TabsTrigger value="reviews" onClick={setActiveTab} active={activeTab === 'reviews'} className="text-xs sm:text-sm">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Reviews </span>({filteredReviews.length})
                  </TabsTrigger>
                  {isPrimaryAdmin && (
                    <TabsTrigger value="users" onClick={setActiveTab} active={activeTab === 'users'} className="text-xs sm:text-sm">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Users </span>({filteredUsers.length})
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <TabsContent value="messages" className="p-4 sm:p-6">
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <Card key={message.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          <div className="flex-1 w-full">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{message.subject}</h3>
                              <Badge variant="outline" className="text-xs self-start">
                                {new Date(message.created_date).toLocaleDateString()}
                              </Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {message.name}
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                <span className="break-all">{message.email}</span>
                              </div>
                            </div>
                            <p className="text-gray-700 line-clamp-3">{message.message}</p>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.subject}`)}
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredMessages.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No messages found</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-4 sm:p-6">
                <div className="space-y-4">
                  {filteredReviews.map((review) => (
                    <Card key={review.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          <div className="flex-1 w-full">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                      star <= review.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <Badge variant="outline" className="text-xs self-start">
                                {new Date(review.created_date).toLocaleDateString()}
                              </Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 text-sm text-gray-600">
                              <span className="break-all">Analysis: {review.analysis_id}</span>
                              {review.user_email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  <span className="break-all">{review.user_email}</span>
                                </div>
                              )}
                              {review.accuracy_feedback && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                  {review.accuracy_feedback.replace('_', ' ')}
                                </Badge>
                              )}
                            </div>
                            {review.comment && (
                              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                "{review.comment}"
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto justify-end">
                            {review.user_email && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`mailto:${review.user_email}?subject=Thank you for your review`)}
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredReviews.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No reviews found</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {isPrimaryAdmin && (
                <TabsContent value="users" className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {filteredUsers.map((userData) => (
                      <Card key={userData.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                            <div className="flex-1 w-full">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                                <h3 className="text-lg font-semibold text-gray-900">{userData.full_name}</h3>
                                {userData.admin_level && userData.admin_level !== 'none' ? (
                                  <Badge className={userData.admin_level === 'primary' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}>
                                    {userData.admin_level === 'primary' ? <Crown className="w-3 h-3 mr-1"/> : <Settings className="w-3 h-3 mr-1"/>}
                                    {userData.admin_level} admin
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">User</Badge>
                                )}
                              </div>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 text-sm text-gray-600 flex-wrap">
                                <div className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  <span className="break-all">{userData.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Joined {new Date(userData.created_date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  Last Visit: {userData.last_login ? new Date(userData.last_login).toLocaleString() : 'N/A'}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span className="font-semibold">Visits: {userData.visit_count || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <BarChart3 className="w-4 h-4" />
                                  <span className="font-semibold">Analyses: {userData.analysis_count || 0}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                              <Select
                                value={userData.admin_level || 'none'}
                                onValueChange={(value) => handleUpdateUserAccess(userData.id, value)}
                              >
                                <SelectTrigger className="w-full sm:w-40 h-9 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">User</SelectItem>
                                  <SelectItem value="secondary">Secondary Admin</SelectItem>
                                  <SelectItem value="primary">Primary Admin</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`mailto:${userData.email}?subject=Regarding your DeepFakeVigilant Account`)}
                                className="text-xs h-9 w-full sm:w-auto"
                              >
                                <Mail className="w-3 h-3 mr-1" />
                                Email
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No users found</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- SignInPage Component (logic from Pages/SignIn.js) ---
function SignInPage({ navigateTo }) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const canSignIn = termsAccepted && privacyAccepted;

  const handleSignIn = async () => {
    if (!canSignIn) return;
    try {
      await base44.auth.redirectToLogin(createPageUrl("Home"));
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign In to DeepFakeVigilant</CardTitle>
          <CardDescription>
            Access enhanced features by signing in securely. (Mocked: signs in as admin)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <Button
              onClick={handleSignIn}
              disabled={!canSignIn}
              className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
            >
              Sign In
            </Button>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={setTermsAccepted}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 leading-normal">
                  I have read and agree to the{' '}
                  <a onClick={() => navigateTo("Terms")} className="text-blue-600 hover:underline cursor-pointer">
                    Terms and Conditions
                  </a>.
                </Label>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={privacyAccepted}
                  onCheckedChange={setPrivacyAccepted}
                />
                <Label htmlFor="privacy" className="text-sm text-gray-600 leading-normal">
                  I have read and agree to the{' '}
                  <a onClick={() => navigateTo("Privacy")} className="text-blue-600 hover:underline cursor-pointer">
                    Privacy Policy
                  </a>.
                </Label>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-8">
            © 2025 NetzSpaz / DeepFakeVigilant
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// --- TermsPage Component (logic from Pages/Terms.js) ---
function TermsPage({ navigateTo }) {
  const [countdown, setCountdown] = useState(10);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsButtonDisabled(false);
    }
  }, [countdown]);

  const sections = [
    { icon: Eye, title: "1. Acceptance of Terms", content: "By accessing and using DeepFakeVigilant (the 'Service'), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service." },
    { icon: FileText, title: "2. Description of Service", content: "DeepFakeVigilant provides an AI-powered deepfake video detection service using a proprietary CNN-ELA-GAN Fusion with Semantic Consistency Check model. The service is provided 'AS-IS' for informational purposes and does not guarantee 100% accuracy. The results should not be used as sole evidence in legal or official proceedings." },
    { icon: Users, title: "3. User Conduct", content: "You agree not to use the Service to upload any content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of another's privacy. You are solely responsible for the content you upload and the consequences of its analysis." },
    { icon: Shield, title: "4. Intellectual Property", content: "The Service and its original content, features, and functionality are and will remain the exclusive property of DeepFakeVigilant and its licensors. The CNN-ELA-GAN Fusion with Semantic Consistency Check technology is protected by copyright, trademark, and other laws. Our copyright © 2025 NetzSpaz / DeepFakeVigilant must be respected and included in any shared reports." },
    { icon: AlertCircle, title: "5. Disclaimer of Warranties", content: "The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance. DeepFakeVigilant does not warrant that the results will be accurate, reliable, or uninterrupted." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-gray-600">Last updated: January 15, 2025</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p>Please read these Terms and Conditions carefully before using the DeepFakeVigilant service operated by NetzSpaz.</p>
              
              {sections.map((section, index) => (
                <div key={index} className="mt-8">
                  <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    {section.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </div>
              ))}
              
              <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Contact Information</h3>
                <p className="text-blue-800">
                  Email: deepfakevigilant@gmail.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <div className="flex flex-col items-center gap-4">
            {isButtonDisabled ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>You can go back in {countdown} seconds</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">You may now return to the previous page.</p>
            )}
            <Button 
              onClick={() => window.history.back()} // Mock navigation back
              disabled={isButtonDisabled}
              variant="outline"
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
          <p className="text-gray-600 mt-6">
            © 2025 NetzSpaz / DeepFakeVigilant. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- PrivacyPage Component (logic from Pages/Privacy.js) ---
function PrivacyPage({ navigateTo }) {
  const [countdown, setCountdown] = useState(10);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsButtonDisabled(false);
    }
  }, [countdown]);

  const sections = [
      { icon: Shield, title: "1. Our Commitment to Privacy", content: "Your privacy is critically important to us. At DeepFakeVigilant, we have a few fundamental principles: we are thoughtful about the personal information we ask you to provide, we store personal information for only as long as we have a reason to keep it, and we aim for full transparency on how we gather, use, and share your personal information. This Privacy Policy applies to information that we collect about you when you use our CNN-ELA-GAN Fusion with Semantic Consistency Check detection service." },
      { icon: Database, title: "2. Information We Collect", content: "We only collect information about you if we have a reason to do so—for example, to provide our Services, to communicate with you, or to make our Services better. We collect this information from three sources: if and when you provide information to us, automatically through operating our Services, and from outside sources. Our AI models process video data temporarily for analysis purposes only." },
      { icon: Trash2, title: "3. Zero Video Data Retention", content: "We have a strict zero-retention policy for all uploaded video content. Videos are processed in-memory using our CNN-ELA-GAN Fusion with Semantic Consistency Check technology and are permanently deleted immediately after the analysis is complete. We do not store, share, or use your video content for any purpose other than providing the requested deepfake analysis." },
      { icon: UserCircle, title: "4. Optional Account Information", content: "Creating an account is optional. If you choose to register, we collect your name and email address for authentication purposes. This information is securely stored and is never shared with third parties. Review data (ratings, comments) is stored with appropriate access controls and is not linked to your personal account information without your explicit consent." },
      { icon: Cookie, title: "5. Cookies and Analytics", content: "We use cookies for essential website functionality, such as maintaining your login session and preserving analysis results during your session. We may use privacy-respecting analytics services to understand website traffic and improve our CNN-ELA-GAN Fusion with Semantic Consistency Check service. We do not use tracking cookies for advertising purposes." },
      { icon: Lock, title: "6. Security and Data Protection", content: "We work very hard to protect information about you against unauthorized access, use, alteration, or destruction, and take reasonable measures to do so, such as monitoring our Services for potential vulnerabilities and attacks. All data transmission is encrypted using SSL/TLS. Our AI processing infrastructure uses secure, isolated environments for video analysis." }
  ];

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                  <p className="text-gray-600">Last updated: January 15, 2025</p>
              </div>

              <Card className="border-none shadow-xl">
                  <CardContent className="p-8 md:p-12">
                      <div className="prose prose-lg max-w-none">
                          <p>DeepFakeVigilant is committed to protecting your privacy and ensuring you have a positive experience on our website and AI detection platform. This policy outlines our handling practices and how we collect and use the information you provide.</p>
                          
                          {sections.map((section, index) => (
                              <div key={index} className="mt-8">
                                  <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
                                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                          <section.icon className="w-5 h-5 text-blue-600" />
                                      </div>
                                      {section.title}
                                  </h2>
                                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                              </div>
                          ))}
                          
                          <div className="mt-12 p-6 bg-purple-50 rounded-lg">
                              <h3 className="text-xl font-bold text-purple-900 mb-3">Data Processing Technology</h3>
                              <p className="text-purple-800">
                                  Our CNN-ELA-GAN Fusion with Semantic Consistency Check technology processes videos using advanced machine learning models. This processing occurs in secure, encrypted environments with automatic data deletion after analysis completion. No human reviewers access your video content during or after processing.
                              </p>
                          </div>
                      </div>
                  </CardContent>
              </Card>

              <div className="text-center mt-12 py-8 border-t border-gray-200">
                  <div className="flex flex-col items-center gap-4">
                      {isButtonDisabled ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>You can go back in {countdown} seconds</span>
                      </div>
                      ) : (
                      <p className="text-sm text-gray-500">You may now return to the previous page.</p>
                      )}
                      <Button 
                          onClick={() => window.history.back()} 
                          disabled={isButtonDisabled}
                          variant="outline"
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Go Back
                      </Button>
                  </div>
              </div>
          </div>
      </div>
  );
}


// --- PDFReportPage Component (logic from Pages/PDFReport.js) ---
function PDFReportPage() {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(null);

    useEffect(() => {
        const urlParams = getParamsFromHash(window.location.hash);
        const analysisId = urlParams.id;
        setId(analysisId);

        if (analysisId) {
            // Mock session storage access for the report data
            const data = sessionStorage.getItem(`analysisResult-${analysisId}`);
            if (data) {
                const parsedData = JSON.parse(data);
                setAnalysisResult(parsedData);
                document.title = `DFV_FR_${parsedData.id.replace('analysis_', '')}`;
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (analysisResult && !loading) {
            // Delay print to allow content and images to render fully
            const printTimeout = setTimeout(() => {
                window.print();
            }, 1000);
            return () => clearTimeout(printTimeout);
        }
    }, [analysisResult, loading]);

    if (loading) {
        return <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '50px' }}>Loading Forensic Report...</div>;
    }

    if (!analysisResult) {
        return (
            <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '50px' }}>
                <h2>Report Generation Failed</h2>
                <p>Analysis data not found for ID: {id}. Please close this tab and generate the report again from the results page.</p>
            </div>
        );
    }

    const isFakeVideo = (analysisResult.fake_frames_count / analysisResult.total_frames) * 100 > 30;
    const fakeFramesPercent = (analysisResult.fake_frames_count / analysisResult.total_frames) * 100;
    const realFramesPercent = 100 - fakeFramesPercent;

    return (
        <div className="watermark-container" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#1f2937' }}>
            <style>
                {`
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        @page { size: A4; margin: 15mm; }
                        .no-print { display: none; }
                    }
                    .watermark-container::before {
                        content: 'DeepFakeVigilant';
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 8rem;
                        font-weight: bold;
                        color: #000;
                        opacity: 0.04;
                        z-index: -1;
                        text-align: center;
                    }
                    .report-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                    .report-table th, .report-table td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; font-size: 0.9rem; }
                    .report-table th { background-color: #f9fafb; font-weight: 600; color: #0D47A1; }
                    .fake-frame-details { page-break-inside: avoid; }
                    .header-icon { display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; background-color: #0D47A1; border-radius: 8px; }
                `}
            </style>
            
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #1976D2', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="header-icon">
                        <Shield color="#fff" size={28} />
                    </div>
                    <div>
                        <h1 style={{ color: '#0D47A1', margin: 0, fontSize: '2rem' }}>Forensic Video Analysis Report</h1>
                        <p style={{ margin: 0, color: '#4b5563' }}>Generated by DeepFakeVigilant</p>
                    </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#4b5563' }}>
                    <div><strong>Report ID:</strong> {analysisResult.id}</div>
                    <div><strong>Date:</strong> {new Date().toLocaleString()}</div>
                </div>
            </header>

            <main>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0D47A1', borderBottom: '1px solid #d1d5db', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Executive Summary</h2>
                    <table className="report-table">
                        <tbody>
                            <tr><th style={{ width: '30%' }}>Video File</th><td>{analysisResult.video_filename}</td></tr>
                            <tr><th>Overall Result</th>
                                <td style={{ fontWeight: 'bold', color: isFakeVideo ? '#b91c1c' : '#15803d', backgroundColor: isFakeVideo ? '#fee2e2' : '#dcfce7' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {isFakeVideo ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                                        {isFakeVideo ? 'Manipulation Detected' : 'Authentic Content Verified'}
                                    </div>
                                </td>
                            </tr>
                            <tr><th>Confidence Score</th><td>{analysisResult.overall_fakeness_score}% Likelihood of Manipulation</td></tr>
                        </tbody>
                    </table>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0D47A1', borderBottom: '1px solid #d1d5db', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Analysis Metrics</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <FileVideo size={20} color="#4b5563" />
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Frame Analysis</h3>
                            </div>
                            <div>Total Frames: {analysisResult.total_frames}</div>
                            <div style={{ color: '#b91c1c' }}>Fake Frames: {analysisResult.fake_frames_count} ({fakeFramesPercent.toFixed(1)}%)</div>
                            <div style={{ color: '#15803d' }}>Real Frames: {analysisResult.total_frames - analysisResult.fake_frames_count} ({realFramesPercent.toFixed(1)}%)</div>
                        </div>
                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <Clock size={20} color="#4b5563" />
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Performance</h3>
                            </div>
                            <div>Video Duration: {analysisResult.video_duration?.toFixed(2) || 'N/A'}s</div>
                            <div>Processing Time: {analysisResult.processing_time}s</div>
                            <div>Analysis Frame Rate: {analysisResult.frame_rate} FPS</div>
                        </div>
                    </div>
                </section>

                {analysisResult.fake_frames_count > 0 && (
                    <section style={{ marginBottom: '2rem', pageBreakBefore: 'auto' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0D47A1', borderBottom: '1px solid #d1d5db', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Detected Manipulations</h2>
                        <table className="report-table">
                            <thead><tr><th>Frame No.</th><th>Timestamp</th><th>Manipulation Type</th><th>Confidence</th><th>Affected Regions</th></tr></thead>
                            <tbody>
                                {analysisResult.analysis_results.filter(f => f.is_fake).slice(0, 50).map((frame, index) => (
                                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9fafb' : '#fff' }} className="fake-frame-details">
                                        <td>{frame.frame_number}</td>
                                        <td>{frame.timestamp}s</td>
                                        <td>{frame.manipulation_type}</td>
                                        <td>{frame.confidence_score}%</td>
                                        <td>{frame.manipulated_regions?.join(', ') || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {analysisResult.fake_frames_count > 50 && (
                            <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#6b7280' }}>... and {analysisResult.fake_frames_count - 50} more fake frames.</p>
                        )}
                    </section>
                )}

                <section style={{ pageBreakBefore: 'auto' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0D47A1', borderBottom: '1px solid #d1d5db', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Technology & Methodology</h2>
                    <table className="report-table">
                        <tbody>
                            <tr><th style={{ width: '30%' }}>Detection Method</th><td>CNN-ELA-GAN Fusion with Semantic Consistency Check</td></tr>
                            <tr><th>Stated Accuracy</th><td>99.2% (in controlled environments)</td></tr>
                            <tr><th>Model Versions</th>
                                <td>
                                    CNN: {analysisResult.model_versions.cnn_model}, ELA: {analysisResult.model_versions.ela_model}, GAN: {analysisResult.model_versions.gan_model}, Semantic: {analysisResult.model_versions.semantic_model}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </main>

            <footer style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #d1d5db', fontSize: '0.75rem', color: '#6b7280' }}>
                <p><strong>Disclaimer:</strong> This report was generated by an automated AI system. Results are for informational purposes and should be considered alongside other verification methods. DeepFakeVigilant is not liable for any actions taken based on this report.</p>
                <p>© {new Date().getFullYear()} NetzSpaz / DeepFakeVigilant | https://deepfakevigilant.base44.app</p>
            </footer>
        </div>
    );
}

// --- Main App Component (App.jsx) ---
function App() {
  const [currentPageName, setCurrentPageName] = useState(getPageNameFromHash(window.location.hash));
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Custom Navigation function
  const navigateTo = (pageName, params = {}) => {
    window.location.hash = createPageUrl(pageName, params);
  };
  
  // Hash change listener
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPageName(getPageNameFromHash(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    // Initial check in case the URL loads with a specific hash
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    checkAuth();
  }, [currentPageName]);

  const isAdmin = user && (user.role === 'admin' || user.admin_level === 'primary' || user.admin_level === 'secondary');
  const noHeaderFooterPages = ["SignIn", "Terms", "Privacy", "PDFReport"];
  const showHeaderFooter = !noHeaderFooterPages.includes(currentPageName);
  
  // Force redirect if accessing admin portal without permission
  if (!loadingUser && (currentPageName === 'AdminPortal') && !isAdmin) {
      if (user) {
          navigateTo('Home');
      } else {
          navigateTo('SignIn');
      }
  }
  
  // Render logic (Layout and Router)
  const renderPage = () => {
    switch (currentPageName) {
      case 'About':
        return <AboutPage user={user} />;
      case 'Contact':
        return <ContactPage />;
      case 'Research':
        return <ResearchPage />;
      case 'AdminPortal':
        return <AdminPortalPage user={user} />;
      case 'SignIn':
        return <SignInPage navigateTo={navigateTo} />;
      case 'Terms':
        return <TermsPage navigateTo={navigateTo} />;
      case 'Privacy':
        return <PrivacyPage navigateTo={navigateTo} />;
      case 'PDFReport':
        return <PDFReportPage />;
      case 'Home':
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  const handleSignOut = async () => {
    await base44.auth.logout();
  };

  const handleSignIn = () => {
    navigateTo("SignIn");
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --primary-blue: #0D47A1;
          --secondary-blue: #1976D2;
          --light-blue: #E3F2FD;
        }
        .floating-animation { animation: float 6s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .pulse-blue { animation: pulse-blue 3s infinite; }
        @keyframes pulse-blue {
          0%, 100% { box-shadow: 0 0 0 0 rgba(13, 71, 161, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(13, 71, 161, 0); }
        }
        .card { transition: all 0.3s ease; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
        @media (max-width: 768px) { .floating-animation { animation: none; } }
      `}</style>
      
      {/* Header */}
      {showHeaderFooter && (
        <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <a href={createPageUrl("Home")} className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center pulse-blue">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    DeepFakeVigilant
                  </span>
                  <span className="text-xs text-gray-500 -mt-1">AI-Powered Detection</span>
                </div>
              </a>

              <nav className="hidden md:flex items-center space-x-8">
                <a href={createPageUrl("Home")} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
                <a href={createPageUrl("Contact")} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
                <a href={createPageUrl("Research")} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Research</a>
                <a href={createPageUrl("About")} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
                {isAdmin && (
                  <a href={createPageUrl("AdminPortal")} className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Admin Portal
                  </a>
                )}
              </nav>

              <div className="hidden md:flex items-center space-x-4">
                {!loadingUser && (
                  <>
                    {user && user.id !== 'anon' ? (
                      <>
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <UserCircle className="w-4 h-4" />
                          {user.full_name || user.email}
                        </span>
                        <Button onClick={handleSignOut} variant="outline" size="sm">
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleSignIn} variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Mobile Menu Button - Stubbed interaction */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => alert("Mobile menu not implemented in this preview.")}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      {showHeaderFooter && (
        <footer className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">DeepFakeVigilant</span>
                </div>
                <p className="text-gray-600 text-sm max-w-md">
                  Advanced AI-powered deepfake detection using CNN-ELA-GAN Fusion with Semantic Consistency Check analysis. 
                  Protecting digital authenticity with cutting-edge technology.
                </p>
                <div className="mt-4">
                  <a href={createPageUrl("Home")}>
                    <Button variant="outline" size="sm">
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Button>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
                <div className="space-y-2">
                  <a href={createPageUrl("Terms")} className="block text-sm text-gray-600 hover:text-blue-600">
                    Terms & Conditions
                  </a>
                  <a href={createPageUrl("Privacy")} className="block text-sm text-gray-600 hover:text-blue-600">
                    Privacy Policy
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
                <div className="space-y-2">
                  <a href={createPageUrl("Home")} className="block text-sm text-gray-600 hover:text-blue-600">
                    Home
                  </a>
                  <a href={createPageUrl("Contact")} className="block text-sm text-gray-600 hover:text-blue-600">
                    Contact Us
                  </a>
                  <a href={createPageUrl("About")} className="block text-sm text-gray-600 hover:text-blue-600">
                    About Us
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                © 2025 NetzSpaz / DeepFakeVigilant. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;