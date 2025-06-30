import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Heart, Award, Droplet, Flame, Zap } from 'lucide-react';

interface WellnessStatsProps {
  streak: number;
  goals: string;
  wellness: number;
  level: string;
  userName: string;
  totalCalories: number;
  totalWater: number;
  totalCaloriesBurnt: number;
}

const StatCard = ({ icon: Icon, label, value, unit, color, bgColor, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`p-4 card-energetic shadow-lg flex flex-col items-center justify-center text-center hover:animate-bounce bg-white`}
    whileHover={{ scale: 1.07 }}
  >
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-white/50`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-sm font-medium text-gray-700">{label}</p>
    <p className="text-xs text-gray-500">{unit}</p>
  </motion.div>
);

const WellnessStats: React.FC<WellnessStatsProps> = ({
  streak,
  goals,
  wellness,
  level,
  userName,
  totalCalories,
  totalWater,
  totalCaloriesBurnt,
}) => {
  const mainStats = [
    {
      icon: Flame,
      label: 'Calories In',
      value: totalCalories,
      unit: 'kcal',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: Zap,
      label: 'Calories Out',
      value: totalCaloriesBurnt,
      unit: 'kcal',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      icon: Droplet,
      label: 'Water Intake',
      value: totalWater,
      unit: 'ml',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Calendar,
      label: 'Streak',
      value: streak,
      unit: 'days',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="p-6 mb-8 bg-white rounded-3xl shadow-md border border-gray-100">
      <motion.h3 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-gray-800 mb-4 text-center font-mono drop-shadow-lg"
      >
        Welcome, {userName}! Here's your daily summary ✨
      </motion.h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mainStats.map((stat, index) => (
          <StatCard key={stat.label} {...stat} delay={index * 0.1} />
        ))}
      </div>
    </div>
  );
};

export default WellnessStats;
