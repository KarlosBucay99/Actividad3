import React from 'react';

/**
 * Componente Toast
 * 
 * Muestra notificaciones de éxito, error, advertencia, etc.
 */

export function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="toast-close">
        ×
      </button>
    </div>
  );
}

/**
 * Componente LoadingSpinner
 * 
 * Muestra un indicador de carga
 */

export function LoadingSpinner({ size = 'md' }) {
  const sizeClass = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
  };

  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClass[size]}`}></div>
    </div>
  );
}

/**
 * Componente Alert
 * 
 * Muestra una alerta con diferentes tipos
 */

export function Alert({ message, type = 'info', onClose }) {
  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="alert-close">
          ×
        </button>
      )}
    </div>
  );
}

/**
 * Componente Pagination
 * 
 * Controles de paginación
 */

export function Pagination({ page, pages, onPageChange }) {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="pagination-btn"
      >
        ← Anterior
      </button>

      <div className="pagination-info">
        Página {page} de {pages}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="pagination-btn"
      >
        Siguiente →
      </button>
    </div>
  );
}

/**
 * Componente EmptyState
 * 
 * Muestra cuando no hay datos
 */

export function EmptyState({ icon = '📭', title = 'No hay datos', message = '' }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
}
