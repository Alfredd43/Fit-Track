
import React, { useState } from 'react';
import { Plus, Droplets } from 'lucide-react';
import Navigation from '../components/Navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

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

 // Get user ID and token from local storage (or your state management)
 const userId = localStorage.getItem('userId'); // Replace with your actual way of getting user ID
 const token = localStorage.getItem('token'); // Replace with your actual way of getting the token

 if (!userId || !token) {
 console.error('User not logged in or token not found');
 // Handle the case where the user is not logged in
 return;
 }

 fetch('/log/water', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'Authorization': `Bearer ${token}`, // Include the token
 },
 body: JSON.stringify({ user_id: userId, volume: amountInMl }),
 })
 .then(response => response.json())
 .then(data => {
 // Optionally update local state or refetch logs to show the new entry
 console.log('Water logged successfully:', data);
 })
 .catch(error => console.error('Error logging water:', error));

 setNewAmount(''); // Clear the form
  };

  const totalWater = waterEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const dailyGoal = 2000; // 2L daily goal
  const progress = Math.min((totalWater / dailyGoal) * 100, 100);

  const quickAmounts = [250, 500, 750];

  const addQuickAmount = (amount: number) => {
 // Get user ID and token from local storage (or your state management)
 const userId = localStorage.getItem('userId'); // Replace with your actual way of getting user ID
 const token = localStorage.getItem('token'); // Replace with your actual way of getting the token

 if (!userId || !token) {
 console.error('User not logged in or token not found');
 // Handle the case where the user is not logged in
 return;
 }

 fetch('/log/water', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'Authorization': `Bearer ${token}`, // Include the token
 },
 body: JSON.stringify({ user_id: userId, volume: amount }),
 })
 .then(response => response.json())
 .then(data => {
 // Optionally update local state or refetch logs to show the new entry
 console.log('Quick water logged successfully:', data);
 })
 .catch(error => console.error('Error logging quick water:', error));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
 <Card className="text-center mb-8">
 <CardHeader>
 <CardTitle className="text-3xl font-bold text-gray-800 mb-2">Hydration Station 🚰</CardTitle>
 </CardHeader>
 <CardContent>
 <p className="text-gray-600">Let's keep you refreshed and energized!</p>
 </CardContent>
 </Card>

        {/* Water Progress */}
 <Card className="mb-6">
 <CardHeader className="text-center">
 <CardTitle className="text-3xl font-bold text-blue-600">{totalWater}ml</CardTitle>
 </CardHeader>
 <CardContent>
 <p className="text-gray-600 mb-4">of {dailyGoal}ml daily goal</p>
 <Progress value={progress} className="w-full h-4 mb-4" />
 <p className="text-center text-sm text-gray-600">
            {progress >= 100 ? "🎉 Goal achieved! Amazing hydration today!" : `${Math.round(progress)}% complete`}
 </p>
 </CardContent>
 </Card>

        {/* Quick Add Buttons */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Add</h3>
          <div className="grid grid-cols-3 gap-3">
            {quickAmounts.map((amount) => (
 <Button
                key={amount}
                onClick={() => addQuickAmount(amount)}
                className="bg-white border border-blue-200 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-center"
 variant="outline" // Use a variant from your Button component
              >
                <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="font-medium text-gray-800">{amount}ml</p>
                <p className="text-xs text-gray-600">{Math.round(amount / 240 * 10) / 10} cups</p>
 </Button>
            ))}
          </div>
        </div>

        {/* Custom Amount Form */}
 <Card className="mb-6">
 <CardHeader>
 <CardTitle className="text-lg font-semibold text-gray-800">Add Custom Amount</CardTitle>
 </CardHeader>
 <CardContent>
 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="flex space-x-3 items-end">
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
 <div>
 <Label htmlFor="unit-select">Unit</Label>
 <Select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="ml">ml</option>
                <option value="cups">cups</option>
              </select>
 </div>
 <Button
                type="submit"
                disabled={!newAmount}
                className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
 variant="default" // Use a variant from your Button component
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
 </Button>
 </div>
 </form>
 </CardContent>
 </Card>

        {/* Water Entries */}
 <Card>
 <CardHeader>
 <CardTitle className="text-lg font-semibold text-gray-800">Today's Hydration</CardTitle>
 </CardHeader>
 <CardContent className="space-y-3">
          {waterEntries.map((entry) => (
 <div key={entry.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{entry.amount}ml</p>
 <p className="text-sm text-gray-600">{Math.round(entry.amount / 240 * 10) / 10} cup{Math.round(entry.amount / 240 * 10) / 10 !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{entry.time}</span>
              </div>
            </div>
          ))}
 </CardContent>
 </Card>

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
