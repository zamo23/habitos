import { PagoDAO, VerificacionPagoRequest, VerificacionPagoResponse } from '../Dao/PagoDAO';

export class PagoControl {
    private pagoDAO: PagoDAO;

    constructor() {
        this.pagoDAO = new PagoDAO();
    }

    async verificarPago(
        token: string | null,
        datos: VerificacionPagoRequest
    ): Promise<VerificacionPagoResponse> {
        try {
            return await this.pagoDAO.verificarPago(token, datos);
        } catch (error) {
            console.error('Error en PagoControl.verificarPago:', error);
            throw error;
        }
    }
}
