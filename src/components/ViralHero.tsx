import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Play, TrendingUp, Heart, Share2 } from 'lucide-react';

interface ViralHeroProps {
  onGetStarted: () => void;
}

export default function ViralHero({ onGetStarted }: ViralHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
        <div className="absolute inset-0 bg-black/10" />
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-60"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-20 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-60"
          animate={{
            scale: [1, 1.3, 1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-60"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Viral Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
        >
          <TrendingUp className="w-4 h-4" />
          <span>🔥 Trending on TikTok & Instagram</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
        >
          Watch Your Puppy Thrive! 📈🐶
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto"
        >
          Track weight, get AI-powered tips, and join <span className="font-bold text-pink-600">10k+</span> happy fur parents! 
          <br />
          <span className="text-lg text-gray-600">Your fur baby's growth journey starts here 💕</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <Button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Free Tracking
          </Button>
          <Button
            variant="outline"
            className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg rounded-full"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Your Story
          </Button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600"
        >
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
        </motion.div>

        {/* Viral Challenge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200"
        >
          <h3 className="text-xl font-bold text-purple-700 mb-2">🎯 Weekly Challenge</h3>
          <p className="text-gray-700 mb-4">
            Share your puppy's first milestone and get featured! 
            <span className="font-semibold text-pink-600"> #PuppyGrowthJourney</span>
          </p>
          <div className="flex gap-2 text-xs">
            <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full">#FurBaby</span>
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">#PuppyLove</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">#GrowthTracker</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}