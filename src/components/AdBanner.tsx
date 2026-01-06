import React from 'react';

interface AdBannerProps {
    variant: 'rectangle' | 'skyscraper';
    className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ variant, className = '' }) => {
    if (variant === 'rectangle') {
        // 300x250px
        return (
            <div className={`flex justify-center items-center p-4 bg-stone-50 rounded-xl ${className}`}>
                <a href="https://in.muotitassu.fi/t/t?a=1962036211&as=2037227635&t=2&tk=1" target="_blank" rel="noopener noreferrer">
                    <img
                        src="https://track.adtraction.com/t/t?a=1962036211&as=2037227635&t=1&tk=1&i=1"
                        width="300"
                        height="250"
                        alt="Muotitassu - Laadukkaat koiratarvikkeet"
                        className="rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        style={{ border: 0 }}
                    />
                </a>
            </div>
        );
    }

    if (variant === 'skyscraper') {
        // 120x600px
        return (
            <div className={`hidden lg:flex justify-center items-start p-4 ${className}`}>
                <a href="https://in.muotitassu.fi/t/t?a=1962036177&as=2037227635&t=2&tk=1" target="_blank" rel="noopener noreferrer">
                    <img
                        src="https://track.adtraction.com/t/t?a=1962036177&as=2037227635&t=1&tk=1&i=1"
                        width="120"
                        height="600"
                        alt="Muotitassu - Tammiale"
                        className="rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        style={{ border: 0 }}
                    />
                </a>
            </div>
        );
    }

    return null;
};

export default AdBanner;
