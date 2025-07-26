import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, PawPrint, Calendar, Clock, Settings } from 'lucide-react';
import { format, differenceInWeeks, differenceInDays, parseISO } from 'date-fns';
import { fi } from 'date-fns/locale';

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  showHeroVideo?: boolean;
  puppyName?: string;
  birthDate?: string;
  puppyImageUrl?: string;
  onEditProfile?: () => void;
}

const calculateAge = (birthDate: string) => {
  const birth = parseISO(birthDate);
  const now = new Date();
  const weeks = differenceInWeeks(now, birth);
  const totalDays = differenceInDays(now, birth);
  const months = Math.floor(weeks / 4.33); // Average weeks per month
  
  return {
    weeks,
    months,
    totalDays
  };
};

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ 
  title, 
  subtitle = "Seuraa pennun kasvua ja tallenna ainutlaatuisia hetkiä",
  showHeroVideo = true,
  puppyName,
  birthDate,
  puppyImageUrl,
  onEditProfile
}) => {
  const puppyAge = birthDate ? calculateAge(birthDate) : null;
  const placeholderPuppyUrl = "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop&crop=face"; // Söpö koiranpentu

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

      <div className="relative z-10 p-8 text-white">
        <div className="flex items-start gap-6">
          {/* Puppy Image */}
          <motion.div
            className="flex-shrink-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
              <img 
                src={puppyImageUrl || placeholderPuppyUrl}
                alt={puppyName ? `${puppyName} pentu` : "Pentu"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = placeholderPuppyUrl;
                }}
              />
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0 relative">
            <motion.div
              className="flex items-center gap-3 mb-2"
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
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
              
              <motion.h1 
                className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold truncate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {puppyName || title}
              </motion.h1>
            </motion.div>

            {/* Birth date and age */}
            {birthDate && puppyAge && (
              <motion.div
                className="space-y-1 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="flex items-center gap-2 text-blue-100">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Syntynyt: {format(parseISO(birthDate), 'dd.MM.yyyy', { locale: fi })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    Ikä: {puppyAge.weeks} viikkoa ({puppyAge.months} kuukautta)
                  </span>
                </div>
              </motion.div>
            )}

            <motion.div
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            >
              <motion.p 
                className="text-lg font-body text-blue-100 max-w-md"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {subtitle}
              </motion.p>
            </motion.div>

            {/* Edit Profile Button */}
            {onEditProfile && (
              <motion.button
                onClick={onEditProfile}
                className="absolute top-0 right-0 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-4 h-4 text-white" />
              </motion.button>
            )}
          </div>
        </div>

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