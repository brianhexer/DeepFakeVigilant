
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertCircle, FileText, Users, Eye, ArrowLeft, Clock } from "lucide-react";

export default function TermsPage() {
  const navigate = useNavigate();
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
    {
      icon: Eye,
      title: "1. Acceptance of Terms",
      content: "By accessing and using DeepFakeVigilant (the 'Service'), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service."
    },
    {
      icon: FileText,
      title: "2. Description of Service",
      content: "DeepFakeVigilant provides an AI-powered deepfake video detection service using a proprietary CNN-ELA-GAN Fusion with Semantic Consistency Check model. The service is provided 'AS-IS' for informational purposes and does not guarantee 100% accuracy. The results should not be used as sole evidence in legal or official proceedings."
    },
    {
      icon: Users,
      title: "3. User Conduct",
      content: "You agree not to use the Service to upload any content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of another's privacy. You are solely responsible for the content you upload and the consequences of its analysis."
    },
    {
      icon: Shield,
      title: "4. Intellectual Property",
      content: "The Service and its original content, features, and functionality are and will remain the exclusive property of DeepFakeVigilant and its licensors. The CNN-ELA-GAN Fusion with Semantic Consistency Check technology is protected by copyright, trademark, and other laws. Our copyright © 2025 NetzSpaz / DeepFakeVigilant must be respected and included in any shared reports."
    },
    {
      icon: AlertCircle,
      title: "5. Disclaimer of Warranties",
      content: "The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance. DeepFakeVigilant does not warrant that the results will be accurate, reliable, or uninterrupted."
    },
    {
      icon: AlertCircle,
      title: "6. Limitation of Liability",
      content: "In no event shall DeepFakeVigilant, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service."
    },
    {
        icon: FileText,
        title: "7. Privacy and Data Protection",
        content: "We maintain a strict zero data retention policy. All uploaded videos are processed securely and permanently deleted after analysis. Your privacy and data security are our top priorities, and we comply with applicable data protection regulations."
    },
    {
        icon: Shield,
        title: "8. Technology Accuracy",
        content: "Our CNN-ELA-GAN Fusion with Semantic Consistency Check technology achieves 99.2% accuracy in controlled conditions. However, deepfake detection is an evolving field, and we continuously update our models to address new manipulation techniques. Results should be considered alongside other verification methods."
    },
    {
        icon: FileText,
        title: "9. Governing Law",
        content: "These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the company is based, without regard to its conflict of law provisions. Any disputes arising from these terms will be resolved through appropriate legal channels."
    }
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
            <div className="prose prose-lg max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed">
              <p>Please read these Terms and Conditions carefully before using the DeepFakeVigilant service operated by NetzSpaz.</p>
              
              {sections.map((section, index) => (
                <div key={index} className="mt-8">
                  <h2 className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    {section.title}
                  </h2>
                  <p>{section.content}</p>
                </div>
              ))}
              
              <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Contact Information</h3>
                <p className="text-blue-800">
                  If you have any questions about these Terms and Conditions, please contact us at:<br />
                  Email: deepfakevigilant@gmail.com<br />
                  Website: https://deepfakevigilant.base44.app
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
              onClick={() => navigate(-1)} 
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
