import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Share2, 
  Download, 
  Sparkles, 
  Trophy,
  Heart,
  MessageCircle
} from 'lucide-react';

// Sample data - in real app, this would come from Firebase
const growthData = [
  { week: 1, weight: 2.5, target: 2.8, milestone: "First week!" },
  { week: 2, weight: 3.2, target: 3.5, milestone: "Growing fast!" },
  { week: 3, weight: 4.1, target: 4.2, milestone: "On track!" },
  { week: 4, weight: 5.0, target: 5.0, milestone: "Perfect growth!" },
  { week: 5, weight: 6.2, target: 6.0, milestone: "Exceeding expectations!" },
  { week: 6, weight: 7.5, target: 7.2, milestone: "Viral growth!" },
  { week: 7, weight: 8.8, target: 8.5, milestone: "Champion!" },
  { week: 8, weight: 10.2, target: 10.0, milestone: "Amazing progress!" }
];

const aiInsights = [
  "🎯 Your puppy is growing 15% faster than average!",
  "💪 Strong bone development detected",
  "🍖 Consider increasing food portions by 10%",
  "🏆 You're in the top 5% of puppy parents!"
];

export default function InteractiveGrowthChart() {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [likes, setLikes] = useState(1247);
  const [shares, setShares] = useState(89);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-bold">Week {label}</p>
          <p className="text-green-600">Weight: {data.weight} kg</p>
          <p className="text-blue-600">Target: {data.target} kg</p>
          <p className="text-purple-600">{data.milestone}</p>
        </div>
      );
    }
    return null;
  };

  const handleShare = () => {
    setShares(prev => prev + 1);
    // In real app, integrate with social sharing APIs
    if (navigator.share) {
      navigator.share({
        title: "My puppy's amazing growth journey! 📈🐶",
        text: "Check out how my fur baby is thriving with Puppy Weight Watch!",
        url: window.location.href
      });
    }
  };

  const handleLike = () => {
    setLikes(prev => prev + 1);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <Sparkles className="w-4 h-4 mr-1" />
            AI-Powered Insights
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Watch Your Puppy Grow! 📈
          </h2>
          <p className="text-xl text-gray-600">
            Interactive growth tracking with viral sharing features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 bg-white shadow-xl border-0 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Growth Journey</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={handleLike}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    {likes}
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    {shares}
                  </Button>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="week" 
                    stroke="#666"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#666"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="#3b82f6"
                    fillOpacity={0.1}
                    name="Target Weight"
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
                    name="Actual Weight"
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Viral Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+15%</div>
                  <div className="text-sm text-gray-600">Faster Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">95%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">Top 5%</div>
                  <div className="text-sm text-gray-600">Performance</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* AI Insights Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* AI Insights */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-0 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">AI Insights</h3>
              </div>
              <div className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-white rounded-lg shadow-sm"
                  >
                    <p className="text-sm text-gray-700">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Viral Actions */}
            <Card className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-0 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Share Your Success! 🚀</h3>
              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on TikTok
                </Button>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on Instagram
                </Button>
                <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download Chart
                </Button>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-0 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-800">Achievements</h3>
              </div>
              <div className="space-y-2">
                <Badge className="bg-green-500 text-white">🎯 First Milestone</Badge>
                <Badge className="bg-blue-500 text-white">📈 Growth Champion</Badge>
                <Badge className="bg-purple-500 text-white">💫 Viral Star</Badge>
                <Badge className="bg-yellow-500 text-black">🏆 Top Performer</Badge>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Community Engagement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-4">Join the Viral Community! 🌟</h3>
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
          </Button>
        </motion.div>
      </div>
    </section>
  );
}