
import React, { useState } from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import Navigation from '../components/Navigation';

interface FoodEntry {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

const FoodLog = () => {
  const userId = localStorage.getItem('userId'); // Get user ID from storage
  const token = localStorage.getItem('token'); // Get token from storage
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([
    {
      id: '1',
      name: 'Avocado Toast',
      quantity: '2 slices',
      calories: 320,
      protein: 8,
      carbs: 24,
      fat: 22,
      time: '8:30 AM'
    },
    {
      id: '2',
      name: 'Greek Yogurt with Berries',
      quantity: '1 cup',
      calories: 180,
      protein: 15,
      carbs: 20,
      fat: 5,
      time: '10:15 AM'
    }
  ]);

  const [newFood, setNewFood] = useState({
    name: '',
    quantity: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/log/food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
        body: JSON.stringify({
          user_id: userId, // Include user ID
          food_item: `${newFood.quantity} of ${newFood.name}`, // Send a descriptive string
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Optionally fetch and update the logs after adding a new entry
        // For simplicity, we'll clear the form and hide it for now
        console.log('Food log added:', data);
      } else {
        console.error('Error adding food log:', data.message);
      }
    } catch (error) {
      console.error('Error submitting food log:', error);
    }
    setLoading(false);
    setNewFood({ name: '', quantity: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowForm(false);
  };

  const deleteEntry = (id: string) => {
    setFoodEntries(foodEntries.filter(entry => entry.id !== id));
  };

  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-peach-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Food Journal 🥗</h2>
          <p className="text-gray-600">Let's fuel your body with love and nutrition!</p>
          <div className="mt-4 bg-white rounded-2xl shadow-lg p-4 inline-block">
            <p className="text-2xl font-bold text-orange-600">{totalCalories}</p>
            <p className="text-sm text-gray-600">calories today</p>
          </div>
        </div>

        {/* Add Food Button */}
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Food Entry</span>
          </button>
        </div>

        {/* Food Entry Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 mb-6 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Food Name</label>
                  <input
                    type="text"
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g., Grilled chicken breast"
                  // Removed required to allow sending just the name for AI parsing
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="text"
                    value={newFood.quantity}
                    onChange={(e) => setNewFood({ ...newFood, quantity: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g., 1 cup, 2 slices"
                  // Removed required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                  <input
                    type="number"
                    value={newFood.calories}
                    onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="0"
                  // Removed required, backend will get from AI
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
                  <input
                    type="number"
                    value={newFood.protein}
                    onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
                  <input
                    type="number"
                    value={newFood.carbs}
                    onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fat (g)</label>
                  <input
                    type="number"
                    value={newFood.fat}
                    onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-200 font-medium"
                  disabled={loading} // Disable button while loading
                  >
                  Add to Journal
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Food Entries */}
        <div className="space-y-4">
          {foodEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{entry.name}</h3>
                  <p className="text-gray-600 mb-3">{entry.quantity} • {entry.time}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-orange-600">{entry.calories}</p>
                      <p className="text-xs text-gray-600">calories</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-blue-600">{entry.protein}g</p>
                      <p className="text-xs text-gray-600">protein</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-green-600">{entry.carbs}g</p>
                      <p className="text-xs text-gray-600">carbs</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-yellow-600">{entry.fat}g</p>
                      <p className="text-xs text-gray-600">fat</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl shadow-lg p-6 text-white text-center">
          <p className="text-lg font-medium mb-2">🌟 Nutrition Wisdom 🌟</p>
          <p className="text-sm opacity-90">
            "Nourish your body like you would a good friend - with love, care, and the best ingredients!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodLog;
