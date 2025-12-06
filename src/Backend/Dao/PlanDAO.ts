import { SuscripcionDTO } from '../Dto/PlanDTO';
import { PlanListDTO } from '../Dto/PlanListDTO';

export class PlanDAO {
    private baseUrl: string = import.meta.env.VITE_API;

    async obtenerPlanes(token: string | null, moneda: string = 'PEN'): Promise<PlanListDTO[]> {
        try {
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            const url = `${this.baseUrl}/plans?moneda=${moneda}`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error al obtener planes: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en PlanDAO.obtenerPlanes:', error);
            throw error;
        }
    }

    async obtenerSuscripcionActual(token: string | null): Promise<SuscripcionDTO> {
        try {
            if (!token) {
                // Si no hay token, devolver plan gratuito por defecto
                return {
                    id: 'default',
                    plan: {
                        id: 'free',
                        codigo: 'free',
                        nombre: 'Free',
                        precio_centavos: 0,
                        moneda: 'PEN',
                        max_habitos: 3,
                        permite_grupos: false
                    },
                    estado: 'activo',
                    ciclo: 'mensual',
                    es_actual: true,
                    periodo_inicio: new Date().toISOString(),
                    periodo_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                };
            }

            const response = await fetch(`${this.baseUrl}/subscriptions/mine`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                // Si no está autorizado, devolver plan gratuito
                return {
                    id: 'default',
                    plan: {
                        id: 'free',
                        codigo: 'free',
                        nombre: 'Free',
                        precio_centavos: 0,
                        moneda: 'PEN',
                        max_habitos: 3,
                        permite_grupos: false
                    },
                    estado: 'activo',
                    ciclo: 'mensual',
                    es_actual: true,
                    periodo_inicio: new Date().toISOString(),
                    periodo_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                };
            }

            if (!response.ok) {
                throw new Error(`Error al obtener suscripción: ${response.statusText}`);
            }

            const data: SuscripcionDTO = await response.json();
            return data;
        } catch (error) {
            console.error('Error en PlanDAO.obtenerSuscripcionActual:', error);
            throw error;
        }
    }
}
