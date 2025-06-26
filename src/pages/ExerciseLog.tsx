
import React, { useState } from 'react';
import { Plus, Clock, Zap, Trash2 } from 'lucide-react';
import Navigation from '../components/Navigation';

interface ExerciseEntry {
  id: string;
  type: string;
  duration: number;
  intensity: 'low' | 'moderate' | 'high';
  calories?: number;
  time: string;
}

const ExerciseLog = () => {
  const [exercises, setExercises] = useState<ExerciseEntry[]>([
    {
      id: '1',
      type: 'Morning Yoga',
      duration: 30,
      intensity: 'low',
      calories: 120,
      time: '7:00 AM'
    },
    {
      id: '2',
      type: 'Evening Walk',
      duration: 45,
      intensity: 'moderate',
      calories: 200,
      time: '6:30 PM'
    }
  ]);

  const [newExercise, setNewExercise] = useState({
    type: '',
    duration: '',
    intensity: 'moderate' as 'low' | 'moderate' | 'high',
    calories: ''
  });

  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const entry: ExerciseEntry = {
      id: Date.now().toString(),
      type: newExercise.type,
      duration: Number(newExercise.duration),
      intensity: newExercise.intensity,
      calories: newExercise.calories ? Number(newExercise.calories) : undefined,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setExercises([...exercises, entry]);
    setNewExercise({ type: '', duration: '', intensity: 'moderate', calories: '' });
    setShowForm(false);
  };

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
  const totalCalories = exercises.reduce((sum, ex) => sum + (ex.calories || 0), 0);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'moderate': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const quickWorkouts = [
    { name: '5-min Stretch', duration: 5, intensity: 'low' as const },
    { name: '15-min Walk', duration: 15, intensity: 'moderate' as const },
    { name: '10-min HIIT', duration: 10, intensity: 'high' as const }
  ];

  const addQuickWorkout = (workout: typeof quickWorkouts[0]) => {
    const entry: ExerciseEntry = {
      id: Date.now().toString(),
      type: workout.name,
      duration: workout.duration,
      intensity: workout.intensity,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setExercises([...exercises, entry]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Movement Journal 🏋️</h2>
          <p className="text-gray-600">Every step counts on your fitness journey!</p>
          
          <div className="mt-4 grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <p className="text-2xl font-bold text-purple-600">{totalDuration}</p>
              <p className="text-sm text-gray-600">minutes today</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <p className="text-2xl font-bold text-pink-600">{totalCalories}</p>
              <p className="text-sm text-gray-600">calories burned</p>
            </div>
          </div>
        </div>

        {/* Quick Workouts */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Start</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickWorkouts.map((workout, index) => (
              <button
                key={index}
                onClick={() => addQuickWorkout(workout)}
                className="bg-white border border-purple-200 rounded-xl p-4 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <span className={`px-2 py-1 rounded-full text-xs ${getIntensityColor(workout.intensity)}`}>
                    {workout.intensity}
                  </span>
                </div>
                <p className="font-medium text-gray-800">{workout.name}</p>
                <p className="text-sm text-gray-600">{workout.duration} minutes</p>
              </button>
            ))}
          </div>
        </div>

        {/* Add Exercise Button */}
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-400 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Log Custom Exercise</span>
          </button>
        </div>

        {/* Exercise Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-6 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Type</label>
                  <input
                    type="text"
                    value={newExercise.type}
                    onChange={(e) => setNewExercise({ ...newExercise, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="e.g., Running, Yoga, Weight Lifting"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newExercise.duration}
                    onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="30"
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Intensity</label>
                  <select
                    value={newExercise.intensity}
                    onChange={(e) => setNewExercise({ ...newExercise, intensity: e.target.value as 'low' | 'moderate' | 'high' })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calories Burned (optional)</label>
                  <input
                    type="number"
                    value={newExercise.calories}
                    onChange={(e) => setNewExercise({ ...newExercise, calories: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="150"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-400 to-purple-500 text-white py-3 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all duration-200 font-medium"
                >
                  Log Exercise
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

        {/* Exercise Entries */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Today's Activities</h3>
          {exercises.map((exercise) => (
            <div key={exercise.id} className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{exercise.type}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getIntensityColor(exercise.intensity)}`}>
                      {exercise.intensity}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{exercise.duration} min</span>
                    </div>
                    {exercise.calories && (
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4" />
                        <span>{exercise.calories} cal</span>
                      </div>
                    )}
                    <span className="text-sm">{exercise.time}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => deleteExercise(exercise.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl shadow-lg p-6 text-white text-center">
          <p className="text-lg font-medium mb-2">💪 Fitness Wisdom 💪</p>
          <p className="text-sm opacity-90">
            "The only bad workout is the one that didn't happen. You're amazing for showing up!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseLog;
