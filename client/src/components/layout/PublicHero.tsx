import React from 'react';

interface PublicHeroProps {
    title: string;
    subtitle: string;
    image?: string;
    children?: React.ReactNode;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&q=80&w=1600";

export const PublicHero: React.FC<PublicHeroProps> = ({ title, subtitle, image = DEFAULT_IMAGE, children }) => {
    return (
        <section className="relative overflow-hidden bg-slate-900 text-white border-b border-white/10">
            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={image}
                    alt="Hero background"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            </div>

            <div className="container-page relative z-10 pt-24 pb-16 lg:pt-32 lg:pb-24">
                <div className="max-w-3xl">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                        {title}
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl">
                        {subtitle}
                    </p>
                    {children}
                </div>
            </div>
        </section>
    );
};
