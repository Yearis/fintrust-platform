import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Import all your components
import Home from './pages/Home';
import DonorDashboard from './pages/DonorDashboard';
import BeneficiaryWallet from './pages/BeneficiaryWallet';
import PublicLedger from './pages/PublicLedger';
import Layout from './components/Layout'; // <-- Import the new layout

// This component protects routes that require a user to be logged in
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>; // Optional: show a loading indicator
  return isAuthenticated ? children : <Navigate to="/" />;
};

// This component is for public routes like the login page
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route: The Login/Register Page */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />

          {/* Protected Routes: The Main Application */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* The first time you visit /dashboard, you'll be sent to the donor page */}
            <Route index element={<Navigate to="donor" />} />
            <Route path="donor" element={<DonorDashboard />} />
            <Route path="beneficiary" element={<BeneficiaryWallet />} />
            <Route path="public" element={<PublicLedger />} />
          </Route>

          {/* Fallback route to redirect any unknown URL to the home page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;