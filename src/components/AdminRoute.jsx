import { Navigate, useLocation } from 'react-router-dom';
import { SessionSkeleton } from './Skeleton';
import { useAuth } from '../contexts/AuthContext';
import { useDelayedLoading } from '../lib/useDelayedLoading';

export default function AdminRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const showSkeleton = useDelayedLoading(loading, 200);

  if (loading) return showSkeleton ? <SessionSkeleton /> : null;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!isAdmin) return <Navigate to="/unauthorized" replace />;

  return children;
}
