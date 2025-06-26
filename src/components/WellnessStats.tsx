
import React from 'react';
import { Calendar, Target, Heart, Award } from 'lucide-react';

const WellnessStats = () => {
  // Mock data - in a real app this would come from your API
  const stats = [
    {
      icon: Calendar,
      label: 'Streak',
      value: '7',
      unit: 'days',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Target,
      label: 'Goals',
      value: '3/5',
      unit: 'today',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Heart,
      label: 'Wellness',
      value: '85',
      unit: 'score',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      icon: Award,
      label: 'Level',
      value: '12',
      unit: 'beginner',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Your Wellness Journey ✨
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-600">{stat.unit}</p>
            <p className="text-sm font-medium text-gray-800 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WellnessStats;
