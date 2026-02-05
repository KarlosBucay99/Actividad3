/**
 * Clase Abstracta Content
 * 
 * Representa el contenido base para publicaciones en el sistema.
 * Define el contrato que deben cumplir sus subclases.
 * 
 * Principio SOLID: Liskov Substitution Principle (LSP)
 */

export class Content {
  constructor(id, title, description, createdAt, updatedAt) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Método abstracto a implementar por subclases
   */
  validate() {
    throw new Error('validate() must be implemented by subclass');
  }

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }
}

export default Content;
