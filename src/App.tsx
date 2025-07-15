import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { 
    Play, 
    TrendingUp, 
    Users, 
    Heart, 
    Share2, 
    Trophy, 
    Sparkles, 
    Star,
    ArrowRight,
    Zap
} from "lucide-react";

// Import viral components - Assuming these are created in your project
import ViralHero from "./components/ViralHero";
import ViralFeatures from "./components/ViralFeatures";
import InteractiveGrowthChart from "./components/InteractiveGrowthChart";
import ViralVideoPlayer from "./components/ViralVideoPlayer";
import ViralGrowthChart from "./components/ViralGrowthChart";
import UserGeneratedContent from "./components/UserGeneratedContent";
import ViralPuppyQuiz from "./components/ViralPuppyQuiz";


// Import existing assets
import puppyHero from "./assets/dog1.png";
import dog2 from "./assets/dog2.png";
import dog3 from "./assets/dog3.png";

// Merged and unified data structures
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
        authorImage: "https://placehold.co/32x32/FFC0CB/000000?text=SJ",
        puppyName: "Bella",
        content: "Bella's growth journey has been incredible! Using this app helped me catch a potential health issue early. She's now a healthy 6-month-old Golden Retriever! 🐕💕",
        likes: 1247,
        comments: 23,
        shares: 89,
        timestamp: "2 hours ago",
        trending: true,
        milestone: "6 Month Milestone",
        verified: true
    },
    {
        id: "2",
        author: "Mike Chen",
        authorImage: "https://placehold.co/32x32/ADD8E6/000000?text=MC",
        puppyName: "Charlie",
        content: "Charlie was the runt of the litter, but with proper nutrition tracking, he's now thriving! This community has been so supportive. Thank you all! 🙏",
        likes: 2156,
        comments: 18,
        shares: 156,
        timestamp: "1 day ago",
        milestone: "Healthy Weight Gained",
        verified: true
    },
    {
        id: "3",
        author: "Emily Rodriguez",
        authorImage: "https://placehold.co/32x32/90EE90/000000?text=ER",
        puppyName: "Luna",
        content: "Luna's first vet visit was perfect! The vet was impressed with how well I've been tracking her growth. This app is a game-changer for new puppy parents! 🎉",
        likes: 3421,
        comments: 31,
        shares: 234,
        timestamp: "3 days ago",
        trending: true,
        milestone: "Perfect Vet Visit",
        verified: true
    }
];

const viralVideos = [
    {
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder video
        title: "5 Signs Your Puppy is Growing Perfectly!",
        description: "Learn the key indicators of healthy puppy growth",
        views: "127K",
        likes: "8.9K",
        shares: "2.1K"
    },
    {
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder video
        title: "Puppy Weight Milestones Explained",
        description: "What to expect in your puppy's first 12 weeks",
        views: "89K",
        likes: "6.2K",
        shares: "1.8K"
    }
];

const quickStats = [
    { label: "Happy Puppies", value: "50,000+", icon: "🐕", color: "text-pink-600" },
    { label: "Viral Stories", value: "2,500+", icon: "🔥", color: "text-purple-600" },
    { label: "Growth Accuracy", value: "95%", icon: "📈", color: "text-green-600" },
    { label: "Social Shares", value: "50K+", icon: "📤", color: "text-blue-600" }
];


export default function App() {
    const [showQuiz, setShowQuiz] = useState(false);
    const [userStories, setUserStories] = useState(mockUserStories);

    const handleAddStory = (newStory) => {
        const story = {
            ...newStory,
            id: Date.now().toString(),
            authorImage: `https://placehold.co/32x32/D3D3D3/000000?text=${newStory.author.charAt(0)}`,
            likes: 0,
            comments: 0,
            shares: 0,
            timestamp: "Just now",
            verified: false
        };
        setUserStories([story, ...userStories]);
    };
    
    const handleGetStarted = () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-poppins">
            {/* Viral Hero Section */}
            <ViralHero onGetStarted={handleGetStarted} puppyImage={puppyHero} />

            {/* Quick Stats Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="py-12 bg-white"
            >
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {quickStats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className={`text-4xl mb-2 ${stat.color}`}>{stat.icon}</div>
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

            {/* Interactive Growth Chart Demo */}
            <InteractiveGrowthChart puppyName="Bella" puppyBreed="Golden Retriever" weightData={mockWeightData} achievements={mockAchievements} />

            {/* Viral Video Content */}
            <ViralVideoPlayer videos={viralVideos} />

            {/* User Generated Content / Success Stories */}
            <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
                <UserGeneratedContent stories={userStories} onAddStory={handleAddStory} />
            </section>
            
            {/* Viral Puppy Quiz Section */}
            {showQuiz && (
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                >
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                        <ViralPuppyQuiz />
                        <div className="text-center p-4 border-t">
                            <Button
                                variant="outline"
                                onClick={() => setShowQuiz(false)}
                                className="px-6 py-2 rounded-full"
                            >
                                Close Quiz
                            </Button>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Final CTA Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                        Join 50,000+ happy pet parents tracking their fur baby's growth with AI-powered insights and viral sharing features!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        <Button onClick={handleGetStarted} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:scale-105 transition-all duration-200">
                            <Play className="w-5 h-5 mr-2" />
                            Start Free Tracking
                        </Button>
                        <Button onClick={() => setShowQuiz(true)} variant="outline" className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg rounded-full">
                            <Trophy className="w-5 h-5 mr-2" />
                            Take Viral Quiz
                        </Button>
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

