import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Heart, MessageCircle, Share2, Camera, Play, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserStory {
  id: string;
  author: string;
  authorImage: string;
  puppyName: string;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  trending?: boolean;
  milestone?: string;
}

interface UserGeneratedContentProps {
  stories: UserStory[];
  onAddStory: (story: Omit<UserStory, 'id' | 'likes' | 'comments' | 'shares' | 'timestamp'>) => void;
}

export const UserGeneratedContent: React.FC<UserGeneratedContentProps> = ({
  stories,
  onAddStory
}) => {
  const [newStory, setNewStory] = useState({
    author: '',
    authorImage: '',
    puppyName: '',
    content: '',
    milestone: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());

  const handleLike = (storyId: string) => {
    setLikedStories(prev => 
      prev.has(storyId) 
        ? new Set([...prev].filter(id => id !== storyId))
        : new Set([...prev, storyId])
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStory.author && newStory.puppyName && newStory.content) {
      onAddStory({
        ...newStory,
        authorImage: newStory.authorImage || '/default-avatar.png'
      });
      setNewStory({ author: '', authorImage: '', puppyName: '', content: '', milestone: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Puppy Success Stories 🎉
        </h2>
        <p className="text-gray-600">Share your fur baby's journey and inspire others!</p>
      </div>

      {/* Add Story Button */}
      <div className="text-center">
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full hover:scale-105 transition-all shadow-lg"
        >
          <Camera className="w-5 h-5 mr-2" />
          Share Your Story
        </Button>
      </div>

      {/* Add Story Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Your name"
                  value={newStory.author}
                  onChange={(e) => setNewStory({...newStory, author: e.target.value})}
                  required
                />
                <Input
                  placeholder="Your puppy's name"
                  value={newStory.puppyName}
                  onChange={(e) => setNewStory({...newStory, puppyName: e.target.value})}
                  required
                />
              </div>
              <Input
                placeholder="Milestone achieved (optional)"
                value={newStory.milestone}
                onChange={(e) => setNewStory({...newStory, milestone: e.target.value})}
              />
              <Textarea
                placeholder="Share your puppy's story, progress, or tips! 🐕💕"
                value={newStory.content}
                onChange={(e) => setNewStory({...newStory, content: e.target.value})}
                rows={4}
                required
              />
              <div className="flex gap-2">
                <Button type="submit" className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  Post Story
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Stories Feed */}
      <div className="space-y-4">
        {stories.map((story) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 hover:shadow-xl transition-all duration-300 rounded-2xl">
              {/* Story Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={story.authorImage} alt={story.author} />
                    <AvatarFallback>{story.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{story.author}</h3>
                    <p className="text-gray-600 text-sm">{story.puppyName}'s journey</p>
                    <p className="text-gray-500 text-xs">{story.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {story.trending && (
                    <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {story.milestone && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      <Zap className="w-3 h-3 mr-1" />
                      {story.milestone}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Story Content */}
              <p className="text-gray-800 mb-4 leading-relaxed">{story.content}</p>

              {/* Media (placeholder for images/videos) */}
              {story.image && (
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img 
                    src={story.image} 
                    alt="Puppy story" 
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {story.video && (
                <div className="mb-4 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center h-64">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Video content</p>
                  </div>
                </div>
              )}

              {/* Story Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(story.id)}
                    className={`flex items-center gap-2 transition-all ${
                      likedStories.has(story.id) ? 'text-pink-500' : 'text-gray-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedStories.has(story.id) ? 'fill-current' : ''}`} />
                    <span>{story.likes + (likedStories.has(story.id) ? 1 : 0)}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="w-5 h-5" />
                    <span>{story.comments}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
                    <Share2 className="w-5 h-5" />
                    <span>{story.shares}</span>
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-800 font-semibold"
                >
                  View Full Story
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button
          variant="outline"
          className="px-8 py-3 rounded-full border-2 border-purple-200 hover:bg-purple-50 transition-all"
        >
          Load More Stories
        </Button>
      </div>
    </div>
  );
};

export default UserGeneratedContent;