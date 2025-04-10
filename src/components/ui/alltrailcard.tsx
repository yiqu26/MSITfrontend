// TrailCardGrid.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  onToggleFavorite: (id: number) => void;
}

type SortOption = 'rating' | 'length' | 'newest';

// 簡化的卡片動畫
const cardVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "tween", 
      duration: 0.15 
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.1 }
  }
};

// 簡化的容器動畫
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    }
  },
  exit: { opacity: 0 }
};

// 單個卡片組件抽離出來，使用memo減少渲染
const TrailCard = React.memo(({ trail, isFavorite, onToggleFavorite }: TrailCardProps) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  // 使用useMemo減少不必要的計算
  const trailReviews = useMemo(() => {
    const trailComment = trailComments.find(tc => tc.trailId === trail.id);
    return trailComment ? trailComment.reviews : [];
  }, [trail.id]);

  // 預先定義事件處理程序以避免重新渲染時產生新的函數
  const handleCardClick = useCallback(() => {
    setIsCommentOpen(true);
  }, []);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(trail.id);
  }, [onToggleFavorite, trail.id]);

  const handleCloseComment = useCallback(() => {
    setIsCommentOpen(false);
  }, []);

  return (
    <>
      <div className="relative group overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all"
        onClick={handleCardClick}>
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <img
            src={trail.image}
            alt={trail.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <button
            className="absolute top-2 right-2 z-10"
            onClick={handleFavoriteClick}
          >
            <HeartIcon
              className={cn(
                "h-6 w-6",
                isFavorite
                  ? "fill-red-500 stroke-white"
                  : "fill-white/30 stroke-white"
              )}
            />
          </button>
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

          <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white truncate">{trail.name}</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm line-clamp-2">{trail.description}</p>

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
      </div>

      <TrailCommentDialog
        isOpen={isCommentOpen}
        onClose={handleCloseComment}
        trailName={trail.name}
        reviews={trailReviews}
      />
    </>
  );
});

TrailCard.displayName = 'TrailCard';

