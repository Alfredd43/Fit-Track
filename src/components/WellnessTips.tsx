
import React from 'react';

const WellnessTips = () => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6">
        <div className="text-3xl mb-3">🎯</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Daily Goals</h3>
        <p className="text-sm text-gray-600 mb-4">Set small, achievable goals and build momentum!</p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Drink 8 glasses of water</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Take a 10-minute walk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Practice mindfulness</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
        <div className="text-3xl mb-3">💝</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Self-Care Reminder</h3>
        <p className="text-sm text-gray-600 mb-4">Remember to be gentle with yourself today!</p>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-sm text-green-700 font-medium">
            "You are worthy of love and care - especially from yourself. 💚"
          </p>
        </div>
      </div>
    </div>
  );
};

export default WellnessTips;
