import { Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

import { LoginPage } from './pages/LoginPage';
import { DemoHubPage } from './pages/DemoHubPage';
import { AgentPage } from './pages/AgentPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminUsersPage } from './pages/AdminUsersPage';

export function App() {
  return (
    <Routes>
      {/* ================================================== */}
      {/* LOGIN */}
      {/* ================================================== */}

      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* ================================================== */}
      {/* DEMO HUB */}
      {/* ================================================== */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell>
              <DemoHubPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* ================================================== */}
      {/* AGENT */}
      {/* ================================================== */}

      <Route
        path="/agents/:agentId"
        element={
          <ProtectedRoute>
            <AppShell>
              <AgentPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* ================================================== */}
      {/* ADMIN */}
      {/* ================================================== */}

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AppShell>
                <AdminUsersPage />
              </AppShell>
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      
      {/* ================================================== */}
      {/* 404 */}
      {/* ================================================== */}

      <Route
        path="/404"
        element={<NotFoundPage />}
      />

      <Route
        path="*"
        element={<Navigate to="/404" replace />}
      />
    </Routes>
  );
}