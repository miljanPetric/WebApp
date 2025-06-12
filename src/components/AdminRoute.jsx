import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();
  return isAuthenticated && userRole === 'admin' ? children : <Navigate to="/login" replace />;
};

export default AdminRoute;