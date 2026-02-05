import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authorsService from '../services/authorsService';
import publicationsService from '../services/publicationsService';
import { LoadingSpinner } from '../components/common/Components';
import './pages.css';

/**
 * Página Dashboard
 * 
 * Muestra un resumen de estadísticas y acceso rápido
 */

function Dashboard() {
  const [stats, setStats] = useState({
    authors: 0,
    publications: 0,
    publicationsByStatus: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [authorsData, publicationsData, statsData] = await Promise.all([
        authorsService.getAll(1, 1),
        publicationsService.getAll(1, 1),
        publicationsService.getStatistics(),
      ]);

      setStats({
        authors: authorsData.total || 0,
        publications: publicationsData.total || 0,
        publicationsByStatus: statsData.statistics || [],
      });
    } catch (err) {
      setError('Error al cargar las estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard">
      <h1>📊 Panel de Control</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tarjetas de estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.authors}</h3>
            <p>Autores registrados</p>
            <Link to="/authors" className="stat-link">
              Ver autores →
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>{stats.publications}</h3>
            <p>Publicaciones totales</p>
            <Link to="/publications" className="stat-link">
              Ver publicaciones →
            </Link>
          </div>
        </div>
      </div>

      {/* Publicaciones por estado */}
      <div className="card">
        <div className="card-header">
          <h2>📈 Publicaciones por Estado</h2>
        </div>
        <div className="card-body">
          {stats.publicationsByStatus.length > 0 ? (
            <div className="status-stats">
              {stats.publicationsByStatus.map((stat) => (
                <div key={stat.status} className="status-item">
                  <div className="status-bar">
                    <span className="status-label">{stat.status}</span>
                    <span className="status-count">{stat.count}</span>
                  </div>
                  <div className="status-progress">
                    <div
                      className={`progress-fill status-${stat.status.toLowerCase()}`}
                      style={{
                        width: `${(stat.count / (stats.publications || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay publicaciones aún</p>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="card">
        <div className="card-header">
          <h2>⚡ Acciones Rápidas</h2>
        </div>
        <div className="card-body">
          <div className="quick-actions">
            <Link to="/authors/new" className="btn btn-primary">
              ➕ Nuevo Autor
            </Link>
            <Link to="/publications/new" className="btn btn-primary">
              ➕ Nueva Publicación
            </Link>
            <Link to="/authors" className="btn btn-light">
              📋 Gestionar Autores
            </Link>
            <Link to="/publications" className="btn btn-light">
              📋 Gestionar Publicaciones
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
