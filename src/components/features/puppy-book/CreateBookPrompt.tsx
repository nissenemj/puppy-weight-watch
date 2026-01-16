import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from '@/utils/iconImports';
import PuppyBookSelector from '@/components/PuppyBook/PuppyBookSelector';
import happyPuppy from '@/assets/happy-puppy.png';
import pawPrints from '@/assets/paw-prints.png';
import { getDefaultBirthDate } from '@/utils/puppyAge';
import type { User } from '@/types/user';

interface CreateBookPromptProps {
    onBookCreated: (title: string, birthDate?: string, coverImageUrl?: string) => void;
    user: User;
    onBookSelect: (bookId: string, bookData: Record<string, unknown>) => void;
}

export const CreateBookPrompt: React.FC<CreateBookPromptProps> = ({
    onBookCreated,
    user,
    onBookSelect
}) => {
    const [title, setTitle] = useState('');
    const [birthDate, setBirthDate] = useState(getDefaultBirthDate());
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateBook = async () => {
        setIsCreating(true);
        await onBookCreated(title, birthDate, coverImageUrl);
        setIsCreating(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Söpöt taustakuviot */}
            <motion.img
                src={pawPrints}
                alt="Tassunjälkiä - koristeellinen elementti"
                className="absolute top-10 left-10 w-20 h-20 opacity-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.img
                src={pawPrints}
                alt="Tassunjälkiä - koristeellinen elementti"
                className="absolute bottom-10 right-10 w-16 h-16 opacity-15"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative"
            >
                {/* Leikkisä ikoni */}
                <motion.div
                    className="relative mb-6"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <motion.img
                        src={happyPuppy}
                        alt="Onnellinen pentu"
                        className="w-24 h-24 mx-auto rounded-full shadow-lg"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute -top-2 -right-2"
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                </motion.div>

                <motion.h2
                    className="text-3xl font-sans font-bold text-gray-800 mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Luo ensimmäinen pentukirja!
                </motion.h2>
                <motion.p
                    className="text-gray-600 mb-6 font-body"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Valitse koira ja aloita pennun ainutlaatuisen elämäntarinan tallentaminen
                </motion.p>

                <div className="mb-6">
                    <PuppyBookSelector
                        user={user}
                        selectedBookId=""
                        onBookSelect={onBookSelect}
                    />
                </div>
            </motion.div>
        </div>
    );
};
