// src/components/VideoBanner.js
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoBanner = () => {
    const videoRef = useRef(null);
    const videoSources = [
        "https://videos.pexels.com/video-files/2040075/2040075-hd_1920_1080_24fps.mp4",
        "https://videos.pexels.com/video-files/2040076/2040076-hd_1920_1080_24fps.mp4",
        "https://videos.pexels.com/video-files/3654337/3654337-uhd_2560_1440_30fps.mp4"
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % videoSources.length);
        }, 9000); // 每 9 秒切換一次影片

        return () => clearInterval(interval); // 清除 interval 當組件卸載時
    }, []);

    return (
        <AnimatePresence mode="wait">
            <motion.video
                key={currentIndex}
                ref={videoRef}
                autoPlay
                muted
                loop
                src={videoSources[currentIndex]}
                className="absolute w-full h-full object-cover brightness-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            />
        </AnimatePresence>
    );
};

export default VideoBanner;
