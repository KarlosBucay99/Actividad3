import Author from '../models/entities/Author.js';

/**
 * AuthorService
 * 
 * Contiene la lógica de negocio relacionada con autores.
 * Utiliza el AuthorRepository para acceder a datos.
 * 
 * Patrón: Service Layer
 * Principio SOLID:
 * - SRP: Responsable solo de validaciones y lógica de negocio
 * - DIP: Inyección de dependencias (repository en constructor)
 */

export class AuthorService {
  constructor(authorRepository) {
    this.repository = authorRepository;
  }

  /**
   * Registrar un nuevo autor
   * Valida datos antes de crear
   */
  async registerAuthor(authorData) {
    // Validación de datos de entrada
    if (!authorData.name || authorData.name.trim().length < 2) {
      throw new Error('Author name must be at least 2 characters long');
    }

    if (!authorData.email || !this.isValidEmail(authorData.email)) {
      throw new Error('Valid email address is required');
    }

    // Verificar email único
    const existing = await this.repository.findByEmail(authorData.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    // Crear instancia de Author (dominio)
    const author = new Author(
      null,
      authorData.name,
      authorData.email,
      authorData.birthDate || null,
      new Date(),
      authorData.bio || null,
      authorData.expertise || null,
      authorData.nationality || null
    );

    // Validar según reglas de la clase dominio
    author.validate();

    // Persistir
    return this.repository.create({
      name: author.getName(),
      email: author.getEmail(),
      birthDate: author.birthDate,
      bio: author.getBio(),
      expertise: author.getExpertise(),
      nationality: author.getNationality(),
    });
  }

  /**
   * Obtener autor por ID
   */
  async getAuthorById(id) {
    const author = await this.repository.findById(id);
    if (!author) {
      throw new Error(`Author with id ${id} not found`);
    }
    return author;
  }

  /**
   * Listar todos los autores con paginación
   */
  async getAllAuthors(limit = 10, offset = 0) {
    const result = await this.repository.findAll(limit, offset);
    return result;
  }

  /**
   * Actualizar un autor
   */
  async updateAuthor(id, updateData) {
    const author = await this.repository.findById(id);
    if (!author) {
      throw new Error(`Author with id ${id} not found`);
    }

    // Si se intenta cambiar el email, verificar que no exista
    if (updateData.email && updateData.email !== author.email) {
      const existing = await this.repository.findByEmail(updateData.email);
      if (existing) {
        throw new Error('Email already registered');
      }
    }

    // Validar datos si se proporcionan
    if (updateData.name) {
      if (updateData.name.length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }
    }

    return this.repository.update(id, updateData);
  }

  /**
   * Eliminar un autor
   */
  async deleteAuthor(id) {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new Error(`Author with id ${id} not found`);
    }
    return this.repository.delete(id);
  }

  /**
   * Validar email
   * @private
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default AuthorService;
