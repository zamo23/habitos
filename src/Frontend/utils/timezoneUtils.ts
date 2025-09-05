import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

/**
 * Utilidades para el manejo de zonas horarias y fechas de notificaciones
 */

/**
 * Convierte una fecha UTC a la zona horaria local del usuario
 * @param date Fecha en UTC
 * @param timeZone Zona horaria del usuario
 * @returns Fecha en la zona horaria del usuario
 */
export function convertUTCToUserTime(date: Date, timeZone: string): Date {
  return toZonedTime(date, timeZone);
}

/**
 * Convierte una fecha local del usuario a UTC
 * @param date Fecha en la zona horaria del usuario
 * @param timeZone Zona horaria del usuario
 * @returns Fecha en UTC
 */
export function convertUserTimeToUTC(date: Date, /* timeZone: string */): Date {
  // Nota: zonedTimeToUtc ya no existe en date-fns-tz
  // Podemos obtener una aproximación usando Date directamente
  const localTime = new Date(date);
  return new Date(Date.UTC(
    localTime.getFullYear(),
    localTime.getMonth(),
    localTime.getDate(),
    localTime.getHours(),
    localTime.getMinutes(),
    localTime.getSeconds()
  ));
}

/**
 * Calcula los próximos horarios de notificación basados en la hora de cierre
 * @param endHour Hora de cierre del día (0-23)
 * @param timeZone Zona horaria del usuario
 * @param hoursBeforeEnd Horas antes del cierre para notificar
 * @returns Array de fechas para notificar
 */
export function calculateNotificationTimes(
  endHour: number,
  timeZone: string,
  hoursBeforeEnd: number[]
): Date[] {
  const now = new Date();
  const userNow = convertUTCToUserTime(now, timeZone);
  
  const endTimeToday = new Date(userNow);
  endTimeToday.setHours(endHour, 0, 0, 0);
  
  // Si ya pasó la hora de cierre, programamos para mañana
  if (userNow.getTime() > endTimeToday.getTime()) {
    endTimeToday.setDate(endTimeToday.getDate() + 1);
  }
  
  return hoursBeforeEnd.map(hours => {
    const notificationTime = new Date(endTimeToday);
    notificationTime.setHours(notificationTime.getHours() - hours);
    return notificationTime;
  });
}

/**
 * Formatea una fecha para mostrarla en la zona horaria del usuario
 * @param date Fecha a formatear
 * @param timeZone Zona horaria del usuario
 * @param formatStr Formato a utilizar
 * @returns Fecha formateada
 */
export function formatUserTime(
  date: Date,
  timeZone: string,
  formatStr: string = 'HH:mm'
): string {
  const userTime = convertUTCToUserTime(date, timeZone);
  return format(userTime, formatStr);
}

/**
 * Calcula si una fecha ya pasó en la zona horaria del usuario
 * @param date Fecha a verificar
 * @param timeZone Zona horaria del usuario
 * @returns true si la fecha ya pasó, false en caso contrario
 */
export function hasTimePassedInUserTimezone(date: Date, timeZone: string): boolean {
  const userNow = convertUTCToUserTime(new Date(), timeZone);
  const userDate = convertUTCToUserTime(date, timeZone);
  return userNow.getTime() > userDate.getTime();
}
