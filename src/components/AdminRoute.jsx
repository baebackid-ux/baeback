import { Navigate, useLocation } from 'react-router-dom';
import { SessionSkeleton } from './Skeleton';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <SessionSkeleton />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!isAdmin) return <Navigate to="/unauthorized" replace />;

  return children;
}