const TrailCardGrid: React.FC<TrailCardGridProps> = ({ trails }) => {
  const [filterState, setFilterState] = useState({
    difficulty: 'all',
    region: 'all',
    season: 'all',
    sortBy: 'rating' as SortOption,
    searchTerm: '',
    currentPage: 1,
    showFavoritesOnly: false
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 使用useRef保存favorites，避免收藏時觸發不必要的重渲染
  const favoritesRef = useRef<Set<number>>(new Set()); 
  const [favorites, setFavorites] = useState<number[]>(() => {
    // 從localStorage中獲取收藏列表
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('trailFavorites');
      const parsed = savedFavorites ? JSON.parse(savedFavorites) : [];
      favoritesRef.current = new Set(parsed);
      return parsed;
    }
    return [];
  });
  
  // 改為每頁顯示3x3=9個卡片
  const itemsPerPage = 9;
  
  // 保存步道數據狀態
  const [trailState, setTrailState] = useState({
    filteredTrails: [] as Trail[],
    visibleTrails: [] as Trail[],
    isFiltering: false,
    totalPages: 0
  });
  
  // 使用memoization避免重複計算
  const uniqueRegions = useMemo(() => {
    const regions = new Set(trails.map(trail => trail.region));
    return ['all', ...Array.from(regions)];
  }, [trails]);
  
  // 使用memoization優化過濾邏輯
  const performFiltering = useCallback((newFilter?: Partial<typeof filterState>) => {
    // 合併過濾條件
    const activeFilter = newFilter ? { ...filterState, ...newFilter } : filterState;
    
    setTrailState(prev => ({ ...prev, isFiltering: true }));
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      try {
        let result = [...trails];
        
        if (activeFilter.difficulty !== 'all') {
          result = result.filter(trail => trail.difficulty === activeFilter.difficulty);
        }
        
        if (activeFilter.region !== 'all') {
          result = result.filter(trail => trail.region === activeFilter.region);
        }
        
        if (activeFilter.season !== 'all') {
          result = result.filter(trail => trail.seasons.includes(activeFilter.season));
        }
        
        if (activeFilter.showFavoritesOnly) {
          result = result.filter(trail => favoritesRef.current.has(trail.id));
        }
        
        if (activeFilter.searchTerm) {
          const term = activeFilter.searchTerm.toLowerCase();
          result = result.filter(trail => 
            trail.name.toLowerCase().includes(term) || 
            trail.description.toLowerCase().includes(term) ||
            trail.tags.some(tag => tag.toLowerCase().includes(term))
          );
        }
        
        // 簡化排序邏輯
        result.sort((a, b) => {
          if (activeFilter.sortBy === 'rating') return b.rating - a.rating;
          if (activeFilter.sortBy === 'length') return a.length - b.length;
          return b.id - a.id; // 'newest'
        });
        
        // 計算總頁數
        const totalPages = Math.ceil(result.length / itemsPerPage);
        
        // 確保頁碼有效
        const effectivePage = Math.min(Math.max(1, activeFilter.currentPage), totalPages || 1);
        
        // 計算當前頁的步道
        const startIndex = (effectivePage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const visibleTrails = result.slice(startIndex, endIndex);
        
        // 更新狀態
        setTrailState({
          filteredTrails: result,
          visibleTrails: visibleTrails,
          isFiltering: false,
          totalPages: totalPages
        });
        
        // 如果當前頁碼與有效頁碼不同，更新頁碼
        if (effectivePage !== activeFilter.currentPage) {
          setFilterState(prev => ({ ...prev, currentPage: effectivePage }));
        }
      } catch (error) {
        console.error('過濾步道時出錯:', error);
        setTrailState(prev => ({ ...prev, isFiltering: false }));
      }
    }, 100);
  }, [trails, filterState, itemsPerPage]);
  
  // 初始化和篩選條件變更時更新
  useEffect(() => {
    performFiltering();
  }, [
    filterState.difficulty, 
    filterState.region, 
    filterState.season, 
    filterState.sortBy,
    filterState.searchTerm,
    filterState.showFavoritesOnly,
    performFiltering
  ]);
  
  // 當頁碼變化時更新顯示步道
  useEffect(() => {
    if (!trailState.isFiltering && trailState.filteredTrails.length > 0) {
      const startIndex = (filterState.currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const visibleTrails = trailState.filteredTrails.slice(startIndex, endIndex);
      
      setTrailState(prev => ({ ...prev, visibleTrails }));
    }
  }, [filterState.currentPage, trailState.filteredTrails, trailState.isFiltering, itemsPerPage]);
  
  // 優化收藏功能，避免整個列表重新渲染
  const toggleFavorite = useCallback((trailId: number) => {
    if (favoritesRef.current.has(trailId)) {
      favoritesRef.current.delete(trailId);
    } else {
      favoritesRef.current.add(trailId);
    }
    
    // 使用requestAnimationFrame延遲更新DOM狀態，避免卡頓
    requestAnimationFrame(() => {
      const newFavorites = Array.from(favoritesRef.current);
      setFavorites(newFavorites);
      
      // 寫入localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('trailFavorites', JSON.stringify(newFavorites));
      }
      
      // 只有在查看收藏時才更新過濾結果
      if (filterState.showFavoritesOnly) {
        performFiltering();
      }
    });
  }, [filterState.showFavoritesOnly, performFiltering]);
  
  const resetFilters = useCallback(() => {
    setFilterState({
      difficulty: 'all',
      region: 'all',
      season: 'all',
      sortBy: 'rating',
      searchTerm: '',
      currentPage: 1,
      showFavoritesOnly: false
    });
  }, []);
  
  // 計算頁碼按鈕
  const pageNumbers = useMemo(() => {
    const maxPages = 5;
    let startPage = Math.max(1, filterState.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(trailState.totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [filterState.currentPage, trailState.totalPages]);
  
  const handleFilterChange = useCallback((filter: keyof typeof filterState, value: any) => {
    const newFilter = { [filter]: value, currentPage: 1 };
    setFilterState(prev => ({ ...prev, ...newFilter }));
  }, []);
  
  // 簡化的頁面切換邏輯
  const handlePageChange = useCallback((page: number) => {
    // 避免無效頁碼或重複點擊當前頁
    if (page < 1 || page > trailState.totalPages || page === filterState.currentPage) return;
    
    // 更新頁碼
    setFilterState(prev => ({ ...prev, currentPage: page }));
    
    // 滾動到頁面頂部
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [trailState.totalPages, filterState.currentPage]);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setFilterState(prev => ({ ...prev, searchTerm: value, currentPage: 1 }));
    }, 300);
  }, []);
  
  const isEmpty = trailState.filteredTrails.length === 0;
  
  return (
    <div ref={containerRef} className="container mx-auto px-4 py-6">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg mb-6 shadow-md">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="w-full md:w-auto flex-1">
            <input
              type="text"
              placeholder="搜尋步道..."
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
              onChange={handleSearchChange}
              defaultValue={filterState.searchTerm}
            />
          </div>
          
          <div>
            <Select
              value={filterState.difficulty}
              onValueChange={(value) => handleFilterChange('difficulty', value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="難度" />
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
            <Select
              value={filterState.region}
              onValueChange={(value) => handleFilterChange('region', value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="地區" />
              </SelectTrigger>
              <SelectContent>
                {uniqueRegions.map(region => (
                  <SelectItem key={region} value={region}>
                    {region === 'all' ? '所有地區' : region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select
              value={filterState.season}
              onValueChange={(value) => handleFilterChange('season', value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="季節" />
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
            <Select
              value={filterState.sortBy}
              onValueChange={(value) => handleFilterChange('sortBy', value as SortOption)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="排序依據" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">評分最高</SelectItem>
                <SelectItem value="length">距離最短</SelectItem>
                <SelectItem value="newest">最新</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="favorites"
              checked={filterState.showFavoritesOnly}
              onChange={(e) => handleFilterChange('showFavoritesOnly', e.target.checked)}
              className="mr-1 h-4 w-4"
            />
            <label htmlFor="favorites" className="text-sm dark:text-white">只顯示收藏</label>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFilters}
            className="ml-auto"
          >
            重置過濾
          </Button>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          顯示 {trailState.filteredTrails.length} 個結果，共 {trails.length} 條步道
          {trailState.totalPages > 0 && ` | 第 ${filterState.currentPage} 頁，共 ${trailState.totalPages} 頁`}
        </div>
      </div>
      
      {trailState.isFiltering ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-slate-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.071 19.071c3.898-3.898 3.898-10.243 0-14.142-3.898-3.898-10.243-3.898-14.142 0-3.898 3.898-3.898 10.243 0 14.142 3.898 3.898 10.243 3.898 14.142 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h8M12 8v8"
            />
          </svg>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
            沒有找到符合條件的步道
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md">
            請嘗試調整過濾條件或重置過濾來查看更多步道。
          </p>
          <Button onClick={resetFilters}>重置過濾</Button>
        </div>
      ) : (
        <>
          {/* 步道卡片網格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {trailState.visibleTrails.map(trail => (
              <TrailCard
                key={trail.id}
                trail={trail}
                isFavorite={favoritesRef.current.has(trail.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
          
          {/* 分頁控制器 */}
          {trailState.totalPages > 1 && (
            <div className="flex justify-center mt-8 mb-20">
              <div className="bg-white dark:bg-slate-800 rounded-full shadow-md py-2 px-4 flex items-center space-x-2 border border-slate-200 dark:border-slate-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(filterState.currentPage - 1)}
                  disabled={filterState.currentPage === 1}
                  className="h-8 w-8 p-0 rounded-full flex items-center justify-center"
                  aria-label="上一頁"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </Button>
                
                <div className="hidden sm:flex space-x-2">
                  {pageNumbers.map(page => (
                    <Button
                      key={page}
                      variant={page === filterState.currentPage ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "h-8 w-8 p-0 rounded-full flex items-center justify-center font-medium",
                        page === filterState.currentPage 
                          ? "bg-indigo-400 text-white shadow-md border-2 border-primary/20 scale-110 transform transition-all"
                          : "hover:bg-primary/10"
                      )}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <div className="sm:hidden px-3 font-medium text-sm">
                  {filterState.currentPage} / {trailState.totalPages}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(filterState.currentPage + 1)}
                  disabled={filterState.currentPage === trailState.totalPages}
                  className="h-8 w-8 p-0 rounded-full flex items-center justify-center"
                  aria-label="下一頁"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(TrailCardGrid);