// TrailFilter.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, X } from "lucide-react";

// 定義步道類型
export interface Trail {
    id: number;
    name: string;
    length: number;
    difficulty: string;
    region: string;
    description: string;
    image: string;
    rating: number;
    seasons: string[];
    terrain: string[];
    features: string[];
    hazards: string[];
    tips: string;
    nearbyTrails: string[];
    lastUpdated: string;
    tags: string[];
}

// 定義篩選器屬性
interface TrailFilterProps {
    trails: Trail[];
    setFilteredTrails: React.Dispatch<React.SetStateAction<Trail[]>>;
}

// 定義篩選條件類型
interface FilterState {
    difficulty: string[];
    region: string[];
    distance: number[];
    seasons: string[];
    terrain: string[];
    features: string[];
    rating: number;
    tags: string[];
}

const TrailFilter: React.FC<TrailFilterProps> = ({ trails, setFilteredTrails }) => {
    // 篩選狀態
    const [filters, setFilters] = useState<FilterState>({
        difficulty: [],
        region: [],
        distance: [0, 20],
        seasons: [],
        terrain: [],
        features: [],
        rating: 0,
        tags: []
    });

    // 展開狀態
    const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);

    // 應用篩選邏輯
    const applyFilters = () => {
        const filtered = trails.filter(trail => {
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

        setFilteredTrails(filtered);
    };

    // 處理篩選變更
    const handleFilterChange = (category: keyof FilterState, value: string | number | number[]) => {
        setFilters(prev => {
            const newFilters = { ...prev };

            if (category === 'distance') {
                newFilters.distance = value as number[];
            } else if (category === 'rating') {
                newFilters.rating = value as number;
            } else if (Array.isArray(prev[category])) {
                const valueStr = value as string;
                const currentArray = prev[category] as string[];

                if (currentArray.includes(valueStr)) {
                    newFilters[category] = currentArray.filter(item => item !== valueStr) as any;
                } else {
                    newFilters[category] = [...currentArray, valueStr] as any;
                }
            }

            return newFilters;
        });
    };

    // 清除所有篩選
    const clearAllFilters = () => {
        setFilters({
            difficulty: [],
            region: [],
            distance: [0, 20],
            seasons: [],
            terrain: [],
            features: [],
            rating: 0,
            tags: []
        });
    };

    // 篩選器變化時應用篩選
    useEffect(() => {
        applyFilters();
    }, [filters]);

    // 獲取所有可能的選項
    const allRegions = Array.from(new Set(trails.map(t => t.region)));
    const allTags = Array.from(new Set(trails.flatMap(t => t.tags)));
    const allTerrains = Array.from(new Set(trails.flatMap(t => t.terrain)));
    const allFeatures = Array.from(new Set(trails.flatMap(t => t.features)));

    return (
        <div className="bg-slate-800 p-4 rounded-lg mb-6 shadow-lg">
            {/* 主要篩選選項 */}
            <div className="flex flex-wrap gap-4 mb-4">
                {/* 難度篩選 */}
                <div>
                    <p className="text-sm text-slate-300 mb-2">難度</p>
                    <div className="flex gap-2">
                        {['簡單', '中等', '困難'].map(diff => (
                            <Badge
                                key={diff}
                                variant={filters.difficulty.includes(diff) ? "default" : "outline"}
                                className={`cursor-pointer ${filters.difficulty.includes(diff) ?
                                        (diff === '困難' ? 'bg-red-500 hover:bg-red-600' :
                                            diff === '中等' ? 'bg-amber-500 hover:bg-amber-600' :
                                                'bg-green-500 hover:bg-green-600')
                                        : ''
                                    }`}
                                onClick={() => handleFilterChange('difficulty', diff)}
                            >
                                {diff}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* 距離篩選 */}
                <div className="min-w-[200px]">
                    <p className="text-sm text-slate-300 mb-2">距離: {filters.distance[0]}-{filters.distance[1]}km</p>
                    <Slider
                        defaultValue={[0, 20]}
                        max={20}
                        step={1}
                        value={filters.distance}
                        onValueChange={(val) => handleFilterChange('distance', val)}
                        className="w-full"
                    />
                </div>

                {/* 評分篩選 */}
                <div>
                    <p className="text-sm text-slate-300 mb-2">最低評分</p>
                    <Select
                        value={filters.rating.toString()}
                        onValueChange={(val) => handleFilterChange('rating', Number(val))}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="評分" />
                        </SelectTrigger>
                        <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map(rating => (
                                <SelectItem key={rating} value={rating.toString()}>
                                    {rating === 0 ? '所有評分' : `${rating} 星以上`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 地區篩選 */}
                <div>
                    <p className="text-sm text-slate-300 mb-2">地區</p>
                    <Select onValueChange={(val) => handleFilterChange('region', val)}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="選擇地區" />
                        </SelectTrigger>
                        <SelectContent>
                            {allRegions.map(region => (
                                <SelectItem key={region} value={region}>{region}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 進階篩選按鈕 */}
            <Button
                variant="ghost"
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="flex items-center gap-1 mb-2 text-slate-300 hover:text-white"
            >
                進階篩選
                {advancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>

            {/* 進階篩選選項 */}
            <AnimatePresence>
                {advancedOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-700">
                            {/* 季節篩選 */}
                            <div>
                                <p className="text-sm text-slate-300 mb-2">適合季節</p>
                                <div className="flex flex-wrap gap-2">
                                    {['春', '夏', '秋', '冬'].map(season => (
                                        <Badge
                                            key={season}
                                            variant={filters.seasons.includes(season) ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => handleFilterChange('seasons', season)}
                                        >
                                            {season}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* 地形篩選 */}
                            <div>
                                <p className="text-sm text-slate-300 mb-2">地形類型</p>
                                <div className="flex flex-wrap gap-2">
                                    {allTerrains.map(terrain => (
                                        <Badge
                                            key={terrain}
                                            variant={filters.terrain.includes(terrain) ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => handleFilterChange('terrain', terrain)}
                                        >
                                            {terrain}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* 特色篩選 */}
                            <div>
                                <p className="text-sm text-slate-300 mb-2">特色景點</p>
                                <div className="flex flex-wrap gap-2">
                                    {allFeatures.map(feature => (
                                        <Badge
                                            key={feature}
                                            variant={filters.features.includes(feature) ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => handleFilterChange('features', feature)}
                                        >
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* 標籤篩選 */}
                            <div className="md:col-span-3">
                                <p className="text-sm text-slate-300 mb-2">熱門標籤</p>
                                <div className="flex flex-wrap gap-2">
                                    {allTags.map(tag => (
                                        <Badge
                                            key={tag}
                                            variant={filters.tags.includes(tag) ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => handleFilterChange('tags', tag)}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 已選擇的篩選條件 */}
            <div className="flex flex-wrap gap-2 mt-4">
                {Object.entries(filters).flatMap(([key, value]) => {
                    if (Array.isArray(value) && value.length > 0 && key !== 'distance') {
                        return value.map(v => (
                            <Badge key={`${key}-${v}`} variant="secondary" className="flex items-center gap-1">
                                {v}
                                <X
                                    size={14}
                                    className="cursor-pointer ml-1"
                                    onClick={() => handleFilterChange(key as keyof FilterState, v)}
                                />
                            </Badge>
                        ));
                    }
                    return [];
                })}

                {(Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v > 0)) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-xs text-slate-300 hover:text-white"
                    >
                        清除所有篩選
                    </Button>
                )}
            </div>
        </div>
    );
};

export default TrailFilter;