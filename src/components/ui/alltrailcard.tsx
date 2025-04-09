// TrailCardGrid.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";
import TrailFilter, { Trail } from '@/components/ui/filter';

interface TrailCardGridProps {
  trails: Trail[];
}

type SortOption = 'rating' | 'length-asc' | 'length-desc' | 'updated';

const TrailCardGrid: React.FC<TrailCardGridProps> = ({ trails }) => {
  const [filteredTrails, setFilteredTrails] = useState<Trail[]>(trails);
  const [sortOption, setSortOption] = useState<SortOption>('rating');
  const [favorites, setFavorites] = useState<number[]>([]);
  // 切換收藏顯示
  const toggleFavorite = (index: number) => {
    setFavorites(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };
  // 排序邏輯
  const sortTrails = (trails: Trail[], option: SortOption): Trail[] => {
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
  };

  // 排序變化時應用排序
  useEffect(() => {
    setFilteredTrails(sortTrails(filteredTrails, sortOption));
  }, [sortOption]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">台灣登山步道</h1>

      {/* 篩選器組件 */}
      <TrailFilter trails={trails} setFilteredTrails={setFilteredTrails} />

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
          {filteredTrails.map((trail, index) => (
            <motion.div
              key={trail.id}
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
                />
                {/* 收藏按鈕 */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(index);
                  }}
                  className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transition-colors duration-200 ${favorites.includes(index)
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
                  {trail.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 無結果提示 */}
      {filteredTrails.length === 0 && (
        <div className="text-center py-12 bg-slate-800/50 rounded-lg">
          <p className="text-xl text-white">沒有符合篩選條件的步道</p>
          <Button
            variant="outline"
            onClick={() => setFilteredTrails(trails)}
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