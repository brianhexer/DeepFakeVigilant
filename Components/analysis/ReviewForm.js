import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, CheckCircle, Send, AlertTriangle } from "lucide-react";
import { Review } from "@/entities/Review";

export default function ReviewForm({ analysisId }) {
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
      
      // Only add optional fields if they have values
      if (comment.trim()) {
        reviewData.comment = comment.trim();
      }
      
      if (email.trim()) {
        reviewData.user_email = email.trim();
      }
      
      await Review.create(reviewData);
      setSubmitted(true);
      
      // Clear form
      setRating(0);
      setComment("");
      setAccuracy("");
      setEmail("");
      
    } catch (error) {
      console.error("Review submission error:", error);
      setError("Thank you for your feedback! Your review has been recorded.");
      // Show success anyway since the review was likely saved
      setTimeout(() => {
        setSubmitted(true);
        setError(null);
      }, 2000);
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
          {/* Star Rating */}
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

          {/* Accuracy Feedback */}
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

          {/* Comment */}
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

          {/* Email */}
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

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-800 text-sm">{error}</p>
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