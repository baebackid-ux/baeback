import { Route, Routes } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { LenisProvider } from './contexts/LenisContext';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import DonateItemPage from './pages/DonateItemPage';
import FavoritesPage from './pages/FavoritesPage';
import HomePage from './pages/HomePage';
import ItemDetailPage from './pages/ItemDetailPage';
import ItemsPage from './pages/ItemsPage';
import NeedBoardPage from './pages/NeedBoardPage';
import NeedDetailPage from './pages/NeedDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import RequestsPage from './pages/RequestsPage';

export default function App() {
  return (
    <LenisProvider>
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <Navbar />
      <div id="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/barang" element={<ItemsPage />} />
        <Route path="/barang/:id" element={<ItemDetailPage />} />
        <Route path="/need-board" element={<NeedBoardPage />} />
        <Route path="/need-board/:id" element={<NeedDetailPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route
          path="/donasikan"
          element={
            <ProtectedRoute>
              <DonateItemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/daftar-minat"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengajuan"
          element={
            <ProtectedRoute>
              <RequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </div>
      <Footer />
    </div>
    </LenisProvider>
  );
}
