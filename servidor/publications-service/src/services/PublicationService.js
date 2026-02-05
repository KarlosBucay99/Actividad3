import { Publication, PublicationStatus } from '../models/entities/Publication.js';
import { DefaultStatusTransitionStrategy } from '../strategies/StatusTransitionStrategy.js';

/**
 * PublicationService - Capa de Lógica de Negocio
 * 
 * Contiene toda la lógica de negocio para Publicaciones.
 * Utiliza el repositorio para acceso a datos y el cliente de Autores
 * para validar autores remotamente.
 * 
 * Patrones:
 * - Service Layer: Centraliza lógica de negocio
 * - Strategy Pattern: Usa StatusTransitionStrategy inyectable
 * 
 * Principios SOLID:
 * - Single Responsibility: Solo reglas de negocio
 * - Dependency Inversion: Inyecta Repository y AuthorsServiceClient
 */

export class PublicationService {
  constructor(
    publicationRepository,
    authorsServiceClient,
    transitionStrategy = new DefaultStatusTransitionStrategy()
  ) {
    this.publicationRepository = publicationRepository;
    this.authorsServiceClient = authorsServiceClient;
    this.transitionStrategy = transitionStrategy;
  }

  /**
   * Crear una nueva publicación
   * Valida que el autor exista antes de crear
   */
  async createPublication(publicationData) {
    try {
      // Validar que el autor exista (validación remota)
      const author = await this.authorsServiceClient.validateAndGetAuthor(
        publicationData.authorId
      );

      // Crear objeto de dominio y validar
      const publication = new Publication(
        null, // id será asignado por la BD
        publicationData.title,
        publicationData.description,
        new Date(),
        new Date(),
        publicationData.authorId,
        PublicationStatus.DRAFT,
        publicationData.reviewComments,
        null // publishedDate será null inicialmente
      );

      publication.validate(); // Validar el dominio

      // Guardar en BD
      const saved = await this.publicationRepository.create({
        title: publication.title,
        description: publication.description,
        authorId: publication.authorId,
        status: publication.status,
        reviewComments: publication.reviewComments,
        publishedDate: publication.publishedDate,
      });

      return {
        publication: saved,
        author: author, // Enriquecer la respuesta con datos del autor
      };
    } catch (error) {
      throw new Error(
        `Failed to create publication: ${error.message}`
      );
    }
  }

  /**
   * Obtener publicación por ID
   */
  async getPublicationById(id) {
    try {
      const publication = await this.publicationRepository.findById(id);
      if (!publication) {
        throw new Error('Publication not found');
      }

      // Enriquecer con datos del autor
      const author = await this.authorsServiceClient.getAuthor(
        publication.authorId
      );

      return {
        publication,
        author,
      };
    } catch (error) {
      if (error.message === 'Publication not found') {
        throw new Error(`Publication with ID ${id} not found`);
      }
      throw new Error(`Failed to fetch publication: ${error.message}`);
    }
  }

  /**
   * Obtener todas las publicaciones
   */
  async getAllPublications(page = 1, limit = 10) {
    try {
      return await this.publicationRepository.findAll(page, limit);
    } catch (error) {
      throw new Error(`Failed to fetch publications: ${error.message}`);
    }
  }

  /**
   * Obtener publicaciones de un autor
   */
  async getPublicationsByAuthor(authorId, page = 1, limit = 10) {
    try {
      // Validar que el autor exista
      await this.authorsServiceClient.validateAndGetAuthor(authorId);

      return await this.publicationRepository.findByAuthorId(
        authorId,
        page,
        limit
      );
    } catch (error) {
      throw new Error(
        `Failed to fetch publications by author: ${error.message}`
      );
    }
  }

  /**
   * Obtener publicaciones por estado
   */
  async getPublicationsByStatus(status, page = 1, limit = 10) {
    try {
      if (!Object.values(PublicationStatus).includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }

      return await this.publicationRepository.findByStatus(status, page, limit);
    } catch (error) {
      throw new Error(
        `Failed to fetch publications by status: ${error.message}`
      );
    }
  }

  /**
   * Actualizar publicación
   */
  async updatePublication(id, updateData) {
    try {
      const publication = await this.publicationRepository.findById(id);
      if (!publication) {
        throw new Error('Publication not found');
      }

      // Validar autor si se intenta cambiar
      if (updateData.authorId && updateData.authorId !== publication.authorId) {
        await this.authorsServiceClient.validateAndGetAuthor(
          updateData.authorId
        );
      }

      // Crear objeto de dominio para validación
      const pubObj = new Publication(
        publication.id,
        updateData.title || publication.title,
        updateData.description || publication.description,
        publication.createdAt,
        new Date(),
        updateData.authorId || publication.authorId,
        publication.status,
        updateData.reviewComments !== undefined
          ? updateData.reviewComments
          : publication.reviewComments,
        publication.publishedDate
      );

      pubObj.validate();

      const updated = await this.publicationRepository.update(id, {
        title: pubObj.title,
        description: pubObj.description,
        authorId: pubObj.authorId,
        reviewComments: pubObj.reviewComments,
      });

      return updated;
    } catch (error) {
      throw new Error(`Failed to update publication: ${error.message}`);
    }
  }

  /**
   * Transicionar estado de publicación
   * Utilizando Strategy Pattern
   */
  async updatePublicationStatus(id, newStatus, context = {}) {
    try {
      const publication = await this.publicationRepository.findById(id);
      if (!publication) {
        throw new Error('Publication not found');
      }

      // Validar transición usando Strategy
      const validation = this.transitionStrategy.validateWithContext(
        publication.status,
        newStatus,
        context
      );

      if (!validation.valid) {
        throw new Error(validation.reason);
      }

      // Actualizar estado
      const updated = await this.publicationRepository.updateStatus(
        id,
        newStatus,
        context.comments
      );

      return updated;
    } catch (error) {
      throw new Error(
        `Failed to update publication status: ${error.message}`
      );
    }
  }

  /**
   * Eliminar publicación (solo si está en DRAFT)
   */
  async deletePublication(id) {
    try {
      const publication = await this.publicationRepository.findById(id);
      if (!publication) {
        throw new Error('Publication not found');
      }

      if (publication.status !== PublicationStatus.DRAFT) {
        throw new Error(
          'Can only delete publications in DRAFT status'
        );
      }

      return await this.publicationRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete publication: ${error.message}`);
    }
  }

  /**
   * Enviar a revisión (DRAFT → IN_REVIEW)
   */
  async submitForReview(id) {
    return this.updatePublicationStatus(id, PublicationStatus.IN_REVIEW);
  }

  /**
   * Aprobar publicación (IN_REVIEW → APPROVED)
   */
  async approvePublication(id, reviewComments = '') {
    return this.updatePublicationStatus(id, PublicationStatus.APPROVED, {
      comments: reviewComments,
      reviewerId: 'system', // Puede ser el ID del reviewer
    });
  }

  /**
   * Rechazar publicación
   */
  async rejectPublication(id, rejectionReason) {
    return this.updatePublicationStatus(id, PublicationStatus.REJECTED, {
      comments: rejectionReason,
      rejectionReason,
    });
  }

  /**
   * Publicar (APPROVED → PUBLISHED)
   */
  async publishPublication(id) {
    return this.updatePublicationStatus(id, PublicationStatus.PUBLISHED, {
      publisherId: 'system',
    });
  }

  /**
   * Obtener estadísticas
   */
  async getStatistics() {
    try {
      return await this.publicationRepository.getStatistics();
    } catch (error) {
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }
}

export default PublicationService;
