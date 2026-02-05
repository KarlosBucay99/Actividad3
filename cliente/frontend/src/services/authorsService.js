import { authorsApi } from './api.js';

/**
 * Authors Service
 * 
 * Contiene toda la lógica para comunicarse con el
 * microservicio de Autores a través de HTTP
 */

export const authorsService = {
  /**
   * Obtener todos los autores
   */
  async getAll(page = 1, limit = 10) {
    try {
      const response = await authorsApi.get('/authors', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Obtener un autor por ID
   */
  async getById(id) {
    try {
      const response = await authorsApi.get(`/authors/${id}`);
      return response.data.author;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Crear un nuevo autor
   */
  async create(authorData) {
    try {
      const response = await authorsApi.post('/authors', authorData);
      return response.data.author;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Actualizar un autor
   */
  async update(id, authorData) {
    try {
      const response = await authorsApi.put(`/authors/${id}`, authorData);
      return response.data.author;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Eliminar un autor
   */
  async delete(id) {
    try {
      await authorsApi.delete(`/authors/${id}`);
      return true;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Manejo de errores
   */
  _handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.error || 'Error al procesar la solicitud';
      return new Error(`[${status}] ${message}`);
    } else if (error.request) {
      return new Error('No hay respuesta del servidor');
    } else {
      return error;
    }
  },
};

export default authorsService;
