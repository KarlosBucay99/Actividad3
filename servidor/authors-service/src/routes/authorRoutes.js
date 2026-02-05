import express from 'express';

/**
 * Rutas de Authors
 * 
 * Define todos los endpoints REST para autores.
 */

export function createAuthorRoutes(authorController) {
  const router = express.Router();

  // POST /authors - Crear autor
  router.post('/', (req, res) => authorController.create(req, res));

  // GET /authors - Listar autores
  router.get('/', (req, res) => authorController.getAll(req, res));

  // GET /authors/:id - Obtener autor
  router.get('/:id', (req, res) => authorController.getById(req, res));

  // PUT /authors/:id - Actualizar autor
  router.put('/:id', (req, res) => authorController.update(req, res));

  // DELETE /authors/:id - Eliminar autor
  router.delete('/:id', (req, res) => authorController.delete(req, res));

  return router;
}

export default createAuthorRoutes;
