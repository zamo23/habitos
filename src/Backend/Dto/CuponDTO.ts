export interface PlanCuponDTO {
    id: number;
    nombre: string;
    codigo: string;
}

export interface CuponVerificacionResponse {
    valido: boolean;
    id: string;
    tipo_descuento: 'porcentaje';
    valor: number;
    es_gratis: boolean;
    precio_original: number;
    precio_final: number;
    flujo_sugerido: 'pago' | 'gratis';
    plan: PlanCuponDTO;
}

export type CicloSuscripcion = 'mensual' | 'anual';

export interface VerificacionCuponRequest {
    codigo: string;
    ciclo: CicloSuscripcion;
    id_plan: number | string;
}

export interface RedimirCuponRequest {
    codigo: string;
    ciclo: CicloSuscripcion;
    id_plan: number | string;
}
