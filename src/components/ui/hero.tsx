// src/components/Hero.js
import React from 'react';
import VideoBanner from './videobanner'
import BlurText from './blur';

const handleAnimationComplete = () => {
    console.log('Animation completed!');
};
const Hero = () => {
    return (
        <section className="relative bg-cover bg-center h-96" style={{ backgroundImage: 'url("/hero-image.jpg")' }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative w-full h-full flex justify-center items-center text-center text-white">
                <VideoBanner />
                <div className='z-10'>
                    <BlurText
                        text="Find your outside!"
                        delay={200}
                        animateBy="words"
                        direction="top"
                        onAnimationComplete={handleAnimationComplete}
                        className="text-6xl indent-2 font-bold mb-4"
                    />
                    <p className="mt-4 text-2xl">保持人模人樣也是一種挑戰</p>
                </div>
            </div>
        </section>
    );
};

export default Hero;
