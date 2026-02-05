/**
 * Clase Abstracta Person
 * 
 * Representa la entidad base para personas en el sistema.
 * Esta es una clase abstracta que define el contrato que deben cumplir
 * sus subclases concretas como Author.
 * 
 * Principio SOLID: Liskov Substitution Principle (LSP)
 * - Cualquier subclase que extienda Person debe poder ser usada
 *   en lugar de Person sin quebrar la funcionalidad.
 */

export class Person {
  constructor(id, name, email, birthDate, createdAt) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.birthDate = birthDate;
    this.createdAt = createdAt;
  }

  /**
   * Método abstracto que debe ser implementado por subclases
   * @throws {Error} Si se llamado directamente desde la clase base
   */
  validate() {
    throw new Error('validate() must be implemented by subclass');
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}

export default Person;
