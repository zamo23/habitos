
import { FacturacionDAO } from '../Dao/FacturacionDAO';
import { FacturacionDTO } from '../Dto/FacturacionDTO';

export class FacturacionControl {
  private static dao: FacturacionDAO = new FacturacionDAO();

  static async obtenerFacturacion(token: string): Promise<FacturacionDTO> {
    return await this.dao.obtenerFacturacionActual(token);
  }
};