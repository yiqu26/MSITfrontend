import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import GradientText from './gridiantext';

const stats = [
  { label: '總步道數', value: '300+', description: '遍布全台的步道網絡' },
  { label: '平均評分', value: '4.5', description: '來自用戶的真實評價' },
  { label: '總長度', value: '1000+', description: '公里的自然步道' },
  { label: '特色景點', value: '50+', description: '值得探索的秘境' }
];

const TrailStats = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="w-full bg-[#f7f5ef] dark:bg-zinc-900 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-12">
          <GradientText showBorder={false} className="text-3xl font-sans px-4 py-2">
            台灣步道數據
          </GradientText>
          <p className="mt-4 text-lg text-[#24321c]/80 dark:text-zinc-300">
            探索台灣最完整的步道資料庫
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-3xl font-bold text-[#15803d] dark:text-emerald-400 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-medium text-[#24321c] dark:text-zinc-200">
                {stat.label}
              </div>
              <div className="text-sm text-[#24321c]/60 dark:text-zinc-400 mt-2">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrailStats; 