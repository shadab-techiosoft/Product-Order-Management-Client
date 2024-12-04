import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ element, allowedRoles }) {
  // Check if token exists in localStorage and if the user is authenticated
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');  // Assuming role is stored in localStorage after login

  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If user role is not in the allowedRoles array, redirect to a different page or login page
    return <Navigate to="/" replace />;
  }

  // If everything checks out, render the element (protected route)
  return element;
}

export default PrivateRoute;
