
import React, { useState } from 'react';
import { Plus, Droplets } from 'lucide-react';
import Navigation from '../components/Navigation';

interface WaterEntry {
  id: string;
  amount: number;
  time: string;
}

const WaterLog = () => {
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([
    { id: '1', amount: 500, time: '9:00 AM' },
    { id: '2', amount: 350, time: '11:30 AM' },
    { id: '3', amount: 400, time: '2:15 PM' }
  ]);

  const [newAmount, setNewAmount] = useState('');
  const [unit, setUnit] = useState('ml');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount) return;

    const amountInMl = unit === 'cups' ? Number(newAmount) * 240 : Number(newAmount);
    
    const entry: WaterEntry = {
      id: Date.now().toString(),
      amount: amountInMl,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setWaterEntries([...waterEntries, entry]);
    setNewAmount('');
  };

  const totalWater = waterEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const dailyGoal = 2000; // 2L daily goal
  const progress = Math.min((totalWater / dailyGoal) * 100, 100);

  const quickAmounts = [250, 500, 750];

  const addQuickAmount = (amount: number) => {
    const entry: WaterEntry = {
      id: Date.now().toString(),
      amount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setWaterEntries([...waterEntries, entry]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Hydration Station 🚰</h2>
          <p className="text-gray-600">Let's keep you refreshed and energized!</p>
        </div>

        {/* Water Progress */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-blue-600">{totalWater}ml</p>
            <p className="text-gray-600">of {dailyGoal}ml daily goal</p>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            {progress >= 100 ? "🎉 Goal achieved! Amazing hydration today!" : `${Math.round(progress)}% complete`}
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Add</h3>
          <div className="grid grid-cols-3 gap-3">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => addQuickAmount(amount)}
                className="bg-white border border-blue-200 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-center"
              >
                <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="font-medium text-gray-800">{amount}ml</p>
                <p className="text-xs text-gray-600">{Math.round(amount / 240 * 10) / 10} cups</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Custom Amount</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter amount"
                  min="1"
                />
              </div>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="ml">ml</option>
                <option value="cups">cups</option>
              </select>
              <button
                type="submit"
                disabled={!newAmount}
                className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </form>
        </div>

        {/* Water Entries */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Today's Hydration</h3>
          {waterEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl shadow-lg border border-blue-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{entry.amount}ml</p>
                    <p className="text-sm text-gray-600">{Math.round(entry.amount / 240 * 10) / 10} cups</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{entry.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl shadow-lg p-6 text-white text-center">
          <p className="text-lg font-medium mb-2">💧 Hydration Wisdom 💧</p>
          <p className="text-sm opacity-90">
            "Water is life's matter and matrix, mother and medium. Stay hydrated, stay amazing!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaterLog;
