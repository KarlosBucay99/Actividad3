import { publicationsApi } from './api.js';

/**
 * Publications Service
 * 
 * Contiene toda la lógica para comunicarse con el
 * microservicio de Publicaciones a través de HTTP
 */

export const publicationsService = {
  /**
   * Obtener todas las publicaciones
   */
  async getAll(page = 1, limit = 10, filters = {}) {
    try {
      const params = { page, limit, ...filters };
      const response = await publicationsApi.get('/publications', { params });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Obtener una publicación por ID
   */
  async getById(id) {
    try {
      const response = await publicationsApi.get(`/publications/${id}`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Crear una nueva publicación
   */
  async create(publicationData) {
    try {
      const response = await publicationsApi.post('/publications', publicationData);
      return response.data.publication;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Actualizar una publicación
   */
  async update(id, publicationData) {
    try {
      const response = await publicationsApi.put(
        `/publications/${id}`,
        publicationData
      );
      return response.data.publication;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Eliminar una publicación
   */
  async delete(id) {
    try {
      await publicationsApi.delete(`/publications/${id}`);
      return true;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Cambiar estado de una publicación
   */
  async updateStatus(id, status, comments = '') {
    try {
      const response = await publicationsApi.patch(
        `/publications/${id}/status`,
        { status, comments }
      );
      return response.data.publication;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Enviar a revisión
   */
  async submitForReview(id) {
    try {
      const response = await publicationsApi.post(
        `/publications/${id}/submit-review`
      );
      return response.data.publication;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Aprobar publicación
   */
  async approve(id, comments = '') {
    try {
      const response = await publicationsApi.post(
        `/publications/${id}/approve`,
        { comments }
      );
      return response.data.publication;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Rechazar publicación
   */
  async reject(id, reason) {
    try {
      const response = await publicationsApi.post(
        `/publications/${id}/reject`,
        { reason }
      );
      return response.data.publication;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Publicar
   */
  async publish(id) {
    try {
      const response = await publicationsApi.post(
        `/publications/${id}/publish`
      );
      return response.data.publication;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  /**
   * Obtener estadísticas
   */
  async getStatistics() {
    try {
      const response = await publicationsApi.get('/publications/stats/summary');
      return response.data;
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

export default publicationsService;
