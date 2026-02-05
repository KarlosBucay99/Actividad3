/**
 * StatusTransitionStrategy - Patrón Strategy
 * 
 * Define diferentes estrategias para validar transiciones
 * entre estados de una publicación.
 * 
 * Patrón Strategy: Encapsula el algoritmo de validación en clases
 * intercambiables, permitiendo variar el algoritmo en tiempo de ejecución.
 * 
 * Principios SOLID:
 * - Open/Closed Principle (OCP): Abierto para extensión, cerrado para modificación
 * - Single Responsibility Principle (SRP): Cada estrategia es responsable de una tarea
 * - Liskov Substitution Principle (LSP): Todas las estrategias se pueden usar indistintamente
 */

export class DefaultStatusTransitionStrategy {
  /**
   * Define el mapa de transiciones válidas
   */
  getValidTransitions() {
    return {
      DRAFT: ['IN_REVIEW'],
      IN_REVIEW: ['APPROVED', 'REJECTED', 'DRAFT'],
      APPROVED: ['PUBLISHED', 'REJECTED', 'IN_REVIEW'],
      PUBLISHED: ['REJECTED'],
      REJECTED: ['DRAFT'],
    };
  }

  /**
   * Valida si una transición es permitida
   */
  isValidTransition(currentStatus, newStatus) {
    const transitions = this.getValidTransitions();
    const allowed = transitions[currentStatus] || [];
    return allowed.includes(newStatus);
  }

  /**
   * Obtiene las transiciones válidas para un estado
   */
  getNextAllowedStates(currentStatus) {
    const transitions = this.getValidTransitions();
    return transitions[currentStatus] || [];
  }

  /**
   * Valida con contexto adicional (usuario, permisos, etc.)
   */
  validateWithContext(currentStatus, newStatus, context = {}) {
    if (!this.isValidTransition(currentStatus, newStatus)) {
      return {
        valid: false,
        reason: `Cannot transition from ${currentStatus} to ${newStatus}`,
      };
    }

    // Validaciones adicionales basadas en contexto
    if (newStatus === 'APPROVED' && !context.reviewerId) {
      return { valid: false, reason: 'Approval requires reviewer ID' };
    }

    if (newStatus === 'REJECTED' && !context.rejectionReason) {
      return { valid: false, reason: 'Rejection requires a reason' };
    }

    if (newStatus === 'PUBLISHED' && !context.publisherId) {
      return { valid: false, reason: 'Publication requires publisher ID' };
    }

    return { valid: true };
  }
}

/**
 * Estrategia para validaciones más estrictas
 * Ejemplo: Requiere aprobación antes de publicar
 */
export class StrictStatusTransitionStrategy extends DefaultStatusTransitionStrategy {
  getValidTransitions() {
    return {
      DRAFT: ['IN_REVIEW'],
      IN_REVIEW: ['APPROVED', 'REJECTED'],
      APPROVED: ['PUBLISHED', 'REJECTED'],
      PUBLISHED: [],
      REJECTED: ['DRAFT'],
    };
  }

  validateWithContext(currentStatus, newStatus, context = {}) {
    // Primero validar con la lógica de la estrategia padre
    const result = super.validateWithContext(currentStatus, newStatus, context);
    if (!result.valid) return result;

    // Validaciones adicionales estrictas
    if (
      newStatus === 'APPROVED' &&
      (!context.minReviewComments || context.minReviewComments < 100)
    ) {
      return {
        valid: false,
        reason: 'Approval requires at least 100 character review comments',
      };
    }

    return { valid: true };
  }
}

/**
 * Factory para crear estrategias
 */
export class StatusTransitionStrategyFactory {
  static create(type = 'default') {
    switch (type) {
      case 'strict':
        return new StrictStatusTransitionStrategy();
      case 'default':
      default:
        return new DefaultStatusTransitionStrategy();
    }
  }
}

export default DefaultStatusTransitionStrategy;
