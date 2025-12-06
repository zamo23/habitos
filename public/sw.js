const CACHE_NAME = 'habitos-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

const scheduledNotifications = new Map();

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, data.options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : self.location.origin;

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('message', (event) => {
  if (!event.data) return;

  switch (event.data.type) {
    case 'SCHEDULE_NOTIFICATION':
      scheduleNotification(event.data.payload);
      break;
    case 'CANCEL_NOTIFICATIONS':
      cancelNotifications(event.data.payload.tag);
      break;
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
  }
});

/**
 * Programa una notificación para mostrarla en un momento específico
 */
function scheduleNotification(payload) {
  const { title, options, notifyAt } = payload;
  const tag = options.tag;

  if (scheduledNotifications.has(tag)) {
    clearTimeout(scheduledNotifications.get(tag));
    scheduledNotifications.delete(tag);
  }

  const notifyTime = new Date(notifyAt).getTime();
  const currentTime = Date.now();
  const timeUntilNotification = Math.max(0, notifyTime - currentTime);

  if (timeUntilNotification > 0) {
    const timeoutId = setTimeout(() => {
      self.registration.showNotification(title, options)
        .then(() => {
          scheduledNotifications.delete(tag);
        })
        .catch(error => {
          console.error(`Error al mostrar notificación: ${error.message}`);
        });
    }, timeUntilNotification);

    scheduledNotifications.set(tag, timeoutId);
  } else {
    self.registration.showNotification(title, options)
      .then(() => {
      })
      .catch(error => {
        console.error(`Error al mostrar notificación inmediata: ${error.message}`);
      });
  }
}

/**
 * Cancela todas las notificaciones programadas que empiezan con el tag proporcionado
 */
function cancelNotifications(tagPrefix) {
  for (const [tag, timeoutId] of scheduledNotifications.entries()) {
    if (tag.startsWith(tagPrefix)) {
      clearTimeout(timeoutId);
      scheduledNotifications.delete(tag);
    }
  }
}
