import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { CommandCenter } from './pages/CommandCenter';
import { Studies } from './pages/Studies';
import { StudyWorkspace } from './pages/StudyWorkspace';
import { Sites } from './pages/Sites';
import { Participants } from './pages/Participants';
import { Monitoring } from './pages/Monitoring';
import { DataQuality } from './pages/DataQuality';
import { Safety } from './pages/Safety';
import { EthicsRegulatory } from './pages/EthicsRegulatory';
import { Interoperability } from './pages/Interoperability';
import { Reports } from './pages/Reports';
import { AuditTrail } from './pages/AuditTrail';
import { Tasks } from './pages/Tasks';
import { DataIntegrity } from './pages/DataIntegrity';
import { PrivacyGovernance } from './pages/PrivacyGovernance';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return null;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CommandCenter />} />
            <Route path="studies" element={<Studies />} />
            <Route path="studies/:studyCode" element={<StudyWorkspace />} />
            <Route path="sites" element={<Sites />} />
            <Route path="participants" element={<Participants />} />
            <Route path="monitoring" element={<Monitoring />} />
            <Route path="data-quality" element={<DataQuality />} />
            <Route path="safety" element={<Safety />} />
            <Route path="ethics" element={<EthicsRegulatory />} />
            <Route path="interop" element={<Interoperability />} />
            <Route path="reports" element={<Reports />} />
            <Route path="audit" element={<AuditTrail />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="data-integrity" element={<DataIntegrity />} />
            <Route path="privacy-governance" element={<PrivacyGovernance />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
