import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface TrailCommentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  trailName: string;
  reviews: Review[];
}

const TrailCommentSheet = ({ isOpen, onClose, trailName, reviews }: TrailCommentSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">{trailName}</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                      {review.user}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(review.date), "yyyy/MM/dd", { locale: zhTW })}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};

export default TrailCommentSheet; 