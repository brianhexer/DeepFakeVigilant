import React, { useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileVideo, X, CheckCircle, AlertTriangle } from "lucide-react";

export default function VideoUploadZone({ onVideoUploaded }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
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
  }, [onVideoUploaded, setError]); // Added setError and onVideoUploaded to dependencies

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile, setDragActive]); // Added handleFile and setDragActive to dependencies

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
                Supports MP4, AVI, MOV, MKV, WebM, OGG • No size limit
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