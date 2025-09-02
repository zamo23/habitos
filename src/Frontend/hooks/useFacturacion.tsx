import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { FacturacionControl } from '../../Backend/Controlador/FacturacionControl';

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
  descripcion: string;
  estado: string;
  fecha_pago: string;
  id: string;
  moneda: string;
  monto_centavos: number;
  plan: string;
}

export interface FacturacionData {
  historial_pagos: Pago[];
  plan: Plan;
  suscripcion: Suscripcion;
}

export function useFacturacion() {
  const { getToken } = useAuth();
  const [data, setData] = useState<FacturacionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFacturacion() {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) {
          throw new Error('No se pudo obtener el token de autenticación');
        }
        const facturacionData = await FacturacionControl.obtenerFacturacion(token);
        // Adaptar el DTO a la interfaz esperada
        const adaptedData: FacturacionData = {
          plan: facturacionData.plan,
          suscripcion: facturacionData.suscripcion,
          historial_pagos: facturacionData.historial_pagos.map((pago: any) => ({
            descripcion: pago.descripcion,
            estado: pago.estado,
            fecha_pago: pago.fecha_pago,
            id: pago.id,
            moneda: pago.moneda,
            monto_centavos: pago.monto_centavos,
            plan: pago.plan,
          })),
        };
        setData(adaptedData);
      } catch (err: any) {
        setError(err.message || 'Error al cargar facturación');
      } finally {
        setLoading(false);
      }
    }
    fetchFacturacion();
  }, [getToken]);

  return { data, loading, error };
}
