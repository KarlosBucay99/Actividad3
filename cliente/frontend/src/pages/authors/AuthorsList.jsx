import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authorsService from '../../services/authorsService';
import {
  LoadingSpinner,
  EmptyState,
  Pagination,
  Toast,
} from '../../components/common/Components';
import { usePagination } from '../../hooks/usePagination';
import '../pages.css';

/**
 * Página: Lista de Autores
 */

function AuthorsList() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const pagination = usePagination(1, 10);

  useEffect(() => {
    loadAuthors();
  }, [pagination.page]);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authorsService.getAll(pagination.page, pagination.limit);
      setAuthors(data.authors || []);
      pagination.updatePaginationInfo(data.total, data.pages);
    } catch (err) {
      setError('Error al cargar autores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`¿Eliminar a ${name}?`)) {
      try {
        await authorsService.delete(id);
        setToast({ type: 'success', message: 'Autor eliminado correctamente' });
        loadAuthors();
      } catch (err) {
        setToast({ type: 'error', message: 'Error al eliminar autor' });
      }
    }
  };

  if (loading && authors.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="authors-page">
      <div className="page-header">
        <h1>👥 Autores</h1>
        <Link to="/authors/new" className="btn btn-primary">
          ➕ Nuevo Autor
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {authors.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No hay autores"
          message="Crea el primer autor para comenzar"
        />
      ) : (
        <>
          <table className="authors-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Especialidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr key={author.id}>
                  <td style={{ fontWeight: 600 }}>{author.firstName} {author.lastName}</td>
                  <td>{author.email}</td>
                  <td>{author.specialization || '-'}</td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/authors/${author.id}`}
                        className="btn btn-view"
                      >
                        Ver
                      </Link>
                      <Link
                        to={`/authors/${author.id}/edit`}
                        className="btn btn-edit"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() =>
                          handleDelete(author.id, `${author.firstName} ${author.lastName}`)
                        }
                        className="btn btn-delete"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            onPageChange={pagination.goToPage}
          />
        </>
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

export default AuthorsList;
