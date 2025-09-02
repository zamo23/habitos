import { AjustesDAO } from '../Dao/AjustesDAO';
import { DetectTimezoneResponse, TimezoneDTO, UsuarioAjustesDTO } from '../Dto/AjustesDTO';
import { TimezoneModel } from '../Modelo/AjustesModelo';

export class AjustesControl {
    private ajustesDAO: AjustesDAO;

    constructor() {
        this.ajustesDAO = new AjustesDAO();
    }

    async obtenerZonasHorarias(token: string): Promise<TimezoneDTO[]> {
        try {
            const zonas = await this.ajustesDAO.obtenerZonasHorarias(token);
            return zonas;
        } catch (error) {
            throw error;
        }
    }

    async detectarZonaHoraria(offsetMinutos: number): Promise<DetectTimezoneResponse> {
        try {
            if (!Number.isInteger(offsetMinutos)) {
                throw new Error('El offset debe ser un número entero de minutos');
            }

            const zonaHorariaSugerida = TimezoneModel.detectTimezone(offsetMinutos);
            return {
                suggested_timezone: zonaHorariaSugerida,
                offset_minutes: offsetMinutos
            };
        } catch (error) {
            throw error;
        }
    }

    async obtenerHoraLocal(token: string): Promise<string> {
        try {
            return await this.ajustesDAO.obtenerHoraLocal(token);
        } catch (error) {
            throw error;
        }
    }

    async obtenerAjustesUsuario(token: string): Promise<UsuarioAjustesDTO> {
        try {
            const ajustes = await this.ajustesDAO.obtenerAjustesUsuario(token);
            return ajustes;
        } catch (error) {
            throw error;
        }
    }

    async actualizarAjustesUsuario(
        token: string,
        ajustes: Partial<Pick<UsuarioAjustesDTO, 'zona_horaria' | 'idioma' | 'cierre_dia_hora'>>
    ): Promise<UsuarioAjustesDTO> {
        try {
            // Validaciones
            if (ajustes.zona_horaria && !TimezoneModel.isValidTimezone(ajustes.zona_horaria)) {
                throw new Error('Zona horaria no válida');
            }

            if (ajustes.idioma && !['es', 'en'].includes(ajustes.idioma)) {
                throw new Error('Idioma no soportado');
            }

            if (ajustes.cierre_dia_hora !== undefined) {
                if (ajustes.cierre_dia_hora < 0 || ajustes.cierre_dia_hora > 23) {
                    throw new Error('La hora de cierre debe estar entre 0 y 23');
                }
            }

            return await this.ajustesDAO.actualizarAjustesUsuario(token, ajustes);
        } catch (error) {
            throw error;
        }
    }
}
