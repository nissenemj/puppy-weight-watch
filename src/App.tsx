
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Play, TrendingUp, Users, Heart, Share2, Trophy, Sparkles, Star } from "lucide-react";

// Import viral components
import ViralVideoPlayer from "./components/ViralVideoPlayer";
import ViralGrowthChart from "./components/ViralGrowthChart";
import UserGeneratedContent from "./components/UserGeneratedContent";
import ViralPuppyQuiz from "./components/ViralPuppyQuiz";

// Import existing assets
import puppyHero from "./assets/dog1.png";
import dog2 from "./assets/dog2.png";
import dog3 from "./assets/dog3.png";

// Mock data for viral components
const mockWeightData = [
  { week: 1, weight: 0.8, milestone: "First week!", target: 0.9 },
  { week: 2, weight: 1.6, milestone: "Doubled birth weight!", target: 1.8 },
  { week: 4, weight: 3.2, target: 3.6 },
  { week: 6, weight: 4.8, milestone: "Started solid food!", target: 5.4 },
  { week: 8, weight: 6.5, milestone: "Ready for new home!", target: 7.2 },
  { week: 10, weight: 8.2, target: 9.0 },
  { week: 12, weight: 9.8, milestone: "3 months old!", target: 10.8 }
];

const mockAchievements = [
  "First Week Survivor",
  "Growth Champion",
  "Healthy Eater",
  "Weight Tracker Pro"
];

const mockUserStories = [
  {
    id: "1",
    author: "Sarah Johnson",
    authorImage: "/api/placeholder/32/32",
    puppyName: "Bella",
    content: "Bella's growth journey has been incredible! Using this app helped me catch a potential health issue early. She's now a healthy 6-month-old Golden Retriever! 🐕💕",
    likes: 127,
    comments: 23,
    shares: 45,
    timestamp: "2 hours ago",
    trending: true,
    milestone: "6 Month Milestone"
  },
  {
    id: "2",
    author: "Mike Chen",
    authorImage: "/api/placeholder/32/32",
    puppyName: "Charlie",
    content: "Charlie was the runt of the litter, but with proper nutrition tracking, he's now thriving! This community has been so supportive. Thank you all! 🙏",
    likes: 89,
    comments: 18,
    shares: 32,
    timestamp: "1 day ago",
    milestone: "Healthy Weight Gained"
  },
  {
    id: "3",
    author: "Emily Rodriguez",
    authorImage: "/api/placeholder/32/32",
    puppyName: "Luna",
    content: "Luna's first vet visit was perfect! The vet was impressed with how well I've been tracking her growth. This app is a game-changer for new puppy parents! 🎉",
    likes: 156,
    comments: 31,
    shares: 78,
    timestamp: "3 days ago",
    trending: true,
    milestone: "Perfect Vet Visit"
  }
];

const viralVideos = [
  {
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "5 Signs Your Puppy is Growing Perfectly!",
    description: "Learn the key indicators of healthy puppy growth",
    views: "127K",
    likes: "8.9K",
    shares: "2.1K"
  },
  {
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Puppy Weight Milestones Explained",
    description: "What to expect in your puppy's first 12 weeks",
    views: "89K",
    likes: "6.2K",
    shares: "1.8K"
  }
];

const testimonials = [
  {
    text: "This app saved my puppy's life! Early detection of growth issues led to quick treatment. Forever grateful! ❤️",
    author: "Anna, Labrador owner 🐕",
    stars: 5,
    img: dog2,
    viral: true
  },
  {
    text: "My Golden Retriever went from underweight to perfectly healthy using these growth tracking tools! 📈",
    author: "Mikko, Golden Retriever owner 🐶",
    stars: 5,
    img: dog3,
    viral: true
  }
];

