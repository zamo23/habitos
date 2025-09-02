import { HabitoDetallesDAO } from '../Dao/HabitoDetallesDAO';
import { HabitoDetallesDTO } from '../Dto/HabitoDetallesDTO';

export class HabitoDetallesControl {
    private habitoDetallesDAO: HabitoDetallesDAO;

    constructor() {
        this.habitoDetallesDAO = new HabitoDetallesDAO();
    }

    async obtenerDetalles(habitId: string, token: string): Promise<HabitoDetallesDTO> {
        try {
            if (!token) {
                throw new Error('Token de autenticación requerido');
            }

            if (!habitId) {
                throw new Error('ID del hábito requerido');
            }

            return await this.habitoDetallesDAO.obtenerDetalles(habitId, token);
        } catch (error) {
            throw error;
        }
    }
}

