import React from 'react';

export const PuppyBookSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
            <div className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-b-3xl mb-6"></div>
                <div className="container mx-auto px-4">
                    <div className="flex space-x-4 mb-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded-lg flex-1"></div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
