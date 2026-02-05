/**
 * Error Handling Middleware
 * 
 * Centraliza el manejo de errores en toda la aplicación.
 * Proporciona respuestas consistentes.
 * 
 * Principio SOLID: SRP - Responsable solo de manejar errores
 */

export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Error 404
  if (err.message === 'Not Found' || err.status === 404) {
    return res.status(404).json({
      error: err.message || 'Resource not found',
      type: 'NOT_FOUND',
    });
  }

  // Errores de validación
  if (err.message.includes('not found') || err.message.includes('does not exist')) {
    return res.status(404).json({
      error: err.message,
      type: 'NOT_FOUND',
    });
  }

  if (
    err.message.includes('required') ||
    err.message.includes('must be') ||
    err.message.includes('already registered')
  ) {
    return res.status(400).json({
      error: err.message,
      type: 'VALIDATION_ERROR',
    });
  }

  // Error de conexión BD
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      error: 'Database connection error',
      type: 'DATABASE_ERROR',
    });
  }

  // Error genérico
  res.status(500).json({
    error: 'Internal server error',
    type: 'INTERNAL_ERROR',
  });
}

export default errorHandler;
