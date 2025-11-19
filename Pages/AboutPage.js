
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, Plus, Upload, Trash2, Shield, Award, Globe, Zap, Lock } from "lucide-react";
import { createPageUrl } from "@/utils";
import { TeamMember } from "@/entities/TeamMember";
import { UploadFile } from "@/integrations/Core";
import { User as UserEntity } from "@/entities/User";
import { AppStats } from "@/entities/AppStats";

const TeamMemberCard = ({ member, isEditing, onUpdate, onImageUpload, onDelete, uploadingImage }) => {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [description, setDescription] = useState(member.description);

  useEffect(() => {
    setName(member.name);
    setRole(member.role);
    setDescription(member.description);
  }, [member]);

  const handleBlur = () => {
    onUpdate(member.id, { name, role, description });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file, member.id);
    }
  };

  return (
    <Card className={`flex-shrink-0 w-80 text-center floating-animation hover:shadow-xl transition-shadow relative group ${uploadingImage ? 'opacity-70 cursor-not-allowed' : ''}`}>
      {isEditing && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-3 -right-3 rounded-full h-8 w-8 z-10"
            onClick={() => onDelete(member.id)}
            disabled={uploadingImage}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
      )}
      <CardContent className="p-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <img
            src={member.profile_image || "https://avatar.vercel.sh/random"}
            alt={member.name}
            className="rounded-full w-full h-full object-cover"
          />
          {isEditing && (
            <>
              <label htmlFor={`upload-${member.id}`} className={`absolute inset-0 bg-black/50 flex items-center justify-center rounded-full cursor-pointer transition-opacity ${uploadingImage ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {uploadingImage ? (
                  <span className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <Upload className="w-8 h-8 text-white" />
                )}
              </label>
              <input
                id={`upload-${member.id}`}
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
                disabled={uploadingImage}
              />
            </>
          )}
        </div>
        {isEditing ? (
          <div className="space-y-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={handleBlur} placeholder="Name" className="text-center" disabled={uploadingImage} />
            <Input value={role} onChange={(e) => setRole(e.target.value)} onBlur={handleBlur} placeholder="Role" className="text-center" disabled={uploadingImage} />
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} onBlur={handleBlur} placeholder="Description" className="text-center h-24" disabled={uploadingImage} />
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="text-blue-600">{member.role}</p>
            <p className="mt-2 text-gray-600 text-sm">{member.description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default function AboutPage() {
  const [user, setUser] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false); // New state for image upload
  const teamContainerRef = useRef(null); // Ref for team section scrolling
  const [totalAnalyses, setTotalAnalyses] = useState(0);

  const checkAuth = async () => {
    try {
      const currentUser = await UserEntity.me();
      setUser(currentUser);
    } catch (error) {
      console.log("User not authenticated");
    }
  };

  const loadTeamMembers = async () => {
    try {
      const members = await TeamMember.list({ sort: 'display_order' });
      setTeamMembers(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const loadStats = async () => {
    try {
      const stats = await AppStats.filter({ singleton: true });
      if (stats.length > 0) {
        setTotalAnalyses(stats[0].total_analyses || 0);
      }
    } catch (error) {
      console.error("Could not load app stats:", error);
    }
  };

  useEffect(() => {
    checkAuth();
    loadTeamMembers();
    loadStats();

    const interval = setInterval(() => {
      loadTeamMembers();
      loadStats();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll team container to center based on number of members
  useEffect(() => {
    if (teamContainerRef.current && teamMembers.length > 0) {
      const container = teamContainerRef.current;
      if (container.scrollWidth > container.clientWidth) {
        const centerScroll = (container.scrollWidth - container.clientWidth) / 2;
        container.scrollTo({ left: centerScroll, behavior: 'smooth' });
      } else {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
  }, [teamMembers]); // Depend on teamMembers to re-adjust scroll if members are added/removed

  const handleDoneEditing = () => {
    setIsEditing(false);
  };

  const handleUpdateMember = async (id, data) => {
    try {
      await TeamMember.update(id, data);
    } catch (error) {
      console.error("Failed to update member:", error);
    }
  };

  const handleAddNewMember = async () => {
    try {
      await TeamMember.create({
        name: "New Member",
        role: "New Role",
        description: "A brief description.",
        display_order: teamMembers.length + 1,
      });
      loadTeamMembers();
    } catch (error) {
      console.error("Failed to add new member:", error);
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await TeamMember.delete(id);
        loadTeamMembers();
      } catch (error) {
        console.error("Failed to delete member:", error);
      }
    }
  };

  const handleImageUpload = async (file, memberId) => {
    setUploadingImage(true);
    try {
      const { file_url } = await UploadFile({ file });
      await TeamMember.update(memberId, { profile_image: file_url });
      loadTeamMembers();
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  const isAdmin = user && user.role === 'admin';

  // Format analysis count display
  const formatAnalysisCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M+`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K+`;
    }
    return count.toString();
  };

  const achievements = [
    { metric: "99.2%", label: "Detection Accuracy", icon: Award },
    { metric: formatAnalysisCount(totalAnalyses), label: "Videos Analyzed", icon: Globe },
    { metric: "6 FPS", label: "Complete Analysis", icon: Zap },
    { metric: "100%", label: "Privacy Protection", icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center floating-animation">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Protecting Digital
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Authenticity
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              DeepFakeVigilant uses advanced CNN-ELA-GAN Fusion with Semantic Consistency Check technology
              to detect manipulated videos with 99.2% accuracy, helping preserve truth in our digital world.
            </p>

            {/* Achievements/Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mt-12">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center floating-animation">
                  <div className="text-4xl font-bold text-blue-600 mb-2 flex items-center justify-center">
                    <achievement.icon className="w-8 h-8 mr-2" />
                    {achievement.metric}
                  </div>
                  <div className="text-gray-600">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Advanced Technology</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            DeepFakeVigilant leverages a unique blend of state-of-the-art technologies to achieve unparalleled accuracy in deepfake detection. Our core innovation lies in the CNN-ELA-GAN Fusion with Semantic Consistency Check, a proprietary algorithm that analyzes subtle inconsistencies at multiple levels.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Brain className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">CNN-ELA-GAN Fusion</h3>
              <p className="text-gray-600 text-sm">
                Combines Convolutional Neural Networks for feature extraction, Error Level Analysis for image forensics, and Generative Adversarial Networks for synthetic data understanding.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Shield className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Semantic Consistency Check</h3>
              <p className="text-gray-600 text-sm">
                Analyzes the contextual and logical integrity of video content, identifying anomalies that typical pixel-based methods might miss, ensuring robust detection.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Users className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Continuous Learning</h3>
              <p className="text-gray-600 text-sm">
                Our models are constantly updated with new datasets and adversarial examples, adapting to evolving deepfake techniques and maintaining high detection rates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            In an era where digital manipulation threatens trust and truth, DeepFakeVigilant is committed to safeguarding digital authenticity. Our mission is to empower individuals and organizations with the tools to discern genuine content from sophisticated fakes, fostering a more secure and truthful digital ecosystem. We believe that technology should be a force for good, and our work is dedicated to upholding integrity in the digital realm.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div id="team" className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet Our Team</h2>
          <p className="mt-4 text-lg text-gray-600">The minds behind the technology.</p>
          {isAdmin && (
            <div className="text-center my-8">
              <Button onClick={() => setIsEditing(!isEditing)} disabled={uploadingImage}>
                {isEditing ? 'Done Editing' : 'Edit Team'}
              </Button>
            </div>
          )}

          <div className="relative mt-16">
            <div className="overflow-x-auto pb-4" ref={teamContainerRef}>
              <div className="flex justify-center gap-8 px-4">
                {teamMembers.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    isEditing={isEditing}
                    onUpdate={handleUpdateMember}
                    onImageUpload={handleImageUpload}
                    onDelete={handleDeleteMember}
                    uploadingImage={uploadingImage}
                  />
                ))}
                {isEditing && (
                  <div className="flex-shrink-0 w-80">
                    <Button onClick={handleAddNewMember} className="w-full h-full border-2 border-dashed" disabled={uploadingImage}>
                      <Plus className="w-8 h-8" />
                      Add New Member
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="mx-auto max-w-7xl py-12 px-6 text-center lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to uncover the truth?</span>
            <span className="block">Start your analysis today.</span>
          </h2>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link to={createPageUrl("Home")} className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-blue-600 hover:bg-blue-50">
                  Analyze a Video
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="py-12 bg-gray-800 text-white text-center">
        <p className="text-sm opacity-75">
          DeepFakeVigilant. A commitment to digital integrity. &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </div>
  );
}
