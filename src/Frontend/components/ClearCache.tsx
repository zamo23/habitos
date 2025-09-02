import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClearCache: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const clearAll = async () => {
      try {
        // Clear localStorage
        localStorage.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear cookies - including secure cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/;domain=" + window.location.hostname);
        });

        // Clear service worker cache
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
          }
        }

        // Clear cache using Cache API
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(key => caches.delete(key)));
        }

        // Forzar recarga completa después de limpiar todo
        window.location.href = '/';
      } catch (error) {
        console.error('Error al limpiar caché:', error);
        // Si hay error, intentamos navegar de todas formas
        window.location.href = '/';
      }
    };

    clearAll();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Limpiando caché...
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Redirigiendo a la página principal...
        </p>
      </div>
    </div>
  );
};

export default ClearCache;
