// TrailCardGrid.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TrailFilter, { Trail, FilterState } from '@/components/ui/filter';

interface TrailCardGridProps {
  trails: Trail[];
}

type SortOption = 'rating' | 'length-asc' | 'length-desc' | 'updated';

// 單個卡片組件抽離出來，使用memo減少渲染
const TrailCard = React.memo(({ trail, isFavorite, onToggleFavorite }: { 
  trail: Trail, 
  isFavorite: boolean, 
  onToggleFavorite: () => void 
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      {/* 卡片圖片 */}
      <div className="relative h-48">
        <img
          src={trail.image}
          alt={trail.name}
          className="w-full h-full object-cover"
          loading="lazy" // 使用懶加載
        />
        {/* 收藏按鈕 */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transition-colors duration-200 ${isFavorite
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
      </div>

      {/* 卡片內容 */}
      <div className="p-4">
        {/* 評分、難度和距離 */}
        <div className="flex gap-2 mb-2">
          <Badge
            variant="default"
            className="flex items-center gap-1 bg-amber-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            {trail.rating.toFixed(1)}
          </Badge>

          <Badge
            variant="default"
            className={
              trail.difficulty === '困難' ? 'bg-red-500' :
                trail.difficulty === '中等' ? 'bg-amber-500' :
                  'bg-green-500'
            }
          >
            {trail.difficulty}
          </Badge>

          <Badge variant="secondary">
            {trail.length} 公里
          </Badge>
        </div>

        {/* 步道名稱 */}
        <h3 className="text-xl font-bold mb-2 text-white">{trail.name}</h3>

        {/* 描述 */}
        <p className="text-slate-300 mb-4 text-sm">{trail.description}</p>

        {/* 地區和季節 */}
        <div className="flex justify-between text-sm mb-2 text-slate-400">
          <span>{trail.region}</span>
          <span>適合季節: {trail.seasons.join(', ')}</span>
        </div>

        {/* 標籤 */}
        <div className="flex flex-wrap gap-1 mt-3">
          {trail.tags.slice(0, 5).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {trail.tags.length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{trail.tags.length - 5}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
});

const TrailCardGrid: React.FC<TrailCardGridProps> = ({ trails }) => {
  const [filteredTrails, setFilteredTrails] = useState<Trail[]>(trails);
  const [sortOption, setSortOption] = useState<SortOption>('rating');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 每頁顯示的卡片數量

  // 切換收藏顯示 - 使用useCallback避免重複創建函數
  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  }, []);
  
  // 篩選邏輯 - 使用useMemo緩存結果
  const applyFilters = useCallback((trails: Trail[], filters: FilterState) => {
    return trails.filter(trail => {
      // 難度篩選
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(trail.difficulty)) {
        return false;
      }

      // 地區篩選
      if (filters.region.length > 0 && !filters.region.includes(trail.region)) {
        return false;
      }

      // 距離篩選
      if (trail.length < filters.distance[0] || trail.length > filters.distance[1]) {
        return false;
      }

      // 季節篩選
      if (filters.seasons.length > 0 && !filters.seasons.some(season => trail.seasons.includes(season))) {
        return false;
      }

      // 評分篩選
      if (trail.rating < filters.rating) {
        return false;
      }

      // 地形篩選
      if (filters.terrain.length > 0 && !filters.terrain.some(t => trail.terrain.includes(t))) {
        return false;
      }

      // 特色篩選
      if (filters.features.length > 0 && !filters.features.some(f => trail.features.includes(f))) {
        return false;
      }

      // 標籤篩選
      if (filters.tags.length > 0 && !filters.tags.some(tag => trail.tags.includes(tag))) {
        return false;
      }

      return true;
    });
  }, []);

  // 排序邏輯
  const sortTrails = useCallback((trails: Trail[], option: SortOption): Trail[] => {
    switch (option) {
      case 'rating':
        return [...trails].sort((a, b) => b.rating - a.rating);
      case 'length-asc':
        return [...trails].sort((a, b) => a.length - b.length);
      case 'length-desc':
        return [...trails].sort((a, b) => b.length - a.length);
      case 'updated':
        return [...trails].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
      default:
        return trails;
    }
  }, []);

  // 處理篩選變化
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    const filtered = applyFilters(trails, newFilters);
    const sorted = sortTrails(filtered, sortOption);
    setFilteredTrails(sorted);
    setCurrentPage(1); // 重置到第一頁
  }, [trails, sortOption, applyFilters, sortTrails]);

  // 排序變化時應用排序
  useEffect(() => {
    setFilteredTrails(prev => sortTrails(prev, sortOption));
  }, [sortOption, sortTrails]);

  // 計算當前頁面顯示的卡片
  const currentTrails = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTrails.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTrails, currentPage, itemsPerPage]);

  // 計算總頁數
  const totalPages = Math.ceil(filteredTrails.length / itemsPerPage);

  // 渲染分頁按鈕
  const renderPaginationButtons = () => {
    const buttons = [];
    
    // 前一頁按鈕
    buttons.push(
      <Button 
        key="prev" 
        variant="outline" 
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        className="text-sm"
      >
        上一頁
      </Button>
    );
    
    // 頁碼按鈕 - 最多顯示5個
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button 
          key={i} 
          variant={i === currentPage ? "default" : "outline"}
          onClick={() => setCurrentPage(i)}
          className="min-w-8 text-sm"
        >
          {i}
        </Button>
      );
    }
    
    // 下一頁按鈕
    buttons.push(
      <Button 
        key="next" 
        variant="outline" 
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        className="text-sm"
      >
        下一頁
      </Button>
    );
    
    return buttons;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">台灣登山步道</h1>

      {/* 篩選器組件 */}
      <TrailFilter trails={trails} setFilteredTrails={setFilteredTrails} onFiltersChange={handleFiltersChange} />

      {/* 排序選項 */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-300">找到 {filteredTrails.length} 條步道</p>
        <Select value={sortOption} onValueChange={(val) => setSortOption(val as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">評分高至低</SelectItem>
            <SelectItem value="length-asc">距離短至長</SelectItem>
            <SelectItem value="length-desc">距離長至短</SelectItem>
            <SelectItem value="updated">最近更新</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 卡片網格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>

      {/* 分頁控制 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {renderPaginationButtons()}
        </div>
      )}

      {/* 無結果提示 */}
      {filteredTrails.length === 0 && (
        <div className="text-center py-12 bg-slate-800/50 rounded-lg">
          <p className="text-xl text-white">沒有符合篩選條件的步道</p>
          <Button
            variant="outline"
            onClick={() => handleFiltersChange({
              difficulty: [],
              region: [],
              distance: [0, 25],
              seasons: [],
              terrain: [],
              features: [],
              rating: 0,
              tags: []
            })}
            className="mt-4"
          >
            重設篩選條件
          </Button>
        </div>
      )}
    </div>
  );
};

export default TrailCardGrid;