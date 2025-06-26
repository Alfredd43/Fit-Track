
import React from 'react';
import { Link } from 'react-router-dom';
import { Apple, Droplets, Dumbbell, TrendingUp } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      to: '/food',
      icon: Apple,
      label: 'Log Food',
      description: 'Track your nutrition',
      color: 'from-orange-400 to-orange-500',
      emoji: '🥗'
    },
    {
      to: '/water',
      icon: Droplets,
      label: 'Add Water',
      description: 'Stay hydrated',
      color: 'from-blue-400 to-blue-500',
      emoji: '🚰'
    },
    {
      to: '/exercise',
      icon: Dumbbell,
      label: 'Log Workout',
      description: 'Record activity',
      color: 'from-purple-400 to-purple-500',
      emoji: '🏋️'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {actions.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className="group block"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group-hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center shadow-lg`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                  {action.label}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
              <div className="text-2xl group-hover:animate-bounce">
                {action.emoji}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
