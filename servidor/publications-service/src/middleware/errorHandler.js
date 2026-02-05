/**
 * ErrorHandler Middleware - Publications Service
 * 
 * Centraliza el manejo de todos los errores de la aplicación.
 * Transforma errores en respuestas HTTP consistentes.
 * 
 * Principios SOLID:
 * - Single Responsibility: Solo responsable de formatear errores
 * - DRY (Don't Repeat Yourself): Un lugar central para manejar errores
 */

export function errorHandler(err, req, res, next) {
  // Log del error para debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Determinar el status code basado en el mensaje de error
  let statusCode = 500;
  let errorType = 'INTERNAL_ERROR';

  if (err.message.includes('not found')) {
    statusCode = 404;
    errorType = 'NOT_FOUND';
  } else if (
    err.message.includes('required') ||
    err.message.includes('Invalid') ||
    err.message.includes('Cannot transition') ||
    err.message.includes('Validation')
  ) {
    statusCode = 400;
    errorType = 'VALIDATION_ERROR';
  } else if (err.message.includes('unavailable') || err.message.includes('ECONNREFUSED')) {
    statusCode = 503;
    errorType = 'SERVICE_UNAVAILABLE';
  } else if (err.message.includes('timeout')) {
    statusCode = 504;
    errorType = 'GATEWAY_TIMEOUT';
  }

  // Respuesta de error consistente
  return res.status(statusCode).json({
    error: err.message || 'An unexpected error occurred',
    type: errorType,
    timestamp: new Date().toISOString(),
  });
}

export default errorHandler;
