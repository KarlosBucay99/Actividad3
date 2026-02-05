import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authorsService from '../../services/authorsService';
import { LoadingSpinner, Toast } from '../../components/common/Components';
import '../pages.css';

/**
 * Página: Formulario de Autor (Crear/Editar)
 */

function AuthorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(!!id);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialization: '',
    biography: '',
  });

  useEffect(() => {
    if (isEditing) {
      loadAuthor();
    }
  }, [id, isEditing]);

  const loadAuthor = async () => {
    try {
      const author = await authorsService.getById(parseInt(id, 10));
      setFormData(author);
    } catch (err) {
      setToast({ type: 'error', message: 'Error al cargar el autor' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (formData.biography && formData.biography.length > 500) {
      newErrors.biography = 'La biografía no puede exceder 500 caracteres';
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

      if (isEditing) {
        await authorsService.update(parseInt(id, 10), formData);
        setToast({
          type: 'success',
          message: 'Autor actualizado correctamente',
        });
      } else {
        await authorsService.create(formData);
        setToast({
          type: 'success',
          message: 'Autor creado correctamente',
        });
      }

      setTimeout(() => {
        navigate('/authors');
      }, 1500);
    } catch (err) {
      setToast({
        type: 'error',
        message: isEditing
          ? 'Error al actualizar el autor'
          : 'Error al crear el autor',
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="author-form-page">
      <h1>{isEditing ? '✏️ Editar Autor' : '➕ Nuevo Autor'}</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">Nombre *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Ej: Juan"
            />
            {errors.firstName && (
              <div className="form-error">{errors.firstName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Apellido *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Ej: Pérez"
            />
            {errors.lastName && (
              <div className="form-error">{errors.lastName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej: juan@example.com"
            />
            {errors.email && (
              <div className="form-error">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="specialization">Especialización</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Ej: Tecnología"
            />
          </div>

          <div className="form-group">
            <label htmlFor="biography">Biografía</label>
            <textarea
              id="biography"
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              placeholder="Cuéntanos sobre ti..."
              maxLength={500}
            />
            <small>
              {formData.biography.length}/500 caracteres
            </small>
            {errors.biography && (
              <div className="form-error">{errors.biography}</div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/authors')}
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

export default AuthorForm;
