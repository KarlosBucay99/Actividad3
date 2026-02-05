import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import AuthorsList from './pages/authors/AuthorsList';
import AuthorDetail from './pages/authors/AuthorDetail';
import AuthorForm from './pages/authors/AuthorForm';
import PublicationsList from './pages/publications/PublicationsList';
import PublicationDetail from './pages/publications/PublicationDetail';
import PublicationForm from './pages/publications/PublicationForm';

/**
 * App - Componente Principal
 * 
 * Configura:
 * - React Router para navegación
 * - Layout global
 * - Todas las rutas de la aplicación
 */

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Dashboard />} />

          {/* Autores */}
          <Route path="/authors" element={<AuthorsList />} />
          <Route path="/authors/new" element={<AuthorForm />} />
          <Route path="/authors/:id" element={<AuthorDetail />} />
          <Route path="/authors/:id/edit" element={<AuthorForm />} />

          {/* Publicaciones */}
          <Route path="/publications" element={<PublicationsList />} />
          <Route path="/publications/new" element={<PublicationForm />} />
          <Route path="/publications/:id" element={<PublicationDetail />} />
          <Route path="/publications/:id/edit" element={<PublicationForm />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function NotFound() {
  return (
    <div className="container">
      <h1>404 - Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
    </div>
  );
}

export default App;
