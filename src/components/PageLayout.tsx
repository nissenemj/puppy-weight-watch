import React from 'react';
import { Navigation } from './Navigation';
import { motion } from 'framer-motion';

interface PageLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 font-sans selection:bg-terracotta-200 dark:selection:bg-terracotta-900">
            {/* Navigation Wrapper */}
            <Navigation />

            {/* Main Content Container */}
            <main className={`
        relative
        w-full 
        max-w-full 
        md:max-w-2xl 
        lg:max-w-4xl 
        xl:max-w-5xl 
        mx-auto 
        px-4 
        pb-24 /* Space for bottom nav */
        pt-6 
        md:pt-24 /* Space for top nav */
        ${className}
      `}>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};
