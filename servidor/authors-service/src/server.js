import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import AuthorModel from './models/Author.sequelize.js';
import AuthorRepository from './repositories/AuthorRepository.js';
import AuthorService from './services/AuthorService.js';
import AuthorController from './controllers/AuthorController.js';
import createAuthorRoutes from './routes/authorRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inyección de dependencias
const authorRepository = new AuthorRepository(AuthorModel);
const authorService = new AuthorService(authorRepository);
const authorController = new AuthorController(authorService);

// Sincronizar base de datos
let dbInitialized = false;

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');

    await sequelize.sync({ alter: true });
    console.log('✓ Database synchronized');

    dbInitialized = true;
  } catch (error) {
    console.error('✗ Database error:', error);
    process.exit(1);
  }
}

// Rutas
app.get('/health', (req, res) => {
  if (!dbInitialized) {
    return res.status(503).json({
      status: 'Authors Service (DB initializing)',
      database: 'connecting',
    });
  }

  res.json({
    status: 'Authors Service OK',
    database: 'connected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/authors', createAuthorRoutes(authorController));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});

// Error handler (debe ser el último)
app.use(errorHandler);

// Iniciar servidor
async function start() {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`✓ Authors Service running on port ${PORT}`);
    console.log(`✓ API: http://localhost:${PORT}`);
    console.log(`✓ Health check: http://localhost:${PORT}/health`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
