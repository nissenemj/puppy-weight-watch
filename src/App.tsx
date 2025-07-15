
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { 
  TrendingUp, 
  Heart, 
  Share2, 
  Play, 
  Sparkles, 
  Trophy,
  Users,
  Zap,
  ArrowRight
} from "lucide-react";

// Import viral components
import ViralHero from "./components/ViralHero";
import ViralFeatures from "./components/ViralFeatures";
import InteractiveGrowthChart from "./components/InteractiveGrowthChart";
import ViralVideoPlayer from "./components/ViralVideoPlayer";

// Sample data for testimonials
const viralTestimonials = [
  {
    name: "Sarah & Max 🐕",
    story: "Max gained 5lbs in 2 weeks! Our vet was amazed!",
    likes: 1247,
    shares: 89,
    avatar: "🐾",
    verified: true
  },
  {
    name: "Mike & Luna 🐶",
    story: "Luna's growth chart went viral on TikTok! #PuppyGoals",
    likes: 2156,
    shares: 156,
    avatar: "🌟",
    verified: true
  },
  {
    name: "Emma & Buddy 🐾",
    story: "Buddy's transformation story got 50k views!",
    likes: 3421,
    shares: 234,
    avatar: "💫",
    verified: true
  }
];

const quickStats = [
  { label: "Happy Puppies", value: "10,000+", icon: "🐕", color: "text-pink-600" },
  { label: "Viral Stories", value: "2,500+", icon: "🔥", color: "text-purple-600" },
  { label: "Growth Accuracy", value: "95%", icon: "📈", color: "text-green-600" },
  { label: "Social Shares", value: "50K+", icon: "📤", color: "text-blue-600" }
];

export default function App() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleGetStarted = () => {
    // Scroll to features section
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Viral Hero Section */}
      <ViralHero onGetStarted={handleGetStarted} />

      {/* Quick Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="py-12 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`text-3xl mb-2 ${stat.color}`}>{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Viral Features Section */}
      <div id="features">
        <ViralFeatures />
      </div>

      {/* Interactive Growth Chart */}
      <InteractiveGrowthChart />

      {/* Viral Video Content */}
      <ViralVideoPlayer />

      {/* Enhanced Testimonials */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="py-20 bg-gradient-to-b from-purple-50 to-pink-50"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <Sparkles className="w-4 h-4 mr-1" />
              Viral Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Real Stories, Real Results! 🌟
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of pet parents sharing their puppy's journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {viralTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="p-6 bg-white shadow-xl border-0 rounded-2xl relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-50" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                          {testimonial.verified && (
                            <Badge className="bg-blue-500 text-white text-xs">✓ Verified</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-red-500" />
                            {testimonial.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-4 h-4 text-blue-500" />
                            {testimonial.shares}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 italic mb-4">"{testimonial.story}"</p>
                    
                    <div className="flex gap-2">
                      <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs">#Viral</span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">#PuppyLove</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">#Success</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Community CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center"
          >
            <Users className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-3xl font-bold mb-4">Join Our Viral Community! 🚀</h3>
            <p className="text-xl mb-6 opacity-90">
              Share your puppy's journey and get featured on our social media!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <span className="bg-white/20 px-4 py-2 rounded-full">#PuppyGrowthJourney</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">#FurBaby</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">#ViralPuppy</span>
            </div>
            <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold">
              Share Your Story
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="py-20 bg-gradient-to-b from-pink-50 to-white"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <Zap className="w-4 h-4 mr-1" />
            Limited Time Offer
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Start Your Puppy's Viral Journey Today! 🐶✨
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join 10,000+ happy pet parents tracking their fur baby's growth with AI-powered insights and viral sharing features!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:scale-105 transition-all duration-200">
              <Play className="w-5 h-5 mr-2" />
              Start Free Tracking
            </Button>
            <Button variant="outline" className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg rounded-full">
              <Trophy className="w-5 h-5 mr-2" />
              Download Free Guide
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>10,000+ happy puppies</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>95% growth accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-blue-500" />
              <span>50k+ shares this week</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Puppy Weight Watch</h3>
              <p className="text-purple-100">
                The viral platform for tracking your fur baby's growth journey with AI-powered insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-purple-100">
                <li>AI Growth Tracker</li>
                <li>Viral Sharing</li>
                <li>Community Stories</li>
                <li>Smart Nutrition</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-purple-100">
                <li>Success Stories</li>
                <li>Viral Challenges</li>
                <li>Pet Tips</li>
                <li>Expert Advice</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-purple-100 hover:text-white">🐦 Twitter</a>
                <a href="#" className="text-purple-100 hover:text-white">📸 Instagram</a>
                <a href="#" className="text-purple-100 hover:text-white">📱 TikTok</a>
                <a href="#" className="text-purple-100 hover:text-white">📺 YouTube</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-purple-500 pt-8 text-center text-purple-100">
            <p>&copy; 2024 Puppy Weight Watch. Made with ❤️ for fur babies everywhere!</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
