// src/components/Header.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import Aurora from './aurora';
import { Menu } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // update with your own items
    return (
        <header className="relative shadow-md top-0 z-50">
            <div className="absolute inset-0 overflow-hidden">
                <Aurora colorStops={["#00d8ff", "#7cff67", "#00d8ff"]} amplitude={0.6} blend={0.7} />
            </div>
            <nav className="relative flex items-center justify-between p-4 max-w-7xl mx-auto">
                <div className="flex items-center -ml-4 md:w-[200px]">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors duration-300" />
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1785/1785210.png"
                            alt="Logo"
                            className="w-16 h-16 rounded-full object-cover p-1 transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </div>
                <button
                    className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:static top-full left-0 right-0 md:justify-center md:flex-1 items-center space-y-4 md:space-y-0 md:space-x-10 p-4 md:p-0 backdrop-blur-sm md:backdrop-blur-none ${isMenuOpen ? 'bg-white/95 dark:bg-zinc-900/95' : ''} md:bg-transparent shadow-lg md:shadow-none`}>
                    <Button variant="ghost" className="relative text-lg font-medium hover:text-primary transition-all duration-200 group w-full md:w-auto">
                        <li className="list-none">
                            <Link to="/" className="relative inline-block">
                                首頁
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                            </Link>
                        </li>
                    </Button>
                    <Button variant="ghost" className="relative text-lg font-medium hover:text-primary transition-all duration-200 group w-full md:w-auto">
                        <li className="list-none">
                            <Link to="/exploretrail" className="relative inline-block">
                                探索簡介
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                            </Link>
                        </li>
                    </Button>
                    <Button variant="ghost" className="relative text-lg font-medium hover:text-primary transition-all duration-200 group w-full md:w-auto">
                        <li className="list-none">
                            <Link to="/maps" className="relative inline-block">
                                地圖導覽
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                            </Link>
                        </li>
                    </Button>
                    <Button variant="ghost" className="relative text-lg font-medium hover:text-primary transition-all duration-200 group w-full md:w-auto">
                        <li className="list-none">
                            <Link to="/about" className="relative inline-block">
                                關於我們
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                            </Link>
                        </li>
                    </Button>
                </div>
                <div className="hidden md:block md:w-[200px] text-right">
                    <Button variant="default" className="text-lg font-semibold bg-primary/90 text-primary-foreground hover:bg-primary transition-all duration-300 px-4 md:px-8 rounded-full shadow-lg hover:shadow-primary/30 hover:scale-105">
                        <li className="list-none"><Link to="/login">登入</Link></li>
                    </Button>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 p-4 bg-white/95 dark:bg-zinc-900/95 shadow-lg backdrop-blur-sm">
                        <Button variant="default" className="w-full text-lg font-semibold bg-primary/90 text-primary-foreground hover:bg-primary transition-all duration-300 px-4 rounded-full shadow-lg hover:shadow-primary/30 hover:scale-105">
                            <li className="list-none"><Link to="/login">登入</Link></li>
                        </Button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
export { }
