import Person from './Person.js';

/**
 * Clase Author (Concreta)
 * 
 * Extiende la clase abstracta Person e implementa validaciones
 * específicas para autores en el sistema.
 * 
 * Principio SOLID: Liskov Substitution Principle (LSP)
 * - Author es una verdadera especialización de Person
 * - Implementa el método abstracto validate() con reglas de negocio
 */

export class Author extends Person {
  constructor(id, name, email, birthDate, createdAt, bio, expertise, nationality) {
    super(id, name, email, birthDate, createdAt);
    this.bio = bio || null;
    this.expertise = expertise || null;
    this.nationality = nationality || null;
  }

  /**
   * Validación específica para autores
   * Implementa el método abstracto de la clase base
   * 
   * Principio SOLID: Single Responsibility (SRP)
   * - Esta clase es responsable solo de validaciones de autor
   */
  validate() {
    // Validaciones heredadas
    if (!this.name || this.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Valid email address is required');
    }

    // Validaciones específicas de Author
    if (this.bio && this.bio.length > 1000) {
      throw new Error('Bio must be less than 1000 characters');
    }

    if (this.expertise && this.expertise.length > 255) {
      throw new Error('Expertise must be less than 255 characters');
    }

    return true;
  }

  /**
   * Valida formato de email
   * @private
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Getters específicos
  getBio() {
    return this.bio;
  }

  getExpertise() {
    return this.expertise;
  }

  getNationality() {
    return this.nationality;
  }

  /**
   * Retorna información completa del autor
   * Útil para respuestas enriquecidas
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      birthDate: this.birthDate,
      bio: this.bio,
      expertise: this.expertise,
      nationality: this.nationality,
      createdAt: this.createdAt,
    };
  }
}

export default Author;
