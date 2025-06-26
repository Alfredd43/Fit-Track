
import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import WellnessStats from '../components/WellnessStats';
import MotivationalBanner from '../components/MotivationalBanner';
import ChatInterface from '../components/ChatInterface';
import WellnessTips from '../components/WellnessTips';
import PageHeader from '../components/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const [logs, setLogs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalWater, setTotalWater] = useState(0);
  const [totalExerciseDuration, setTotalExerciseDuration] = useState(0);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token'); // Or from your state management
      const userId = localStorage.getItem('userId'); // Or from your state management

      if (!token || !userId) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/logs?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        const data = await response.json();
        setLogs(data);

        // Calculate statistics
        let calories = 0;
        if (data.foodLogs) {
          calories = data.foodLogs.reduce((sum: number, log: any) => sum + (log.calories || 0), 0);
        }
        setTotalCalories(calories);

        let waterVolume = 0;
        if (data.waterLogs) {
          waterVolume = data.waterLogs.reduce((sum: number, log: any) => sum + (log.volume || 0), 0);
        }
        setTotalWater(waterVolume);

        let exerciseDuration = 0;
        if (data.exerciseLogs) {
          exerciseDuration = data.exerciseLogs.reduce((sum: number, log: any) => sum + (log.duration || 0), 0);
        }
        setTotalExerciseDuration(exerciseDuration);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading logs...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-peach-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <PageHeader 
          title="Chat with Fitness Bab 💬"
          subtitle="Your caring wellness companion is here to listen and support you!"
        />

        <MotivationalBanner />
        <WellnessStats
          totalCalories={totalCalories}
          totalWater={totalWater}
          totalExerciseDuration={totalExerciseDuration}
        />

        {/* Quick Actions Section - Refactored */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex space-x-4">
            {/* These buttons will likely navigate or open modals */}
            <Button variant="outline" onClick={() => alert("Log Food Action")}>
              <Plus className="mr-2 h-4 w-4" /> Log Food
            </Button>
            <Button variant="outline" onClick={() => alert("Log Water Action")}>
              <Plus className="mr-2 h-4 w-4" /> Log Water
            </Button>
          </CardContent>
        </Card>
        <ChatInterface />

        {logs && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Food Logs</CardTitle>
              </CardHeader>
              <CardContent>
                {logs.foodLogs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Calories</TableHead>
                        <TableHead>Macros</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.foodLogs.map((log: any) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.food_item}</TableCell>
                          <TableCell>{log.quantity}</TableCell>
                          <TableCell>{log.calories}</TableCell>
                          <TableCell>{log.macros}</TableCell>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p>No food logs yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Water Logs</CardTitle>
              </CardHeader>
              <CardContent>
                {logs.waterLogs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Volume (ml)</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.waterLogs.map((log: any) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.volume}</TableCell>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p>No water logs yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exercise Logs</CardTitle>
              </CardHeader>
              <CardContent>
                {logs.exerciseLogs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Duration (mins)</TableHead>
                        <TableHead>Intensity</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.exerciseLogs.map((log: any) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.exercise_type}</TableCell>
                          <TableCell>{log.duration}</TableCell>
                          <TableCell>{log.intensity}</TableCell>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p>No exercise logs yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <WellnessTips />
      </div>
    </div>
  );
};

export default Index;
