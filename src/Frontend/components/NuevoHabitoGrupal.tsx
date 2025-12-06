import React from 'react';
import { Loader2, Users, PlusCircle, Mail, ArrowLeft, ArrowRight, Check, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useHabits } from '../layouts/state/HabitsContext';
import { GrupoControl } from '../../Backend/Controlador/GrupoControl';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

interface NuevoHabitoGrupalProps {
  onSuccess: () => void;
}

const NuevoHabitoGrupal: React.FC<NuevoHabitoGrupalProps> = ({
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<'crear-grupo' | 'crear-habito' | 'invitar-usuarios'>('crear-grupo');
  const [titulo, setTitulo] = React.useState('');
  const [tipo, setTipo] = React.useState<'hacer' | 'dejar'>('hacer');
  const [nombreGrupo, setNombreGrupo] = React.useState('');
  const [descripcionGrupo, setDescripcionGrupo] = React.useState('');
  const [correoInvitado, setCorreoInvitado] = React.useState('');
  const [rolInvitado, setRolInvitado] = React.useState<'miembro' | 'administrador'>('miembro');
  const [modoLote, setModoLote] = React.useState(false);
  const [correosLote, setCorreosLote] = React.useState<string>('');
  const [grupoSeleccionado, setGrupoSeleccionado] = React.useState('');
  const [grupoActual, setGrupoActual] = React.useState<{ id: string; nombre: string; descripcion?: string; soy_rol?: string } | null>(null);
  const [, setHabitoCreado] = React.useState(false);
  const [grupos, setGrupos] = React.useState<{ id: string; nombre: string; descripcion?: string; soy_rol: string }[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingGrupos, setLoadingGrupos] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [invitaciones, setInvitaciones] = React.useState<string[]>([]);
  
  // Estados para edición y eliminación de grupos
  const [grupoEditar, setGrupoEditar] = React.useState<{ id: string; nombre: string; descripcion?: string; soy_rol?: string } | null>(null);
  const [grupoEliminar, setGrupoEliminar] = React.useState<{ id: string; nombre: string; descripcion?: string; soy_rol?: string } | null>(null);
  const [nuevoNombreGrupo, setNuevoNombreGrupo] = React.useState('');
  const [nuevaDescripcionGrupo, setNuevaDescripcionGrupo] = React.useState('');
  
  const { addGroupHabit, refetchHabits } = useHabits();
  const { getToken } = useAuth();
  const grupoControl = new GrupoControl();

  // Función para cargar grupos bajo demanda
  const cargarGrupos = async () => {
    try {
      setLoadingGrupos(true);
      setError(null);
      
      const token = await getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
  const gruposData = await grupoControl.obtenerGrupos(token);
  setGrupos(gruposData.map(g => ({ id: g.id, nombre: g.nombre, descripcion: g.descripcion, soy_rol: g.soy_rol })));
    } catch (error) {
      console.error('Error al cargar grupos:', error);
      setError('Error al cargar grupos');
    } finally {
      setLoadingGrupos(false);
    }
  };

  const handleCrearGrupo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      if (!nombreGrupo.trim()) {
        throw new Error('El nombre del grupo es obligatorio');
      }
      
      const grupo = await grupoControl.crearGrupo({
        nombre: nombreGrupo,
        descripcion: descripcionGrupo || undefined
      }, token);
      
      setGrupos(prev => [...prev, { id: grupo.id, nombre: grupo.nombre, descripcion: grupo.descripcion, soy_rol: 'propietario' }]);
      setGrupoSeleccionado(grupo.id);
      setGrupoActual({ id: grupo.id, nombre: grupo.nombre, descripcion: grupo.descripcion, soy_rol: 'propietario' });
      setNombreGrupo('');
      setDescripcionGrupo('');
      
      // Avanzar al siguiente paso después de crear grupo
      setStep('crear-habito');
      
    } catch (error) {
      console.error('Error al crear grupo:', error);
      setError(error instanceof Error ? error.message : 'Error al crear el grupo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeleccionarGrupo = () => {
    if (!grupoSeleccionado) {
      setError('Debes seleccionar un grupo');
      return;
    }

    const grupo = grupos.find(g => g.id === grupoSeleccionado);
    if (grupo) {
      // Verificar si el usuario tiene permisos para crear hábitos en este grupo
      if (grupo.soy_rol !== 'propietario' && grupo.soy_rol !== 'administrador') {
        setError('Solo los propietarios y administradores pueden crear hábitos en este grupo');
        return;
      }
      
      setGrupoActual(grupo);
      setStep('crear-habito');
      setError(null);
    }
  };

  const handleCrearHabitoGrupal = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!titulo.trim()) {
        throw new Error('El título del hábito es obligatorio');
      }
      
      if (!grupoActual?.id) {
        throw new Error('Debes seleccionar un grupo');
      }
      
      const result = await addGroupHabit(titulo, tipo, grupoActual.id);
      
      if (!result.ok) {
        if (result.reason === 'not_premium') {
          throw new Error('Necesitas una suscripción premium para crear hábitos grupales');
        } else {
          throw new Error('No se pudo crear el hábito grupal');
        }
      }
      
      // Marcar que el hábito se creó exitosamente
      setHabitoCreado(true);
      
      // Avanzar al paso de invitar usuarios
      setStep('invitar-usuarios');
      
    } catch (error) {
      console.error('Error al crear hábito grupal:', error);
      setError(error instanceof Error ? error.message : 'Error al crear el hábito');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvitarUsuario = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      if (!correoInvitado.trim()) {
        throw new Error('El correo del invitado es obligatorio');
      }

      if (!grupoActual?.id) {
        throw new Error('No hay grupo seleccionado');
      }

      // Validar correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correoInvitado)) {
        throw new Error('El correo electrónico no es válido');
      }

      const invitacionData = {
        correo: correoInvitado,
        rol: rolInvitado
      };

      console.log('🚀 Enviando invitación individual:', {
        grupoId: grupoActual.id,
        invitacionData,
        token: token ? 'Token presente' : 'Sin token'
      });

      const response = await grupoControl.invitarUsuario(grupoActual.id, invitacionData, token);

      console.log('✅ Respuesta de invitación individual:', response);

      // Agregar el email a la lista de invitaciones enviadas
      setInvitaciones(prev => [...prev, correoInvitado]);
      setCorreoInvitado('');
      setRolInvitado('miembro');

    } catch (error) {
      console.error('❌ Error al invitar usuario:', error);
      setError(error instanceof Error ? error.message : 'Error al enviar la invitación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvitarUsuariosLote = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      if (!correosLote.trim()) {
        throw new Error('Los correos de los invitados son obligatorios');
      }

      if (!grupoActual?.id) {
        throw new Error('No hay grupo seleccionado');
      }

      // Procesar los correos (uno por línea)
      const correos = correosLote.split('\n').map(email => email.trim()).filter(email => email);

      console.log('📝 Correos procesados del lote:', correos);

      if (correos.length === 0) {
        throw new Error('No se encontraron correos válidos');
      }

      // Validar correos
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const correosInvalidos = correos.filter(email => !emailRegex.test(email));

      if (correosInvalidos.length > 0) {
        throw new Error(`Correos inválidos: ${correosInvalidos.join(', ')}`);
      }

      // Crear array de invitaciones
      const invitaciones = correos.map(correo => ({
        correo,
        rol: rolInvitado as 'miembro' | 'administrador'
      }));

      console.log('🚀 Enviando invitaciones por lote:', {
        grupoId: grupoActual.id,
        invitaciones,
        totalCorreos: invitaciones.length,
        rolAsignado: rolInvitado,
        token: token ? 'Token presente' : 'Sin token'
      });

      const response = await grupoControl.invitarUsuariosLote(grupoActual.id, invitaciones, token);

      console.log('✅ Respuesta de invitaciones por lote:', response);

      // Agregar los emails a la lista de invitaciones enviadas
      setInvitaciones(prev => [...prev, ...correos]);
      setCorreosLote('');
      setRolInvitado('miembro');

    } catch (error) {
      console.error('❌ Error al invitar usuarios por lote:', error);
      setError(error instanceof Error ? error.message : 'Error al enviar las invitaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminar = () => {
    onSuccess();
    navigate("/home?tab=grupal");
  };

  // Manejador para abrir el modal de edición de grupo
  const handleEditarGrupo = (grupo: { id: string; nombre: string; descripcion?: string; soy_rol?: string }) => {
    setGrupoEditar({ id: grupo.id, nombre: grupo.nombre, descripcion: grupo.descripcion, soy_rol: grupo.soy_rol });
    setNuevoNombreGrupo(grupo.nombre);
    setNuevaDescripcionGrupo(grupo.descripcion || '');
  };

  // Manejador para guardar los cambios de un grupo
  const handleGuardarCambiosGrupo = async () => {
    if (!grupoEditar) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      if (!nuevoNombreGrupo.trim()) {
        throw new Error('El nombre del grupo es obligatorio');
      }
      
      await grupoControl.actualizarGrupo(grupoEditar.id, {
        nombre: nuevoNombreGrupo,
        descripcion: nuevaDescripcionGrupo || undefined
      }, token);
      
      // Actualizar la lista de grupos
      setGrupos(prev => prev.map(g => 
        g.id === grupoEditar.id 
          ? { ...g, nombre: nuevoNombreGrupo, descripcion: nuevaDescripcionGrupo } 
          : g
      ));
      
      // Cerrar el modal de edición
      setGrupoEditar(null);
      setNuevoNombreGrupo('');
      setNuevaDescripcionGrupo('');
      
    } catch (error) {
      console.error('Error al actualizar grupo:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar el grupo');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejador para confirmar eliminación de grupo
  const handleConfirmarEliminarGrupo = async () => {
    if (!grupoEliminar) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      await grupoControl.eliminarGrupo(grupoEliminar.id, token);
      
      // Actualizar la lista de grupos
      setGrupos(prev => prev.filter(g => g.id !== grupoEliminar.id));
      
      // Si el grupo eliminado era el seleccionado, resetear la selección
      if (grupoSeleccionado === grupoEliminar.id) {
        setGrupoSeleccionado('');
      }
      
      // Recargar los hábitos para eliminar los hábitos del grupo eliminado
      await refetchHabits();
      
      // Cerrar el modal de confirmación
      setGrupoEliminar(null);
      
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
      setError(error instanceof Error ? error.message : 'Error al eliminar el grupo');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizado según el paso actual
  const renderStepContent = () => {
    switch (step) {
      case 'crear-grupo':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Paso 1: Crear o seleccionar grupo</h2>
            
            {/* Selección de grupo existente */}
            {grupos.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Seleccionar un grupo existente
                  </label>
                  <div className="flex gap-3">
                    <select
                      value={grupoSeleccionado}
                      onChange={(e) => setGrupoSeleccionado(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-white"
                    >
                      <option value="">Selecciona un grupo</option>
                      {grupos.map((grupo) => (
                        <option 
                          key={grupo.id} 
                          value={grupo.id}
                          disabled={grupo.soy_rol !== 'propietario' && grupo.soy_rol !== 'administrador'}
                        >
                          {grupo.nombre} ({grupo.soy_rol === 'propietario' ? 'Propietario' : grupo.soy_rol === 'administrador' ? 'Administrador' : 'Miembro'})
                        </option>
                      ))}
                    </select>
                    {grupoSeleccionado && (
                      <>
                        {(() => {
                          const grupoSel = grupos.find(g => g.id === grupoSeleccionado);
                          if (grupoSel?.soy_rol === 'propietario') {
                            return <>
                              <button
                                onClick={() => handleEditarGrupo(grupoSel)}
                                className="rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-2 text-white"
                                title="Editar grupo"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setGrupoEliminar(grupoSel)}
                                className="rounded-lg bg-red-600 hover:bg-red-700 px-3 py-2 text-white"
                                title="Eliminar grupo"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </>;
                          }
                          return null;
                        })()}
                      </>
                    )}
                    <button
                      onClick={handleSeleccionarGrupo}
                      disabled={!grupoSeleccionado}
                      className={`rounded-lg px-4 py-2 font-medium flex items-center justify-center gap-2
                        ${
                          !grupoSeleccionado
                            ? 'bg-blue-600/40 text-white/70 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                  {grupos.some(g => g.soy_rol !== 'propietario' && g.soy_rol !== 'administrador') && (
                    <p className="text-sm text-gray-400 mt-2">
                      Solo puedes crear hábitos en grupos donde eres propietario o administrador.
                    </p>
                  )}
                </div>

                <div className="relative flex items-center py-5">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="mx-4 flex-shrink text-gray-400">O</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <button
                  onClick={cargarGrupos}
                  disabled={loadingGrupos}
                  className={`w-full rounded-lg border border-white/10 bg-white/5 py-2 px-4 text-gray-300 hover:bg-white/10 mb-5 ${loadingGrupos ? 'cursor-not-allowed' : ''}`}
                >
                  {loadingGrupos ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Cargando grupos...</span>
                    </div>
                  ) : (
                    <span>¿Quieres seleccionar un grupo existente?</span>
                  )}
                </button>
              </div>
            )}

            {/* Crear nuevo grupo */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Nombre del nuevo grupo
              </label>
              <input
                type="text"
                value={nombreGrupo}
                onChange={(e) => setNombreGrupo(e.target.value)}
                placeholder="Ej: Amigos del gimnasio"
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-white placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Descripción (opcional)
              </label>
              <textarea
                value={descripcionGrupo}
                onChange={(e) => setDescripcionGrupo(e.target.value)}
                placeholder="Describe el propósito del grupo..."
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-white placeholder:text-gray-500"
                rows={3}
              />
            </div>

            {/* Botón para crear grupo */}
            <div className="pt-4">
              <button
                onClick={handleCrearGrupo}
                disabled={isLoading || !nombreGrupo.trim()}
                className={`w-full rounded-lg py-2 px-4 font-medium flex items-center justify-center gap-2
                  ${
                    isLoading || !nombreGrupo.trim()
                      ? 'bg-blue-600/40 text-white/70 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Users className="h-5 w-5" />
                )}
                Crear y continuar
              </button>
            </div>
          </div>
        );

      case 'crear-habito':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Paso 2: Crear hábito grupal</h2>
            
            {/* Información del grupo seleccionado */}
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-blue-300">
              <p className="font-medium">Grupo: {grupoActual?.nombre}</p>
            </div>

            {/* Título del hábito */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Título del hábito
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Correr 30 minutos"
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-white placeholder:text-gray-500"
              />
            </div>

            {/* Tipo de hábito */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Tipo de hábito
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTipo('hacer')}
                  className={`rounded-lg border p-3 text-center ${
                    tipo === 'hacer'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  Hacer
                </button>
                <button
                  type="button"
                  onClick={() => setTipo('dejar')}
                  className={`rounded-lg border p-3 text-center ${
                    tipo === 'dejar'
                      ? 'border-purple-500/30 bg-purple-500/10 text-purple-400'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  Dejar
                </button>
              </div>
            </div>

            {/* Botones de navegación */}
            <div className="pt-4 flex gap-3">
              <button
                onClick={() => setStep('crear-grupo')}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-gray-300 hover:bg-white/10"
              >
                Atrás
              </button>
              <button
                onClick={handleCrearHabitoGrupal}
                disabled={isLoading || !titulo.trim()}
                className={`flex-1 rounded-lg py-2 px-4 font-medium flex items-center justify-center gap-2
                  ${
                    isLoading || !titulo.trim()
                      ? 'bg-blue-600/40 text-white/70 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <PlusCircle className="h-5 w-5" />
                )}
                Crear y continuar
              </button>
            </div>
          </div>
        );

      case 'invitar-usuarios':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Paso 3: Invitar usuarios</h2>

            {/* Confirmación de hábito creado */}
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-green-300 flex items-start gap-3">
              <Check className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium">¡Hábito grupal creado con éxito!</p>
                <p className="text-sm">Ahora puedes invitar a otros usuarios a unirse.</p>
              </div>
            </div>
            
            {/* Información del grupo */}
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-blue-300">
              <p className="font-medium">Grupo: {grupoActual?.nombre}</p>
              <p className="text-sm mt-1">Hábito: {titulo}</p>
            </div>

            {/* Invitaciones enviadas */}
            {invitaciones.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Invitaciones enviadas:</h3>
                <ul className="space-y-2">
                  {invitaciones.map((email, index) => (
                    <li 
                      key={index}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300"
                    >
                      <Check className="h-4 w-4 text-green-400" />
                      {email}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Formulario de invitación */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Correo electrónico
                </label>
                <button
                  type="button"
                  onClick={() => setModoLote(!modoLote)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  {modoLote ? 'Modo individual' : 'Modo lote'}
                </button>
              </div>
              
              {modoLote ? (
                <div className="space-y-3">
                  <textarea
                    value={correosLote}
                    onChange={(e) => setCorreosLote(e.target.value)}
                    placeholder="correo1@ejemplo.com&#10;correo2@ejemplo.com&#10;correo3@ejemplo.com"
                    className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-white placeholder:text-gray-500"
                    rows={4}
                  />
                  <div className="flex items-center gap-3">
                    <select
                      value={rolInvitado}
                      onChange={(e) => setRolInvitado(e.target.value as 'miembro' | 'administrador')}
                      className="rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-white"
                    >
                      <option value="miembro">Miembro</option>
                      <option value="administrador">Administrador</option>
                    </select>
                    <button
                      onClick={handleInvitarUsuariosLote}
                      disabled={isLoading || !correosLote.trim()}
                      className={`rounded-lg px-4 py-2 font-medium flex items-center justify-center gap-2 min-w-fit
                        ${
                          isLoading || !correosLote.trim()
                            ? 'bg-blue-600/40 text-white/70 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Mail className="h-5 w-5" />
                      )}
                      <span className="hidden sm:inline">Invitar lote</span>
                      <span className="sm:hidden">Enviar</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Un correo por línea. Todos recibirán el mismo rol.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    value={correoInvitado}
                    onChange={(e) => setCorreoInvitado(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="flex-1 rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-white placeholder:text-gray-500"
                  />
                  <select
                    value={rolInvitado}
                    onChange={(e) => setRolInvitado(e.target.value as 'miembro' | 'administrador')}
                    className="rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-white min-w-fit"
                  >
                    <option value="miembro">Miembro</option>
                    <option value="administrador">Administrador</option>
                  </select>
                  <button
                    onClick={handleInvitarUsuario}
                    disabled={isLoading || !correoInvitado.trim()}
                    className={`rounded-lg px-4 py-2 font-medium flex items-center justify-center gap-2 min-w-fit
                      ${
                        isLoading || !correoInvitado.trim()
                          ? 'bg-blue-600/40 text-white/70 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Mail className="h-5 w-5" />
                    )}
                    <span className="hidden sm:inline">Invitar</span>
                    <span className="sm:hidden">Enviar</span>
                  </button>
                </div>
              )}
            </div>

            {/* Botón para terminar */}
            <div className="pt-4">
              <button
                onClick={handleTerminar}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
              >
                Terminar
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-gray-300 hover:bg-white/10 flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white truncate">Hábitos Grupales</h1>
          <p className="text-gray-400 text-sm sm:text-base">Crea un nuevo hábito para compartir con amigos</p>
        </div>
      </div>

      {/* Pasos de progreso */}
      <div className="flex items-center w-full">
        <div className={`h-2 flex-1 rounded-full ${step === 'crear-grupo' ? 'bg-blue-600' : 'bg-blue-600'}`}></div>
        <div className={`h-2 flex-1 rounded-full mx-1 ${step === 'crear-habito' || step === 'invitar-usuarios' ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
        <div className={`h-2 flex-1 rounded-full ${step === 'invitar-usuarios' ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-4 sm:p-5 lg:p-6 space-y-6 max-w-full overflow-hidden">
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300 break-words">
            {error}
          </div>
        )}

        {/* Contenido según el paso actual */}
        {renderStepContent()}
      </div>

      {/* Modal de Edición de Grupo */}
      {grupoEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white">Editar grupo</h3>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Nombre del grupo
                </label>
                <input
                  type="text"
                  value={nuevoNombreGrupo}
                  onChange={(e) => setNuevoNombreGrupo(e.target.value)}
                  placeholder="Nombre del grupo"
                  className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-white placeholder:text-gray-500"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Descripción (opcional)
                </label>
                <textarea
                  value={nuevaDescripcionGrupo}
                  onChange={(e) => setNuevaDescripcionGrupo(e.target.value)}
                  placeholder="Descripción del grupo"
                  className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-white placeholder:text-gray-500"
                  rows={3}
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={() => setGrupoEditar(null)}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-gray-300 hover:bg-white/10"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarCambiosGrupo}
                  disabled={isLoading || !nuevoNombreGrupo.trim()}
                  className={`rounded-lg px-4 py-2 font-medium flex items-center justify-center gap-2
                    ${
                      isLoading || !nuevoNombreGrupo.trim()
                        ? 'bg-blue-600/40 text-white/70 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Check className="h-5 w-5" />
                  )}
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {grupoEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2 bg-red-500/20 rounded-full text-red-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Eliminar grupo</h3>
                <p className="mt-2 text-gray-300">
                  ¿Estás seguro de que deseas eliminar el grupo "<span className="font-medium text-white">{grupoEliminar.nombre}</span>"? Esta acción no se puede deshacer.
                </p>
                <p className="mt-1 text-sm text-red-300">
                  Se eliminarán todos los hábitos asociados a este grupo.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setGrupoEliminar(null)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-gray-300 hover:bg-white/10"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarEliminarGrupo}
                disabled={isLoading}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 inline-flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
                Eliminar definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuevoHabitoGrupal;