import React, { useState, useEffect } from 'react';
import { Plus, Clock, Zap, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import { API_BASE_URL } from '../config'; // Assuming you have a config file for the API base URL
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExerciseEntry {
  id: string;
  exercise_type: string;
  duration: number;
  intensity: string;
  calories_burnt: number;
  timestamp: string;
}

const ExerciseLog = () => {
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newExercise, setNewExercise] = useState({
    type: '',
    duration: '',
    intensity: 'moderate',
  });
  const [showForm, setShowForm] = useState(false);

  const fetchExerciseLogs = async () => {
    if (!token || !userId) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/logs?userId=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch exercise logs');
      const data = await response.json();
      setExerciseEntries(data.exercise_logs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExerciseLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/log/exercise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          exercise_type: newExercise.type,
          duration: parseInt(newExercise.duration, 10),
          intensity: newExercise.intensity,
        }),
      });

      if (response.ok) {
        fetchExerciseLogs();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add exercise log');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
      setNewExercise({ type: '', duration: '', intensity: 'moderate' });
      setShowForm(false);
    }
  };

  const deleteEntry = (id: string) => {
    setExerciseEntries(exerciseEntries.filter(entry => entry.id !== id));
  };

  const totalMinutes = exerciseEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const totalCaloriesBurnt = exerciseEntries.reduce((sum, entry) => sum + entry.calories_burnt, 0);

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
      exercise_type: workout.name,
      duration: workout.duration,
      intensity: workout.intensity,
      calories_burnt: 0, // Calories will come from backend if available later
      timestamp: new Date().toISOString()
    };
    setExerciseEntries([...exerciseEntries, entry]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="text-center mb-8 p-6 shadow-xl bg-white/80 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Exercise Log 🏃‍♂️</h2>
            <p className="text-gray-600">Celebrate your movement and progress!</p>
            <div className="mt-4 bg-white rounded-2xl shadow-lg p-4 inline-block">
              <p className="text-3xl font-bold text-pink-600">{totalMinutes} min</p>
              <p className="text-sm text-gray-600">of exercise today</p>
            </div>
          </Card>
        </motion.div>

        <div className="mb-6 text-center">
          <Button onClick={() => setShowForm(!showForm)} size="lg" className="rounded-full shadow-lg">
            <Plus className="w-5 h-5 mr-2" /> Add Exercise Entry
          </Button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
            <Card className="mb-6">
              <CardHeader><CardTitle>Add New Exercise Entry</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="text"
                    value={newExercise.type}
                    onChange={(e) => setNewExercise({ ...newExercise, type: e.target.value })}
                    placeholder="Exercise type (e.g., Running, Yoga)"
                    required
                  />
                  <Input
                    type="number"
                    value={newExercise.duration}
                    onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })}
                    placeholder="Duration (in minutes)"
                    required
                  />
                  <Select
                    value={newExercise.intensity}
                    onValueChange={(value) => setNewExercise({ ...newExercise, intensity: value })}
                  >
                    <SelectTrigger><SelectValue placeholder="Select intensity" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Logging...' : 'Log Exercise'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="space-y-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && exerciseEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="flex items-center justify-between p-4 shadow-sm hover:shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                    <Zap className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <p className="font-semibold capitalize">{entry.exercise_type}</p>
                    <p className="text-sm text-gray-500">{entry.duration} min • {entry.intensity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <Button variant="ghost" size="icon" onClick={() => deleteEntry(entry.id)}>
                    <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
          {!loading && exerciseEntries.length === 0 && (
            <Card className="text-center p-8 border-dashed">
              <p className="text-gray-500">No exercise logged today. Add an entry to get moving!</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExerciseLog;
