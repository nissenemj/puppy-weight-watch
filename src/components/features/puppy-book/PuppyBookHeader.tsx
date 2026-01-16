import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, Settings } from '@/utils/iconImports';
import pawPrints from '@/assets/paw-prints.png';
import puppyBookIcon from '@/assets/puppy-book-icon.png';
import type { PuppyBook } from '@/types/dog';

interface PuppyBookHeaderProps {
    book: PuppyBook;
    onShareClick: () => void;
    onSettingsClick: () => void;
}

export const PuppyBookHeader: React.FC<PuppyBookHeaderProps> = ({
    book,
    onShareClick,
    onSettingsClick
}) => {
    return (
        <div className="relative bg-gradient-playful text-white overflow-hidden">
            {/* Söpöt taustakuviot */}
            <motion.img
                src={pawPrints}
                alt="Tassunjälkiä - koristeellinen elementti"
                className="absolute top-4 right-4 w-16 h-16 opacity-30"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.img
                src={pawPrints}
                alt="Tassunjälkiä - koristeellinen elementti"
                className="absolute bottom-4 left-4 w-12 h-12 opacity-20"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative container mx-auto px-4 py-8">
                <motion.div
                    className="flex items-center space-x-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {book.cover_image_url ? (
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white/30">
                                <img
                                    src={book.cover_image_url}
                                    alt="Kirjan kansi"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white/30 bg-white/20 flex items-center justify-center">
                                <img
                                    src={puppyBookIcon}
                                    alt="Pentukirja"
                                    className="w-16 h-16"
                                />
                            </div>
                        )}
                    </motion.div>

                    <div className="flex-1">
                        <motion.h1
                            className="text-3xl font-playful font-bold mb-2 flex items-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {book.title}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Heart className="w-6 h-6 text-red-400" />
                            </motion.div>
                        </motion.h1>
                        <motion.p
                            className="text-white/80 font-body"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Luotu {new Date(book.created_at).toLocaleDateString('fi-FI')}
                        </motion.p>
                    </div>

                    <div className="flex space-x-2">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onShareClick}
                            className="p-3 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-colors"
                        >
                            <Share2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: -10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onSettingsClick}
                            className="p-3 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
