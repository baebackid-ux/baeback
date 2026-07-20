import { Navigate, useLocation } from 'react-router-dom';
import { SessionSkeleton } from './Skeleton';
import { useAuth } from '../contexts/AuthContext';
import { useDelayedLoading } from '../lib/useDelayedLoading';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const showSkeleton = useDelayedLoading(loading, 200);

  if (loading) return showSkeleton ? <SessionSkeleton /> : null;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
}
