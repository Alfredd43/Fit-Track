import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import WellnessStats from '../components/WellnessStats';
import ChatInterface from '../components/ChatInterface';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, Flame, Droplet, Zap } from "lucide-react";
import { API_BASE_URL } from '../config';
import MotivationalBanner from '../components/MotivationalBanner';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User & Profile State
  const [userName, setUserName] = useState('');
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState('Beginner');

  // Daily Stats State
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalWater, setTotalWater] = useState(0);
  const [totalCaloriesBurnt, setTotalCaloriesBurnt] = useState(0);

  // Log State
  const [foodLogs, setFoodLogs] = useState([]);
  const [waterLogs, setWaterLogs] = useState([]);
  const [exerciseLogs, setExerciseLogs] = useState([]);

  // Modal State
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);

  // Form State
  const [foodForm, setFoodForm] = useState({ name: '', quantity: '' });
  const [waterForm, setWaterForm] = useState({ amount: '' });
  const [exerciseForm, setExerciseForm] = useState({ type: '', duration: '', intensity: 'moderate' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    if (!token || !userId) {
      navigate('/login');
      return;
    }

    try {
      const [logsResponse, profileResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/logs?userId=${userId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/profile`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setTotalCalories(logsData.total_calories || 0);
        setTotalWater(logsData.total_water || 0);
        setTotalCaloriesBurnt(logsData.total_calories_burnt || 0);
        setFoodLogs(logsData.food_logs || []);
        setWaterLogs(logsData.water_logs || []);
        setExerciseLogs(logsData.exercise_logs || []);
      }

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserName(profileData.name || 'User');
        setStreak(profileData.streak || 0);
        setLevel(profileData.level || 'Beginner');
      }
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogSubmit = async (type: 'food' | 'water' | 'exercise', payload: any) => {
    setFormLoading(true);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    try {
      const response = await fetch(`${API_BASE_URL}/log/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId, ...payload }),
      });
      if (response.ok) {
        setShowFoodModal(false);
        setShowWaterModal(false);
        setShowExerciseModal(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1800);
        fetchData(); // Refresh all data
      } else {
        const data = await response.json();
        setFormError(data.message || `Failed to log ${type}.`);
      }
    } catch (err) {
      setFormError(`An error occurred while logging ${type}.`);
    } finally {
      setFormLoading(false);
    }
  };
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="min-h-screen animated-gradient">
      {showConfetti && <div className="confetti">
        {[...Array(40)].map((_, i) => (
          <span key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random()}s`,
            fontSize: `${Math.random() * 1.5 + 1}rem`,
            color: ["#f472b6","#a5b4fc","#6ee7b7","#fbbf24","#f0abfc"][i%5]
          }}>🎉</span>
        ))}
      </div>}
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <MotivationalBanner />
        <WellnessStats
          streak={streak}
          goals={""}
          wellness={0}
          level={level}
          userName={userName}
          totalCalories={totalCalories}
          totalWater={totalWater}
          totalCaloriesBurnt={totalCaloriesBurnt}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column: Logs & Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="card-energetic">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex space-x-4">
                <button className="button-energetic" onClick={() => setShowFoodModal(true)}>
                  <Flame className="mr-2 h-4 w-4" /> Log Food
                </button>
                <button className="button-energetic" onClick={() => setShowWaterModal(true)}>
                  <Droplet className="mr-2 h-4 w-4" /> Log Water
                </button>
                <button className="button-energetic" onClick={() => setShowExerciseModal(true)}>
                  <Zap className="mr-2 h-4 w-4" /> Log Exercise
                </button>
              </CardContent>
            </div>

            <div className="card-energetic">
              <CardHeader><CardTitle>Today's Food Log</CardTitle></CardHeader>
              <CardContent>
                {foodLogs.length > 0 ? (
                  foodLogs.map((log: any) => <p key={log.id}>{log.food_item}: {log.calories} kcal</p>)
                ) : <p>No food logged today.</p>}
              </CardContent>
            </div>
            <div className="card-energetic">
              <CardHeader><CardTitle>Today's Water Log</CardTitle></CardHeader>
              <CardContent>
                {waterLogs.length > 0 ? (
                  waterLogs.map((log: any) => <p key={log.id}>{log.volume} ml</p>)
                ) : <p>No water logged today.</p>}
              </CardContent>
            </div>
            <div className="card-energetic">
              <CardHeader><CardTitle>Today's Exercise Log</CardTitle></CardHeader>
              <CardContent>
                {exerciseLogs.length > 0 ? (
                  exerciseLogs.map((log: any) => <p key={log.id}>{log.exercise_type} - {log.duration} mins</p>)
                ) : <p>No exercise logged today.</p>}
              </CardContent>
            </div>
          </motion.div>

          {/* Right Column: Chat */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            <div className="card-energetic sticky top-24">
              <CardHeader><CardTitle>Chat with Bab</CardTitle></CardHeader>
              <CardContent>
                <ChatInterface />
              </CardContent>
            </div>
          </motion.div>
        </div>

        {/* Modals for logging */}
        {/* Food Modal */}
        {showFoodModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Log Food</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleLogSubmit('food', { food_item: `${foodForm.quantity} of ${foodForm.name}` });
              }}>
                <Label>Food Name</Label>
                <Input value={foodForm.name} onChange={e => setFoodForm(f => ({ ...f, name: e.target.value }))} required />
                <Label>Quantity</Label>
                <Input value={foodForm.quantity} onChange={e => setFoodForm(f => ({ ...f, quantity: e.target.value }))} />
                <Button type="submit" disabled={formLoading}>{formLoading ? 'Logging...' : 'Log'}</Button>
                <Button type="button" onClick={() => setShowFoodModal(false)}>Cancel</Button>
              </form>
            </div>
          </div>
        )}
        {/* Water Modal */}
        {showWaterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Log Water</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleLogSubmit('water', { volume: parseInt(waterForm.amount, 10) });
              }}>
                <Label>Amount (ml)</Label>
                <Input type="number" value={waterForm.amount} onChange={e => setWaterForm(f => ({ ...f, amount: e.target.value }))} required />
                <Button type="submit" disabled={formLoading}>{formLoading ? 'Logging...' : 'Log'}</Button>
                <Button type="button" onClick={() => setShowWaterModal(false)}>Cancel</Button>
              </form>
            </div>
          </div>
        )}
        {/* Exercise Modal */}
        {showExerciseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Log Exercise</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleLogSubmit('exercise', { 
                  exercise_type: exerciseForm.type,
                  duration: parseInt(exerciseForm.duration, 10),
                  intensity: exerciseForm.intensity
                });
              }}>
                <Label>Type</Label>
                <Input value={exerciseForm.type} onChange={e => setExerciseForm(f => ({...f, type: e.target.value}))} required />
                <Label>Duration (mins)</Label>
                <Input type="number" value={exerciseForm.duration} onChange={e => setExerciseForm(f => ({...f, duration: e.target.value}))} required />
                <Label>Intensity</Label>
                <Select value={exerciseForm.intensity} onValueChange={val => setExerciseForm(f => ({ ...f, intensity: val }))}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" disabled={formLoading}>{formLoading ? 'Logging...' : 'Log'}</Button>
                <Button type="button" onClick={() => setShowExerciseModal(false)}>Cancel</Button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
