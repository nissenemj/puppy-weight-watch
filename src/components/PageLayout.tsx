import React from 'react';
import { Navigation } from './Navigation';
import { motion, useReducedMotion } from 'framer-motion';

interface PageLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
    const reduceMotion = useReducedMotion();

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 font-sans selection:bg-terracotta-200 dark:selection:bg-terracotta-900">
            {/* Navigation Wrapper */}
            <Navigation>
                {/* Main Content Container */}
                <main id="main-content" tabIndex={-1} className={`
        relative
        w-full
        max-w-full
        md:max-w-2xl
        lg:max-w-4xl
        xl:max-w-6xl
        mx-auto
        px-4
        pb-[calc(6rem+env(safe-area-inset-bottom))]
        md:pb-12
        pt-6
        md:pt-8
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-terracotta-700
        ${className}
      `}>
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                        transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </main>
            </Navigation>
        </div>
    );
};
