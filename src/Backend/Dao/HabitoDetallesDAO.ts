import { HabitoDetallesDTO } from "../Dto/HabitoDetallesDTO";


export class HabitoDetallesDAO {
    private apiUrl: string;

    constructor() {
        const apiUrl = import.meta.env.VITE_API;
        if (!apiUrl) {
            console.error('❌ Error: VITE_API no está configurado en el archivo .env');
            throw new Error('Configuración de API no válida');
        }
        this.apiUrl = apiUrl;
    }

    async obtenerDetalles(habitId: string, token: string): Promise<HabitoDetallesDTO> {
        if (!habitId) {
            throw new Error('ID del hábito es requerido');
        }

        if (!token) {
            throw new Error('Token de autenticación es requerido');
        }

        try {
            const url = `${this.apiUrl}/habits/${habitId}/details`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Error al obtener los detalles del hábito');
            }

            const data = await response.json();

            return data as HabitoDetallesDTO;
        } catch (error) {
            throw error;
        }
    }
}
