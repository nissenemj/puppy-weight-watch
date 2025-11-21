import { motion } from 'framer-motion'

interface MeshBackgroundProps {
    variant?: 'default' | 'dashboard' | 'achievement'
}

export default function MeshBackground({ variant = 'default' }: MeshBackgroundProps) {
    const getColors = () => {
        switch (variant) {
            case 'dashboard':
                return {
                    blob1: 'bg-terracotta-200/20',
                    blob2: 'bg-sage-200/20',
                    blob3: 'bg-terracotta-300/15'
                }
            case 'achievement':
                return {
                    blob1: 'bg-yellow-200/20',
                    blob2: 'bg-purple-200/20',
                    blob3: 'bg-pink-200/15'
                }
            default:
                return {
                    blob1: 'bg-terracotta-100/30',
                    blob2: 'bg-sage-100/30',
                    blob3: 'bg-stone-200/20'
                }
        }
    }

    const colors = getColors()

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Blob 1 - Terracotta */}
            <motion.div
                className={`absolute top-0 -left-48 w-96 h-96 ${colors.blob1} rounded-full blur-3xl`}
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />

            {/* Blob 2 - Sage */}
            <motion.div
                className={`absolute top-1/3 right-0 w-96 h-96 ${colors.blob2} rounded-full blur-3xl`}
                animate={{
                    x: [0, -30, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />

            {/* Blob 3 - Mixed */}
            <motion.div
                className={`absolute bottom-0 left-1/3 w-80 h-80 ${colors.blob3} rounded-full blur-3xl`}
                animate={{
                    x: [0, 40, 0],
                    y: [0, -40, 0],
                    scale: [1, 1.15, 1]
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />
        </div>
    )
}
