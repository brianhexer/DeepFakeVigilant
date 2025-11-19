
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Database, Trash2, Cookie, UserCheck, Shield, ArrowLeft, Clock } from "lucide-react";

export default function PrivacyPage() {
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
          icon: Shield,
          title: "1. Our Commitment to Privacy",
          content: "Your privacy is critically important to us. At DeepFakeVigilant, we have a few fundamental principles: we are thoughtful about the personal information we ask you to provide, we store personal information for only as long as we have a reason to keep it, and we aim for full transparency on how we gather, use, and share your personal information. This Privacy Policy applies to information that we collect about you when you use our CNN-ELA-GAN Fusion with Semantic Consistency Check detection service."
        },
        {
          icon: Database,
          title: "2. Information We Collect",
          content: "We only collect information about you if we have a reason to do so—for example, to provide our Services, to communicate with you, or to make our Services better. We collect this information from three sources: if and when you provide information to us, automatically through operating our Services, and from outside sources. Our AI models process video data temporarily for analysis purposes only."
        },
        {
          icon: Trash2,
          title: "3. Zero Video Data Retention",
          content: "We have a strict zero-retention policy for all uploaded video content. Videos are processed in-memory using our CNN-ELA-GAN Fusion with Semantic Consistency Check technology and are permanently deleted immediately after the analysis is complete. We do not store, share, or use your video content for any purpose other than providing the requested deepfake analysis."
        },
        {
          icon: UserCheck,
          title: "4. Optional Account Information",
          content: "Creating an account is optional. If you choose to register, we collect your name and email address for authentication purposes. This information is securely stored and is never shared with third parties. Review data (ratings, comments) is stored with appropriate access controls and is not linked to your personal account information without your explicit consent."
        },
        {
          icon: Cookie,
          title: "5. Cookies and Analytics",
          content: "We use cookies for essential website functionality, such as maintaining your login session and preserving analysis results during your session. We may use privacy-respecting analytics services to understand website traffic and improve our CNN-ELA-GAN Fusion with Semantic Consistency Check service. We do not use tracking cookies for advertising purposes."
        },
        {
          icon: Lock,
          title: "6. Security and Data Protection",
          content: "We work very hard to protect information about you against unauthorized access, use, alteration, or destruction, and take reasonable measures to do so, such as monitoring our Services for potential vulnerabilities and attacks. All data transmission is encrypted using SSL/TLS. Our AI processing infrastructure uses secure, isolated environments for video analysis."
        }
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
                        <div className="prose prose-lg max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed">
                            <p>DeepFakeVigilant is committed to protecting your privacy and ensuring you have a positive experience on our website and AI detection platform. This policy outlines our handling practices and how we collect and use the information you provide.</p>
                            
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
                            
                            <div className="mt-12 p-6 bg-purple-50 rounded-lg">
                                <h3 className="text-xl font-bold text-purple-900 mb-3">Data Processing Technology</h3>
                                <p className="text-purple-800">
                                    Our CNN-ELA-GAN Fusion with Semantic Consistency Check technology processes videos using advanced machine learning models. This processing occurs in secure, encrypted environments with automatic data deletion after analysis completion. No human reviewers access your video content during or after processing.
                                </p>
                            </div>
                            
                            <div className="mt-6 p-6 bg-blue-50 rounded-lg">
                                <h3 className="text-xl font-bold text-blue-900 mb-3">Contact Information</h3>
                                <p className="text-blue-800">
                                    If you have any questions about this Privacy Policy, please contact us at:<br />
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
