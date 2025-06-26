import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { API_BASE_URL } from '../config';

interface FoodEntry {
  id: string;
  food_item: string;
  quantity: string;
  calories: number;
  macros: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  timestamp: string;
}

const FoodLog = () => {
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newFood, setNewFood] = useState({
    name: '',
    quantity: '',
  });

  const [showForm, setShowForm] = useState(false);

  const fetchFoodLogs = async () => {
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
      if (!response.ok) throw new Error('Failed to fetch food logs');
      const data = await response.json();
      setFoodEntries(data.food_logs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/log/food`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          food_item: `${newFood.quantity} of ${newFood.name}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchFoodLogs(); // Re-fetch logs to show the new entry
      } else {
        console.error('Error adding food log:', data.message);
        setError(data.message || 'Failed to add food log');
      }
    } catch (error: any) {
      console.error('Error submitting food log:', error);
      setError(error.message || 'An unexpected error occurred.');
    } finally {
        setLoading(false);
        setNewFood({ name: '', quantity: '' });
        setShowForm(false);
    }
  };

  const deleteEntry = (id: string) => {
    // Note: Deleting is not implemented on the backend in this example.
    // This will only remove it from the view.
    setFoodEntries(foodEntries.filter(entry => entry.id !== id));
  };

  const totalCalories = foodEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-peach-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="text-center mb-8 p-6 shadow-xl bg-white/80 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Food Journal 🥗</h2>
            <p className="text-gray-600">Let's fuel your body with love and nutrition!</p>
            <div className="mt-4 bg-white rounded-2xl shadow-lg p-4 inline-block">
              <p className="text-3xl font-bold text-orange-600">{totalCalories}</p>
              <p className="text-sm text-gray-600">calories today</p>
            </div>
          </Card>
        </motion.div>

        <div className="mb-6 text-center">
          <Button onClick={() => setShowForm(!showForm)} size="lg" className="rounded-full shadow-lg">
            <Plus className="w-5 h-5 mr-2" /> Add Food Entry
          </Button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
            <Card className="mb-6">
              <CardHeader><CardTitle>Add New Food Entry</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="foodName">Food Name</Label>
                      <Input
                        type="text"
                        value={newFood.name}
                        onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="e.g., Grilled chicken breast"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        type="text"
                        value={newFood.quantity}
                        onChange={(e) => setNewFood({ ...newFood, quantity: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="e.g., 1 cup, 2 slices"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                      {loading ? 'Adding...' : 'Add Food'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="space-y-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && foodEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="flex items-center justify-between p-4 shadow-sm hover:shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold capitalize">{entry.food_item}</p>
                    <p className="text-sm text-gray-500">
                      {entry.calories || 0} kcal
                      {entry.macros && ` • P:${entry.macros.protein || 0}g C:${entry.macros.carbs || 0}g F:${entry.macros.fat || 0}g`}
                    </p>
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
          {!loading && foodEntries.length === 0 && (
            <Card className="text-center p-8 border-dashed">
              <p className="text-gray-500">No food logged today. Add an entry to get started!</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default FoodLog;
