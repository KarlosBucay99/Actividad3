import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

/**
 * Componente Layout
 * 
 * Proporciona la estructura común de todas las páginas:
 * - Header con navegación
 * - Sidebar
 * - Contenido principal
 * - Footer
 */

function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>📚 Sistema de Gestión</h1>
          </div>
          <nav className="nav-primary">
            <ul>
              <li>
                <Link
                  to="/"
                  className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/authors"
                  className={`nav-link ${isActive('/authors') ? 'active' : ''}`}
                >
                  Autores
                </Link>
              </li>
              <li>
                <Link
                  to="/publications"
                  className={`nav-link ${isActive('/publications') ? 'active' : ''}`}
                >
                  Publicaciones
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">{children}</div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>
            &copy; 2024 Sistema de Gestión de Autores y Publicaciones. Todos
            los derechos reservados.
          </p>
          <nav className="nav-secondary">
            <a href="#about">Acerca de</a>
            <a href="#contact">Contacto</a>
            <a href="#privacy">Privacidad</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
