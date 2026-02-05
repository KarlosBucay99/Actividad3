/**
 * AuthorRepository
 * 
 * Implementa el patrón Repository para abstraer las operaciones
 * de persistencia. De esta forma, la lógica de negocio (Service)
 * no conoce los detalles de la BD.
 * 
 * Patrón: Repository Pattern
 * Principio SOLID: 
 * - SRP: Responsable solo de acceso a datos
 * - DIP: Service depende de esta abstracción
 */

export class AuthorRepository {
  constructor(authorModel) {
    this.model = authorModel;
  }

  /**
   * Crear un nuevo autor
   */
  async create(data) {
    try {
      const author = await this.model.create({
        name: data.name,
        email: data.email,
        birthDate: data.birthDate || null,
        bio: data.bio || null,
        expertise: data.expertise || null,
        nationality: data.nationality || null,
      });
      return author;
    } catch (error) {
      throw new Error(`Failed to create author: ${error.message}`);
    }
  }

  /**
   * Obtener autor por ID
   */
  async findById(id) {
    try {
      const author = await this.model.findByPk(id);
      return author;
    } catch (error) {
      throw new Error(`Failed to find author by ID: ${error.message}`);
    }
  }

  /**
   * Obtener todos los autores con paginación
   */
  async findAll(limit = 10, offset = 0) {
    try {
      const { count, rows } = await this.model.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });
      return {
        total: count,
        page: Math.floor(offset / limit) + 1,
        pages: Math.ceil(count / limit),
        authors: rows,
      };
    } catch (error) {
      throw new Error(`Failed to find all authors: ${error.message}`);
    }
  }

  /**
   * Actualizar un autor
   */
  async update(id, data) {
    try {
      const author = await this.model.findByPk(id);
      if (!author) {
        return null;
      }

      await author.update({
        name: data.name || author.name,
        email: data.email || author.email,
        birthDate: data.birthDate !== undefined ? data.birthDate : author.birthDate,
        bio: data.bio !== undefined ? data.bio : author.bio,
        expertise: data.expertise !== undefined ? data.expertise : author.expertise,
        nationality:
          data.nationality !== undefined ? data.nationality : author.nationality,
      });

      return author;
    } catch (error) {
      throw new Error(`Failed to update author: ${error.message}`);
    }
  }

  /**
   * Eliminar un autor
   */
  async delete(id) {
    try {
      const author = await this.model.findByPk(id);
      if (!author) {
        return false;
      }

      await author.destroy();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete author: ${error.message}`);
    }
  }

  /**
   * Buscar autor por email
   */
  async findByEmail(email) {
    try {
      const author = await this.model.findOne({
        where: { email },
      });
      return author;
    } catch (error) {
      throw new Error(`Failed to find author by email: ${error.message}`);
    }
  }
}

export default AuthorRepository;
