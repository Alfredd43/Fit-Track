import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, MessageCircle, Apple, Droplets, Zap } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/exercises', icon: Dumbbell, label: 'Exercises' },
    { path: '/food', icon: Apple, label: 'Food Log' },
    { path: '/water', icon: Droplets, label: 'Water Log' },
    { path: '/exercise', icon: Zap, label: 'Exercise Log' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">B</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 font-mono tracking-tight">BuddyBliss</h1>
              <p className="text-xs text-gray-500">Your wellness companion</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-100 to-blue-100 text-gray-900 shadow-sm font-bold'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && <span className="absolute left-2 right-2 bottom-1 h-1 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full animate-pulse" />}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
