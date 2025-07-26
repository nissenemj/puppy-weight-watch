import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, PawPrint } from 'lucide-react';
import heroIllustration from '@/assets/hero-illustration.png';

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  showHeroVideo?: boolean;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ 
  title, 
  subtitle = "Seuraa pennun kasvua ja tallenna ainutlaatuisia hetkiä",
  showHeroVideo = true 
}) => {
  return (
    <div className="relative bg-gradient-primary min-h-[300px] rounded-b-3xl overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-10 -left-10 w-32 h-32 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <PawPrint className="w-full h-full text-white" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 -right-16 w-40 h-40 opacity-15"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <Heart className="w-full h-full text-white" />
        </motion.div>
      </div>

      {/* Hero illustration */}
      {showHeroVideo && (
        <motion.div
          className="absolute right-8 top-8 w-48 h-48 opacity-30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img 
            src={heroIllustration} 
            alt="Pentu tutkii maailmaa" 
            className="w-full h-full object-contain"
          />
        </motion.div>
      )}

      <div className="relative z-10 p-8 text-white">
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-heading font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h1>
        </motion.div>

        <motion.div
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          <motion.p 
            className="text-xl font-body text-blue-100 max-w-md"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Animated progress indicator */}
        <motion.div
          className="mt-6 w-32 h-1 bg-white/20 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: 128 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 2, delay: 1.2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedHeader;