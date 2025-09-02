import { DetectTimezoneRequest, DetectTimezoneResponse, TimezoneDTO, UsuarioAjustesDTO } from '../Dto/AjustesDTO';
import { DatabaseError } from './DatabaseError';

export class AjustesDAO {
    private apiUrl: string;

    constructor() {
        this.apiUrl = import.meta.env.VITE_API;
    }

    async obtenerZonasHorarias(token: string): Promise<TimezoneDTO[]> {
        try {
            const response = await fetch(`${this.apiUrl}/timezones`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new DatabaseError('Error al obtener zonas horarias', response.status.toString());
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async detectarZonaHoraria(offsetMinutos: number, token: string): Promise<DetectTimezoneResponse> {
        try {
            const request: DetectTimezoneRequest = {
                offset_minutes: offsetMinutos
            };

            const response = await fetch(`${this.apiUrl}/detect-timezone`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                throw new DatabaseError('Error al detectar zona horaria', response.status.toString());
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async obtenerHoraLocal(token: string): Promise<string> {
        try {
            const response = await fetch(`${this.apiUrl}/me/local-time`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new DatabaseError('Error al obtener hora local', response.status.toString());
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async obtenerAjustesUsuario(token: string): Promise<UsuarioAjustesDTO> {
        try {
            const response = await fetch(`${this.apiUrl}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new DatabaseError('Error al obtener ajustes del usuario', response.status.toString());
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async actualizarAjustesUsuario(
        token: string, 
        ajustes: Partial<Pick<UsuarioAjustesDTO, 'zona_horaria' | 'idioma' | 'cierre_dia_hora'>>
    ): Promise<UsuarioAjustesDTO> {
        try {
            const response = await fetch(`${this.apiUrl}/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(ajustes)
            });

            if (!response.ok) {
                throw new DatabaseError('Error al actualizar ajustes del usuario', response.status.toString());
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}
