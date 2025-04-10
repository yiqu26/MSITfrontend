import React, { useEffect, useState, useMemo, useCallback, Suspense, useRef, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trail } from "@/components/ui/filter";
import Traildata from "@/data/trails.json";
import { Loader2 } from "lucide-react";

// 使用React.lazy替代Next.js的dynamic import
const TrailCardGrid = lazy(() => import("@/components/ui/alltrailcard"));

// 更簡化的加載動畫變體 - 以最小化GPU負擔
const loadingContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// 減少文字動畫的複雜度
const loadingTextVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 }
  }
};

// 使用React.memo包裝LoadingIndicator組件以防止不必要的重渲染
const LoadingIndicator = React.memo(() => (
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
));

LoadingIndicator.displayName = 'LoadingIndicator';

const TrailsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 對trails.json數據進行更高效的輕量化處理
  const trailsData = useMemo(() => {
    try {
      const data = Traildata as Trail[];
      
      // 對數據進行輕量處理，只保留必要的屬性
      return data.map(trail => {
        // 截取過長的描述，減少不必要的數據傳輸
        const trimmedDescription = trail.description.length > 80 
          ? `${trail.description.substring(0, 80)}...` 
          : trail.description;

        return {
          ...trail,
          // 預先計算派生屬性，減少子組件內的計算負擔
          difficultyLevel: trail.difficulty === '困難' ? 3 : trail.difficulty === '中等' ? 2 : 1,
          // 只保留需要的tag (最多4個)
          tags: trail.tags.slice(0, 4),
          // 為了減少記憶體佔用，預先截取description
          description: trimmedDescription,
        };
      });
    } catch (error) {
      console.error('Error processing trail data:', error);
      return [] as Trail[];
    }
  }, []);

  // 預加載優先級高的圖片
  const preloadHighPriorityImages = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // 只預加載首屏中最可能立即看到的前幾張圖片(減少到3張)
    const visibleTrails = trailsData.slice(0, 3);
    
    // 創建一個延遲隊列，避免同時加載所有圖片
    visibleTrails.forEach((trail, index) => {
      setTimeout(() => {
        const img = new Image();
        img.onload = () => {
          // 最後一張圖片加載完成時，結束載入狀態
          if (index === visibleTrails.length - 1) {
            setIsLoading(false);
          }
        };
        img.src = trail.image;
      }, index * 100); // 每100ms載入一張圖片
    });
  }, [trailsData]);

  useEffect(() => {
    let isMounted = true;
    
    // 設置一個較短的最大等待時間，提高用戶體驗
    loadingTimerRef.current = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 600);

    // 立即開始預加載關鍵圖片
    preloadHighPriorityImages();
    
    return () => {
      isMounted = false;
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [preloadHighPriorityImages]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <Suspense fallback={<LoadingIndicator />}>
            <TrailCardGrid trails={trailsData} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(TrailsPage);