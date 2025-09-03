import { CuponDAO } from '../Dao/CuponDAO';
import { CuponVerificacionResponse, VerificacionCuponRequest, RedimirCuponRequest } from '../Dto/CuponDTO';

export class CuponControl {
    private cuponDAO: CuponDAO;

    constructor() {
        this.cuponDAO = new CuponDAO();
    }

    async verificarCupon(
        token: string | null,
        datos: VerificacionCuponRequest
    ): Promise<CuponVerificacionResponse> {
        try {
            return await this.cuponDAO.verificarCupon(token, datos);
        } catch (error) {
            console.error('Error en CuponControl.verificarCupon:', error);
            throw error;
        }
    }

    async redimirCupon(
        token: string | null,
        datos: RedimirCuponRequest
    ): Promise<void> {
        try {
            await this.cuponDAO.redimirCupon(token, datos);
        } catch (error) {
            console.error('Error en CuponControl.redimirCupon:', error);
            throw error;
        }
    }
}
