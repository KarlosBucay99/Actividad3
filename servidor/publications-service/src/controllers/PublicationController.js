/**
 * PublicationController - Capa de Presentación
 * 
 * Maneja todas las peticiones HTTP para Publicaciones.
 * Delega lógica de negocio al ServicioDelpublicaciones
 * y formatea respuestas.
 * 
 * Principios SOLID:
 * - Single Responsibility: Solo HTTP request/response
 * - Dependency Inversion: Inyecta el servicio
 */

export class PublicationController {
  constructor(publicationService) {
    this.publicationService = publicationService;
  }

  /**
   * POST /publications
   * Crear nueva publicación
   */
  async create(req, res, next) {
    try {
      const { title, description, authorId, reviewComments } = req.body;

      if (!title || !description || !authorId) {
        return res.status(400).json({
          error: 'Title, description, and authorId are required',
          type: 'VALIDATION_ERROR',
        });
      }

      const result = await this.publicationService.createPublication({
        title,
        description,
        authorId: parseInt(authorId, 10),
        reviewComments,
      });

      return res.status(201).json({
        message: 'Publication created successfully',
        publication: result.publication,
        author: result.author,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /publications/:id
   * Obtener publicación por ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const publicationId = parseInt(id, 10);

      if (!Number.isInteger(publicationId) || publicationId <= 0) {
        return res.status(400).json({
          error: 'Invalid publication ID',
          type: 'VALIDATION_ERROR',
        });
      }

      const result = await this.publicationService.getPublicationById(
        publicationId
      );

      return res.status(200).json({
        publication: result.publication,
        author: result.author,
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: error.message,
          type: 'NOT_FOUND',
        });
      }
      next(error);
    }
  }

  /**
   * GET /publications
   * Obtener todas las publicaciones con paginación
   */
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '10', 10);
      const status = req.query.status;
      const authorId = req.query.authorId;

      if (page < 1 || limit < 1) {
        return res.status(400).json({
          error: 'Page and limit must be positive numbers',
          type: 'VALIDATION_ERROR',
        });
      }

      let result;
      if (status) {
        result = await this.publicationService.getPublicationsByStatus(
          status.toUpperCase(),
          page,
          limit
        );
      } else if (authorId) {
        result = await this.publicationService.getPublicationsByAuthor(
          parseInt(authorId, 10),
          page,
          limit
        );
      } else {
        result = await this.publicationService.getAllPublications(page, limit);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /publications/:id
   * Actualizar publicación
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const publicationId = parseInt(id, 10);

      if (!Number.isInteger(publicationId) || publicationId <= 0) {
        return res.status(400).json({
          error: 'Invalid publication ID',
          type: 'VALIDATION_ERROR',
        });
      }

      const updateData = {};
      if (req.body.title) updateData.title = req.body.title;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.authorId) updateData.authorId = parseInt(req.body.authorId, 10);
      if (req.body.reviewComments !== undefined) {
        updateData.reviewComments = req.body.reviewComments;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          error: 'No fields to update',
          type: 'VALIDATION_ERROR',
        });
      }

      const publication = await this.publicationService.updatePublication(
        publicationId,
        updateData
      );

      return res.status(200).json({
        message: 'Publication updated successfully',
        publication,
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: error.message,
          type: 'NOT_FOUND',
        });
      }
      next(error);
    }
  }

  /**
   * PATCH /publications/:id/status
   * Cambiar estado de publicación
   */
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, comments } = req.body;
      const publicationId = parseInt(id, 10);

      if (!status) {
        return res.status(400).json({
          error: 'Status is required',
          type: 'VALIDATION_ERROR',
        });
      }

      const publication = await this.publicationService.updatePublicationStatus(
        publicationId,
        status.toUpperCase(),
        { comments }
      );

      return res.status(200).json({
        message: 'Publication status updated successfully',
        publication,
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: error.message,
          type: 'NOT_FOUND',
        });
      }
      if (
        error.message.includes('Cannot transition') ||
        error.message.includes('Invalid')
      ) {
        return res.status(400).json({
          error: error.message,
          type: 'INVALID_TRANSITION',
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /publications/:id
   * Eliminar publicación (solo si está en DRAFT)
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const publicationId = parseInt(id, 10);

      if (!Number.isInteger(publicationId) || publicationId <= 0) {
        return res.status(400).json({
          error: 'Invalid publication ID',
          type: 'VALIDATION_ERROR',
        });
      }

      await this.publicationService.deletePublication(publicationId);

      return res.status(200).json({
        message: 'Publication deleted successfully',
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: error.message,
          type: 'NOT_FOUND',
        });
      }
      if (error.message.includes('Can only delete')) {
        return res.status(400).json({
          error: error.message,
          type: 'INVALID_STATE',
        });
      }
      next(error);
    }
  }

  /**
   * GET /publications/stats
   * Obtener estadísticas
   */
  async getStatistics(req, res, next) {
    try {
      const stats = await this.publicationService.getStatistics();

      return res.status(200).json({
        statistics: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Métodos de conveniencia para transiciones de estado
   */

  async submitForReview(req, res, next) {
    try {
      const { id } = req.params;
      const publication = await this.publicationService.submitForReview(
        parseInt(id, 10)
      );

      return res.status(200).json({
        message: 'Publication submitted for review',
        publication,
      });
    } catch (error) {
      next(error);
    }
  }

  async approvePublication(req, res, next) {
    try {
      const { id } = req.params;
      const { comments } = req.body;
      const publication = await this.publicationService.approvePublication(
        parseInt(id, 10),
        comments
      );

      return res.status(200).json({
        message: 'Publication approved',
        publication,
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectPublication(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({
          error: 'Rejection reason is required',
          type: 'VALIDATION_ERROR',
        });
      }

      const publication = await this.publicationService.rejectPublication(
        parseInt(id, 10),
        reason
      );

      return res.status(200).json({
        message: 'Publication rejected',
        publication,
      });
    } catch (error) {
      next(error);
    }
  }

  async publishPublication(req, res, next) {
    try {
      const { id } = req.params;
      const publication = await this.publicationService.publishPublication(
        parseInt(id, 10)
      );

      return res.status(200).json({
        message: 'Publication published',
        publication,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PublicationController;
