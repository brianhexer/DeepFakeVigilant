
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  MessageSquare, 
  Star, 
  Mail, 
  Calendar,
  Search,
  Filter,
  Trash2,
  Shield,
  BarChart3,
  Settings,
  Crown,
  Download,
  Clock, // New import for last visit icon
  Eye // New import for visit count icon
} from "lucide-react";
import { User as UserEntity } from "@/entities/User";
import { ContactMessage } from "@/entities/ContactMessage";
import { Review } from "@/entities/Review";
import { AppStats } from "@/entities/AppStats";

export default function AdminPortalPage() {
  const [user, setUser] = useState(null);
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
      
      // Calculate total analyses from both sources
      const userAnalysesSum = usersData.reduce((sum, userData) => sum + (userData.analysis_count || 0), 0);
      const appStatsTotal = stats.length > 0 ? (stats[0].total_analyses || 0) : 0;
      setTotalAnalyses(Math.max(userAnalysesSum, appStatsTotal));
      
      console.log("Loaded admin data:", {
        messages: messages.length,
        reviews: reviewsData.length,
        users: usersData.length,
        totalAnalyses: Math.max(userAnalysesSum, appStatsTotal),
        userAnalysesBreakdown: usersData.map(u => ({ email: u.email, count: u.analysis_count || 0 }))
      });
      
    } catch (error) {
      console.error("Failed to load data:", error);
      alert("Failed to load admin data. Please refresh the page.");
    }
  }, []);

  const checkAdminAccess = useCallback(async () => {
    try {
      const currentUser = await UserEntity.me();
      if (currentUser.role !== 'admin' && currentUser.admin_level !== 'primary' && currentUser.admin_level !== 'secondary') {
        window.location.href = '/';
        return;
      }
      setUser(currentUser);
      await loadData();
    } catch (error) {
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  }, [loadData]);

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
      alert(`✅ User access updated to ${adminLevel} successfully!\n\nThe user now has ${adminLevel} admin privileges.`);
    } catch (error) {
      console.error("Failed to update user access:", error);
      alert("❌ Failed to update user access. Please try again.");
    }
  };

  const isPrimaryAdmin = user && (user.role === 'admin' || user.admin_level === 'primary');
  const isSecondaryAdmin = user && user.admin_level === 'secondary';

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
      {/* Header */}
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
            <div className="flex items-center gap-3 w-full sm:w-auto"> {/* Added w-full sm:w-auto */}
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
                <Download className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> {/* Changed icon to Download */}
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Grid */}
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

        {/* Search Bar */}
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

        {/* Main Content */}
        <Card className="border-none shadow-xl floating-animation">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-gray-200 px-4 sm:px-6 pt-4 sm:pt-6">
                <TabsList className={`grid w-full max-w-lg ${isPrimaryAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  <TabsTrigger value="messages" className="text-xs sm:text-sm">
                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Messages </span>({filteredMessages.length})
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="text-xs sm:text-sm">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Reviews </span>({filteredReviews.length})
                  </TabsTrigger>
                  {isPrimaryAdmin && (
                    <TabsTrigger value="users" className="text-xs sm:text-sm">
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
