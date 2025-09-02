// src/Frontend/layouts/state/HabitsContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { HabitoControl } from "../../../Backend/Controlador/HabitoControl";
import { useSubscription } from "./SubscriptionContext";

export type HabitType = "hacer" | "dejar";

interface RegistroHoy {
  completado: boolean;
  estado: 'exito' | 'fallo';
  comentario?: string;
  puede_registrar: boolean;
  fecha_local_usuario: string;
}

interface Grupo {
  id: string;
  nombre: string;
}

export interface Activity {
  id: string;
  habitoId: string;
  habitoNombre: string;
  nombre: string;
  fecha: string;
  completado: boolean;
  comentario?: string;
}

export interface Habit {
  streak: number;
  id: string;
  titulo: string;
  tipo: HabitType;
  archivado: boolean;
  es_grupal: boolean;
  rachas?: {
    actual: number;
    mejor: number;
  };
  registro_hoy?: RegistroHoy;
  grupo?: Grupo;
}

type Ctx = {
  habits: Habit[];
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  addHabit: (titulo: string, tipo: HabitType) => Promise<{ ok: boolean; reason?: "limit" }>;
  removeHabit: (id: string) => Promise<void>;
  markDone: (id: string, comentario?: string) => Promise<void>;
  markFail: (id: string, comentario?: string) => Promise<void>;
  refetchHabits: () => Promise<void>;
};

const HabitsContext = createContext<Ctx | null>(null);
export const useHabits = () => {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within HabitsProvider");
  return ctx;
};

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getToken } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const habitoControl = new HabitoControl();
  useSubscription();

  useEffect(() => {
    refetchHabits();
  }, []);

  const refetchHabits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) throw new Error('No hay token de autenticación');
      
      const habitosData = await habitoControl.listarHabitos(token);
      setHabits(
        habitosData.map(h => ({
          ...h,
          streak: h.rachas?.actual ?? 0 // or provide another logic for streak
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los hábitos');
    } finally {
      setIsLoading(false);
    }
  };

  const addHabit: Ctx["addHabit"] = async (titulo, tipo) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
      }
      
      await habitoControl.crearHabito({ titulo, tipo }, token);
      await refetchHabits();
      
      return { ok: true };
    } catch (error) {
      throw error;
    }
  };

  const removeHabit: Ctx["removeHabit"] = async (id) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No hay token de autenticación');

      await habitoControl.eliminarHabito(id, token);
      await refetchHabits();
    } catch (error) {
      throw error;
    }
  };

  const markDone: Ctx["markDone"] = async (id, comentario) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No hay token de autenticación');

      const registro = {
        estado: 'success' as const,
        comentario
      };

      await habitoControl.registrarProgreso(id, registro, token);
      await refetchHabits();
    } catch (error) {
      throw error;
    }
  };

  const markFail: Ctx["markFail"] = async (id, comentario) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No hay token de autenticación');

      const registro = {
        estado: 'fail' as const,
        comentario
      };

      await habitoControl.registrarProgreso(id, registro, token);
      await refetchHabits();
    } catch (error) {
      throw error;
    }
  };

  return (
    <HabitsContext.Provider
      value={{ 
        habits,
        activities,
        isLoading, 
        error, 
        addHabit, 
        removeHabit, 
        markDone, 
        markFail, 
        refetchHabits
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};
