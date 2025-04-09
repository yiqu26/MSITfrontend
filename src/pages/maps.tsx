import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/leaflet-fix.css';
import '../styles/custom-scrollbar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import L from 'leaflet';
import trailsData from '@/data/trails.json';
import TrailHorizontalCards from "@/components/ui/TrailHorizontalCards";
import { Trail } from '@/types/trail';

// Leaflet 預設圖標修正
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// 自定義步道難度圖標
const createDifficultyIcon = (difficulty: string) => {
  return L.divIcon({
    className: `custom-div-icon ${difficulty}`,
    html: `<div style="background-color: ${
      difficulty === '困難' ? '#ef4444' : 
      difficulty === '中等' ? '#f59e0b' : 
      '#22c55e'
    }; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white;">
      <span style="color: white; font-weight: bold; font-size: 10px;">${
        difficulty === '困難' ? '難' : 
        difficulty === '中等' ? '中' : 
        '易'
      }</span>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

// 地圖中心重置組件
const MapControl = ({ selectedTrail }: { selectedTrail: Trail | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedTrail) {
      map.flyTo(
        [selectedTrail.latitude, selectedTrail.longitude], 
        14, 
        { duration: 1.5 }
      );
    }
  }, [selectedTrail, map]);
  
  return null;
};

// 定義列表動畫變體
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// 修改 TrailCard 組件，添加 trail-card 類名以使用 CSS 性能優化
const TrailCard = React.memo(({ 
  trail, 
  isSelected, 
  onClick 
}: { 
  trail: Trail, 
  isSelected: boolean, 
  onClick: () => void 
}) => {
  return (
    <motion.div
      variants={itemVariants}
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 trail-card ${
        isSelected 
          ? 'bg-blue-800/30 border border-blue-500/50' 
          : 'bg-slate-700 hover:bg-slate-700/80'
      }`}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      layoutId={`trail-${trail.id}`} // 添加 layoutId 以支持平滑過渡
    >
      <div className="flex gap-3">
        <div className="rounded-md overflow-hidden h-16 w-16 flex-shrink-0">
          <img 
            src={trail.image} 
            alt={trail.name} 
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="font-medium text-sm text-white truncate" title={trail.name}>{trail.name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge className={`text-xs ${
              trail.difficulty === '困難' ? 'bg-red-500' : 
              trail.difficulty === '中等' ? 'bg-amber-500' : 
              'bg-green-500'
            }`}>
              {trail.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {trail.length} 公里
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {trail.region}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {trail.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

// 優化2: 對特色步道卡片進行 memo 處理
const FeaturedTrailCard = React.memo(({ 
  trail, 
  isSelected, 
  onClick 
}: { 
  trail: Trail, 
  isSelected: boolean, 
  onClick: () => void 
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="rounded-xl overflow-hidden shadow-lg cursor-pointer trail-card"
      layoutId={`featured-trail-${trail.id}`}
    >
      <div className="aspect-video relative">
        <img 
          src={trail.image} 
          alt={trail.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg">{trail.name}</h3>
          <div className="flex gap-2 mt-1">
            <Badge className={`${
              trail.difficulty === '困難' ? 'bg-red-500' : 
              trail.difficulty === '中等' ? 'bg-amber-500' : 
              'bg-green-500'
            }`}>
              {trail.difficulty}
            </Badge>
            <Badge variant="outline" className="text-white border-white/50 bg-black/20">
              {trail.rating.toFixed(1)} 分
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-slate-700">
        <p className="text-slate-200 text-sm line-clamp-1">
          {trail.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {trail.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

// 地圖組件包裝器，僅在真正需要時重新渲染地圖
const MapWithMemo = React.memo(({ centerPosition, trails, onMarkerClick, selectedTrail }: {
  centerPosition: [number, number];
  trails: Trail[];
  onMarkerClick: (trail: Trail) => void;
  selectedTrail: Trail | null;
}) => {
  return (
    <MapContainer 
      center={centerPosition} 
      zoom={8} 
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {trails.map(trail => (
        <Marker 
          key={trail.id} 
          position={[trail.latitude, trail.longitude]}
          icon={createDifficultyIcon(trail.difficulty)}
          eventHandlers={{
            click: () => onMarkerClick(trail)
          }}
        >
          <Popup>
            <div className="text-slate-900">
              <h3 className="font-bold">{trail.name}</h3>
              <div className="flex gap-1 my-1">
                <span className={`px-2 py-0.5 rounded-full text-xs text-white ${
                  trail.difficulty === '困難' ? 'bg-red-500' : 
                  trail.difficulty === '中等' ? 'bg-amber-500' : 
                  'bg-green-500'
                }`}>{trail.difficulty}</span>
                <span className="px-2 py-0.5 bg-slate-200 rounded-full text-xs">{trail.region}</span>
              </div>
              <p className="text-sm">{trail.description.substring(0, 50)}...</p>
              <button 
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkerClick(trail);
                }}
              >
                顯示詳情
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {selectedTrail && <MapControl selectedTrail={selectedTrail} />}
    </MapContainer>
  );
}, (prevProps, nextProps) => {
  // 只有當以下條件變化時才重新渲染地圖
  return (
    prevProps.trails.length === nextProps.trails.length &&
    prevProps.selectedTrail?.id === nextProps.selectedTrail?.id &&
    prevProps.centerPosition[0] === nextProps.centerPosition[0] &&
    prevProps.centerPosition[1] === nextProps.centerPosition[1]
  );
});

const Maps = () => {
  const [trails] = useState<Trail[]>(trailsData as Trail[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // 台灣中部為初始中心點
  const centerPosition: [number, number] = [23.8, 121.0];
  
  // 篩選步道
  const filteredAndSortedTrails = useMemo(() => {
    // 先篩選
    const filtered = trails.filter(trail => {
      const matchesSearch = trail.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = selectedDifficulty && selectedDifficulty !== 'all' ? trail.difficulty === selectedDifficulty : true;
      const matchesRegion = selectedRegion && selectedRegion !== 'all' ? trail.region === selectedRegion : true;
      
      return matchesSearch && matchesDifficulty && matchesRegion;
    });
    
    // 支持按不同條件排序 (此處可擴展)
    return filtered;
  }, [trails, searchTerm, selectedDifficulty, selectedRegion]);
  
  // 取得所有地區選項
  const regions = useMemo(() => {
    return Array.from(new Set(trails.map(trail => trail.region))).filter(region => region.trim() !== '');
  }, [trails]);
  
  // 取得熱門步道 (評分高的前8條)
  const featuredTrails = useMemo(() => {
    return [...trails]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, [trails]);
  
  // 點擊標記處理
  const handleMarkerClick = useCallback((trail: Trail) => {
    setSelectedTrail(trail);
    setShowSidebar(true);
  }, []);
  
  // 點擊卡片處理
  const handleCardClick = useCallback((trail: Trail) => {
    setSelectedTrail(trail);
    setShowSidebar(true);
  }, []);
  
  return (
    <div className="flex flex-col md:flex-row h-screen p-3 md:p-4 gap-3 md:gap-4 bg-slate-900 text-white overflow-x-hidden">
      {/* 左側 */}
      <div className="md:w-2/3 lg:w-3/4 flex flex-col gap-3 md:gap-4">
        {/* 搜尋和過濾區 */}
        <div className="bg-slate-800 p-3 md:p-4 rounded-xl shadow-lg flex flex-col sm:flex-row gap-3">
          <Input
            className="bg-slate-700 border-slate-600 flex-grow"
            placeholder="搜尋步道名稱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full sm:w-32 bg-slate-700 border-slate-600">
              <SelectValue placeholder="難度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部難度</SelectItem>
              <SelectItem value="簡單">簡單</SelectItem>
              <SelectItem value="中等">中等</SelectItem>
              <SelectItem value="困難">困難</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full sm:w-40 bg-slate-700 border-slate-600">
              <SelectValue placeholder="地區" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部地區</SelectItem>
              {regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* 地圖區塊 */}
        <motion.div 
          className="flex-grow rounded-xl overflow-hidden shadow-lg min-h-[50vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MapWithMemo 
            centerPosition={centerPosition}
            trails={filteredAndSortedTrails}
            onMarkerClick={handleMarkerClick}
            selectedTrail={selectedTrail}
          />
        </motion.div>
        
        {/* 水平滑動卡片 (在 md 以下尺寸顯示) */}
        <div className="md:hidden mt-2">
          <div className="bg-slate-800 p-4 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">特色步道</h2>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredTrails.map(trail => (
                  <CarouselItem key={trail.id} className="pl-2 md:pl-4 basis-3/4 md:basis-1/2 lg:basis-1/3">
                    <FeaturedTrailCard
                      trail={trail}
                      isSelected={selectedTrail?.id === trail.id}
                      onClick={() => handleCardClick(trail)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious className="relative -left-0 bg-slate-700/50 hover:bg-slate-700" />
                <CarouselNext className="relative -right-0 bg-slate-700/50 hover:bg-slate-700" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
      
      {/* 右側 - 步道卡片列表和詳情面板 */}
      <div className="md:w-1/3 lg:w-1/4 mt-4 md:mt-0 flex flex-col gap-4">
        <div className="sticky top-4 space-y-4">
          {/* 步道卡片列表 */}
          <div className="bg-slate-800 p-4 rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">步道列表</h2>
              <Badge variant="outline">{filteredAndSortedTrails.length} 條</Badge>
            </div>
            
            <Separator className="my-2 bg-slate-700" />
            
            <motion.div 
              className="space-y-2 max-h-[35vh] lg:max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredAndSortedTrails.map(trail => (
                <TrailCard
                  key={trail.id}
                  trail={trail}
                  isSelected={selectedTrail?.id === trail.id}
                  onClick={() => handleCardClick(trail)}
                />
              ))}
              
              {filteredAndSortedTrails.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  沒有符合條件的步道
                </div>
              )}
            </motion.div>
          </div>
          
          {/* 特色步道區 (僅在 md 以上尺寸顯示) */}
          <div className="hidden md:block bg-slate-800 p-4 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">特色步道</h2>
            
            <Separator className="my-2 bg-slate-700" />
            
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredTrails.slice(0, 5).map(trail => (
                  <CarouselItem key={trail.id} className="pl-2 md:pl-4 basis-full">
                    <FeaturedTrailCard
                      trail={trail}
                      isSelected={selectedTrail?.id === trail.id}
                      onClick={() => handleCardClick(trail)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious className="relative -left-0 bg-slate-700/50 hover:bg-slate-700" />
                <CarouselNext className="relative -right-0 bg-slate-700/50 hover:bg-slate-700" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
      
      {/* 側邊詳情卡片 */}
      <AnimatePresence>
        {showSidebar && selectedTrail && (
          <motion.div
            className="fixed top-0 right-0 w-full sm:w-96 h-full bg-slate-800 shadow-lg z-50 overflow-y-auto custom-scrollbar"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          >
            <Button
              variant="ghost"
              className="absolute top-4 right-4 p-2 z-10"
              onClick={() => setShowSidebar(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
            
            <div className="p-6 pt-16">
              <div className="w-full aspect-video mb-4 rounded-lg overflow-hidden">
                <img 
                  src={selectedTrail.image} 
                  alt={selectedTrail.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{selectedTrail.name}</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={
                  selectedTrail.difficulty === '困難' ? 'bg-red-500' : 
                  selectedTrail.difficulty === '中等' ? 'bg-amber-500' : 
                  'bg-green-500'
                }>
                  {selectedTrail.difficulty}
                </Badge>
                
                <Badge variant="outline">
                  {selectedTrail.length} 公里
                </Badge>
                
                <Badge variant="secondary">
                  {selectedTrail.region}
                </Badge>
                
                <Badge variant="secondary" className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  {selectedTrail.rating.toFixed(1)}
                </Badge>
              </div>
              
              <p className="text-slate-300 mb-6">
                {selectedTrail.description}
              </p>
              
              {/* 步道資訊表格 */}
              <div className="space-y-4 mb-6">
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <h3 className="font-semibold mb-2">地形特徵</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedTrail.terrain.map(item => (
                      <Badge key={item} variant="outline" className="text-xs">{item}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <h3 className="font-semibold mb-2">最佳季節</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedTrail.seasons.map(season => (
                      <Badge key={season} variant="outline" className="text-xs">{season}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <h3 className="font-semibold mb-2">步道特色</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedTrail.features.map(feature => (
                      <Badge key={feature} variant="outline" className="text-xs">{feature}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <h3 className="font-semibold mb-2">安全提醒</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedTrail.hazards.map(hazard => (
                      <Badge key={hazard} variant="outline" className="text-xs bg-red-900/20">{hazard}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-slate-300">{selectedTrail.tips}</p>
                </div>
                
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <h3 className="font-semibold mb-2">附近步道</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedTrail.nearbyTrails.map(trail => (
                      <Badge key={trail} variant="outline" className="text-xs">{trail}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-slate-400 mt-8">
                最後更新: {selectedTrail.lastUpdated}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(Maps);
  