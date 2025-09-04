import { HabitoDTO, HabitoRespuestaDTO } from '../Dto/HabitoDTO';

interface HabitoConRachas extends HabitoRespuestaDTO {
    rachas: {
        actual: number;
        mejor: number;
    };
}

interface RegistroHabito {
    estado: 'success' | 'fail';
    comentario?: string;
}

interface RegistroRespuesta {
    id: string;
    fecha: string;
    estado: 'success' | 'fail';
    comentario?: string;
    rachas_usuario: {
        actual: number;
        mejor: number;
    };
}

export class HabitoDAO {
    private apiUrl: string;

    constructor() {
        this.apiUrl = import.meta.env.VITE_API;
    }

    async crearHabito(habito: HabitoDTO, token: string): Promise<HabitoRespuestaDTO> {
        try {
            if (!token) {
                throw new Error('No se proporcionó token de autenticación');
            }

            const response = await fetch(`${this.apiUrl}/habits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(habito)
            });

            const responseData = await response.json();

            if (!response.ok) {
                let errorMessage = 'Error al crear el hábito';
                if (response.status === 403) {
                    errorMessage = 'No tienes permisos para crear hábitos. Verifica tu autenticación.';
                }
                if (responseData.message) {
                    errorMessage += `: ${responseData.message}`;
                }
                throw new Error(errorMessage);
            }

            return responseData;
        } catch (error) {
            throw error;
        }
    }

    async listarHabitos(token: string): Promise<HabitoConRachas[]> {
        try {
            const response = await fetch(`${this.apiUrl}/habits`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los hábitos');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async registrarProgreso(habitId: string, registro: RegistroHabito, token: string): Promise<RegistroRespuesta> {
        try {

            const response = await fetch(`${this.apiUrl}/habits/${habitId}/entries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(registro)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(`Error al registrar el progreso: ${responseData.message || 'Error desconocido'}`);
            }

            return responseData;
        } catch (error) {
            throw error;
        }
    }

    async eliminarHabito(habitId: string, token: string): Promise<void> {
        try {
            const response = await fetch(`${this.apiUrl}/habits/${habitId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el hábito');
            }
        } catch (error) {
            throw error;
        }
    }

    async editarHabito(habitId: string, titulo: string, token: string): Promise<HabitoRespuestaDTO> {
        try {
            const response = await fetch(`${this.apiUrl}/habits/${habitId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ titulo })
            });

            const responseData = await response.json();

            if (!response.ok) {
                let errorMessage = 'Error al editar el hábito';
                if (response.status === 403) {
                    errorMessage = 'No tienes permisos para editar hábitos. Verifica tu autenticación.';
                }
                if (responseData.error?.message) {
                    errorMessage += `: ${responseData.error.message}`;
                }
                throw new Error(errorMessage);
            }

            return responseData;
        } catch (error) {
            throw error;
        }
    }

    async obtenerUsuario(token: string) {
        try {
            const response = await fetch(`${this.apiUrl}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener información del usuario');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}
