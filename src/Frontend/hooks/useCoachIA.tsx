import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export interface Consejo {
  id: string;
  tipo: "motivacion" | "mejora_habito" | "reto" | "celebracion" | "felicitacion" | "ruptura_racha";
  titulo: string;
  contenido: string;
  leido: boolean;
  generado_en: string;
}

export interface ConsejoDiarioResponse {
  success: boolean;
  data?: {
    consejos: Consejo[];
    total_consejos: number;
    fecha: string;
  };
  message?: string;
}

export interface InteraccionResponse {
  success: boolean;
  message: string;
}

export interface ActualizarConsejoResponse {
  success: boolean;
  data?: {
    consejos: Consejo[];
    total_consejos: number;
    fecha: string;
    actualizado: boolean;
  };
  message?: string;
}

type AccionInteraccion = "visto" | "archivado" | "seguido" | "ignorado";

export const useCoachIA = () => {
  const { getToken } = useAuth();
  const [consejos, setConsejos] = useState<Consejo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fecha, setFecha] = useState<string>("");

  const apiUrl = import.meta.env.VITE_API || "http://127.0.0.1:5000/api";

  useEffect(() => {
    fetchConsejoDiario();
  }, [getToken]);

  const fetchConsejoDiario = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();

      if (!token) {
        throw new Error("No se pudo obtener el token de autenticación");
      }

      const response = await fetch(`${apiUrl}/ia-coach/consejo-diario`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor, inicia sesión nuevamente.");
        }
        throw new Error("Error al obtener los consejos del día");
      }

      const result: ConsejoDiarioResponse = await response.json();

      if (result.success && result.data) {
        setConsejos(result.data.consejos);
        setFecha(result.data.fecha);
      } else {
        throw new Error(result.message || "Error desconocido al obtener consejos");
      }
    } catch (err) {
      const mensajeError =
        err instanceof Error ? err.message : "Error desconocido al obtener consejos";
      setError(mensajeError);
      console.error("Error en fetchConsejoDiario:", err);
    } finally {
      setLoading(false);
    }
  };

  const registrarInteraccion = async (
    idConsejo: string,
    accion: AccionInteraccion
  ): Promise<boolean> => {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error("No se pudo obtener el token de autenticación");
      }

      const response = await fetch(`${apiUrl}/ia-coach/interaccion`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_consejo: idConsejo,
          accion,
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Parámetros inválidos para registrar la interacción");
        }
        throw new Error("Error al registrar la interacción");
      }

      const result: InteraccionResponse = await response.json();

      if (result.success) {
        // Actualizar localmente el estado del consejo si es necesario
        if (accion === "visto") {
          setConsejos((prevConsejos) =>
            prevConsejos.map((c) =>
              c.id === idConsejo ? { ...c, leido: true } : c
            )
          );
        }
        return true;
      } else {
        throw new Error(result.message || "Error al registrar la interacción");
      }
    } catch (err) {
      console.error("Error en registrarInteraccion:", err);
      return false;
    }
  };

  const recargarConsejos = async () => {
    await fetchConsejoDiario();
  };

  const actualizarConsejos = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();

      if (!token) {
        throw new Error("No se pudo obtener el token de autenticación");
      }

      const response = await fetch(`${apiUrl}/ia-coach/actualizar-consejo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor, inicia sesión nuevamente.");
        } else if (response.status === 400) {
          throw new Error("Error de validación al actualizar los consejos");
        } else if (response.status === 500) {
          throw new Error("Error del servidor al generar los nuevos consejos");
        }
        throw new Error("Error al actualizar los consejos");
      }

      const result: ActualizarConsejoResponse = await response.json();

      if (result.success && result.data) {
        setConsejos(result.data.consejos);
        setFecha(result.data.fecha);
        return true;
      } else {
        throw new Error(result.message || "Error desconocido al actualizar consejos");
      }
    } catch (err) {
      const mensajeError =
        err instanceof Error ? err.message : "Error desconocido al actualizar consejos";
      setError(mensajeError);
      console.error("Error en actualizarConsejos:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    consejos,
    loading,
    error,
    fecha,
    registrarInteraccion,
    recargarConsejos,
    actualizarConsejos,
  };
};
