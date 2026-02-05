import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import publicationsService from '../../services/publicationsService';
import authorsService from '../../services/authorsService';
import { LoadingSpinner, Toast } from '../../components/common/Components';
import '../pages.css';

/**
 * Página: Formulario de Publicación (Crear/Editar)
 */

function PublicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(!!id);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [authors, setAuthors] = useState([]);
  const [loadingAuthors, setLoadingAuthors] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    authorId: '',
    reviewComments: '',
  });

  useEffect(() => {
    loadAuthors();
    if (isEditing) {
      loadPublication();
    }
  }, [id, isEditing]);

  const loadAuthors = async () => {
    try {
      const data = await authorsService.getAll(1, 100);
      setAuthors(data.authors || []);
    } catch (err) {
      setToast({ type: 'error', message: 'Error al cargar autores' });
    } finally {
      setLoadingAuthors(false);
    }
  };

  const loadPublication = async () => {
    try {
      const data = await publicationsService.getById(parseInt(id, 10));
      setFormData(data.publication);
    } catch (err) {
      setToast({ type: 'error', message: 'Error al cargar la publicación' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.authorId) {
      newErrors.authorId = 'Debe seleccionar un autor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const dataToSend = {
        title: formData.title,
        description: formData.description,
        authorId: parseInt(formData.authorId, 10),
        reviewComments: formData.reviewComments,
      };

      if (isEditing) {
        await publicationsService.update(parseInt(id, 10), dataToSend);
        setToast({
          type: 'success',
          message: 'Publicación actualizada correctamente',
        });
      } else {
        await publicationsService.create(dataToSend);
        setToast({
          type: 'success',
          message: 'Publicación creada correctamente',
        });
      }

      setTimeout(() => {
        navigate('/publications');
      }, 1500);
    } catch (err) {
      setToast({
        type: 'error',
        message: isEditing
          ? 'Error al actualizar la publicación'
          : 'Error al crear la publicación',
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if ((loading || loadingAuthors) && isEditing) {
    return <LoadingSpinner />;
  }

  return (
    <div className="publication-form-page">
      <h1>{isEditing ? '✏️ Editar Publicación' : '➕ Nueva Publicación'}</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Mi primer artículo"
            />
            {errors.title && (
              <div className="form-error">{errors.title}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el contenido de la publicación..."
              rows={6}
            />
            {errors.description && (
              <div className="form-error">{errors.description}</div>
            )}
            <small>
              {formData.description.length} caracteres
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="authorId">Autor *</label>
            {loadingAuthors ? (
              <p>Cargando autores...</p>
            ) : (
              <select
                id="authorId"
                name="authorId"
                value={formData.authorId}
                onChange={handleChange}
              >
                <option value="">Selecciona un autor</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.firstName} {author.lastName}
                  </option>
                ))}
              </select>
            )}
            {errors.authorId && (
              <div className="form-error">{errors.authorId}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="reviewComments">Comentarios de Revisión</label>
            <textarea
              id="reviewComments"
              name="reviewComments"
              value={formData.reviewComments}
              onChange={handleChange}
              placeholder="Comentarios opcionales..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/publications')}
              className="btn btn-light"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
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

export default PublicationForm;
