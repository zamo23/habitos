import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useHabits } from '../../layouts/state/HabitsContext';
import { GrupoControl } from '../../../Backend/Controlador/GrupoControl';
import { HabitoControl } from '../../../Backend/Controlador/HabitoControl';
import { GrupoRespuestaDTO, MiembroGrupoDTO } from '../../../Backend/Dto/GrupoDTO';
import { HabitoRespuestaDTO } from '../../../Backend/Dto/HabitoDTO';
import GrupoMiembrosManager from '../../components/grupos/GrupoMiembrosManager';
import { Users, Settings, CalendarClock, Edit, Trash2, PlusCircle, Loader2, ArrowLeft } from 'lucide-react';

interface TabProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const Tab: React.FC<TabProps> = ({ active, onClick, icon, label }) => (
  <div 
    className={`flex-1 px-4 py-3 cursor-pointer border-b-2 flex items-center justify-center gap-1.5
      ${active ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </div>
);

const GrupoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken, userId } = useAuth();
  const { refetchHabits } = useHabits();
  const grupoControl = new GrupoControl();
  const habitoControl = new HabitoControl();

  const [grupo, setGrupo] = useState<GrupoRespuestaDTO | null>(null);
  const [habitos, setHabitos] = useState<HabitoRespuestaDTO[]>([]);
  const [miembros, setMiembros] = useState<MiembroGrupoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'habitos' | 'miembros' | 'configuracion'>('habitos');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const cargarGrupo = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const authToken = await getToken();
        if (!authToken) {
          setError('No hay token de autenticación. Por favor, inicia sesión.');
          setIsLoading(false);
          return;
        }

        // Cargar información del grupo
        const grupoData = await grupoControl.obtenerGrupo(id, authToken);
        setGrupo(grupoData);

        // Cargar hábitos del grupo
        const habitosGrupales = await habitoControl.obtenerHabitosGrupales(id, authToken);
        setHabitos(habitosGrupales);

        // Cargar miembros del grupo
        const miembrosGrupo = await grupoControl.obtenerMiembrosGrupo(id, authToken);
        setMiembros(miembrosGrupo);

        // Determinar el rol del usuario actual
        const userMember = miembrosGrupo.find(m => m.id_usuario === userId);
        if (userMember) {
          setUserRole(userMember.rol);
        }
      } catch (error) {
        console.error('Error al cargar datos del grupo:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar el grupo');
      } finally {
        setIsLoading(false);
      }
    };

    cargarGrupo();
  }, [id, getToken, userId, grupoControl, habitoControl]);

  const handleDeleteGroup = async () => {
    if (!id || !confirm('¿Estás seguro de que deseas eliminar este grupo? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const authToken = await getToken();
      if (!authToken) {
        throw new Error('No hay token de autenticación. Por favor, inicia sesión.');
      }

      await grupoControl.eliminarGrupo(id, authToken);
      // Recargar los hábitos para eliminar los hábitos del grupo eliminado
      await refetchHabits();
      navigate('/dashboard/grupal');
    } catch (error) {
      console.error('Error al eliminar el grupo:', error);
      setError(error instanceof Error ? error.message : 'Error al eliminar el grupo');
      setIsDeleting(false);
    }
  };

  const handleNuevoHabito = () => {
    // Aquí iría la lógica para abrir un modal o navegar a una página para crear un nuevo hábito grupal
    // Por ejemplo: navigate(`/crear-habito-grupal/${id}`);
  };

  // Actualiza la lista de miembros después de invitar/eliminar
  const handleMembersChanged = async () => {
    if (!id) return;

    try {
      const authToken = await getToken();
      if (!authToken) return;

      const miembrosGrupo = await grupoControl.obtenerMiembrosGrupo(id, authToken);
      setMiembros(miembrosGrupo);
    } catch (error) {
      console.error('Error al actualizar miembros:', error);
    }
  };

  const canManageGroup = userRole === 'admin' || userRole === 'owner';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-gray-500">Cargando información del grupo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg m-4">
        <h2 className="text-lg font-medium text-red-700">Error</h2>
        <p className="text-red-600 mt-1">{error}</p>
        <button 
          onClick={() => navigate('/dashboard/grupal')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
        >
          Volver a mis grupos
        </button>
      </div>
    );
  }

  if (!grupo) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg m-4">
        <h2 className="text-lg font-medium text-yellow-700">Grupo no encontrado</h2>
        <p className="text-yellow-600 mt-1">No se ha podido encontrar el grupo solicitado.</p>
        <button 
          onClick={() => navigate('/dashboard/grupal')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none"
        >
          Volver a mis grupos
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with back button */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/dashboard/grupal')}
          className="flex items-center text-gray-600 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Volver a mis grupos</span>
        </button>
      </div>
      
      {/* Grupo Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{grupo.nombre}</h1>
            {grupo.descripcion && (
              <p className="mt-1 text-gray-600">{grupo.descripcion}</p>
            )}
            <div className="mt-2 text-sm text-gray-500">
              <span>Creado el {new Date(grupo.fecha_creacion).toLocaleDateString()}</span>
              <span className="ml-4">{miembros.length} miembros</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-4 md:mt-0 space-x-2 flex">
            {canManageGroup && (
              <>
                <button
                  onClick={handleNuevoHabito}
                  className="px-3 py-2 bg-primary text-white rounded-md flex items-center gap-1 hover:bg-primary-dark"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Nuevo Hábito</span>
                </button>
                
                {userRole === 'owner' && (
                  <button
                    onClick={handleDeleteGroup}
                    disabled={isDeleting}
                    className="px-3 py-2 bg-red-600 text-white rounded-md flex items-center gap-1 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span>Eliminar Grupo</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <Tab 
            active={activeTab === 'habitos'} 
            onClick={() => setActiveTab('habitos')}
            icon={<CalendarClock className="h-5 w-5" />}
            label="Hábitos"
          />
          <Tab 
            active={activeTab === 'miembros'} 
            onClick={() => setActiveTab('miembros')}
            icon={<Users className="h-5 w-5" />}
            label="Miembros"
          />
          {canManageGroup && (
            <Tab 
              active={activeTab === 'configuracion'} 
              onClick={() => setActiveTab('configuracion')}
              icon={<Settings className="h-5 w-5" />}
              label="Configuración"
            />
          )}
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'habitos' && (
            <div>
              {habitos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay hábitos grupales aún.</p>
                  {canManageGroup && (
                    <button
                      onClick={handleNuevoHabito}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-md inline-flex items-center gap-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Crear primer hábito</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {habitos.map(habito => (
                    <div key={habito.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-medium text-gray-900">{habito.titulo}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Tipo: {habito.tipo === 'hacer' ? 'Hacer' : 'Dejar de hacer'}
                      </p>
                      <div className="mt-4 flex justify-between">
                        <button 
                          onClick={() => navigate(`/dashboard/grupal/habit/${habito.id}`)}
                          className="text-sm text-primary hover:text-primary-dark"
                        >
                          Ver detalles
                        </button>
                        <button className="text-primary hover:text-primary-dark">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'miembros' && (
            <GrupoMiembrosManager 
              grupoId={id || ''} 
              onMembersChanged={handleMembersChanged}
            />
          )}
          
          {activeTab === 'configuracion' && canManageGroup && (
            <div>
              <h3 className="text-lg font-medium">Configuración del grupo</h3>
              <form className="mt-4 space-y-4">
                <div>
                  <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">Nombre del grupo</label>
                  <input 
                    type="text" 
                    id="groupName" 
                    defaultValue={grupo.nombre}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="groupDesc" className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea 
                    id="groupDesc" 
                    defaultValue={grupo.descripcion || ''}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none"
                  >
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrupoDetalle;
