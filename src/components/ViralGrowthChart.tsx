import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trophy, TrendingUp, Share2, Camera, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeightData {
  week: number;
  weight: number;
  milestone?: string;
  target?: number;
}

interface ViralGrowthChartProps {
  puppyName: string;
  puppyBreed: string;
  weightData: WeightData[];
  achievements: string[];
}

export const ViralGrowthChart: React.FC<ViralGrowthChartProps> = ({
  puppyName,
  puppyBreed,
  weightData,
  achievements
}) => {
  const [showMilestones, setShowMilestones] = useState(true);
  const [shareCount, setShareCount] = useState(342);

  const handleShare = () => {
    setShareCount(prev => prev + 1);
    // Implement actual sharing logic
  };

  const currentWeight = weightData[weightData.length - 1]?.weight || 0;
  const weightGain = weightData.length > 1 ? currentWeight - weightData[0].weight : 0;
  const growthTrend = weightGain > 0 ? "📈 Growing strong!" : "📊 Steady progress";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="p-6 shadow-2xl rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Header with viral elements */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {puppyName}'s Growth Journey 🐕
            </h2>
            <p className="text-gray-600">{puppyBreed} • {growthTrend}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleShare}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full hover:scale-105 transition-all"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share ({shareCount})
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Camera className="w-4 h-4 mr-2" />
              Photo
            </Button>
          </div>
        </div>

        {/* Achievements & Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full">
                <Trophy className="w-3 h-3 mr-1" />
                {achievement}
              </Badge>
            </motion.div>
          ))}
        </div>

        {/* Viral Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-white rounded-xl shadow-md">
            <div className="text-2xl font-bold text-blue-600">{currentWeight}kg</div>
            <div className="text-sm text-gray-600">Current Weight</div>
          </div>
          <div className="text-center p-3 bg-white rounded-xl shadow-md">
            <div className="text-2xl font-bold text-green-600">+{weightGain.toFixed(1)}kg</div>
            <div className="text-sm text-gray-600">Total Growth</div>
          </div>
          <div className="text-center p-3 bg-white rounded-xl shadow-md">
            <div className="text-2xl font-bold text-purple-600">{weightData.length}</div>
            <div className="text-sm text-gray-600">Weeks Tracked</div>
          </div>
        </div>

        {/* Interactive Chart */}
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="week" 
                label={{ value: 'Week', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold">Week {label}</p>
                        <p className="text-blue-600">Weight: {payload[0].value}kg</p>
                        {data.milestone && (
                          <p className="text-purple-600 text-sm">🎉 {data.milestone}</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#8884d8"
                strokeWidth={3}
                fill="url(#colorGradient)"
              />
              {showMilestones && (
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#ff7300"
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Viral CTA */}
        <div className="text-center space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <TrendingUp className="w-5 h-5 mr-2 inline" />
            Share Your Puppy's Progress! 🚀
          </motion.button>
          <p className="text-gray-600 text-sm">
            Seuraa koirasi kasvua helposti ammattimaisilla työkaluilla! 💕
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default ViralGrowthChart;