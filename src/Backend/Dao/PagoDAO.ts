
export interface VerificacionPagoRequest {
    primer_nombre: string;
    primer_apellido: string;
    id_plan: string;
    codigo_seguridad?: string;
    codigo_cupon?: string;
    periodo: 'monthly' | 'annual';
}

export interface PlanPagoResponse {
    id: number;
    codigo: string;
    nombre: string;
    precio_centavos: number;
}

export interface VerificacionPagoResponse {
    aprobado: boolean;
    id_pago?: string;
    id_historial?: string;
    remitente?: string;
    monto?: string;
    fecha_hora?: string;
    fecha_aplicacion?: string;
    plan?: PlanPagoResponse;
    error?: string;
    debug?: {
        nombre_buscado?: string;
        apellido_buscado?: string;
        codigo_seguridad?: string;
        pagos_encontrados?: number;
    };
    codigo?: string;
    pago_realizado?: string;
    precio_plan?: string;
}

export class PagoDAO {
    private baseUrl: string = import.meta.env.VITE_API;

    async verificarPago(
        token: string | null,
        datos: VerificacionPagoRequest
    ): Promise<VerificacionPagoResponse> {
        if (!token) {
            throw new Error('Token de autenticación requerido');
        }
        try {
            const response = await fetch(`${this.baseUrl}/pagos/verificar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datos)
            });

            const data = await response.json();

            if (!response.ok) {
                // Construir respuesta de error con todos los detalles disponibles
                return {
                    aprobado: false,
                    error: data.error || 'Error en la verificación del pago',
                    debug: data.debug || null,
                    codigo: data.codigo || null,
                    pago_realizado: data.pago_realizado,
                    precio_plan: data.precio_plan
                };
            }

            // La respuesta ya viene en el formato correcto
            return data;
        } catch (error) {
            console.error('Error en PagoDAO.verificarPago:', error);
            throw error;
        }
    }
}
