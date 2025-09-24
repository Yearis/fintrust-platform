import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submit button was clicked!'); // <-- DEBUGGING MESSAGE
    setError('');
    setLoading(true);

    try {
      if (isLoginMode) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register({ name: formData.name, email: formData.email, password: formData.password });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-fintrust-dark">FinTrust</h1>
          <p className="text-gray-600">Transparent Charitable Donations on Blockchain</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-fintrust-dark mb-6">
            {isLoginMode ? 'Sign In' : 'Create Account'}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {/* Ensure the button is INSIDE the form tag */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required={!isLoginMode} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fintrust-green focus:border-fintrust-green" placeholder="Enter your full name" />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fintrust-green focus:border-fintrust-green" placeholder="Enter your email" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fintrust-green focus:border-fintrust-green" placeholder="Enter your password" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fintrust-green hover:opacity-90 disabled:opacity-50">
              {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <button onClick={toggleMode} className="font-medium text-fintrust-green hover:opacity-80">
                {isLoginMode ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
        <div className="text-center text-sm text-gray-600 space-y-2">
          <div className="flex items-center justify-center space-x-4">
            <span>✓ Blockchain Transparency</span>
            <span>✓ Real-time Tracking</span>
            <span>✓ Secure Donations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;