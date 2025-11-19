import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  BookOpen, 
  Users, 
  Award, 
  ExternalLink, 
  Download,
  Calendar,
  TrendingUp,
  Microscope,
  Globe
} from "lucide-react";

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
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

      {/* Research Focus Areas */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Research Focus
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Exploring multiple dimensions of deepfake detection and digital media authentication using CNN-ELA-GAN Fusion with Semantic Consistency Check technology
            </p>
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

      {/* Contact for Research */}
      <div className="py-20 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Collaborate with Us
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Interested in research collaboration, academic partnerships, or accessing our technology for research purposes?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:researchdeepfakevigilant@gmail.com">
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                <Users className="w-5 h-5 mr-2" />
                Research Partnerships
              </Button>
            </a>
            <a href="mailto:deepfakevigilant@gmail.com">
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                <BookOpen className="w-5 h-5 mr-2" />
                General Inquiries
              </Button>
            </a>
          </div>
          <div className="mt-8 space-y-2 text-purple-200">
            <p>Research Contact: <a href="mailto:researchdeepfakevigilant@gmail.com" className="underline hover:text-white">researchdeepfakevigilant@gmail.com</a></p>
            <p>General Support: <a href="mailto:deepfakevigilant@gmail.com" className="underline hover:text-white">deepfakevigilant@gmail.com</a></p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2025 NetzSpaz / DeepFakeVigilant. All rights reserved.<br />
            Advancing deepfake detection through open research and collaboration using CNN-ELA-GAN Fusion with Semantic Consistency Check technology.
          </p>
        </div>
      </div>
    </div>
  );
}