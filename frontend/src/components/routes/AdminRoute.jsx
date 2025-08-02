import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Spinner from '../ui/Spinner';

const AdminRoute = () => {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const loading = useAuthStore(state => state.loading);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
