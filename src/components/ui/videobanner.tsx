// src/components/VideoBanner.js
import React, { useEffect, useRef, useState } from 'react';

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
        }, 7000); // 每 5 秒切換一次影片

        return () => clearInterval(interval); // 清除 interval 當組件卸載時
    }, []);

    return (
        <video
            ref={videoRef}
            autoPlay
            muted
            loop
            src={videoSources[currentIndex]}
            className="absolute w-full h-full object-cover brightness-50"
        ></video>
    );
};

export default VideoBanner;
