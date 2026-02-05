import axios from 'axios';

/**
 * API Service - Configuración de axios
 * 
 * Proporciona una instancia configurada de axios para
 * comunicarse con los microservicios de Autores y Publicaciones
 * 
 * Principios:
 * - DRY: Un único lugar para configurar axios
 * - Reutilizable: Importable en cualquier componente
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';

// Micro service URLs
const AUTHORS_SERVICE_URL = `${API_BASE_URL}:3001`;
const PUBLICATIONS_SERVICE_URL = `${API_BASE_URL}:3002`;

// Instancia para Authors Service
export const authorsApi = axios.create({
  baseURL: AUTHORS_SERVICE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instancia para Publications Service
export const publicationsApi = axios.create({
  baseURL: PUBLICATIONS_SERVICE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ Interceptores ============

// Request interceptor para agregar headers adicionales
authorsApi.interceptors.request.use(
  (config) => {
    // Agregar token si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

publicationsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor para manejo de errores
authorsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

publicationsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default {
  authorsApi,
  publicationsApi,
};
