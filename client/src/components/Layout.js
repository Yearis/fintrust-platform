import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-fintrust-dark">🏦 FinTrust</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 flex space-x-4">
          <NavLink
            to="/dashboard/donor"
            className="nav-link px-3 py-3 text-sm font-medium text-gray-500 hover:text-fintrust-dark"
          >
            🌐 Donor Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/beneficiary"
            className="nav-link px-3 py-3 text-sm font-medium text-gray-500 hover:text-fintrust-dark"
          >
            📱 Beneficiary Wallet
          </NavLink>
          <NavLink
            to="/dashboard/public"
            className="nav-link px-3 py-3 text-sm font-medium text-gray-500 hover:text-fintrust-dark"
          >
            📊 Public Dashboard
          </NavLink>
        </div>
      </nav>

      {/* This is where the active page will be rendered */}
      <main className="container mx-auto p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;