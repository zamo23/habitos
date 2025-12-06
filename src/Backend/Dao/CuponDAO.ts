import { CuponVerificacionResponse, RedimirCuponRequest, VerificacionCuponRequest } from "../Dto/CuponDTO";

export class CuponDAO {
    private baseUrl: string = import.meta.env.VITE_API;

    async verificarCupon(
        token: string | null,
        datos: VerificacionCuponRequest
    ): Promise<CuponVerificacionResponse> {
        if (!token) {
            throw new Error('Token de autenticación requerido');
        }

        try {
            const url = `${this.baseUrl}/cupones/verificar`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al verificar el cupón');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en CuponDAO.verificarCupon:', error);
            throw error;
        }
    }

    async redimirCupon(
        token: string | null,
        datos: RedimirCuponRequest
    ): Promise<void> {
        if (!token) {
            throw new Error('Token de autenticación requerido');
        }

        try {
            const response = await fetch(`${this.baseUrl}/cupones/redimir`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al redimir el cupón');
            }
        } catch (error) {
            console.error('Error en CuponDAO.redimirCupon:', error);
            throw error;
        }
    }
}