export default function App() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [userStories, setUserStories] = useState(mockUserStories);

  const handleAddStory = (newStory: any) => {
    const story = {
      ...newStory,
      id: Date.now().toString(),
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: "Just now"
    };
    setUserStories([story, ...userStories]);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen font-poppins">
      {/* Viral Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="relative overflow-hidden"
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-blue-600/20"></div>
        
        <div className="relative z-10 text-center p-8 md:p-16">
          {/* Viral badges */}
          <div className="flex justify-center gap-2 mb-6">
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending #1
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full">
              <Users className="w-3 h-3 mr-1" />
              50K+ Users
            </Badge>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mb-8"
          >
            <img
              src={puppyHero}
              alt="Adorable puppy"
              className="w-48 md:w-64 mx-auto rounded-full shadow-2xl"
            />
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-white p-2 rounded-full animate-bounce">
              <Heart className="w-6 h-6" />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4"
          >
            Watch Your Puppy Thrive! 📈🐶
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-700 mb-6 max-w-2xl mx-auto"
          >
            Track weight, get AI-powered tips, and join 50,000+ happy puppy parents! 🎉
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 mb-8"
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xl px-12 py-6 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 mr-4"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Start Free Tracking
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => setShowQuiz(true)}
              className="text-xl px-8 py-6 rounded-full border-2 border-purple-300 hover:bg-purple-50 transition-all duration-300"
            >
              <Play className="w-6 h-6 mr-2" />
              Take Viral Quiz
            </Button>
          </motion.div>

          <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
                ))}
              </div>
              <span>50,000+ happy puppy parents</span>
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span>4.9/5 rating</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Viral Quiz Section */}
      {showQuiz && (
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-16 px-4"
        >
          <ViralPuppyQuiz />
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => setShowQuiz(false)}
              className="px-6 py-3 rounded-full"
            >
              Close Quiz
            </Button>
          </div>
        </motion.section>
      )}

      {/* Features Grid with Viral Elements */}
      <section className="py-16 px-4 md:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why 50,000+ Puppy Parents Choose Us 🚀
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join the viral movement of data-driven puppy care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <Card className="p-8 rounded-3xl shadow-xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-100">
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 rounded-full">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">AI Growth Tracking</h3>
                <p className="text-gray-600 mb-4">Real-time growth charts with AI-powered insights and health alerts</p>
                <Button variant="outline" className="rounded-full">
                  Try Demo
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <Card className="p-8 rounded-3xl shadow-xl bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-100">
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 rounded-full">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">🍲</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Smart Food Calculator</h3>
                <p className="text-gray-600 mb-4">Personalized feeding recommendations based on breed, age, and growth</p>
                <Button variant="outline" className="rounded-full">
                  Calculate Now
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <Card className="p-8 rounded-3xl shadow-xl bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-100">
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white p-3 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Viral Community</h3>
                <p className="text-gray-600 mb-4">Share your puppy's journey and get support from 50K+ parents</p>
                <Button variant="outline" className="rounded-full">
                  Join Community
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Viral Video Content Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Trending Puppy Care Videos 🎬
            </h2>
            <p className="text-lg text-gray-600">
              Watch viral tips that helped thousands of puppy parents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {viralVideos.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <ViralVideoPlayer {...video} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Growth Chart Demo */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              See Your Puppy's Growth Journey 📊
            </h2>
            <p className="text-lg text-gray-600">
              Interactive charts that make tracking fun and engaging
            </p>
          </div>

          <ViralGrowthChart
            puppyName="Bella"
            puppyBreed="Golden Retriever"
            weightData={mockWeightData}
            achievements={mockAchievements}
          />
        </div>
      </section>

      {/* User Generated Content / Success Stories */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <UserGeneratedContent stories={userStories} onAddStory={handleAddStory} />
      </section>

      {/* Viral Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Viral Success Stories 🌟
            </h2>
            <p className="text-lg text-gray-600">
              Real stories from real puppy parents going viral
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-6 rounded-3xl shadow-xl bg-white border-2 border-purple-100">
                  <div className="flex items-center gap-2 mb-4">
                    {Array.from({ length: testimonial.stars }).map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    {testimonial.viral && (
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white ml-2">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Viral
                      </Badge>
                    )}
                  </div>
                  <p className="italic text-gray-700 mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={testimonial.img} alt="Happy puppy" className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          1.2K
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-3 h-3" />
                          543
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Viral CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Join the Viral Puppy Movement! 🚀
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Download our free puppy care guide and start tracking today
            </p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
              <input
                type="email"
                placeholder="Enter your email for free guide"
                className="px-6 py-4 rounded-full text-gray-800 text-lg w-full md:w-auto min-w-80"
              />
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Get Free Guide
              </Button>
            </div>

            <div className="flex justify-center items-center gap-6 text-sm opacity-80">
              <span>✅ Instant download</span>
              <span>✅ No spam, ever</span>
              <span>✅ Join 50K+ puppy parents</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer with Social Links */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6">
              <a href="/about" className="hover:text-purple-400 transition-colors">About</a>
              <a href="/contact" className="hover:text-purple-400 transition-colors">Contact</a>
              <a href="/privacy" className="hover:text-purple-400 transition-colors">Privacy</a>
            </div>
            <div className="flex gap-4">
              <a href="https://tiktok.com" className="hover:text-purple-400 transition-colors">
                <span className="text-2xl">🎵</span>
              </a>
              <a href="https://instagram.com" className="hover:text-purple-400 transition-colors">
                <span className="text-2xl">📸</span>
              </a>
              <a href="https://twitter.com" className="hover:text-purple-400 transition-colors">
                <span className="text-2xl">🐦</span>
              </a>
            </div>
          </div>
          <div className="text-center mt-6 text-gray-400">
            <p>&copy; 2024 Puppy Weight Watch. Join the viral movement! 🐕💕</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
