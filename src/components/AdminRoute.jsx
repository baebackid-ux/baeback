import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <main className="container page-shell">Memuat akses...</main>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!isAdmin) return <Navigate to="/unauthorized" replace />;

  return children;
}
