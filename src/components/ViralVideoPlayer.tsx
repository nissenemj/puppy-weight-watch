import React from 'react';
import ReactPlayer from 'react-player';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Share2, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ViralVideoPlayerProps {
  videoUrl: string;
  title: string;
  description: string;
  views: string;
  likes: string;
  shares: string;
}

export const ViralVideoPlayer: React.FC<ViralVideoPlayerProps> = ({
  videoUrl,
  title,
  description,
  views,
  likes,
  shares
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="overflow-hidden shadow-lg rounded-2xl">
        <div className="relative">
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="300px"
            controls
            playing={false}
            light={true}
            config={{
              youtube: {
                playerVars: { showinfo: 1 }
              }
            }}
          />
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
            {views} views
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-3">{description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">Comment</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Share2 className="w-4 h-4" />
              <span className="text-sm">{shares}</span>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ViralVideoPlayer;