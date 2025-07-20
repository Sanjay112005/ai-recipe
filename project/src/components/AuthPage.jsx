import React, { useState } from 'react';
import { ChefHat, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { authAPI } from '../utils/api';

const AuthPage = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // In AuthPage.js
// In your AuthPage.jsx file

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    let responseData;
    if (isLogin) {
      // FIX: The response is now the direct data object, not nested in { data: ... }
      responseData = await authAPI.login(formData.email, formData.password);
    } else {
      responseData = await authAPI.register(formData.name, formData.email, formData.password);
    }

    // FIX: Check for token and user directly on the response data
    if (responseData && responseData.token && responseData.user) {
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('user', JSON.stringify(responseData.user));
      onLogin(responseData.user);
    } else {
      // This is the line that was causing your error
      throw new Error('Invalid login response from server.');
    }

  } catch (err) {
    // The error object from your api.js is { response: { data: { message: '...' } } }
    const errorMessage = err.response?.data?.message || err.message || 'Authentication failed';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-12">
        <div className="text-center">
          <ChefHat className="w-20 h-20 text-white mx-auto mb-8" />
          <h1 className="text-4xl font-bold text-white mb-6">SmartMeal Planner</h1>
          <p className="text-xl text-indigo-100 mb-8">
            AI-powered recipe generation and intelligent meal planning for a healthier lifestyle
          </p>
          <div className="space-y-4 text-indigo-100">
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-indigo-300 rounded-full mr-3"></div>
              Generate personalized recipes with AI
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-indigo-300 rounded-full mr-3"></div>
              Plan meals with visual calendar
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-indigo-300 rounded-full mr-3"></div>
              Auto-generate smart shopping lists
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back to Home Button */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="flex items-center text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>

          <div className="text-center mb-8">
            <ChefHat className="w-12 h-12 text-indigo-500 mx-auto mb-4 lg:hidden" />
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-slate-400">
              {isLogin ? 'Sign in to continue planning' : 'Create your account today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
