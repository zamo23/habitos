import { format, isAfter } from 'date-fns';
import { idbHelper } from '../utils/indexedDBHelper';

export enum NotificationType {
  REMINDER = 'reminder',
  STREAK = 'streak',
}

export interface NotificationConfig {
  enabled: boolean;
  title: string;
  body: string;
  icon: string;
  badge?: string;
  tag: string;
  data?: any;
}

const DAILY_REMINDER_TIMES = [12, 6, 1];

class NotificationService {
  private static instance: NotificationService;
  private initialized: boolean = false;
  private permission: NotificationPermission = 'default';
  private timezone: string = 'America/Lima';
  private endHour: number = 0;
  private configs: Record<NotificationType, NotificationConfig> = {
    [NotificationType.REMINDER]: {
      enabled: false,
      title: '¡Recordatorio de hábitos!',
      body: 'Tienes hábitos pendientes por completar hoy.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'reminder',
    },
    [NotificationType.STREAK]: {
      enabled: false,
      title: '¡Puedes superar tu racha!',
      body: 'Estás a un día de superar tu mejor racha. ¡No lo olvides!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'streak',
    },
  };

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Inicializa el servicio de notificaciones
   * @param timezone Zona horaria del usuario
   * @param endHour Hora de cierre del día
   */
  public async initialize(timezone: string, endHour: number): Promise<boolean> {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('Las notificaciones no son soportadas en este navegador');
      return false;
    }

    await this.loadSettings();

    this.timezone = timezone;
    this.endHour = endHour;
    this.permission = Notification.permission;

    if (this.permission === 'granted') {
      this.saveSettings();
      this.initialized = true;
      return true;
    }

