// src/App.js
import Header from '@/components/ui/header';
import Hero from '@/components/ui/hero';
import Menu from '@/components/ui/menu';
import Footer from '@/components/ui/footer';
import TrailSection from '@/components/ui/trailsection';
import TrailStats from '@/components/ui/trailstats';

function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Menu />
      <TrailSection />
      <TrailStats />
      <Footer />
    </div>
  );
}

export default Home;
