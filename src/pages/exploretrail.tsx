import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TrailCardGrid from "@/components/ui/alltrailcard";
import { Trail } from "@/components/ui/filter";
import Traildata from "@/data/trails.json";
import { Loader2 } from "lucide-react";

const loadingContainerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const loadingTextVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: 0.2, 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// 簡化的篩選類型
type SimpleFilter = {
  region: string[];
  difficulty: string[];
  seasons: string[];
  minRating: number;
};

const TrailsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // 使用 useMemo 只加載一次資料，避免不必要的重新計算
  const trailsData = useMemo(() => Traildata as Trail[], []);

  useEffect(() => {
    // 設置頁面標題
    document.title = "探索台灣登山步道 | 台灣最佳登山資訊平台";
    
    // 預先加載一些關鍵圖片
    const preloadImages = () => {
      const firstFewTrails = trailsData.slice(0, 6);
      firstFewTrails.forEach(trail => {
        const img = new Image();
        img.src = trail.image;
      });
    };
    
    // 模擬資料加載 - 使用較短的延遲時間並優化圖片加載
    const timeout = setTimeout(() => {
      preloadImages();
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timeout);
  }, [trailsData]);

  // 使用 AnimatePresence 創建平滑的過渡效果
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            variants={loadingContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col justify-center items-center min-h-screen"
          >
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <motion.span 
              variants={loadingTextVariants}
              className="text-lg text-slate-800 dark:text-white"
            >
              正在載入步道資料...
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TrailCardGrid trails={trailsData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrailsPage;