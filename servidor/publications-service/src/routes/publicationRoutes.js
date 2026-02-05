import { Router } from 'express';

/**
 * Rutas para Publications
 * 
 * Define todos los endpoints REST para el servicio de Publicaciones
 * 
 * Principios SOLID:
 * - Dependency Injection: El controlador se inyecta
 * - Single Responsibility: Solo responsable de ruteo
 */

export function publicationRoutes(publicationController) {
  const router = Router();

  // CRUD Básico
  router.post('/', (req, res, next) => publicationController.create(req, res, next));
  router.get('/', (req, res, next) => publicationController.getAll(req, res, next));
  router.get('/:id', (req, res, next) => publicationController.getById(req, res, next));
  router.put('/:id', (req, res, next) => publicationController.update(req, res, next));
  router.delete('/:id', (req, res, next) => publicationController.delete(req, res, next));

  // Endpoints de estado
  router.patch('/:id/status', (req, res, next) => publicationController.updateStatus(req, res, next));
  
  // Endpoints de transición rápida
  router.post('/:id/submit-review', (req, res, next) => publicationController.submitForReview(req, res, next));
  router.post('/:id/approve', (req, res, next) => publicationController.approvePublication(req, res, next));
  router.post('/:id/reject', (req, res, next) => publicationController.rejectPublication(req, res, next));
  router.post('/:id/publish', (req, res, next) => publicationController.publishPublication(req, res, next));

  // Estadísticas
  router.get('/stats/summary', (req, res, next) => publicationController.getStatistics(req, res, next));

  return router;
}

export default publicationRoutes;
