import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import publicationsService from '../../services/publicationsService';
import { LoadingSpinner, EmptyState, Toast } from '../../components/common/Components';
import { usePagination } from '../../hooks/usePagination';
import '../pages.css';

/**
 * Página: Lista de Publicaciones
 */

function PublicationsList() {
  const [searchParams] = useSearchParams();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    authorId: searchParams.get('authorId') || '',
  });
  const pagination = usePagination(1, 10);

  useEffect(() => {
    loadPublications();
  }, [pagination.page, filters.status, filters.authorId]);

  const loadPublications = async () => {
    try {
      setLoading(true);
      setError(null);
      const filterObj = {};
      if (filters.status) filterObj.status = filters.status;
      if (filters.authorId) filterObj.authorId = filters.authorId;

      const data = await publicationsService.getAll(
        pagination.page,
        pagination.limit,
        filterObj
      );
      setPublications(data.publications || []);
      pagination.updatePaginationInfo(data.total, data.pages);
    } catch (err) {
      setError('Error al cargar publicaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (confirm(`¿Eliminar "${title}"?`)) {
      try {
        await publicationsService.delete(id);
        setToast({ type: 'success', message: 'Publicación eliminada' });
        loadPublications();
      } catch (err) {
        setToast({ type: 'error', message: 'Error al eliminar' });
      }
    }
  };

  const handleStatusChange = (value) => {
    setFilters((prev) => ({ ...prev, status: value }));
    pagination.goToPage(1);
  };

  const statusColors = {
    DRAFT: '#8b5cf6',
    IN_REVIEW: '#8b5cf6',
    APPROVED: '#10b981',
    PUBLISHED: '#3b82f6',
    REJECTED: '#8b5cf6',
  };

  if (loading && publications.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="publications-page">
      <div className="page-header">
        <h1>📄 Publicaciones</h1>
        <Link to="/publications/new" className="btn btn-primary">
          ➕ Nueva Publicación
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filtros */}
      <div className="filters-card card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <label htmlFor="status">Filtrar por estado:</label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="DRAFT">Borrador</option>
                <option value="IN_REVIEW">En Revisión</option>
                <option value="APPROVED">Aprobado</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="REJECTED">Rechazado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {publications.length === 0 ? (
        <EmptyState
          icon="📄"
          title="No hay publicaciones"
          message="Crea la primera publicación para comenzar"
        />
      ) : (
        <div className="publications-list">
          {publications.map((pub) => (
            <div key={pub.id} className="publication-card card">
              <div className="card-body">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    gap: '1rem',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginTop: 0 }}>{pub.title}</h3>
                    <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                      {pub.description.substring(0, 100)}...
                    </p>
                    <div style={{ fontSize: '0.9rem', color: '#999' }}>
                      <p style={{ margin: '0.25rem 0' }}>
                        <strong>Autor ID:</strong> {pub.authorId}
                      </p>
                      <p style={{ margin: '0.25rem 0' }}>
                        <strong>Creado:</strong>{' '}
                        {new Date(pub.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: statusColors[pub.status],
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      whiteSpace: 'nowrap',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                    }}
                  >
                    {pub.status}
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <Link
                    to={`/publications/${pub.id}`}
                    className="btn btn-view"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/publications/${pub.id}/edit`}
                    className="btn btn-edit"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(pub.id, pub.title)}
                    className="btn btn-delete"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default PublicationsList;
