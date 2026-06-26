import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();

  if (loading) return <main className="container page-shell">Memuat akses...</main>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}
