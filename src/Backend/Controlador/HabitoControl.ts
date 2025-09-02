import { HabitoDAO } from '../Dao/HabitoDAO';
import { HabitoDTO, HabitoRespuestaDTO } from '../Dto/HabitoDTO';

interface RegistroHabito {
    estado: 'success' | 'fail';
    comentario?: string;
}

export class HabitoControl {
    private habitoDAO: HabitoDAO;

    constructor() {
        this.habitoDAO = new HabitoDAO();
    }

    async crearHabito(habito: HabitoDTO, token: string): Promise<HabitoRespuestaDTO> {
        try {
            // Validaciones básicas
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!habito.titulo || !habito.tipo) {
                throw new Error('Título y tipo son requeridos');
            }

            if (!['hacer', 'dejar'].includes(habito.tipo)) {
                throw new Error('Tipo de hábito inválido');
            }

            const resultado = await this.habitoDAO.crearHabito(habito, token);
            return resultado;
        } catch (error) {
            throw error;
        }
    }

    async obtenerUsuario(token: string) {
        try {
            return await this.habitoDAO.obtenerUsuario(token);
        } catch (error) {
            throw error;
        }
    }

    async listarHabitos(token: string) {
        try {
            return await this.habitoDAO.listarHabitos(token);
        } catch (error) {
            throw error;
        }
    }

    async eliminarHabito(id: string, token: string) {
        try {
            await this.habitoDAO.eliminarHabito(id, token);
        } catch (error) {
            throw error;
        }
    }

    async registrarProgreso(habitId: string, registro: RegistroHabito, token: string) {
        try {
            // Validaciones
            if (!['success', 'fail'].includes(registro.estado)) {
                throw new Error('Estado inválido');
            }

            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            const resultado = await this.habitoDAO.registrarProgreso(habitId, registro, token);
            
            return resultado;
        } catch (error) {
            throw error;
        }
    }
}
