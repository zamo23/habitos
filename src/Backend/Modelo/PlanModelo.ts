import { SuscripcionDTO } from '../Dto/PlanDTO';
import { PlanListDTO } from '../Dto/PlanListDTO';
import { PlanDAO } from '../Dao/PlanDAO';

export class PlanModelo {
    private planDAO: PlanDAO;

    constructor() {
        this.planDAO = new PlanDAO();
    }

    async obtenerPlanes(token: string | null, moneda: string = 'PEN'): Promise<PlanListDTO[]> {
        try {
            return await this.planDAO.obtenerPlanes(token, moneda);
        } catch (error) {
            console.error('Error en PlanModelo.obtenerPlanes:', error);
            throw error;
        }
    }

    async obtenerSuscripcionActual(token: string | null): Promise<SuscripcionDTO> {
        try {
            return await this.planDAO.obtenerSuscripcionActual(token);
        } catch (error) {
            console.error('Error en PlanModelo.obtenerSuscripcionActual:', error);
            throw error;
        }
    }

    esPlanPremium(suscripcion: SuscripcionDTO): boolean {
        return suscripcion.plan.codigo === 'premium';
    }

    obtenerMaximoHabitos(suscripcion: SuscripcionDTO): number {
        return suscripcion.plan.max_habitos;
    }

    permiteGrupos(suscripcion: SuscripcionDTO): boolean {
        return suscripcion.plan.permite_grupos;
    }

    obtenerMensajeVerificacionManual(error: any): string {
        const mensajeBase = "Si crees que esto es un error, por favor envía una captura de tu pago por WhatsApp al +51 933826740 para verificación manual.";
        
        if (error?.response?.data?.debug?.pagos_encontrados === 0) {
            return `No pudimos encontrar tu pago con los datos proporcionados. ${mensajeBase}`;
        }
        
        if (error?.response?.data?.pago_realizado && error?.response?.data?.precio_plan) {
            return `Detectamos una diferencia en el monto del pago. ${mensajeBase}`;
        }

        return `Hubo un problema al verificar tu pago. ${mensajeBase}`;
    }
}
