
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Apple, Droplets, Dumbbell } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: MessageCircle, label: 'AI Coach', emoji: '💬' },
    { path: '/food', icon: Apple, label: 'Food Log', emoji: '🥗' },
    { path: '/water', icon: Droplets, label: 'Water Log', emoji: '🚰' },
    { path: '/exercise', icon: Dumbbell, label: 'Exercise', emoji: '🏋️' }
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">💪</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Fitness Bab</h1>
              <p className="text-xs text-gray-600">Your wellness companion</p>
            </div>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-green-100 text-green-700 shadow-sm'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">{item.label}</span>
                  <span className="text-sm">{item.emoji}</span>
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
