import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Droplet } from 'lucide-react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { API_BASE_URL } from '../config';

interface WaterEntry {
  id: string;
  volume: number;
  timestamp: string;
}

const WaterLog = () => {
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newAmount, setNewAmount] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchWaterLogs = async () => {
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
      if (!response.ok) throw new Error('Failed to fetch water logs');
      const data = await response.json();
      setWaterEntries(data.water_logs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/log/water`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          volume: parseInt(newAmount, 10),
        }),
      });

      if (response.ok) {
        fetchWaterLogs();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add water log');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
      setNewAmount('');
      setShowForm(false);
    }
  };

  const deleteEntry = (id: string) => {
    setWaterEntries(waterEntries.filter(entry => entry.id !== id));
  };

  const totalWater = waterEntries.reduce((sum, entry) => sum + entry.volume, 0);
  const dailyGoal = 2000; // 2L daily goal
  const progress = Math.min((totalWater / dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="text-center mb-8 p-6 shadow-xl bg-white/80 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Water Log 💧</h2>
            <p className="text-gray-600">Stay hydrated, stay healthy!</p>
            <div className="mt-4 bg-white rounded-2xl shadow-lg p-4 inline-block max-w-sm w-full">
              <p className="text-3xl font-bold text-blue-600">{totalWater}ml</p>
              <p className="text-sm text-gray-600">of {dailyGoal}ml daily goal</p>
              <Progress value={progress} className="w-full mt-2" />
            </div>
          </Card>
        </motion.div>

        <div className="mb-6 text-center">
          <Button onClick={() => setShowForm(!showForm)} size="lg" className="rounded-full shadow-lg">
            <Plus className="w-5 h-5 mr-2" /> Add Water Entry
          </Button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
            <Card className="mb-6">
              <CardHeader><CardTitle>Add New Water Entry</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="custom-amount">Amount</Label>
                    <Input
                      id="custom-amount"
                      type="number"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="1"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!newAmount}
                    className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    variant="default"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="space-y-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && waterEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="flex items-center justify-between p-4 shadow-sm hover:shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Droplet className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="font-semibold text-lg">{entry.volume} ml</p>
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
          {!loading && waterEntries.length === 0 && (
            <Card className="text-center p-8 border-dashed">
              <p className="text-gray-500">No water logged today. Add an entry to stay hydrated!</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default WaterLog;
