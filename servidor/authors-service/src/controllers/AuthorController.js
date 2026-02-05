/**
 * AuthorController
 * 
 * Maneja las solicitudes HTTP relacionadas con autores.
 * Delega la lógica de negocio al AuthorService.
 * 
 * Patrón: Controller Pattern (MVC)
 * Principio SOLID: SRP - Responsable solo de manejar HTTP
 */

export class AuthorController {
  constructor(authorService) {
    this.service = authorService;
  }

  /**
   * POST /authors
   * Crear un nuevo autor
   */
  async create(req, res) {
    try {
      const author = await this.service.registerAuthor(req.body);
      res.status(201).json({
        id: author.id,
        name: author.name,
        email: author.email,
        birthDate: author.birthDate,
        bio: author.bio,
        expertise: author.expertise,
        nationality: author.nationality,
        createdAt: author.createdAt,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
        type: 'VALIDATION_ERROR',
      });
    }
  }

  /**
   * GET /authors
   * Listar autores con paginación
   */
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const offset = (page - 1) * limit;

      const result = await this.service.getAllAuthors(limit, offset);

      res.json({
        total: result.total,
        page: result.page,
        pages: result.pages,
        authors: result.authors.map((author) => ({
          id: author.id,
          name: author.name,
          email: author.email,
          birthDate: author.birthDate,
          bio: author.bio,
          expertise: author.expertise,
          nationality: author.nationality,
          createdAt: author.createdAt,
        })),
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
        type: 'QUERY_ERROR',
      });
    }
  }

  /**
   * GET /authors/:id
   * Obtener un autor específico
   */
  async getById(req, res) {
    try {
      const author = await this.service.getAuthorById(req.params.id);
      res.json({
        id: author.id,
        name: author.name,
        email: author.email,
        birthDate: author.birthDate,
        bio: author.bio,
        expertise: author.expertise,
        nationality: author.nationality,
        createdAt: author.createdAt,
      });
    } catch (error) {
      res.status(404).json({
        error: error.message,
        type: 'NOT_FOUND',
      });
    }
  }

  /**
   * PUT /authors/:id
   * Actualizar un autor
   */
  async update(req, res) {
    try {
      const author = await this.service.updateAuthor(req.params.id, req.body);
      res.json({
        id: author.id,
        name: author.name,
        email: author.email,
        birthDate: author.birthDate,
        bio: author.bio,
        expertise: author.expertise,
        nationality: author.nationality,
        createdAt: author.createdAt,
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({
          error: error.message,
          type: 'NOT_FOUND',
        });
      } else {
        res.status(400).json({
          error: error.message,
          type: 'VALIDATION_ERROR',
        });
      }
    }
  }

  /**
   * DELETE /authors/:id
   * Eliminar un autor
   */
  async delete(req, res) {
    try {
      await this.service.deleteAuthor(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({
        error: error.message,
        type: 'NOT_FOUND',
      });
    }
  }
}

export default AuthorController;
