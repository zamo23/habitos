// Registro del Service Worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        // Primero, verificamos si ya hay un service worker registrado
        const registrations = await navigator.serviceWorker.getRegistrations();
        
        // Si hay registros existentes, intentamos actualizarlos
        if (registrations.length > 0) {
          console.log('Actualizando Service Workers existentes...');
          for (const registration of registrations) {
            await registration.update();
            console.log('Service Worker actualizado:', registration.scope);
          }
        }
        
        // Registramos nuestro service worker (o actualizamos si ya existe)
        const registration = await navigator.serviceWorker.register('/sw.js', {
          updateViaCache: 'none' // No usar caché para el service worker
        });
        
        console.log('Service Worker registrado con éxito:', registration.scope);
        
        // Forzar la activación del service worker
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      } catch (error) {
        console.error('Error al registrar el Service Worker:', error);
      }
    });
    
    // Escuchar cambios en el service worker
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller ha cambiado');
    });
  }
}

// Función para comprobar si las notificaciones son compatibles
export function areNotificationsSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

// Función para obtener el estado actual del permiso de notificaciones
export function getNotificationPermission(): NotificationPermission {
  if (!areNotificationsSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

// Función para solicitar permiso de notificaciones
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!areNotificationsSupported()) {
    return 'denied';
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error al solicitar permiso de notificaciones:', error);
    return 'denied';
  }
}

// Registra el Service Worker al importar este archivo
registerServiceWorker();
