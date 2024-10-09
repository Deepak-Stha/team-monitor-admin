import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCurrentToken } from '../redux/auth/authSlice';

const ProtectedRoute = ({ element }) => {
  const token = useSelector(selectCurrentToken); 

  // Check if user is authenticated
  const isAuthenticated = !!token; 

  return isAuthenticated ? element : <Navigate to="/LoginPage" />;
};

export default ProtectedRoute;
