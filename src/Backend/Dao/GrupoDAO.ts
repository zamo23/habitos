import { GrupoDTO, GrupoRespuestaDTO, HabitoGrupalDTO, InvitacionGrupoDTO, InvitacionRespuestaDTO, MiembroGrupoDTO } from '../Dto/GrupoDTO';
import { HabitoRespuestaDTO } from '../Dto/HabitoDTO';
import { DatabaseError } from './DatabaseError';

export class GrupoDAO {
    private apiUrl: string;

    constructor() {
        this.apiUrl = import.meta.env.VITE_API;
    }

    async crearGrupo(grupo: GrupoDTO, token: string): Promise<GrupoRespuestaDTO> {
        try {
            const response = await fetch(`${this.apiUrl}/groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(grupo)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al crear el grupo');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al crear el grupo');
        }
    }

    async obtenerGrupos(token: string): Promise<GrupoRespuestaDTO[]> {
        try {
            const response = await fetch(`${this.apiUrl}/groups`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al obtener los grupos');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al obtener los grupos');
        }
    }

    async obtenerGrupo(id_grupo: string, token: string): Promise<GrupoRespuestaDTO> {
        try {
            const response = await fetch(`${this.apiUrl}/groups/${id_grupo}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al obtener el grupo');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al obtener el grupo');
        }
    }

    async crearHabitoGrupal(id_grupo: string, habito: HabitoGrupalDTO, token: string): Promise<HabitoRespuestaDTO> {
        try {
            const response = await fetch(`${this.apiUrl}/groups/${id_grupo}/habits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(habito)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al crear el hábito grupal');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al crear el hábito grupal');
        }
    }

    async obtenerHabitosGrupales(id_grupo: string, token: string): Promise<HabitoRespuestaDTO[]> {
        try {
            const response = await fetch(`${this.apiUrl}/groups/${id_grupo}/habits`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al obtener los hábitos del grupo');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al obtener los hábitos del grupo');
        }
    }

    async invitarUsuario(id_grupo: string, invitacion: InvitacionGrupoDTO, token: string): Promise<InvitacionRespuestaDTO> {
        try {
            const requestBody = invitacion;
            const requestUrl = `${this.apiUrl}/groups/${id_grupo}/invites`;

            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('❌ DAO - Error en respuesta de invitación individual:', error);
                throw new DatabaseError(response.status.toString(), error.message || 'Error al enviar la invitación');
            }

            const responseData = await response.json();

            return responseData;
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            console.error('💥 DAO - Error de conexión en invitación individual:', error);
            throw new DatabaseError('500', 'Error en la conexión al enviar la invitación');
        }
    }

    async invitarUsuariosLote(id_grupo: string, invitaciones: { correo: string; rol?: 'miembro' | 'administrador' }[], token: string): Promise<any> {
        try {
            const requestBody = { correos: invitaciones };
            const requestUrl = `${this.apiUrl}/groups/${id_grupo}/invites/batch`;

            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('❌ DAO - Error en respuesta de invitaciones por lote:', error);
                throw new DatabaseError(response.status.toString(), error.message || 'Error al enviar las invitaciones');
            }

            const responseData = await response.json();

            return responseData;
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            console.error('💥 DAO - Error de conexión en invitaciones por lote:', error);
            throw new DatabaseError('500', 'Error en la conexión al enviar las invitaciones');
        }
    }

    async obtenerInvitaciones(id_grupo: string, token: string): Promise<InvitacionRespuestaDTO[]> {
        try {
            const response = await fetch(`${this.apiUrl}/groups/${id_grupo}/invites`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al obtener las invitaciones');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al obtener las invitaciones');
        }
    }

    async obtenerMisInvitaciones(token: string): Promise<InvitacionRespuestaDTO[]> {
        try {
            const response = await fetch(`${this.apiUrl}/invites`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al obtener mis invitaciones');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al obtener mis invitaciones');
        }
    }

    async responderInvitacion(id_invitacion: string, aceptar: boolean, token: string): Promise<InvitacionRespuestaDTO> {
        try {
            const response = await fetch(`${this.apiUrl}/invites/${id_invitacion}/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ aceptar })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al responder a la invitación');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al responder a la invitación');
        }
    }

    async obtenerMiembrosGrupo(id_grupo: string, token: string): Promise<MiembroGrupoDTO[]> {
        try {
            const response = await fetch(`${this.apiUrl}/groups/${id_grupo}/members`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al obtener los miembros del grupo');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al obtener los miembros del grupo');
        }
    }

    // Verifica una invitación usando el token del link
    async verificarInvitacionPorToken(tokenInvitacion: string, authToken: string): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}/groups/invites/verify?token=${tokenInvitacion}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al verificar la invitación');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al verificar la invitación');
        }
    }

    // Acepta una invitación usando el token del link
    async aceptarInvitacionPorToken(tokenInvitacion: string, authToken: string): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}/groups/invites/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ token: tokenInvitacion })
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Error response:', error);
                throw new DatabaseError(response.status.toString(), error.message || 'Error al aceptar la invitación');
            }

            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al aceptar la invitación');
        }
    }

    // Rechaza una invitación usando el token del link
    async rechazarInvitacionPorToken(tokenInvitacion: string, authToken: string): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}/groups/invites/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ token: tokenInvitacion })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al rechazar la invitación');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al rechazar la invitación');
        }
    }

    // Invita a un usuario a un grupo por email
    async invitarMiembroGrupo(idGrupo: string, email: string, token: string): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}/groups/${idGrupo}/invites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ correo: email })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al invitar al miembro');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al invitar al miembro');
        }
    }

    // Elimina a un miembro del grupo
    async eliminarMiembroGrupo(idGrupo: string, idMiembro: string, token: string): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}/groups/${idGrupo}/members/${idMiembro}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al eliminar al miembro');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al eliminar al miembro');
        }
    }

    // Actualiza la información de un grupo
    async actualizarGrupo(idGrupo: string, datos: { nombre?: string; descripcion?: string }, token: string): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}/groups/${idGrupo}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al actualizar el grupo');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al actualizar el grupo');
        }
    }
    
    // Elimina un grupo completamente
    async eliminarGrupo(idGrupo: string, token: string): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}/groups/${idGrupo}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new DatabaseError(response.status.toString(), error.message || 'Error al eliminar el grupo');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('500', 'Error en la conexión al eliminar el grupo');
        }
    }
}
