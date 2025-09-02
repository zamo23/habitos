import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { PlanControl } from '../../../Backend/Controlador/PlanControl';

interface Plan {
  id: string;
  codigo: string;
  nombre: string;
  precio_centavos: number;
  moneda: string;
  max_habitos: number;
  permite_grupos: boolean;
}

interface Subscription {
  id: string;
  plan: Plan;
  estado: string;
  ciclo: string;
  es_actual: boolean;
  periodo_inicio: string;
  periodo_fin: string;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getToken = auth.getToken;

  // Don't try to use any auth methods until it's loaded
  if (!auth.isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }
  
  if (!auth.isLoaded) {
    return null;
  }

  // Función para obtener datos del caché
  const planControl = new PlanControl();

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const data = await planControl.obtenerSuscripcionActual(token);

      setSubscription(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    fetchSubscription();
  }, []);

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      isLoading,
      error,
      refetch: fetchSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
