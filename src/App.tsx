import { ThemeProvider } from './components/theme-provider';
import { ThemeToggle } from './components/ui/theme-toggle';
import { AnimatePresence } from 'framer-motion';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../src/pages/home';
import About from '../src/pages/about';
import Login from '../src/pages/login';
import Signup from '../src/pages/signup';
import ForgetPassword from '../src/pages/forgetpassword';
import TraiPage from '../src/pages/exploretrail';
import Maps from '../src/pages/maps';
import { ExpandedTabs } from './components/ui/expanded-tabs';
import { House, Bell, Settings, HelpCircle, Shield, User, } from "lucide-react"

const App = () => {
  const tabs = [
    { title: "home", icon: House, path: "/" },
    { title: "notice", icon: Bell, path: "/" },
    { type: "separator" as const, path: "/" },
    { title: "setting", icon: Settings, path: "/" },
    { title: "help", icon: HelpCircle, path: "/" },
    { title: "security", icon: Shield },
  ]
  return (

    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AnimatePresence mode="wait">
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />
              <Route path="/exploretrail" element={<TraiPage />} />
              <Route path="/maps" element={<Maps />} />
            </Routes>
            {/*left-1/2 transform -translate-x-1/2：水平置中。 */}
            <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 w-80 z-50">
              <ExpandedTabs
                tabs={tabs}
                activeColor="text-blue-500"
                className="flex justify-around py-2 border border-zinc-500 dark:border-blue-800 rounded-xl bg-white dark:bg-zinc-900 shadow-md"
              />
            </div>
            <ThemeToggle />
          </div>
        </Router>
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default App;
