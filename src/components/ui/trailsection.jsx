'use client'

//import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'

import ShinyText from '@/components/ui/shinytext';

const cards = [
  { title: 'Hiking', image: 'https://cdn.britannica.com/94/125794-050-FB09B3F4/Hikers-Gore-Range-Mountains-Denver.jpg' },
  { title: 'Mountain biking', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU1Y4MpEbkRNGiQG3w0NK-qIQDUym7a7GaBQ&s' },
  { title: 'Running', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmbMpBX5IKtMVN8KwpQdCog8a2DZTVUUdF_A&s' },
  { title: 'Dog-friendly', image: 'https://www.buffaloriver.com/wp-content/uploads/2021/03/7-Must-See-Pet-Friendly-Trails-Buffalo-Outdoor-Center.jpg' },
  { title: 'Wheelchair-friendly', image: 'https://www.homage.com.au/wp-content/uploads/sites/3/2021/12/AdobeStock_64187033.jpeg' },
  { title: 'Road biking', image: 'https://www.nelsonkootenaylake.com/sites/default/files/images/categories/roadbiking_JannekeGuenther.jpg' },
]

export default function TrailSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const navigate = useNavigate()

  const handleSignUp = () => {
    navigate('/login')
  }

  return (
    <section className="w-full bg-[#f7f5ef] dark:bg-zinc-900 py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className="flex flex-col-reverse md:flex-row items-start gap-6 lg:gap-36"
        >
          {/* 左側卡片區 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="w-full md:w-7/12"
          >
            <div className="grid grid-cols-3 grid-rows-2 gap-2 sm:gap-3 md:gap-4">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className="relative rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-md"
                >
                  <div className="relative h-[120px] md:h-[140px] lg:h-[160px]">
                    <img
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/95 transition-colors duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <span className="text-white font-bold text-base sm:text-lg block text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          {card.title}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* 右側文字區 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="w-full md:w-5/12 flex flex-col items-center md:items-start gap-6 mb-8 md:mb-0 md:pt-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-center md:text-left leading-tight mb-2">
              <span className="text-inherit">適合您的</span>
              {' '}
              <span className="inline-block" style={{ color: '#15803d', textShadow: '0 0 0 #15803d' }}>自然路線</span>
            </h2>

            <p className="text-lg sm:text-xl text-[#24321c]/80 dark:text-zinc-300 max-w-xl text-center md:text-left leading-relaxed mb-8">
              千里之行始於足下，想一千次，不如去做一次。
            </p>

            <div className="w-full flex justify-center md:justify-end">
              <button
                type="button"
                onClick={handleSignUp}
                style={{
                  background: 'linear-gradient(to right, #15803d, #24321c, #2c3d22)',
                  width: '70px',
                }}
                className="relative inline-flex items-center justify-center rounded-full px-24 sm:px-28 py-5 sm:py-6 text-xl sm:text-2xl font-bold text-white transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-2xl group border border-white/10"
              >
                <span className="text-2xl tracking-wider whitespace-nowrap  "><ShinyText text="GO!" disabled={false} speed={6} className='text-white' /></span>
               
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
