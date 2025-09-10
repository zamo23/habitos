import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { GrupoControl } from '../../../Backend/Controlador/GrupoControl';
import { GrupoRespuestaDTO } from '../../../Backend/Dto/GrupoDTO';
import { Users, Plus, Loader2, UserPlus } from 'lucide-react';

interface MisGruposProps {
  onCreateGroup?: () => void;
}

const MisGrupos: React.FC<MisGruposProps> = ({ onCreateGroup }) => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const grupoControl = new GrupoControl();
  
  const [grupos, setGrupos] = useState<GrupoRespuestaDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user's groups
  useEffect(() => {
    const cargarGrupos = async () => {
      try {
        setIsLoading(true);
        const authToken = await getToken();
        if (!authToken) {
          setError('No hay token de autenticación. Por favor, inicia sesión.');
          setIsLoading(false);
          return;
        }

        const data = await grupoControl.obtenerGrupos(authToken);
        setGrupos(data);
      } catch (error) {
        console.error('Error al cargar grupos:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar los grupos');
      } finally {
        setIsLoading(false);
      }
    };

    cargarGrupos();
  }, [getToken, grupoControl]);

  const handleViewGroup = (id: string) => {
    navigate(`/dashboard/grupal/${id}`);
  };

  const handleCreateGroup = () => {
    if (onCreateGroup) {
      onCreateGroup();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-gray-500">Cargando tus grupos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Mis Grupos
        </h2>
        <button
          onClick={handleCreateGroup}
          className="px-3 py-2 bg-primary text-white rounded-md flex items-center gap-1 hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          <span>Crear Grupo</span>
        </button>
      </div>

      {grupos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary-light">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes grupos aún</h3>
          <p className="text-sm text-gray-500 mb-6">
            Crea tu primer grupo para comenzar a compartir hábitos con otros.
          </p>
          <button
            onClick={handleCreateGroup}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Crear mi primer grupo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grupos.map((grupo) => (
            <div
              key={grupo.id}
              onClick={() => handleViewGroup(grupo.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="font-medium text-lg text-gray-900">{grupo.nombre}</h3>
              {grupo.descripcion && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{grupo.descripcion}</p>
              )}
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Creado el {new Date(grupo.fecha_creacion).toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewGroup(grupo.id);
                  }}
                  className="text-primary text-sm hover:underline"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisGrupos;
