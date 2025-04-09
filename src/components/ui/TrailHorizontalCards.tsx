import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Trail } from '@/types/trail';

interface TrailHorizontalCardsProps {
  trails: Trail[];
  onTrailSelect: (trail: Trail) => void;
  selectedTrailId?: number;
}

const TrailHorizontalCards: React.FC<TrailHorizontalCardsProps> = ({ 
  trails, 
  onTrailSelect, 
  selectedTrailId 
}) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-white">特色步道</h2>
      
      <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {trails.map(trail => (
          <motion.div
            key={trail.id}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTrailSelect(trail)}
            className={`flex-shrink-0 w-72 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all ${
              selectedTrailId === trail.id 
                ? 'ring-2 ring-blue-500 shadow-blue-500/20' 
                : 'hover:shadow-xl'
            }`}
          >
            <div className="h-40 relative">
              <img 
                src={trail.image} 
                alt={trail.name} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
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
                  <Badge variant="secondary">
                    {trail.length} 公里
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-800">
              <p className="text-slate-300 text-sm line-clamp-2">
                {trail.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {trail.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrailHorizontalCards; 