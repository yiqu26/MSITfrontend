import { ThemeProvider } from './components/theme-provider';
import { ThemeToggle } from './components/ui/theme-toggle';
import { AnimatePresence } from 'framer-motion';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../src/pages/home';
import About from '../src/pages/about';
import Login from '../src/pages/login';
import Signup from '../src/pages/signup';
import ForgetPassword from '../src/pages/forgetpassword';
import Playground from '../src/pages/playground';
import TraiPage from '../src/pages/exploretrail';

const App = () => {
 
  return (
    
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AnimatePresence mode="wait">
      <Router>
        
        <div className="min-h-screen bg-background text-foreground">
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/exploretrail" element={<TraiPage />} />
          </Routes>
          <ThemeToggle />
        </div>
      </Router>
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default App;
