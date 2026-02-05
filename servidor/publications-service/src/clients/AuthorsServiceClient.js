import axios from 'axios';

/**
 * AuthorsServiceClient - Patrón Adapter
 * 
 * Proporciona una interfaz unificada para comunicarse
 * con el servicio de Autores a través de HTTP.
 * 
 * Patrones:
 * - Adapter Pattern: Adapta la interfaz HTTP del servicio remoto
 * - Strategy Pattern: Diferentes estrategias de reintento y manejo de errores
 * 
 * Principios SOLID:
 * - Single Responsibility: Solo responsable de comunicación HTTP
 * - Dependency Inversion: Inyectable, no hardcodeado
 */

export class AuthorsServiceClient {
  constructor(baseURL = process.env.AUTHOR_SERVICE_URL || 'http://localhost:3001') {
    this.baseURL = baseURL;

    // Configurables vía env (útiles para pruebas y despliegue)
    this.maxRetries = parseInt(process.env.AUTHOR_CLIENT_MAX_RETRIES, 10) || 3;
    this.retryDelay = parseInt(process.env.AUTHOR_CLIENT_RETRY_DELAY_MS, 10) || 1000; // ms
    const timeoutMs = parseInt(process.env.AUTHOR_CLIENT_TIMEOUT_MS, 10) || 5000;

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: timeoutMs,
    });
  }

  /**
   * Obtener un autor por ID
   * Reintenta en caso de fallo temporal
   */
  async getAuthor(authorId) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.client.get(`/authors/${authorId}`);
        return response.data.author || response.data;
      } catch (error) {
        lastError = error;

        // Si el error es 404 (no encontrado), no reintentar
        if (error.response?.status === 404) {
          throw new Error(`Author with ID ${authorId} not found`);
        }

        // Log de reintento y backoff simple
        if (attempt < this.maxRetries) {
          const wait = this.retryDelay * attempt;
          console.log(
            `Retry ${attempt}/${this.maxRetries} for authorId ${authorId}, waiting ${wait}ms...`
          );
          await this.delay(wait);
        }
      }
    }

    throw new Error(
      `Failed to fetch author ${authorId} after ${this.maxRetries} retries: ${
        lastError?.message
      }`
    );
  }

  /**
   * Verificar si un autor existe
   */
  async authorExists(authorId) {
    try {
      await this.getAuthor(authorId);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener lista de autores con paginación
   */
  async getAuthors(page = 1, limit = 10) {
    try {
      const response = await this.client.get('/authors', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch authors list: ${error.message}`
      );
    }
  }

  /**
   * Validar que el autor exista y obtener sus datos
   * Mejora de experiencia: devuelve datos completos del autor
   */
  async validateAndGetAuthor(authorId) {
    if (!Number.isInteger(authorId) || authorId <= 0) {
      throw new Error('Invalid author ID');
    }

    try {
      const author = await this.getAuthor(authorId);
      return author;
    } catch (error) {
      throw new Error(
        `Author validation failed: ${error.message}`
      );
    }
  }

  /**
   * Helper: Esperar un tiempo determinado
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Obtener estado de salud del servicio de Autores
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Authors Service is unavailable');
    }
  }
}

export default AuthorsServiceClient;
