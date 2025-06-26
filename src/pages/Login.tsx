import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LoginIllustration from '../assets/login-illustration.svg'; // Using the SVG as a component

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('user_name', data.name);
        navigate('/');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto grid w-[350px] gap-6"
        >
          <Card className="p-6">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
              <CardDescription>
                Sign in to continue your wellness journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password" // Assuming you might have a forgot password page
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="hidden bg-muted lg:flex items-center justify-center p-8 bg-gradient-to-br from-blue-100 to-purple-100">
        <motion.img
          src={LoginIllustration}
          alt="Illustration of a person meditating"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};

export default Login;