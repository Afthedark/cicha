import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/public/HomePage';
import { InstitutionalPage } from './pages/public/InstitutionalPage';
import { TradeBilateralPage } from './pages/public/TradeBilateralPage';
import { ArticlesPage } from './pages/public/ArticlesPage';
import { ArticleDetailPage } from './pages/public/ArticleDetailPage';
import { EventsPage } from './pages/public/EventsPage';
import { MembersDirectoryPage } from './pages/public/MembersDirectoryPage';
import { MembershipApplyPage } from './pages/public/MembershipApplyPage';
import { ContactPage } from './pages/public/ContactPage';

// Partner Portal (Socio) Components
import { PartnerLayout } from './components/layout/PartnerLayout';
import { PartnerDashboardPage } from './pages/partner/PartnerDashboardPage';
import { PartnerResourcesPage } from './pages/partner/PartnerResourcesPage';
import { PartnerOpportunitiesPage } from './pages/partner/PartnerOpportunitiesPage';
import { PartnerBenefitsPage } from './pages/partner/PartnerBenefitsPage';
import { PartnerDirectoryPage } from './pages/partner/PartnerDirectoryPage';

// Admin CMS (Admin & Secretario) Components
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminArticlesPage } from './pages/admin/AdminArticlesPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminMembersPage } from './pages/admin/AdminMembersPage';
import { AdminOpportunitiesPage } from './pages/admin/AdminOpportunitiesPage';
import { AdminAuthoritiesPage } from './pages/admin/AdminAuthoritiesPage';
import { AdminInstitutionalPage } from './pages/admin/AdminInstitutionalPage';
import { AdminAlliancesPage } from './pages/admin/AdminAlliancesPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminPartnerResourcesPage } from './pages/admin/AdminPartnerResourcesPage';

// Role-Based Route Wrapper
const RoleRoute: React.FC<{
  allowedRoles: ('admin' | 'secretario' | 'socio')[];
  children: React.ReactNode;
}> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xs">
        Verificando credenciales de acceso...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If socio tries to enter admin CMS, redirect to partner portal
    if (user.role === 'socio') {
      return <Navigate to="/portal-socios" replace />;
    }
    // If secretario tries to enter admin-only module, redirect to dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

// Public Layout Wrapper (Visitante)
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1. Public Portal Routes (Visitante) */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route
            path="/institucional"
            element={
              <PublicLayout>
                <InstitutionalPage />
              </PublicLayout>
            }
          />
          <Route
            path="/comercio-bilateral"
            element={
              <PublicLayout>
                <TradeBilateralPage />
              </PublicLayout>
            }
          />
          <Route
            path="/noticias"
            element={
              <PublicLayout>
                <ArticlesPage />
              </PublicLayout>
            }
          />
          <Route
            path="/noticias/:slug"
            element={
              <PublicLayout>
                <ArticleDetailPage />
              </PublicLayout>
            }
          />
          <Route
            path="/eventos"
            element={
              <PublicLayout>
                <EventsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/socios"
            element={
              <PublicLayout>
                <MembersDirectoryPage />
              </PublicLayout>
            }
          />
          <Route
            path="/asociarse"
            element={
              <PublicLayout>
                <MembershipApplyPage />
              </PublicLayout>
            }
          />
          <Route
            path="/contacto"
            element={
              <PublicLayout>
                <ContactPage />
              </PublicLayout>
            }
          />

          {/* Unified Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* 2. Exclusive Partner Portal Routes (Role: socio, admin, secretario) */}
          <Route
            path="/portal-socios"
            element={
              <RoleRoute allowedRoles={['socio', 'admin', 'secretario']}>
                <PartnerLayout />
              </RoleRoute>
            }
          >
            <Route index element={<PartnerDashboardPage />} />
            <Route path="recursos" element={<PartnerResourcesPage />} />
            <Route path="oportunidades" element={<PartnerOpportunitiesPage />} />
            <Route path="beneficios" element={<PartnerBenefitsPage />} />
            <Route path="directorio" element={<PartnerDirectoryPage />} />
          </Route>

          {/* 3. Admin CMS Routes (Roles: admin, secretario) */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={['admin', 'secretario']}>
                <AdminLayout />
              </RoleRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="noticias" element={<AdminArticlesPage />} />
            <Route path="eventos" element={<AdminEventsPage />} />
            <Route path="socios" element={<AdminMembersPage />} />
            <Route path="oportunidades" element={<AdminOpportunitiesPage />} />
            <Route path="recursos-socios" element={<AdminPartnerResourcesPage />} />
            <Route path="solicitudes" element={<AdminApplicationsPage />} />
            <Route path="mensajes" element={<AdminMessagesPage />} />

            {/* Configuration & Institutional Management (Roles: admin, secretario) */}
            <Route
              path="autoridades"
              element={
                <RoleRoute allowedRoles={['admin', 'secretario']}>
                  <AdminAuthoritiesPage />
                </RoleRoute>
              }
            />
            <Route
              path="institucional"
              element={
                <RoleRoute allowedRoles={['admin', 'secretario']}>
                  <AdminInstitutionalPage />
                </RoleRoute>
              }
            />
            <Route
              path="alianzas"
              element={
                <RoleRoute allowedRoles={['admin', 'secretario']}>
                  <AdminAlliancesPage />
                </RoleRoute>
              }
            />
            <Route
              path="configuracion"
              element={
                <RoleRoute allowedRoles={['admin', 'secretario']}>
                  <AdminSettingsPage />
                </RoleRoute>
              }
            />

            {/* Strict Admin-Only Routes (Role: admin) */}
            <Route
              path="usuarios"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <AdminUsersPage />
                </RoleRoute>
              }
            />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
