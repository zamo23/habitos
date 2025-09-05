import { useEffect, useState } from 'react';
import { useSettings } from './useSettings';
import { useHabits } from '../layouts/state/HabitsContext';
import NotificationService, { NotificationType } from '../services/NotificationService';
import { getNotificationPermission, requestNotificationPermission } from '../../serviceWorkerRegistration';

export const useNotifications = () => {
  const { settings } = useSettings();
  const { habits } = useHabits();
  const [permission, setPermission] = useState<NotificationPermission>(getNotificationPermission());
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(false);
  const [streakAlertsEnabled, setStreakAlertsEnabled] = useState<boolean>(false);
  
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    const initializeNotifications = async () => {
      if (permission === 'granted') {
        try {
          await notificationService.loadSettings();
          
          const initialized = await notificationService.initialize(
            settings.zona_horaria,
            settings.cierre_dia_hora
          );
          
          if (initialized) {
            setRemindersEnabled(notificationService.isNotificationEnabled(NotificationType.REMINDER));
            setStreakAlertsEnabled(notificationService.isNotificationEnabled(NotificationType.STREAK));
            setIsInitialized(true);
          }
        } catch (error) {
          console.error('Error al inicializar notificaciones:', error);
        }
      }
    };

    initializeNotifications();
  }, [permission, settings.zona_horaria, settings.cierre_dia_hora]);

  useEffect(() => {
    if (isInitialized) {
      notificationService.updateSettings(
        settings.zona_horaria,
        settings.cierre_dia_hora
      );
    }
  }, [isInitialized, settings.zona_horaria, settings.cierre_dia_hora]);


  useEffect(() => {
    if (isInitialized && streakAlertsEnabled && habits.length > 0) {
      habits.forEach(habit => {
        if (habit.rachas && habit.rachas.actual > 0 && habit.rachas.mejor > 0) {
          notificationService.scheduleStreakNotification(
            habit.rachas.actual,
            habit.rachas.mejor
          );
        }
      });
    }
  }, [isInitialized, streakAlertsEnabled, habits]);

  /**
   * Solicita permiso para enviar notificaciones
   */
  const requestPermission = async (): Promise<boolean> => {
    const newPermission = await requestNotificationPermission();
    setPermission(newPermission);
    
    if (newPermission === 'granted') {
      const initialized = await notificationService.initialize(
        settings.zona_horaria,
        settings.cierre_dia_hora
      );
      setIsInitialized(initialized);
      return initialized;
    }
    
    return false;
  };

  /**
   * Habilita o deshabilita las notificaciones de recordatorio
   */
  const toggleReminders = async (enabled: boolean): Promise<void> => {
    if (!isInitialized && enabled) {
      const granted = await requestPermission();
      if (granted) {
        await notificationService.toggleNotificationType(NotificationType.REMINDER, enabled);
        setRemindersEnabled(enabled);
      }
    } else if (isInitialized) {
      await notificationService.toggleNotificationType(NotificationType.REMINDER, enabled);
      setRemindersEnabled(enabled);
    }
  };

  /**
   * Habilita o deshabilita las notificaciones de alerta de racha
   */
  const toggleStreakAlerts = async (enabled: boolean): Promise<void> => {
    if (!isInitialized && enabled) {
      const granted = await requestPermission();
      if (granted) {
        await notificationService.toggleNotificationType(NotificationType.STREAK, enabled);
        setStreakAlertsEnabled(enabled);
      }
    } else if (isInitialized) {
      await notificationService.toggleNotificationType(NotificationType.STREAK, enabled);
      setStreakAlertsEnabled(enabled);
    }
  };

  return {
    permission,
    isInitialized,
    remindersEnabled,
    streakAlertsEnabled,
    requestPermission,
    toggleReminders,
    toggleStreakAlerts
  };
};
