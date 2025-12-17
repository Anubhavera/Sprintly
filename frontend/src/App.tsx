import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './graphql/client';
import { useOrganization } from './hooks/useOrganization';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProjectList } from './components/Projects/ProjectList';
import { ProjectDetail } from './pages/ProjectDetail';

function AppRoutes() {
  const { organizationSlug } = useOrganization();

  return (
    <Layout organizationSlug={organizationSlug}>
      <Routes>
        <Route
          path="/"
          element={<Dashboard organizationSlug={organizationSlug} />}
        />
        <Route
          path="/projects"
          element={<ProjectList organizationSlug={organizationSlug} />}
        />
        <Route
          path="/projects/:id"
          element={<ProjectDetail />}
        />
        <Route
          path="/settings"
          element={
            <div className="glass-card p-8 text-center">
              <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
              <p className="text-slate-400">Settings page coming soon.</p>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
