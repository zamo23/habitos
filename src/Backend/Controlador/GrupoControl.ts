import { GrupoDAO } from '../Dao/GrupoDAO';
import { GrupoDTO, GrupoRespuestaDTO, HabitoGrupalDTO, InvitacionGrupoDTO, InvitacionRespuestaDTO, MiembroGrupoDTO } from '../Dto/GrupoDTO';
import { HabitoRespuestaDTO } from '../Dto/HabitoDTO';

export class GrupoControl {
    private grupoDAO: GrupoDAO;

    constructor() {
        this.grupoDAO = new GrupoDAO();
    }

    async crearGrupo(grupo: GrupoDTO, token: string): Promise<GrupoRespuestaDTO> {
        try {
            // Validaciones básicas
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!grupo.nombre) {
                throw new Error('Nombre del grupo es requerido');
            }

            return await this.grupoDAO.crearGrupo(grupo, token);
        } catch (error) {
            throw error;
        }
    }

    async obtenerGrupos(token: string): Promise<GrupoRespuestaDTO[]> {
        try {
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            return await this.grupoDAO.obtenerGrupos(token);
        } catch (error) {
            throw error;
        }
    }

    async obtenerGrupo(id_grupo: string, token: string): Promise<GrupoRespuestaDTO> {
        try {
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!id_grupo) {
                throw new Error('ID del grupo es requerido');
            }

            return await this.grupoDAO.obtenerGrupo(id_grupo, token);
        } catch (error) {
            throw error;
        }
    }

    async crearHabitoGrupal(id_grupo: string, habito: HabitoGrupalDTO, token: string): Promise<HabitoRespuestaDTO> {
        try {
            // Validaciones básicas
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!id_grupo) {
                throw new Error('ID del grupo es requerido');
            }

            if (!habito.titulo) {
                throw new Error('Título del hábito es requerido');
            }

            if (!habito.tipo || !['hacer', 'dejar'].includes(habito.tipo)) {
                throw new Error('Tipo de hábito inválido');
            }

            return await this.grupoDAO.crearHabitoGrupal(id_grupo, habito, token);
        } catch (error) {
            throw error;
        }
    }

    async obtenerHabitosGrupales(id_grupo: string, token: string): Promise<HabitoRespuestaDTO[]> {
        try {
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!id_grupo) {
                throw new Error('ID del grupo es requerido');
            }

            return await this.grupoDAO.obtenerHabitosGrupales(id_grupo, token);
        } catch (error) {
            throw error;
        }
    }

    async invitarUsuario(id_grupo: string, invitacion: InvitacionGrupoDTO, token: string): Promise<InvitacionRespuestaDTO> {
        try {
            // Validaciones básicas
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!id_grupo) {
                throw new Error('ID del grupo es requerido');
            }

            if (!invitacion.correo) {
                throw new Error('Correo electrónico es requerido');
            }

            // Validar formato de correo
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(invitacion.correo)) {
                throw new Error('Formato de correo electrónico inválido');
            }

            return await this.grupoDAO.invitarUsuario(id_grupo, invitacion, token);
        } catch (error) {
            throw error;
        }
    }

    async invitarUsuariosLote(id_grupo: string, invitaciones: { correo: string; rol?: 'miembro' | 'administrador' }[], token: string): Promise<any> {
        try {
            // Validaciones básicas
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!id_grupo) {
                throw new Error('ID del grupo es requerido');
            }

            if (!invitaciones || invitaciones.length === 0) {
                throw new Error('Se requiere al menos una invitación');
            }

            // Validar cada invitación
            for (const invitacion of invitaciones) {
                if (!invitacion.correo) {
                    throw new Error('Todos los correos electrónicos son requeridos');
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(invitacion.correo)) {
                    throw new Error(`Formato de correo electrónico inválido: ${invitacion.correo}`);
                }
            }

            return await this.grupoDAO.invitarUsuariosLote(id_grupo, invitaciones, token);
        } catch (error) {
            throw error;
        }
    }

    async obtenerInvitaciones(id_grupo: string, token: string): Promise<InvitacionRespuestaDTO[]> {
        try {
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!id_grupo) {
                throw new Error('ID del grupo es requerido');
            }

            return await this.grupoDAO.obtenerInvitaciones(id_grupo, token);
        } catch (error) {
            throw error;
        }
    }

    async obtenerMisInvitaciones(token: string): Promise<InvitacionRespuestaDTO[]> {
        try {
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            return await this.grupoDAO.obtenerMisInvitaciones(token);
        } catch (error) {
            throw error;
        }
    }

    async responderInvitacion(id_invitacion: string, aceptar: boolean, token: string): Promise<InvitacionRespuestaDTO> {
        try {
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!id_invitacion) {
                throw new Error('ID de la invitación es requerido');
            }

            return await this.grupoDAO.responderInvitacion(id_invitacion, aceptar, token);
        } catch (error) {
            throw error;
        }
    }

    async obtenerMiembrosGrupo(id_grupo: string, token: string): Promise<MiembroGrupoDTO[]> {
        try {
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!id_grupo) {
                throw new Error('ID del grupo es requerido');
            }

            return await this.grupoDAO.obtenerMiembrosGrupo(id_grupo, token);
        } catch (error) {
            throw error;
        }
    }

    // Verifica la información de una invitación usando el token del link
    async verificarInvitacionPorToken(tokenInvitacion: string, authToken: string): Promise<any> {
        try {
            if (!authToken) {
                throw new Error('Token de autenticación requerido');
            }

            if (!tokenInvitacion) {
                throw new Error('Token de invitación requerido');
            }

            return await this.grupoDAO.verificarInvitacionPorToken(tokenInvitacion, authToken);
        } catch (error) {
            throw error;
        }
    }

    // Acepta una invitación usando el token del link
    async aceptarInvitacionPorToken(tokenInvitacion: string, authToken: string): Promise<any> {
        try {
            if (!authToken) {
                throw new Error('Token de autenticación requerido');
            }

            if (!tokenInvitacion) {
                throw new Error('Token de invitación requerido');
            }

            return await this.grupoDAO.aceptarInvitacionPorToken(tokenInvitacion, authToken);
        } catch (error) {
            throw error;
        }
    }

    // Rechaza una invitación usando el token del link
    async rechazarInvitacionPorToken(tokenInvitacion: string, authToken: string): Promise<any> {
        try {
            if (!authToken) {
                throw new Error('Token de autenticación requerido');
            }

            if (!tokenInvitacion) {
                throw new Error('Token de invitación requerido');
            }

            return await this.grupoDAO.rechazarInvitacionPorToken(tokenInvitacion, authToken);
        } catch (error) {
            throw error;
        }
    }

    // Invita a un usuario a un grupo por email
    async invitarMiembroGrupo(idGrupo: string, email: string, token: string): Promise<any> {
        try {
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!idGrupo) {
                throw new Error('ID del grupo es requerido');
            }

            if (!email) {
                throw new Error('Email del invitado es requerido');
            }

            return await this.grupoDAO.invitarMiembroGrupo(idGrupo, email, token);
        } catch (error) {
            throw error;
        }
    }

    // Elimina a un miembro del grupo
    async eliminarMiembroGrupo(idGrupo: string, idMiembro: string, token: string): Promise<any> {
        try {
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!idGrupo) {
                throw new Error('ID del grupo es requerido');
            }

            if (!idMiembro) {
                throw new Error('ID del miembro es requerido');
            }

            return await this.grupoDAO.eliminarMiembroGrupo(idGrupo, idMiembro, token);
        } catch (error) {
            throw error;
        }
    }

    // Actualiza la información de un grupo
    async actualizarGrupo(idGrupo: string, datos: { nombre?: string; descripcion?: string }, token: string): Promise<any> {
        try {
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!idGrupo) {
                throw new Error('ID del grupo es requerido');
            }

            if (!datos.nombre && !datos.descripcion) {
                throw new Error('Se requiere al menos un campo para actualizar');
            }

            return await this.grupoDAO.actualizarGrupo(idGrupo, datos, token);
        } catch (error) {
            throw error;
        }
    }

    // Elimina un grupo completamente
    async eliminarGrupo(idGrupo: string, token: string): Promise<any> {
        try {
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!idGrupo) {
                throw new Error('ID del grupo es requerido');
            }

            return await this.grupoDAO.eliminarGrupo(idGrupo, token);
        } catch (error) {
            throw error;
        }
    }
}
