import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Share2, 
  Heart, 
  MessageCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const viralVideos = [
  {
    id: 1,
    title: "5 Puppy Growth Tips That Went Viral! 🐶",
    description: "Watch how Sarah's golden retriever gained 3kg in just 2 weeks!",
    thumbnail: "https://via.placeholder.com/400x225/FF6B6B/FFFFFF?text=Puppy+Growth+Tips",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    views: "2.4M",
    likes: "124K",
    shares: "15K",
    duration: "2:34",
    trending: true
  },
  {
    id: 2,
    title: "AI-Powered Puppy Nutrition Guide 📊",
    description: "How AI helped Max achieve perfect growth curve!",
    thumbnail: "https://via.placeholder.com/400x225/4ECDC4/FFFFFF?text=AI+Nutrition+Guide",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    views: "1.8M",
    likes: "98K",
    shares: "12K",
    duration: "3:12",
    trending: false
  },
  {
    id: 3,
    title: "Viral Puppy Transformation Story! ✨",
    description: "From 2kg to 8kg in 8 weeks - the complete journey!",
    thumbnail: "https://via.placeholder.com/400x225/45B7D1/FFFFFF?text=Puppy+Transformation",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    views: "3.1M",
    likes: "156K",
    shares: "22K",
    duration: "4:56",
    trending: true
  }
];

export default function ViralVideoPlayer() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [likes, setLikes] = useState(viralVideos[0].likes);
  const [shares, setShares] = useState(viralVideos[0].shares);

  const handleVideoChange = (index: number) => {
    setCurrentVideo(index);
    setLikes(viralVideos[index].likes);
    setShares(viralVideos[index].shares);
    setIsPlaying(false);
  };

  const handleLike = () => {
    setLikes(prev => {
      const current = parseInt(prev.replace('K', '000').replace('M', '000000'));
      const newCount = current + 1000;
      return newCount >= 1000000 ? `${(newCount / 1000000).toFixed(1)}M` : `${(newCount / 1000).toFixed(0)}K`;
    });
  };

  const handleShare = () => {
    setShares(prev => {
      const current = parseInt(prev.replace('K', '000').replace('M', '000000'));
      const newCount = current + 500;
      return newCount >= 1000000 ? `${(newCount / 1000000).toFixed(1)}M` : `${(newCount / 1000).toFixed(0)}K`;
    });
    
    // In real app, integrate with social sharing APIs
    if (navigator.share) {
      navigator.share({
        title: viralVideos[currentVideo].title,
        text: viralVideos[currentVideo].description,
        url: viralVideos[currentVideo].videoUrl
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-pink-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            <TrendingUp className="w-4 h-4 mr-1" />
            Trending Videos
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Viral Puppy Content! 🎬
          </h2>
          <p className="text-xl text-gray-600">
            Watch, learn, and share the most popular puppy growth content
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
              {/* Video Container */}
              <div className="relative aspect-video bg-black">
                <img
                  src={viralVideos[currentVideo].thumbnail}
                  alt={viralVideos[currentVideo].title}
                  className="w-full h-full object-cover"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </Button>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setIsMuted(!isMuted)}
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <span className="text-white text-sm">{viralVideos[currentVideo].duration}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleLike}
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="ml-1 text-sm">{likes}</span>
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="ml-1 text-sm">{shares}</span>
                    </Button>
                  </div>
                </div>

                {/* Trending Badge */}
                {viralVideos[currentVideo].trending && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{viralVideos[currentVideo].title}</h3>
                <p className="text-gray-600 mb-4">{viralVideos[currentVideo].description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>👁️ {viralVideos[currentVideo].views} views</span>
                    <span>❤️ {viralVideos[currentVideo].likes} likes</span>
                    <span>📤 {viralVideos[currentVideo].shares} shares</span>
                  </div>
                  
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Video
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Video Playlist */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">More Viral Content</h3>
            
            {viralVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card 
                  className={`p-4 cursor-pointer transition-all ${
                    currentVideo === index 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => handleVideoChange(index)}
                >
                  <div className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      {video.trending && (
                        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                          🔥
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm mb-1 ${
                        currentVideo === index ? 'text-white' : 'text-gray-800'
                      }`}>
                        {video.title}
                      </h4>
                      <p className={`text-xs ${
                        currentVideo === index ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {video.views} views • {video.duration}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Community Section */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-0 rounded-2xl">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Join the Community! 🌟</h4>
              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Share Your Story
                </Button>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Upload Video
                </Button>
                <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Featured
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Viral Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-4">🎯 Weekly Video Challenge</h3>
          <p className="text-xl mb-6 opacity-90">
            Share your puppy's growth journey and win prizes! Top videos get featured on our social media.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <span className="bg-white/20 px-4 py-2 rounded-full">#PuppyGrowthJourney</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">#ViralPuppy</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">#FurBaby</span>
          </div>
          <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold">
            Submit Your Video
          </Button>
        </motion.div>
      </div>
    </section>
  );
}