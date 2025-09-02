
export interface PlanDTO {
	codigo: string;
	max_habitos: number;
	moneda: string;
	nombre: string;
	permite_grupos: boolean;
	precio_centavos: number;
}

export interface SuscripcionDTO {
	ciclo: string;
	estado: string;
	id: string;
	periodo_fin: string | null;
	periodo_inicio: string | null;
}

export interface PagoDTO {
	// Define los campos según la estructura real de los pagos
	[key: string]: any;
}

export interface FacturacionDTO {
	historial_pagos: PagoDTO[];
	plan: PlanDTO;
	suscripcion: SuscripcionDTO;
}
