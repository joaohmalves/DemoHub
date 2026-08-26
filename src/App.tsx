import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DemoHubPage } from './pages/DemoHubPage';
import { AgentPage } from './pages/AgentPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { BackendTest } from './pages/DemoHubPage';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell>
              <DemoHubPage />
              <BackendTest />
            </AppShell>
          </ProtectedRoute>
        }
      />

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

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
