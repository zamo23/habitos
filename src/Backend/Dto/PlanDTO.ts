export interface PlanDTO {
    id: string;
    codigo: string;
    nombre: string;
    precio_centavos: number;
    moneda: string;
    max_habitos: number;
    permite_grupos: boolean;
}

export interface SuscripcionDTO {
    id: string;
    plan: PlanDTO;
    estado: string;
    ciclo: string;
    es_actual: boolean;
    periodo_inicio: string;
    periodo_fin: string;
}
