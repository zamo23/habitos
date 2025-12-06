import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

interface Day {
  date: string;
  day_of_week: number;
  value: string;
}

interface Week {
  days: Day[];
  week_index: number;
}

interface Estadisticas {
  dias_con_actividad: number;
  mejor_dia: string;
  porcentaje_actividad: number;
  promedio_diario: string;
  total_dias: number;
  total_exitos: string;
}

interface ActivityHeatmapData {
  estadisticas: Estadisticas;
  heatmap: Week[];
  periodo_semanas: number;
  rango_fechas: {
    inicio: string;
    fin: string;
  };
}

export const useActivityHeatmap = () => {
  const { getToken } = useAuth();
  const [data, setData] = useState<ActivityHeatmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const apiUrl = import.meta.env.VITE_API || "http://127.0.0.1:5000/api/v1";
        
        const response = await fetch(`${apiUrl}/users/me/activity-heatmap`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar el mapa de actividad");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, [getToken]);

  return { data, loading, error };
};
