import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const trails = [
    {
        name: "Big Dam Nine Loop",
        location: "Beitun, Taichung City, Taiwan",
        rating: 4.2,
        difficulty: "普通",
        distance: "2.7 km",
        duration: "Est. 1h 1m",
        image: "https://images.alltrails.com/eyJidWNrZXQiOiJhc3NldHMuYWxsdHJhaWxzLmNvbSIsImtleSI6InVwbG9hZHMvcGhvdG8vaW1hZ2UvMzM1NDg5ODYvMTUyY2VmOTFjMDQ4N2MzNGMzZDA1NDk2YTI3NjM4OGQuanBnIiwiZWRpdHMiOnsidG9Gb3JtYXQiOiJqcGVnIiwicmVzaXplIjp7IndpZHRoIjo1MDAsImhlaWdodCI6NTAwLCJmaXQiOiJpbnNpZGUifSwicm90YXRlIjpudWxsLCJqcGVnIjp7InRyZWxsaXNRdWFudGlzYXRpb24iOnRydWUsIm92ZXJzaG9vdERlcmluZ2luZyI6dHJ1ZSwib3B0aW1pc2VTY2FucyI6dHJ1ZSwicXVhbnRpc2F0aW9uVGFibGUiOjN9fX0=",
    },
    {
        name: "大坑步道",
        location: "Beitun, Taichung City, Taiwan",
        rating: 4.3,
        difficulty: "普通",
        distance: "3.4 km",
        duration: "Est. 1h 14m",
        image: "https://taichung.travel/content/images/attractions/50044/1024x768_image637683481937709225.jpg",
    },
    {
        name: "大坑9號步道",
        location: "Beitun, Taichung City, Taiwan",
        rating: 4.0,
        difficulty: "困難",
        distance: "3.4 km",
        duration: "Est. 1h 11m",
        image: "https://taichung.travel/content/images/attractions/60887/1024x768_attractions-image-mxzjzkgmtesqyvbyewuuoa.jpg",
    },
    {
        name: "大坑4號步道",
        location: "Beitun, Taichung City, Taiwan",
        rating: 4.5,
        difficulty: "簡單",
        distance: "2.3 km",
        duration: "Est. 53m",
        image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/da/b3/3d/dakeng-trail-no-4.jpg?w=1200&h=-1&s=1",
    },
    {
        name: "知高圳步道",
        location: "Beitun, Taichung City, Taiwan",
        rating: 4.5,
        difficulty: "簡單",
        distance: "2.3 km",
        duration: "Est. 53m",
        image: "https://lh3.googleusercontent.com/p/AF1QipOXR-uwbE9RfShrgefjcXG4zA9kBrJxeBwUhnSz=s1360-w1360-h1020",
    },
    {
        name: "竹坑南寮登山古道",
        location: "Beitun, Taichung City, Taiwan",
        rating: 4.5,
        difficulty: "簡單",
        distance: "2.3 km",
        duration: "Est. 53m",
        image: "https://lh3.googleusercontent.com/p/AF1QipNbR_8-y8Vuz3OcnRN-JSjdQJ273ZA5qUzLXGcy=s1360-w1360-h1020",
    },
    {
        name: "橫嶺山步道",
        location: "Beitun, Taichung City, Taiwan",
        rating: 4.5,
        difficulty: "簡單",
        distance: "2.3 km",
        duration: "Est. 53m",
        image: "https://lh3.googleusercontent.com/p/AF1QipPz0FBoNc9YVrQVrziErUCjxuvdMeurPV0o70li=s1360-w1360-h1020",
    },
];

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case "簡單":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        case "普通":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        case "困難":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
};

const TrailCarousel = () => {
    const [favorites, setFavorites] = useState<number[]>([]);

    // 切換收藏顯示
    const toggleFavorite = (index: number) => {
        setFavorites(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="px-4 py-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Local favorites near <span className="text-primary dark:text-primary/80 font-bold">Taichung</span>
            </h2>
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1.2}
                navigation
                breakpoints={{
                    640: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 3.2 },
                    1280: { slidesPerView: 4.2 },
                }}
                className="pb-8"
            >
                {trails.map((trail, index) => (
                    <SwiperSlide key={index}>
                        <div className="group rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleFavorite(index);
                                    }}
                                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors duration-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-6 w-6 transition-colors duration-200 ${
                                            favorites.includes(index)
                                                ? "text-red-500 fill-current"
                                                : "text-white"
                                        }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                </button>
                                <img
                                    src={trail.image}
                                    alt={trail.name}
                                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                    <h3 className="text-lg font-bold text-white truncate mb-1">{trail.name}</h3>
                                    <p className="text-sm text-gray-200 truncate">{trail.location}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white dark:bg-gray-800">
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                    <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 dark:bg-green-800 dark:text-yellow-300 px-2 py-1 rounded-full">
                                        ⭐ {trail.rating}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full ${getDifficultyColor(trail.difficulty)}`}>
                                        {trail.difficulty}
                                    </span>
                                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        {trail.distance}
                                    </span>
                                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        {trail.duration}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default TrailCarousel;
export { }
