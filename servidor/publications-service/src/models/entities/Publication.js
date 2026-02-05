import Content from './Content.js';

/**
 * Clase Publication (Concreta)
 * 
 * Extiende Content e implementa validaciones
 * y métodos específicos para publicaciones.
 * 
 * Principio SOLID: Liskov Substitution Principle (LSP)
 */

export const PublicationStatus = {
  DRAFT: 'DRAFT',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
};

export class Publication extends Content {
  constructor(
    id,
    title,
    description,
    createdAt,
    updatedAt,
    authorId,
    status = PublicationStatus.DRAFT,
    reviewComments = null,
    publishedDate = null
  ) {
    super(id, title, description, createdAt, updatedAt);
    this.authorId = authorId;
    this.status = status;
    this.reviewComments = reviewComments;
    this.publishedDate = publishedDate;
  }

  /**
   * Validación específica para publicaciones
   * Implementa el método abstracto de la clase base
   */
  validate() {
    if (!this.title || this.title.trim().length < 3) {
      throw new Error('Publication title must be at least 3 characters long');
    }

    if (!this.description || this.description.trim().length < 10) {
      throw new Error('Publication description must be at least 10 characters long');
    }

    if (!this.authorId || !Number.isInteger(this.authorId)) {
      throw new Error('Valid author ID is required');
    }

    if (!Object.values(PublicationStatus).includes(this.status)) {
      throw new Error('Invalid publication status');
    }

    return true;
  }

  /**
   * Verificar si se puede transicionar a un nuevo estado
   * (Patrón Strategy: La lógica se delega a StatusTransitionStrategy)
   */
  canTransitionTo(newStatus) {
    const validTransitions = {
      [PublicationStatus.DRAFT]: [PublicationStatus.IN_REVIEW],
      [PublicationStatus.IN_REVIEW]: [
        PublicationStatus.APPROVED,
        PublicationStatus.REJECTED,
        PublicationStatus.DRAFT,
      ],
      [PublicationStatus.APPROVED]: [
        PublicationStatus.PUBLISHED,
        PublicationStatus.REJECTED,
        PublicationStatus.IN_REVIEW,
      ],
      [PublicationStatus.PUBLISHED]: [PublicationStatus.REJECTED],
      [PublicationStatus.REJECTED]: [PublicationStatus.DRAFT],
    };

    return validTransitions[this.status]?.includes(newStatus) ?? false;
  }

  /**
   * Actualizar el estado de la publicación
   */
  updateStatus(newStatus, comments = null) {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(
        `Cannot transition from ${this.status} to ${newStatus}`
      );
    }

    this.status = newStatus;
    if (newStatus === PublicationStatus.PUBLISHED) {
      this.publishedDate = new Date();
    }
    if (comments) {
      this.reviewComments = comments;
    }

    return this;
  }

  /**
   * Verificar si la publicación está publicada
   */
  isPublished() {
    return this.status === PublicationStatus.PUBLISHED;
  }

  /**
   * Verificar si la publicación fue rechazada
   */
  isRejected() {
    return this.status === PublicationStatus.REJECTED;
  }

  /**
   * Retorna información completa
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      authorId: this.authorId,
      status: this.status,
      reviewComments: this.reviewComments,
      publishedDate: this.publishedDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Publication;
