import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "/home/runner/work/bab-buddy-bliss/bab-buddy-bliss/src/components/ui/button";
import { Input } from "/home/runner/work/bab-buddy-bliss/bab-buddy-bliss/src/components/ui/input";
import { Label } from "/home/runner/work/bab-buddy-bliss/bab-buddy-bliss/src/components/ui/label";

const Register: React.FC = () => {
  // State for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
    };

    try {
      // Assuming your backend is running locally on port 5000, adjust the URL if needed
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      // Check if the response was successful
      if (response.ok) {
        console.log('Registration successful:', data);
        // Redirect to login page on successful registration
        navigate('/login');
      } else {
        console.error('Registration failed:', data.error);
        // Handle registration errors (e.g., display error message to user)
        alert(`Registration failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      // Handle network errors
      alert('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Register</Button>
        </form>
        <div>
          <p className="text-center text-sm text-gray-600">Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login here</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;