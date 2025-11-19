
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User as UserEntity } from "@/entities/User";
import { TeamMember } from "@/entities/TeamMember";
import { UploadFile } from "@/integrations/Core";
import { 
  Shield, 
  Brain, 
  Eye, 
  Zap, 
  Lock, 
  Users, 
  Globe, 
  Award,
  CheckCircle,
  ArrowRight,
  Plus,
  Edit3,
  Save,
  X,
  Upload,
  Camera,
  User
} from "lucide-react";
import { AppStats } from "@/entities/AppStats";

export default function AboutPage() {
  const [user, setUser] = useState(null);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true); // Added loading state for stats
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    description: "",
    profile_image: null
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [teamContainer, setTeamContainer] = useState(null);

  useEffect(() => {
    checkAuth();
    loadTeamMembers();
    loadTotalAnalyses();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await UserEntity.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const loadTeamMembers = async () => {
    try {
      const members = await TeamMember.list('display_order');
      if (members.length === 0) {
        // Create default member if none exist
        const defaultMember = await TeamMember.create({
          name: "BRIAN",
          role: "Founder of NetzSpaz & Lead AI Researcher",
          description: "Leading innovation in deepfake detection and AI security research and founder of NetzSpaz",
          display_order: 1
        });
        setTeamMembers([defaultMember]);
      } else {
        setTeamMembers(members);
      }
    } catch (error) {
      console.error("Could not load team members:", error);
    }
  };

  const loadTotalAnalyses = async () => {
    setLoadingStats(true);
    try {
      // Try to get from AppStats first
      const stats = await AppStats.list();
      
      if (stats.length > 0) {
        const totalFromStats = stats.reduce((sum, stat) => sum + (stat.total_analyses || 0), 0);
        setTotalAnalyses(totalFromStats);
      } else {
        // Fallback: try to calculate from all users if AppStats is empty or inaccessible
        try {
          const allUsers = await UserEntity.list();
          const totalFromUsers = allUsers.reduce((sum, userData) => sum + (userData.analysis_count || 0), 0);
          setTotalAnalyses(totalFromUsers);
        } catch (userError) {
          console.log("Could not load user stats, defaulting to 0:", userError);
          setTotalAnalyses(0); // Default to 0 if user stats also fail
        }
      }
    } catch (error) {
      console.error("Could not load total analyses from AppStats, trying users:", error);
      // If AppStats fails, try to load from users
      try {
        const allUsers = await UserEntity.list();
        const totalFromUsers = allUsers.reduce((sum, userData) => sum + (userData.analysis_count || 0), 0);
        setTotalAnalyses(totalFromUsers);
      } catch (userError) {
        console.log("Could not load user stats, defaulting to 0:", userError);
        setTotalAnalyses(0); // Default to 0 if user stats also fail
      }
    } finally {
      setLoadingStats(false);
    }
  };

  // Updated isAdmin check to include primary admin level
  const isAdmin = user && (user.role === 'admin' || user.admin_level === 'primary');

  const handleImageUpload = async (file, memberId = null) => {
    if (!file) return null;
    
    setUploadingImage(true);
    try {
      const result = await UploadFile({ file });
      
      if (memberId) {
        // Update existing member in database
        await TeamMember.update(memberId, { profile_image: result.file_url });
        loadTeamMembers(); // Reload to get updated data
      } else {
        // For new member
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
        loadTeamMembers(); // Reload to get updated data for all users
      } catch (error) {
        console.error("Could not add team member:", error);
        alert("Failed to add team member. Please try again.");
      }
    }
  };

  const handleRemoveMember = async (id) => {
    try {
      await TeamMember.delete(id);
      loadTeamMembers(); // Reload to get updated data for all users
    } catch (error) {
      console.error("Could not remove team member:", error);
      alert("Failed to remove team member. Please try again.");
    }
  };

  const handleUpdateMember = async (id, updates) => {
    try {
      await TeamMember.update(id, updates);
      loadTeamMembers(); // Reload to get updated data for all users
    } catch (error) {
      console.error("Could not update team member:", error);
    }
  };

  const handleDoneEditing = () => {
    setIsEditingTeam(false);
    loadTeamMembers(); // Final reload to ensure all users see latest data
    alert("✅ Team updates saved! All users will now see the updated team information.");
  };

  // Auto-scroll team container to center based on number of members
  useEffect(() => {
    if (teamContainer && teamMembers.length > 0) {
      const scrollAmount = (teamMembers.length * 320 - teamContainer.offsetWidth) / 2;
      teamContainer.scrollLeft = Math.max(0, scrollAmount);
    }
  }, [teamMembers.length, teamContainer]);

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
      {/* Hero Section */}
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

      {/* Technology Section */}
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

      {/* Mission Section */}
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

      {/* Team Section */}
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

          {/* Horizontally Scrollable Team Grid */}
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
                    
                    {/* Profile Image */}
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

              {/* Add New Member Card - Only visible to admins when editing */}
              {isEditingTeam && isAdmin && (
                <Card className="border-2 border-dashed border-gray-300 flex-shrink-0 w-80 hover:border-blue-400 transition-colors">
                  <CardContent className="p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Add Team Member</h3>
                    
                    {/* Profile Image Upload */}
                    <div className="mb-4 text-center">
                      {newMember.profile_image ? (
                        <img 
                          src={newMember.profile_image} 
                          alt="New member"
                          className="w-20 h-20 rounded-full mx-auto object-cover mb-2"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <User className="w-8 h-8 text-gray-400" />
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
          
          {/* Scroll indicators */}
          {teamMembers.length > 3 && (
            <div className="text-center text-sm text-gray-500">
              Scroll horizontally to see all team members
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Analyze Your Complete Video?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users protecting digital authenticity with our advanced complete video analysis at 6 FPS using CNN-ELA-GAN Fusion with Semantic Consistency Check AI
          </p>
          <Link to={createPageUrl("Home")}>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto">
              Start Complete Analysis
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <div className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2025 NetzSpaz / DeepFakeVigilant. All rights reserved.<br />
            Protecting digital authenticity worldwide through complete video analysis using CNN-ELA-GAN Fusion with Semantic Consistency Check AI technology.
          </p>
        </div>
      </div>
    </div>
  );
}
