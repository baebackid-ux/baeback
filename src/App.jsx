import { Route, Routes, useLocation } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { LenisProvider } from './contexts/LenisContext';

import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import NeedBoardPage from './pages/NeedBoardPage';
import NeedDetailPage from './pages/NeedDetailPage';
import AuthPage from './pages/AuthPage';
import DonateItemPage from './pages/DonateItemPage';
import DashboardPage from './pages/DashboardPage';
import FavoritesPage from './pages/FavoritesPage';
import RequestsPage from './pages/RequestsPage';
import MyDonationsPage from './pages/MyDonationsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import AccessDeniedPage from './pages/AccessDeniedPage';



export default function App() {
  const location = useLocation();

  return (
    <LenisProvider>
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <Navbar />
      <div id="main-content">
        <div className="page-transition" key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/barang" element={<ItemsPage />} />
              <Route path="/barang/:id" element={<ItemDetailPage />} />
              <Route path="/campaign" element={<CampaignsPage />} />
              <Route path="/campaign/:slug" element={<CampaignDetailPage />} />
              <Route path="/need-board" element={<NeedBoardPage />} />
              <Route path="/need-board/:id" element={<NeedDetailPage />} />
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/register" element={<AuthPage mode="register" />} />
              <Route path="/unauthorized" element={<AccessDeniedPage />} />
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
                path="/donasi-saya"
                element={
                  <ProtectedRoute>
                    <MyDonationsPage />
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
      </div>
      <Footer />
    </div>
    </LenisProvider>
  );
}
