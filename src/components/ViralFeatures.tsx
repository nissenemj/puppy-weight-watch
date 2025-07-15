import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  Video, 
  Calculator, 
  Users, 
  Trophy, 
  Share2, 
  Heart,
  Play,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "AI Growth Tracker",
    description: "Smart predictions and personalized insights",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    badge: "🔥 Viral",
    color: "from-pink-500 to-purple-500"
  },
  {
    icon: <Calculator className="w-8 h-8" />,
    title: "Smart Food Calculator",
    description: "AI-powered nutrition recommendations",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    badge: "⚡ Trending",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Viral Community",
    description: "Share stories, get featured, go viral!",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    badge: "💫 Hot",
    color: "from-green-500 to-emerald-500"
  }
];

const testimonials = [
  {
    name: "Sarah & Max 🐕",
    story: "Max gained 5lbs in 2 weeks! Our vet was amazed!",
    likes: 1247,
    shares: 89,
    avatar: "🐾"
  },
  {
    name: "Mike & Luna 🐶",
    story: "Luna's growth chart went viral on TikTok! #PuppyGoals",
    likes: 2156,
    shares: 156,
    avatar: "🌟"
  },
  {
    name: "Emma & Buddy 🐾",
    story: "Buddy's transformation story got 50k views!",
    likes: 3421,
    shares: 234,
    avatar: "💫"
  }
];

export default function ViralFeatures() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            <Zap className="w-4 h-4 mr-1" />
            Trending Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Features That Go Viral! 🚀
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of pet parents sharing their puppy's journey
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="p-6 h-full bg-white shadow-xl border-0 rounded-2xl relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5`} />
                
                {/* Badge */}
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  {feature.badge}
                </Badge>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}>
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>

                  {/* Video Preview */}
                  <div className="relative rounded-xl overflow-hidden mb-4 bg-gray-100">
                    <div className="aspect-video flex items-center justify-center">
                      <Button
                        onClick={() => setActiveVideo(index)}
                        className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3"
                      >
                        <Play className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      Try Now
                    </Button>
                    <Button variant="outline" className="px-3">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Viral Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8">🔥 Viral Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="p-6 bg-white shadow-lg border-0 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>{testimonial.likes}</span>
                        <Share2 className="w-4 h-4 text-blue-500" />
                        <span>{testimonial.shares}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.story}"</p>
                  <div className="flex gap-1 mt-3">
                    <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs">#Viral</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">#PuppyLove</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Gamification Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center"
        >
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
          <h3 className="text-3xl font-bold mb-4">Earn Badges & Go Viral! 🏆</h3>
          <p className="text-xl mb-6 opacity-90">
            Complete challenges, share milestones, and get featured on our social media!
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Badge className="bg-yellow-500 text-black px-4 py-2">🎯 First Milestone</Badge>
            <Badge className="bg-purple-500 text-white px-4 py-2">📈 Growth Champion</Badge>
            <Badge className="bg-pink-500 text-white px-4 py-2">💫 Viral Star</Badge>
            <Badge className="bg-green-500 text-white px-4 py-2">🏆 Community Hero</Badge>
          </div>
          <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold">
            Start Earning Badges
          </Button>
        </motion.div>
      </div>
    </section>
  );
}