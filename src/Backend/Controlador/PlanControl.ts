import { PlanModelo } from '../Modelo/PlanModelo';
import { SuscripcionDTO } from '../Dto/PlanDTO';
import { PlanListDTO } from '../Dto/PlanListDTO';

export class PlanControl {
    private planModelo: PlanModelo;

    constructor() {
        this.planModelo = new PlanModelo();
    }

    async obtenerPlanes(token: string | null, moneda: string = 'PEN'): Promise<PlanListDTO[]> {
        try {
            return await this.planModelo.obtenerPlanes(token, moneda);
        } catch (error) {
            throw error;
        }
    }

    async obtenerSuscripcionActual(token: string | null): Promise<SuscripcionDTO> {
        try {
            return await this.planModelo.obtenerSuscripcionActual(token);
        } catch (error) {
            throw error;
        }
    }

    esPlanPremium(suscripcion: SuscripcionDTO): boolean {
        return this.planModelo.esPlanPremium(suscripcion);
    }

    obtenerMaximoHabitos(suscripcion: SuscripcionDTO): number {
        return this.planModelo.obtenerMaximoHabitos(suscripcion);
    }

    permiteGrupos(suscripcion: SuscripcionDTO): boolean {
        return this.planModelo.permiteGrupos(suscripcion);
    }

    obtenerMensajeVerificacionManual(error: any): string {
        return this.planModelo.obtenerMensajeVerificacionManual(error);
    }
}

