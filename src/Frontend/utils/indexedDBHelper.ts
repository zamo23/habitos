/**
 * Helper para trabajar con IndexedDB
 * Proporciona métodos para guardar/cargar datos persistentes en la PWA
 */

const DB_NAME = 'habitos-db';
const DB_VERSION = 1;
const NOTIFICATION_STORE = 'notifications';

export interface NotificationSettings {
  timezone: string;
  endHour: number;
  configs: Record<string, any>;
}

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error al abrir la base de datos IndexedDB:', event);
      reject(new Error('No se pudo abrir la base de datos'));
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(NOTIFICATION_STORE)) {
        db.createObjectStore(NOTIFICATION_STORE, { keyPath: 'id' });
      }
    };
  });
}

// Guarda datos en la base de datos
export async function saveData(storeName: string, id: string, data: any): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.put({ id, ...data });
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error('Error al guardar datos en IndexedDB:', event);
        reject(new Error('Error al guardar datos'));
      };
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error al interactuar con IndexedDB:', error);
    localStorage.setItem(`${storeName}-${id}`, JSON.stringify(data));
  }
}

// Carga datos de la base de datos
export async function loadData<T>(storeName: string, id: string): Promise<T | null> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      const request = store.get(id);
      
      request.onsuccess = () => {
        if (request.result) {
          const { id: _, ...data } = request.result;
          resolve(data as T);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error al cargar datos de IndexedDB:', event);
        reject(new Error('Error al cargar datos'));
      };
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error al interactuar con IndexedDB:', error);
    const data = localStorage.getItem(`${storeName}-${id}`);
    return data ? JSON.parse(data) : null;
  }
}

// Elimina datos de la base de datos
export async function deleteData(storeName: string, id: string): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error('Error al eliminar datos de IndexedDB:', event);
        reject(new Error('Error al eliminar datos'));
      };
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error al interactuar con IndexedDB:', error);
    localStorage.removeItem(`${storeName}-${id}`);
  }
}

export const idbHelper = {
  saveNotificationSettings: async (settings: NotificationSettings) => {
    return saveData(NOTIFICATION_STORE, 'settings', settings);
  },
  
  loadNotificationSettings: async (): Promise<NotificationSettings | null> => {
    return loadData<NotificationSettings>(NOTIFICATION_STORE, 'settings');
  }
};
