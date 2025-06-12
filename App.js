import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import UserManagementPage from './UserManagementPage';
import CryptoManagementPage from './pages/CryptoManagementPage';
import AllTransactionsPage from './pages/AllTransactionsPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container-wrapper"> { }
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            { }
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/transactions/:id" element={<PrivateRoute><TransactionDetailPage /></PrivateRoute>} />

            { }
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserManagementPage /></AdminRoute>} />
            <Route path="/admin/cryptos" element={<AdminRoute><CryptoManagementPage /></AdminRoute>} />
            <Route path="/admin/transactions" element={<AdminRoute><AllTransactionsPage /></AdminRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;