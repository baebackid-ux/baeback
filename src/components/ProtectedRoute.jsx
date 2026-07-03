import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <main className="container page-shell">Memuat sesi...</main>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
}
