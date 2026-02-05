import PublicationModel from '../models/Publication.sequelize.js';

/**
 * PublicationRepository - Patrón Repository
 * 
 * Abstrae todas las operaciones de acceso a datos para Publications.
 * Proporciona una interfaz limpia de métodos de negocio sobre la BD.
 * 
 * Principios SOLID:
 * - Single Responsibility: Solo responsable de acceso a datos
 * - Dependency Inversion: Inyectable, depende de abstracción (no de BD directa)
 * - Interface Segregation: Métodos específicos del dominio
 */

export class PublicationRepository {
  /**
   * Crear una nueva publicación
   */
  async create(publicationData) {
    try {
      const publication = await PublicationModel.create(publicationData);
      return publication.get({ plain: true });
    } catch (error) {
      throw new Error(`Failed to create publication: ${error.message}`);
    }
  }

  /**
   * Obtener publicación por ID
   */
  async findById(id) {
    try {
      const publication = await PublicationModel.findByPk(id);
      if (!publication) {
        return null;
      }
      return publication.get({ plain: true });
    } catch (error) {
      throw new Error(`Failed to find publication: ${error.message}`);
    }
  }

  /**
   * Obtener todas las publicaciones con paginación
   */
  async findAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await PublicationModel.findAndCountAll({
        offset,
        limit,
        order: [['createdAt', 'DESC']],
      });

      return {
        total: count,
        page,
        pages: Math.ceil(count / limit),
        publications: rows.map((pub) => pub.get({ plain: true })),
      };
    } catch (error) {
      throw new Error(`Failed to fetch publications: ${error.message}`);
    }
  }

  /**
   * Obtener publicaciones por autor
   */
  async findByAuthorId(authorId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await PublicationModel.findAndCountAll({
        where: { authorId },
        offset,
        limit,
        order: [['createdAt', 'DESC']],
      });

      return {
        total: count,
        page,
        pages: Math.ceil(count / limit),
        publications: rows.map((pub) => pub.get({ plain: true })),
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch publications by author: ${error.message}`
      );
    }
  }

  /**
   * Obtener publicaciones por estado
   */
  async findByStatus(status, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await PublicationModel.findAndCountAll({
        where: { status },
        offset,
        limit,
        order: [['createdAt', 'DESC']],
      });

      return {
        total: count,
        page,
        pages: Math.ceil(count / limit),
        publications: rows.map((pub) => pub.get({ plain: true })),
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch publications by status: ${error.message}`
      );
    }
  }

  /**
   * Actualizar publicación
   */
  async update(id, updates) {
    try {
      const publication = await PublicationModel.findByPk(id);
      if (!publication) {
        return null;
      }

      await publication.update(updates);
      return publication.get({ plain: true });
    } catch (error) {
      throw new Error(`Failed to update publication: ${error.message}`);
    }
  }

  /**
   * Actualizar estado de publicación
   * Utilizará StatusTransitionStrategy en el Service
   */
  async updateStatus(id, newStatus, reviewComments = null) {
    try {
      const updates = { status: newStatus };

      if (newStatus === 'PUBLISHED') {
        updates.publishedDate = new Date();
      }

      if (reviewComments) {
        updates.reviewComments = reviewComments;
      }

      return this.update(id, updates);
    } catch (error) {
      throw new Error(`Failed to update publication status: ${error.message}`);
    }
  }

  /**
   * Eliminar publicación
   */
  async delete(id) {
    try {
      const publication = await PublicationModel.findByPk(id);
      if (!publication) {
        return false;
      }

      await publication.destroy();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete publication: ${error.message}`);
    }
  }

  /**
   * Contar publicaciones por estado
   */
  async countByStatus(status) {
    try {
      const count = await PublicationModel.count({
        where: { status },
      });
      return count;
    } catch (error) {
      throw new Error(
        `Failed to count publications by status: ${error.message}`
      );
    }
  }

  /**
   * Obtener estadísticas de publicaciones
   */
  async getStatistics() {
    try {
      const stats = await PublicationModel.findAll({
        attributes: [
          'status',
          [
            PublicationModel.sequelize.fn('COUNT', PublicationModel.sequelize.col('id')),
            'count',
          ],
        ],
        group: ['status'],
      });

      return stats.map((stat) => ({
        status: stat.status,
        count: parseInt(stat.get('count'), 10),
      }));
    } catch (error) {
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }
}

export default PublicationRepository;
