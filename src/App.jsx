import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { LenisProvider } from './contexts/LenisContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const ItemsPage = lazy(() => import('./pages/ItemsPage'));
const ItemDetailPage = lazy(() => import('./pages/ItemDetailPage'));
const CampaignsPage = lazy(() => import('./pages/CampaignsPage'));
const CampaignDetailPage = lazy(() => import('./pages/CampaignDetailPage'));
const NeedBoardPage = lazy(() => import('./pages/NeedBoardPage'));
const NeedDetailPage = lazy(() => import('./pages/NeedDetailPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const DonateItemPage = lazy(() => import('./pages/DonateItemPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const RequestsPage = lazy(() => import('./pages/RequestsPage'));
const MyDonationsPage = lazy(() => import('./pages/MyDonationsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AccessDeniedPage = lazy(() => import('./pages/AccessDeniedPage'));

function PageFallback() {
  return <div className="page-shell" aria-busy="true" />;
}

export default function App() {
  const location = useLocation();

  return (
    <LenisProvider>
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <Navbar />
      <div id="main-content">
        <div className="page-transition" key={location.pathname}>
          <Suspense fallback={<PageFallback />}>
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
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
    </LenisProvider>
  );
}
