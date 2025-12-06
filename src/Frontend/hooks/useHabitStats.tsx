import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export interface Estadisticas {
  tasa_exito: number;
  total_exitos: number;
  total_fallos: number;
  total_registros: number;
}

export interface Racha {
  actual: number;
  mejor: number;
}

export interface RegistroReciente {
  id: string;
  estado: "exito" | "fallo";
  fecha: string;
  comentario?: string;
}

export interface Grupo {
  id: string;
  nombre: string;
}

export interface Habito {
  id: string;
  titulo: string;
  tipo: "hacer" | "dejar";
  archivado: boolean;
  es_grupal: boolean;
  estadisticas: Estadisticas;
  rachas: Racha;
  registros_recientes: RegistroReciente[];
  grupo?: Grupo;
}

export interface ResumenGeneral {
  total_habitos: number;
  habitos_activos_con_racha: number;
  estadisticas: {
    total_registros: number;
    total_exitos: number;
    total_fallos: number;
    tasa_exito_promedio: number;
  };
}

export interface HabitStatsResponse {
  habitos: Habito[];
  resumen_general: ResumenGeneral;
}

export interface HabitoDetalleResponse extends Habito {}

export const useHabitStats = () => {
  const { getToken } = useAuth();
  const [data, setData] = useState<HabitStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHabitStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await getToken();
        const apiUrl =
          import.meta.env.VITE_API || "http://127.0.0.1:5000/api/v1";

        const response = await fetch(`${apiUrl}/habits/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al cargar estadísticas de hábitos");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchHabitStats();
  }, [getToken]);

  const getHabitoDetail = async (habitoId: string): Promise<HabitoDetalleResponse | null> => {
    try {
      const token = await getToken();
      const apiUrl =
        import.meta.env.VITE_API || "http://127.0.0.1:5000/api/v1";

      const response = await fetch(`${apiUrl}/habits/${habitoId}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar detalles del hábito");
      }

      return await response.json();
    } catch (err) {
      console.error("Error fetching habit detail:", err);
      return null;
    }
  };

  return { data, loading, error, getHabitoDetail };
};
