
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
            console.log('Datos enviados a la API:', {
                url: `${this.baseUrl}/pagos/verificar`,
                token: token ? `${token.substring(0, 10)}...` : 'No token',
                datos: {
                    ...datos,
                    id_plan: datos.id_plan,
                    primer_nombre: datos.primer_nombre,
                    primer_apellido: datos.primer_apellido,
                    codigo_seguridad: datos.codigo_seguridad || 'No proporcionado'
                }
            });

            const response = await fetch(`${this.baseUrl}/pagos/verificar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datos)
            });

            const data = await response.json();
            
            // Log completo de la respuesta HTTP
            console.group('=== Respuesta Detallada de la API ===');
            
            // 1. Información básica de la respuesta
            console.log('Información de la respuesta:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                url: response.url
            });

            // 2. Headers de la respuesta
            console.log('Headers:', Object.fromEntries(response.headers.entries()));

            // 3. Cuerpo de la respuesta detallado
            console.group('Datos de la respuesta:');
            if (data) {
                // Estado de aprobación
                console.log('Estado:', {
                    aprobado: data.aprobado,
                    error: data.error || 'Sin error'
                });

                // Información del pago
                if (data.id_pago) {
                    console.log('Información del pago:', {
                        id_pago: data.id_pago,
                        id_historial: data.id_historial,
                        remitente: data.remitente,
                        monto: data.monto,
                        fecha_hora: data.fecha_hora,
                        fecha_aplicacion: data.fecha_aplicacion
                    });
                }

                // Información del plan
                if (data.plan) {
                    console.log('Información del plan:', {
                        id: data.plan.id,
                        codigo: data.plan.codigo,
                        nombre: data.plan.nombre,
                        precio_centavos: data.plan.precio_centavos
                    });
                }

                // Información adicional o de debug
                if (data.debug) {
                    console.log('Información de debug:', data.debug);
                }

                // Cualquier otra información
                console.log('Datos adicionales:', Object.keys(data)
                    .filter(key => !['aprobado', 'error', 'id_pago', 'id_historial', 'remitente', 
                                   'monto', 'fecha_hora', 'fecha_aplicacion', 'plan', 'debug'].includes(key))
                    .reduce((obj, key) => ({ ...obj, [key]: data[key] }), {}));
            }
            console.groupEnd();
            console.groupEnd();

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
