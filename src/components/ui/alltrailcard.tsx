// TrailCardGrid.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trail } from '@/components/ui/filter';
import { cn } from "@/lib/utils";
import { HeartIcon } from "@heroicons/react/24/solid";
import TrailCommentDialog from "./trailcommentdialog";
import trailComments from "@/data/trailcomments.json";

interface TrailCardGridProps {
  trails: Trail[];
}

interface TrailCardProps {
  trail: Trail;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

type SortOption = 'rating' | 'length' | 'newest';

// 卡片動畫變體 - 使用較溫和的動畫效果
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 260, 
      damping: 20,
      duration: 0.3 
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

// 容器動畫變體
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 子元素錯開顯示
      delayChildren: 0.1,    // 稍微延遲子元素動畫
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      staggerChildren: 0.03,
      staggerDirection: -1   // 反向錯開，創造更自然的退場效果
    }
  }
};

// 單個卡片組件抽離出來，使用memo減少渲染
const TrailCard = React.memo(({ trail, isFavorite, onToggleFavorite }: TrailCardProps) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);

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

  const getTrailReviews = (trailId: number) => {
    const trailComment = trailComments.find(tc => tc.trailId === trailId);
    return trailComment ? trailComment.reviews : [];
  };

  return (
    <>
      <motion.div 
        layout
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative group overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all"
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        onClick={() => setIsCommentOpen(true)}
      >
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <img
            src={trail.image}
            alt={trail.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <motion.button
            className="absolute top-2 right-2 z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <HeartIcon
              className={cn(
                "h-6 w-6",
                isFavorite
                  ? "fill-red-500 stroke-white"
                  : "fill-white/30 stroke-white"
              )}
            />
          </motion.button>
        </div>

        <div className="p-4">
          <div className="flex gap-2 mb-2">
            <Badge className="flex items-center gap-1 bg-amber-500 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              {trail.rating.toFixed(1)}
            </Badge>

            <Badge
              className={cn(
                "text-white",
                trail.difficulty === '困難' ? 'bg-red-500' :
                trail.difficulty === '中等' ? 'bg-amber-500' :
                'bg-green-500'
              )}
            >
              {trail.difficulty}
            </Badge>

            <Badge variant="secondary" className="dark:bg-slate-700">
              {trail.length} 公里
            </Badge>
          </div>

          <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{trail.name}</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">{trail.description}</p>

          <div className="flex justify-between text-sm mb-2 text-slate-500 dark:text-slate-400">
            <span>{trail.region}</span>
            <span>適合季節: {trail.seasons.join(', ')}</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {trail.tags.slice(0, 3).map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600"
              >
                {tag}
              </Badge>
            ))}
            {trail.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600"
              >
                +{trail.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      <TrailCommentDialog
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        trailName={trail.name}
        reviews={getTrailReviews(trail.id)}
      />
    </>
  );
});

TrailCard.displayName = 'TrailCard';

