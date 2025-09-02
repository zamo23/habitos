
// Asegurarnos de que se use la URL correcta de la API
const API_URL = import.meta.env.VITE_API;

export interface Plan {
	codigo: string;
	max_habitos: number;
	moneda: string;
	nombre: string;
	permite_grupos: boolean;
	precio_centavos: number;
}

export interface Suscripcion {
	ciclo: string;
	estado: string;
	id: string;
	periodo_fin: string | null;
	periodo_inicio: string | null;
}

export interface Pago {
	// Define los campos según la estructura real de los pagos
	[key: string]: any;
}

export interface FacturacionResponse {
	historial_pagos: Pago[];
	plan: Plan;
	suscripcion: Suscripcion;
}

export class FacturacionDAO {
    private apiUrl: string;

    constructor() {
        this.apiUrl = API_URL.replace(/\/$/, '');
        console.log('API URL:', this.apiUrl); 
    }

    async obtenerFacturacionActual(token: string): Promise<FacturacionResponse> {
        try {
            if (!token) {
                throw new Error('No se proporcionó token de autenticación');
            }

            console.log('Realizando petición a:', `${this.apiUrl}/suscripcion/actual`); // Para depuración
            const response = await fetch(`${this.apiUrl}/suscripcion/actual`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener la información de facturación');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}