    return false;
  }

  /**
   * Solicita permisos para enviar notificaciones
   */
  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Las notificaciones no son soportadas en este navegador');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      if (permission === 'granted') {
        this.saveSettings();
        this.initialized = true;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al solicitar permisos de notificación:', error);
      return false;
    }
  }

  /**
   * Actualiza la configuración del servicio
   * @param timezone Zona horaria del usuario
   * @param endHour Hora de cierre del día
   */
  public updateSettings(timezone: string, endHour: number): void {
    this.timezone = timezone;
    this.endHour = endHour;
    this.saveSettings();
  }

  /**
   * Habilita o deshabilita un tipo de notificación
   * @param type Tipo de notificación
   * @param enabled Estado de habilitación
   */
  public async toggleNotificationType(type: NotificationType, enabled: boolean): Promise<void> {
    if (this.configs[type]) {
      this.configs[type].enabled = enabled;
      await this.saveSettings();

      if (enabled) {
        this.scheduleNotification(type);
      } else {
        this.cancelNotification(type);
      }
    }
  }

  /**
   * Verifica si un tipo de notificación está habilitado
   * @param type Tipo de notificación
   */
  public isNotificationEnabled(type: NotificationType): boolean {
    return this.configs[type]?.enabled || false;
  }

  /**
   * Programa todas las notificaciones habilitadas
   */
  public scheduleAllNotifications(): void {
    Object.keys(this.configs).forEach((type) => {
      const notificationType = type as NotificationType;
      if (this.configs[notificationType].enabled) {
        this.scheduleNotification(notificationType);
      }
    });
  }

  /**
   * Programa una notificación específica
   * @param type Tipo de notificación
   */
  private async scheduleNotification(type: NotificationType): Promise<void> {
    if (!this.initialized || this.permission !== 'granted') {
      console.warn('Servicio de notificaciones no inicializado o sin permisos');
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    this.cancelNotification(type);
    
    switch (type) {
      case NotificationType.REMINDER:
        this.scheduleReminderNotifications(registration);
        break;
      case NotificationType.STREAK:
        break;
    }
  }

  /**
   * Programa notificaciones de recordatorio diario
   * @param registration Registro del Service Worker
   */
  private async scheduleReminderNotifications(registration: ServiceWorkerRegistration): Promise<void> {

    const now = new Date();
    
    const endTimeToday = new Date(now);
    endTimeToday.setHours(this.endHour, 0, 0, 0);
    
    if (isAfter(now, endTimeToday)) {
      endTimeToday.setDate(endTimeToday.getDate() + 1);
    }
    
    for (const hoursBeforeEnd of DAILY_REMINDER_TIMES) {
      const reminderTime = new Date(endTimeToday);
      reminderTime.setHours(reminderTime.getHours() - hoursBeforeEnd);
      
      if (isAfter(reminderTime, now)) {
        const tag = `${NotificationType.REMINDER}-${hoursBeforeEnd}`;
        
        localStorage.setItem(`notification-${tag}`, reminderTime.toISOString());
        
        await registration.active?.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          payload: {
            title: this.configs[NotificationType.REMINDER].title,
            options: {
              ...this.configs[NotificationType.REMINDER],
              body: hoursBeforeEnd === 1 
                ? '¡Último recordatorio! Te queda 1 hora para completar tus hábitos hoy.'
                : `Te quedan ${hoursBeforeEnd} horas para completar tus hábitos hoy.`,
              tag,
              data: {
                type: NotificationType.REMINDER,
                hoursBeforeEnd,
                url: window.location.origin + '/inicio',
              },
            },
            notifyAt: reminderTime.toISOString(),
          },
        });
        
        console.log(`Notificación programada para ${format(reminderTime, 'HH:mm')} (${hoursBeforeEnd}h antes del cierre)`);
      }
    }
  }
  
  /**
   * Programa una notificación de racha
   * @param streak Racha actual
   * @param bestStreak Mejor racha
   */
  public async scheduleStreakNotification(streak: number, bestStreak: number): Promise<void> {
    if (!this.configs[NotificationType.STREAK].enabled || streak + 1 !== bestStreak) {
      return;
    }
    
    const registration = await navigator.serviceWorker.ready;
    const now = new Date();
    
    const endTimeToday = new Date(now);
    endTimeToday.setHours(this.endHour, 0, 0, 0);

    if (isAfter(now, endTimeToday)) {
      endTimeToday.setDate(endTimeToday.getDate() + 1);
    }

    const notificationTime = new Date(endTimeToday);
    notificationTime.setHours(notificationTime.getHours() - 12);

    if (isAfter(notificationTime, now)) {
      const tag = `${NotificationType.STREAK}-${streak}`;
      localStorage.setItem(`notification-${tag}`, notificationTime.toISOString());
      
      await registration.active?.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        payload: {
          title: this.configs[NotificationType.STREAK].title,
          options: {
            ...this.configs[NotificationType.STREAK],
            body: `¡Estás a un día de superar tu récord de ${bestStreak} días! Completa tus hábitos hoy.`,
            tag,
            data: {
              type: NotificationType.STREAK,
              streak,
              bestStreak,
              url: window.location.origin + '/inicio',
            },
          },
          notifyAt: notificationTime.toISOString(),
        },
      });
      
      console.log(`Notificación de racha programada para ${format(notificationTime, 'HH:mm')}`);
    }
  }

  /**
   * Cancela una notificación programada
   * @param type Tipo de notificación
   */
  private async cancelNotification(type: NotificationType): Promise<void> {
    const registration = await navigator.serviceWorker.ready;
    
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(`notification-${type}`)
    );
 
    for (const key of keys) {
      localStorage.removeItem(key);
    }

    await registration.active?.postMessage({
      type: 'CANCEL_NOTIFICATIONS',
      payload: { tag: type }
    });
  }

  /**
   * Guarda la configuración en localStorage e IndexedDB
   */
  private async saveSettings(): Promise<void> {
    const settings = {
      timezone: this.timezone,
      endHour: this.endHour,
      configs: this.configs,
    };

    localStorage.setItem('notification-settings', JSON.stringify(settings));

    try {
      await idbHelper.saveNotificationSettings(settings);
      console.log('Configuración de notificaciones guardada en IndexedDB');
    } catch (error) {
      console.warn('Error al guardar en IndexedDB, usando localStorage como fallback:', error);
    }
  }

  /**
   * Carga la configuración desde localStorage o IndexedDB
   */
  public async loadSettings(): Promise<void> {
    try {
      const settings = await idbHelper.loadNotificationSettings();
      
      if (settings) {
        this.timezone = settings.timezone;
        this.endHour = settings.endHour;
        this.configs = settings.configs;
        console.log('Configuración de notificaciones cargada desde IndexedDB');
        return;
      }
    } catch (error) {
      console.warn('Error al cargar desde IndexedDB:', error);
    }
    
    const settingsJson = localStorage.getItem('notification-settings');
    if (settingsJson) {
      try {
        const settings = JSON.parse(settingsJson);
        this.timezone = settings.timezone;
        this.endHour = settings.endHour;
        this.configs = settings.configs;
        console.log('Configuración de notificaciones cargada desde localStorage');
      } catch (error) {
        console.error('Error al parsear configuración de notificaciones:', error);
      }
    }
  }

  /**
   * Verifica si el servicio está inicializado
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Obtiene el estado actual del permiso de notificaciones
   */
  public getPermissionStatus(): NotificationPermission {
    return this.permission;
  }
}

export default NotificationService;
