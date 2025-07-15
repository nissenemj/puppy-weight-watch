import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player/youtube';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
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

// A unified and detailed data structure for the videos
const viralVideos = [
    {
        id: 1,
        title: "5 Puppy Growth Tips That Went Viral! 🐶",
        description: "Watch how Sarah's golden retriever gained 3kg in just 2 weeks!",
        thumbnail: "https://placehold.co/400x225/FF6B6B/FFFFFF?text=Puppy+Growth+Tips",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder URL
        views: "2.4M",
        likes: "124K",
        shares: "15K",
        duration: "2:34",
        trending: true
    },
    {
        id: 2,
        title: "AI-Powered Puppy Nutrition Guide 📊",
        description: "How AI helped Max achieve a perfect growth curve!",
        thumbnail: "https://placehold.co/400x225/4ECDC4/FFFFFF?text=AI+Nutrition+Guide",
        videoUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso", // Placeholder URL
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
        thumbnail: "https://placehold.co/400x225/45B7D1/FFFFFF?text=Puppy+Transformation",
        videoUrl: "https://www.youtube.com/watch?v=3h3-p_v_c2k", // Placeholder URL
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
    
    // Use an object to store stats for each video independently
    const [videoStats, setVideoStats] = useState(() => {
        const stats = {};
        viralVideos.forEach(video => {
            stats[video.id] = {
                likes: parseInt(video.likes.replace('K', '000')),
                shares: parseInt(video.shares.replace('K', '000')),
            };
        });
        return stats;
    });

    const playerRef = useRef(null);
    const currentVideoData = viralVideos[currentVideo];
    const currentStats = videoStats[currentVideoData.id];

    const formatStat = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num;
    };

    const handleVideoChange = (index) => {
        setCurrentVideo(index);
        setIsPlaying(true); // Auto-play new video
    };

    const handleLike = () => {
        setVideoStats(prev => ({
            ...prev,
            [currentVideoData.id]: {
                ...prev[currentVideoData.id],
                likes: prev[currentVideoData.id].likes + 1,
            }
        }));
    };

    const handleShare = () => {
        setVideoStats(prev => ({
            ...prev,
            [currentVideoData.id]: {
                ...prev[currentVideoData.id],
                shares: prev[currentVideoData.id].shares + 1,
            }
        }));
        
        if (navigator.share) {
            navigator.share({
                title: currentVideoData.title,
                text: currentVideoData.description,
                url: currentVideoData.videoUrl
            }).catch(console.error);
        }
    };

    return (
        <section className="py-20 bg-gradient-to-b from-pink-50 to-purple-50">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
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
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
                            {/* Video Container */}
                            <div className="relative aspect-video bg-black">
                                <ReactPlayer
                                    ref={playerRef}
                                    url={currentVideoData.videoUrl}
                                    width="100%"
                                    height="100%"
                                    playing={isPlaying}
                                    muted={isMuted}
                                    controls={false} // Use custom controls
                                    light={currentVideoData.thumbnail} // Show thumbnail
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    className="absolute top-0 left-0"
                                />
                                
                                {/* Custom Controls Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                                    <Button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4"
                                    >
                                        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                                    </Button>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Button onClick={() => setIsMuted(!isMuted)} variant="ghost" size="icon" className="text-white hover:bg-white/20">
                                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                            </Button>
                                            <span className="text-white text-sm font-semibold">{currentVideoData.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button onClick={handleLike} variant="ghost" className="text-white hover:bg-white/20 flex items-center gap-1">
                                                <Heart className="w-5 h-5" />
                                                <span className="text-sm">{formatStat(currentStats.likes)}</span>
                                            </Button>
                                            <Button onClick={handleShare} variant="ghost" className="text-white hover:bg-white/20 flex items-center gap-1">
                                                <Share2 className="w-5 h-5" />
                                                <span className="text-sm">{formatStat(currentStats.shares)}</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {currentVideoData.trending && (
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg">
                                            <Sparkles className="w-3 h-3 mr-1" />
                                            Trending
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Video Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">{currentVideoData.title}</h3>
                                <p className="text-gray-600 mb-4">{currentVideoData.description}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>👁️ {currentVideoData.views} views</span>
                                    </div>
                                    <Button onClick={handleShare} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
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
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-2">More Viral Content</h3>
                        {viralVideos.map((video, index) => (
                            <motion.div key={video.id} whileHover={{ scale: 1.02 }}>
                                <Card
                                    className={`p-3 cursor-pointer transition-all duration-300 flex gap-3 items-center ${
                                        currentVideo === index 
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
                                        : 'bg-white hover:bg-gray-50'
                                    }`}
                                    onClick={() => handleVideoChange(index)}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img src={video.thumbnail} alt={video.title} className="w-24 h-14 object-cover rounded" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <Play className="w-5 h-5 text-white" />
                                        </div>
                                        {video.trending && (
                                            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white p-1 h-5 w-5 flex items-center justify-center text-xs border-2 border-white">🔥</Badge>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-semibold text-sm mb-1 truncate ${currentVideo === index ? 'text-white' : 'text-gray-800'}`}>
                                            {video.title}
                                        </h4>
                                        <p className={`text-xs ${currentVideo === index ? 'text-white/80' : 'text-gray-600'}`}>
                                            {video.views} views • {video.duration}
                                        </p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Viral Challenge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center shadow-2xl"
                >
                    <h3 className="text-3xl font-bold mb-4">🎯 Weekly Video Challenge</h3>
                    <p className="text-xl mb-6 opacity-90">
                        Share your puppy's growth journey and win prizes! Top videos get featured.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                        <Badge variant="secondary" className="bg-white/20 text-white">#PuppyGrowthJourney</Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white">#ViralPuppy</Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white">#FurBaby</Badge>
                    </div>
                    <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-transform">
                        Submit Your Video
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
