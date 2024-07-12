// ProtectedRoute.js

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isLoggedIn, ...props }) => {
  return isLoggedIn ? <Route {...props} element={element} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
