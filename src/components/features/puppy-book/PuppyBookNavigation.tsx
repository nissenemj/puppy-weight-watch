import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, Target, Heart } from '@/utils/iconImports';

interface PuppyBookNavigationProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const PuppyBookNavigation: React.FC<PuppyBookNavigationProps> = ({
    activeSection,
    onSectionChange
}) => {
    const sections = [
        { id: 'monthly', label: 'Kuukaudet', icon: Calendar },
        { id: 'timeline', label: 'Aikajana', icon: Calendar },
        { id: 'milestones', label: 'Virstanpylväät', icon: Award },
        { id: 'growth', label: 'Kasvu', icon: Target },
        { id: 'memories', label: 'Muistot', icon: Heart },
    ];

    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex overflow-x-auto scrollbar-hide">
                    {sections.map((section) => (
                        <motion.button
                            key={section.id}
                            whileHover={{ y: -3, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSectionChange(section.id)}
                            className={`
                flex-shrink-0 flex items-center space-x-2 px-6 py-4 font-medium transition-all rounded-t-lg
                ${activeSection === section.id
                                    ? 'text-orange-600 border-b-3 border-orange-600 bg-gradient-to-t from-orange-50 to-orange-25 font-semibold'
                                    : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50/50'
                                }
              `}
                        >
                            <motion.div
                                initial={{ scale: 1, rotate: 0 }}
                                animate={activeSection === section.id ? {
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 3, -3, 0]
                                } : { scale: 1, rotate: 0 }}
                                transition={{
                                    duration: 0.6,
                                    ease: "easeInOut",
                                    repeat: 0
                                }}
                            >
                                <section.icon className="w-5 h-5" />
                            </motion.div>
                            <span className="font-playful">{section.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};
