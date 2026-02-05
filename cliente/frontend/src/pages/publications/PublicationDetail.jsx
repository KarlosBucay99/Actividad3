import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import publicationsService from '../../services/publicationsService';
import { LoadingSpinner, Toast } from '../../components/common/Components';
import '../pages.css';

/**
 * Página: Detalle de Publicación
 */

function PublicationDetail() {
  const { id } = useParams();
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    loadPublication();
  }, [id]);

  const loadPublication = async () => {
    try {
      setLoading(true);
      const data = await publicationsService.getById(parseInt(id, 10));
      setPublication(data.publication);
      setNewStatus(data.publication.status);
    } catch (err) {
      setError('Error al cargar la publicación');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === publication.status) {
      setToast({ type: 'warning', message: 'Selecciona un estado diferente' });
      return;
    }

    try {
      await publicationsService.updateStatus(publication.id, newStatus, comments);
      setToast({ type: 'success', message: 'Estado actualizado' });
      setShowStatusForm(false);
      loadPublication();
    } catch (err) {
      setToast({ type: 'error', message: 'Error al actualizar estado' });
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Eliminar esta publicación?')) {
      try {
        await publicationsService.delete(publication.id);
        setToast({ type: 'success', message: 'Publicación eliminada' });
        setTimeout(() => {
          window.location.href = '/publications';
        }, 1500);
      } catch (err) {
        setToast({ type: 'error', message: 'Error al eliminar' });
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !publication) {
    return (
      <div>
        <div className="alert alert-danger">{error || 'Publicación no encontrada'}</div>
        <Link to="/publications" className="btn btn-primary">
          ← Volver
        </Link>
      </div>
    );
  }

  const statusColors = {
    DRAFT: '#8b5cf6',
    IN_REVIEW: '#8b5cf6',
    APPROVED: '#10b981',
    PUBLISHED: '#3b82f6',
    REJECTED: '#8b5cf6',
  };

  return (
    <div className="publication-detail">
      <Link to="/publications" className="btn btn-light">
        ← Volver
      </Link>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <h1 style={{ margin: 0 }}>{publication.title}</h1>
            <div
              style={{
                backgroundColor: statusColors[publication.status],
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}
            >
              {publication.status}
            </div>
          </div>
        </div>

        <div className="card-body">
          <div style={{ marginBottom: '2rem' }}>
            <h3>Descripción</h3>
            <p style={{ lineHeight: '1.8' }}>{publication.description}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3>Información</h3>
              <p>
                <strong>ID:</strong> {publication.id}
              </p>
              <p>
                <strong>Autor ID:</strong> {publication.authorId}
              </p>
              <p>
                <strong>Creado:</strong>{' '}
                {new Date(publication.createdAt).toLocaleDateString('es-ES')}
              </p>
              <p>
                <strong>Actualizado:</strong>{' '}
                {new Date(publication.updatedAt).toLocaleDateString('es-ES')}
              </p>
              {publication.publishedDate && (
                <p>
                  <strong>Publicado:</strong>{' '}
                  {new Date(publication.publishedDate).toLocaleDateString('es-ES')}
                </p>
              )}
            </div>

            <div>
              <h3>Revisión</h3>
              {publication.reviewComments ? (
                <p>
                  <strong>Comentarios:</strong> {publication.reviewComments}
                </p>
              ) : (
                <p style={{ color: '#999' }}>Sin comentarios de revisión</p>
              )}
            </div>
          </div>
        </div>

        <div className="card-footer">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to={`/publications/${publication.id}/edit`}
              className="btn btn-warning"
            >
              ✏️ Editar
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              🗑️ Eliminar
            </button>
            <button
              onClick={() => setShowStatusForm(!showStatusForm)}
              className="btn btn-primary"
            >
              {showStatusForm ? '❌ Cancelar' : '🔄 Cambiar Estado'}
            </button>
          </div>

          {showStatusForm && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <h4>Cambiar Estado</h4>
              <div className="form-group">
                <label>Nuevo estado:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="DRAFT">Borrador</option>
                  <option value="IN_REVIEW">En Revisión</option>
                  <option value="APPROVED">Aprobado</option>
                  <option value="PUBLISHED">Publicado</option>
                  <option value="REJECTED">Rechazado</option>
                </select>
              </div>

              <div className="form-group">
                <label>Comentarios:</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Agregar comentarios..."
                />
              </div>

              <button
                onClick={handleStatusUpdate}
                className="btn btn-success"
                style={{ marginRight: '0.5rem' }}
              >
                Actualizar
              </button>
            </div>
          )}
        </div>
      </div>

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

export default PublicationDetail;
