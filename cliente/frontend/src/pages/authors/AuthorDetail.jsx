import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import authorsService from '../../services/authorsService';
import { LoadingSpinner, Toast } from '../../components/common/Components';
import '../pages.css';

/**
 * Página: Detalle de Autor
 */

function AuthorDetail() {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadAuthor();
  }, [id]);

  const loadAuthor = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authorsService.getById(parseInt(id, 10));
      setAuthor(data);
    } catch (err) {
      setError('Error al cargar el autor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`¿Eliminar a ${author.firstName} ${author.lastName}?`)) {
      try {
        await authorsService.delete(author.id);
        setToast({
          type: 'success',
          message: 'Autor eliminado correctamente',
        });
        setTimeout(() => {
          window.location.href = '/authors';
        }, 1500);
      } catch (err) {
        setToast({ type: 'error', message: 'Error al eliminar' });
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !author) {
    return (
      <div>
        <div className="alert alert-danger">{error || 'Autor no encontrado'}</div>
        <Link to="/authors" className="btn btn-primary">
          ← Volver a Autores
        </Link>
      </div>
    );
  }

  return (
    <div className="author-detail">
      <Link to="/authors" className="btn btn-light">
        ← Volver
      </Link>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h1>
            {author.firstName} {author.lastName}
          </h1>
        </div>

        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3>Información Personal</h3>
              <p>
                <strong>Email:</strong> {author.email}
              </p>
              <p>
                <strong>Especialización:</strong>{' '}
                {author.specialization || 'No especificada'}
              </p>
              <p>
                <strong>Biografía:</strong> {author.biography || 'No disponible'}
              </p>
            </div>

            <div>
              <h3>Información del Sistema</h3>
              <p>
                <strong>ID:</strong> {author.id}
              </p>
              <p>
                <strong>Creado:</strong>{' '}
                {new Date(author.createdAt).toLocaleDateString('es-ES')}
              </p>
              <p>
                <strong>Actualizado:</strong>{' '}
                {new Date(author.updatedAt).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to={`/authors/${author.id}/edit`}
              className="btn btn-warning"
            >
              ✏️ Editar
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              🗑️ Eliminar
            </button>
            <Link to="/publications?authorId={author.id}" className="btn btn-primary">
              📄 Ver Publicaciones
            </Link>
          </div>
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

export default AuthorDetail;
