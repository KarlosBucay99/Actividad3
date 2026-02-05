import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import database from './config/database.js';
import PublicationRepository from './repositories/PublicationRepository.js';
import PublicationService from './services/PublicationService.js';
import PublicationController from './controllers/PublicationController.js';
import publicationRoutes from './routes/publicationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import AuthorsServiceClient from './clients/AuthorsServiceClient.js';
import { DefaultStatusTransitionStrategy } from './strategies/StatusTransitionStrategy.js';

/**
 * Publications Microservice
 * 
 * Arquitectura de Capas con Inyección de Dependencias:
 * 
 * HTTP Request
 *     ↓
 * [Routes] → [Controller] → [Service] → [Repository] → [Database]
 *                ↓
 *           [AuthorsServiceClient] (for validation)
 *           [StatusTransitionStrategy] (for state machine)
 *
 * Principios SOLID:
 * - S: Cada componente tiene una responsabilidad
 * - O: Abierto para extensión (estrategias intercambiables)
 * - L: Liskov Substitution (repositorio y servicio son reemplazables)
 * - I: Interface Segregation (interfaces específicas)
 * - D: Dependency Inversion (inyección de dependencias)
 */

const app = express();

// ============ Middleware Global ============
app.use(cors());
app.use(express.json());

// ============ Inicialización de Dependencias ============
// 1. Cliente para validar autores remotamente
const authorsServiceClient = new AuthorsServiceClient(
  process.env.AUTHOR_SERVICE_URL || 'http://localhost:3001'
);

// 2. Estrategia para transiciones de estado
const statusTransitionStrategy = new DefaultStatusTransitionStrategy();

// 3. Inyectar dependencias: Repository → Service → Controller
const publicationRepository = new PublicationRepository();
const publicationService = new PublicationService(
  publicationRepository,
  authorsServiceClient,
  statusTransitionStrategy
);
const publicationController = new PublicationController(publicationService);

// ============ Rutas de Aplicación ============
// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'publications-service',
    timestamp: new Date().toISOString(),
  });
});

// Publications API
app.use('/publications', publicationRoutes(publicationController));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    type: 'NOT_FOUND',
    path: req.path,
  });
});

// ============ Error Handler (middleware final) ============
app.use(errorHandler);

// ============ Inicialización de la Base de Datos ============
async function initializeDatabase() {
  try {
    console.log('🔌 Conectando a la base de datos...');
    await database.authenticate();
    console.log('✅ Conexión a base de datos establecida');

    console.log('🔄 Sincronizando modelos...');
    await database.sync({ alter: true });
    console.log('✅ Base de datos sincronizada');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

// ============ Iniciar Servidor ============
async function startServer() {
  try {
    await initializeDatabase();

    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
      console.log(`\n🚀 Publications Service iniciado en puerto ${PORT}`);
      console.log(`📚 Authors Service URL: ${process.env.AUTHOR_SERVICE_URL || 'http://localhost:3001'}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar la aplicación
startServer();

export default app;