const TrailCardGrid: React.FC<TrailCardGridProps> = ({ trails }) => {
  // 使用useRef避免不必要的effect觸發
  const isFiltering = useRef(false);
  const prevFilters = useRef({ difficulty: 'all', region: 'all', season: 'all' });
  
  // 使用單一狀態物件來管理過濾條件
  const [filterState, setFilterState] = useState({
    difficulty: 'all',
    region: 'all',
    season: 'all',
    sortBy: 'rating' as SortOption,
    currentPage: 1
  });
  
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filteredTrails, setFilteredTrails] = useState<Trail[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const itemsPerPage = 12;
  
  // 優化性能的虛擬化列表邏輯
  const allTrailsMap = useMemo(() => {
    const map = new Map<number, Trail>();
    trails.forEach(trail => map.set(trail.id, trail));
    return map;
  }, [trails]);
  
  // 簡化的重置過濾器 - 只更新一次狀態，減少重渲染
  const resetFilters = useCallback(() => {
    // 檢查是否需要重置 (當前已經是初始狀態則不需要)
    if (
      filterState.difficulty === 'all' && 
      filterState.region === 'all' && 
      filterState.season === 'all' && 
      filterState.sortBy === 'rating' && 
      filterState.currentPage === 1
    ) {
      return;
    }
    
    // 設置動畫標記
    setIsAnimating(true);
    
    // 儲存當前過濾條件用於變換動畫
    prevFilters.current = {
      difficulty: filterState.difficulty,
      region: filterState.region,
      season: filterState.season
    };
    
    // 使用requestAnimationFrame確保UI更新先執行
    requestAnimationFrame(() => {
      setFilterState({
        difficulty: 'all',
        region: 'all',
        season: 'all',
        sortBy: 'rating',
        currentPage: 1
      });
      
      // 使用離屏渲染或web worker來減輕主線程負擔
      setTimeout(() => {
        setFilteredTrails([...trails]);
        setTimeout(() => setIsAnimating(false), 300);
      }, 50);
    });
  }, [filterState, trails]);

  // 切換收藏 - 使用記憶化避免不必要的重渲染
  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  }, []);
  
  // 統一處理所有過濾狀態變更 - 避免重複渲染邏輯
  const handleFilterChange = useCallback((key: string, value: string) => {
    // 如果值沒有變化，則不觸發狀態更新
    if (filterState[key as keyof typeof filterState] === value) {
      return;
    }
    
    // 設置動畫標記
    setIsAnimating(true);
    
    // 保存前一個過濾狀態以便動畫比較
    prevFilters.current = {
      difficulty: filterState.difficulty,
      region: filterState.region,
      season: filterState.season
    };
    
    // 使用requestAnimationFrame確保UI更新順暢
    const rafId = requestAnimationFrame(() => {
      setFilterState(prev => ({
        ...prev,
        [key]: value,
        currentPage: 1 // 重置頁面
      }));
    });
    
    return () => cancelAnimationFrame(rafId);
  }, [filterState]);
  
  // 批量處理頁面變更 - 減少狀態更新次數
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage === filterState.currentPage) return;
    
    setIsAnimating(true);
    
    requestAnimationFrame(() => {
      setFilterState(prev => ({ ...prev, currentPage: newPage }));
      // 頁面切換時使用較短的延遲時間
      setTimeout(() => setIsAnimating(false), 200);
    });
  }, [filterState.currentPage]);
  
  // 篩選和排序 - 使用Web Worker模式減輕主線程負擔
  useEffect(() => {
    // 標記正在過濾
    isFiltering.current = true;
    
    const performFiltering = () => {
      // 定義過濾邏輯，使用函數式風格讓代碼更清晰
      const applyFilters = (data: Trail[]) => {
        // 使用函數組合模式來構建過濾管道
        const filterByDifficulty = (arr: Trail[]) => 
          filterState.difficulty !== 'all' 
            ? arr.filter(t => t.difficulty === filterState.difficulty)
            : arr;
        
        const filterByRegion = (arr: Trail[]) => 
          filterState.region !== 'all'
            ? arr.filter(t => t.region === filterState.region)
            : arr;
            
        const filterBySeason = (arr: Trail[]) => 
          filterState.season !== 'all'
            ? arr.filter(t => t.seasons.includes(filterState.season))
            : arr;
        
        // 使用組合函數進行過濾
        return filterBySeason(filterByRegion(filterByDifficulty(data)));
      };
      
      // 定義排序邏輯
      const applySort = (filteredData: Trail[]) => {
        // 對於相同評分的情況，加入次級排序條件以確保穩定排序
        if (filterState.sortBy === 'rating') {
          return [...filteredData].sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
        } else if (filterState.sortBy === 'length') {
          return [...filteredData].sort((a, b) => a.length - b.length || a.name.localeCompare(b.name));
        } else if (filterState.sortBy === 'newest') {
          return [...filteredData].sort((a, b) => {
            const dateA = new Date(a.lastUpdated).getTime();
            const dateB = new Date(b.lastUpdated).getTime();
            return dateB - dateA || a.name.localeCompare(b.name);
          });
        }
        return filteredData;
      };
      
      // 應用過濾和排序
      const filtered = applyFilters(trails);
      const sorted = applySort(filtered);
      
      // 更新狀態
      setFilteredTrails(sorted);
      
      // 延遲重置動畫標記，使動畫有時間完成
      setTimeout(() => {
        setIsAnimating(false);
        isFiltering.current = false;
      }, 300);
    };
    
    // 使用較短的延遲時間進行非阻塞處理
    const timeoutId = setTimeout(performFiltering, 50);
    
    return () => clearTimeout(timeoutId);
  }, [trails, filterState]);

  // 計算當前頁面顯示的卡片 - 使用記憶化避免不必要的計算
  const currentTrails = useMemo(() => {
    const startIndex = (filterState.currentPage - 1) * itemsPerPage;
    return filteredTrails.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTrails, filterState.currentPage, itemsPerPage]);

  // 計算總頁數
  const totalPages = Math.ceil(filteredTrails.length / itemsPerPage);
  
  // 初始化元件
  useEffect(() => {
    setFilteredTrails(trails);
  }, [trails]);

  // 增強的篩選結果通知 - 提供更詳細的信息
  const filterNotification = useMemo(() => {
    if (filteredTrails.length === trails.length) {
      return `顯示全部 ${trails.length} 個步道`;
    }
    
    const start = Math.min((filterState.currentPage - 1) * itemsPerPage + 1, filteredTrails.length);
    const end = Math.min(filterState.currentPage * itemsPerPage, filteredTrails.length);
    
    let message = `顯示 ${filteredTrails.length} 個步道中的 ${start}-${end}`;
    
    const filters = [];
    if (filterState.difficulty !== 'all') filters.push(`難度: ${filterState.difficulty}`);
    if (filterState.region !== 'all') filters.push(`地區: ${filterState.region}`);
    if (filterState.season !== 'all') filters.push(`季節: ${filterState.season}`);
    
    if (filters.length > 0) {
      message += ` (${filters.join(', ')})`;
    }
    
    return message;
  }, [filteredTrails.length, trails.length, filterState, itemsPerPage]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 bg-slate-100 dark:bg-slate-900">
     

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-8 shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">難度</label>
            <Select 
              value={filterState.difficulty} 
              onValueChange={(value) => handleFilterChange('difficulty', value)}
              disabled={isAnimating}
            >
              <SelectTrigger className="w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                <SelectValue placeholder="所有難度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有難度</SelectItem>
                <SelectItem value="簡單">簡單</SelectItem>
                <SelectItem value="中等">中等</SelectItem>
                <SelectItem value="困難">困難</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">地區</label>
            <Select 
              value={filterState.region} 
              onValueChange={(value) => handleFilterChange('region', value)}
              disabled={isAnimating}
            >
              <SelectTrigger className="w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                <SelectValue placeholder="所有地區" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有地區</SelectItem>
                <SelectItem value="台北市">台北市</SelectItem>
                <SelectItem value="新北市">新北市</SelectItem>
                <SelectItem value="宜蘭縣">宜蘭縣</SelectItem>
                <SelectItem value="花蓮縣">花蓮縣</SelectItem>
                <SelectItem value="南投縣">南投縣</SelectItem>
                <SelectItem value="嘉義縣">嘉義縣</SelectItem>
                <SelectItem value="屏東縣">屏東縣</SelectItem>
                <SelectItem value="苗栗縣">苗栗縣</SelectItem>
                <SelectItem value="台南市">台南市</SelectItem>
                <SelectItem value="新竹縣">新竹縣</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">季節</label>
            <Select 
              value={filterState.season} 
              onValueChange={(value) => handleFilterChange('season', value)}
              disabled={isAnimating}
            >
              <SelectTrigger className="w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                <SelectValue placeholder="所有季節" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有季節</SelectItem>
                <SelectItem value="春">春季</SelectItem>
                <SelectItem value="夏">夏季</SelectItem>
                <SelectItem value="秋">秋季</SelectItem>
                <SelectItem value="冬">冬季</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">排序方式</label>
            <Select 
              value={filterState.sortBy} 
              onValueChange={(value) => handleFilterChange('sortBy', value as SortOption)}
              disabled={isAnimating}
            >
              <SelectTrigger className="w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">評分 (高至低)</SelectItem>
                <SelectItem value="length">長度 (短至長)</SelectItem>
                <SelectItem value="newest">最新更新</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
          <Button
            onClick={resetFilters}
            variant="outline"
            disabled={isAnimating}
            className="w-full sm:w-auto bg-white dark:bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {isAnimating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                重設中...
              </span>
            ) : "重設過濾器"}
          </Button>
          
          <motion.div 
            key={filterNotification}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-600 dark:text-gray-300 text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full"
          >
            {filterNotification}
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {filteredTrails.length === 0 ? (
          <motion.div 
            key="no-results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12 text-slate-600 dark:text-gray-300 bg-white dark:bg-slate-800 rounded-lg shadow"
          >
            <div className="text-6xl mb-4">🏔️</div>
            <h3 className="text-xl font-semibold mb-2">沒有找到符合條件的步道</h3>
            <p>請嘗試調整您的過濾條件</p>
          </motion.div>
        ) : (
          <LayoutGroup id="trail-cards">
            <motion.div 
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {currentTrails.map((trail) => (
                  <TrailCard 
                    key={trail.id} 
                    trail={trail} 
                    isFavorite={favorites.includes(trail.id)} 
                    onToggleFavorite={() => toggleFavorite(trail.id)} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}
      </AnimatePresence>

      {filteredTrails.length > 0 && totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mt-8 flex justify-center"
        >
          <div className="flex space-x-2">
            <Button
              onClick={() => handlePageChange(Math.max(filterState.currentPage - 1, 1))}
              disabled={filterState.currentPage === 1 || isAnimating}
              variant="outline"
              className="bg-white dark:bg-slate-700 text-slate-700 dark:text-white border-slate-300 dark:border-slate-600"
            >
              上一頁
            </Button>
            <div className="flex items-center px-4 text-slate-700 dark:text-white bg-white dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600">
              第 {filterState.currentPage} 頁，共 {totalPages} 頁
            </div>
            <Button
              onClick={() => handlePageChange(Math.min(filterState.currentPage + 1, totalPages))}
              disabled={filterState.currentPage === totalPages || isAnimating}
              variant="outline"
              className="bg-white dark:bg-slate-700 text-slate-700 dark:text-white border-slate-300 dark:border-slate-600"
            >
              下一頁
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrailCardGrid;