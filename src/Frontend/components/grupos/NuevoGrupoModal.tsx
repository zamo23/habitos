import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { GrupoControl } from '../../../Backend/Controlador/GrupoControl';
import { X, Loader2, Check } from 'lucide-react';

interface NuevoGrupoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (grupoId: string) => void;
}

const NuevoGrupoModal: React.FC<NuevoGrupoModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { getToken } = useAuth();
  const grupoControl = new GrupoControl();
  
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      setError('El nombre del grupo es obligatorio');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const authToken = await getToken();
      if (!authToken) {
        throw new Error('No hay token de autenticación. Por favor, inicia sesión.');
      }

      const grupo = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined
      };

      const result = await grupoControl.crearGrupo(grupo, authToken);
      
      setSuccess(true);
      
      // Clear form
      setNombre('');
      setDescripcion('');
      
      // Call callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(result.id);
        }, 1500); // Give time for the success message to be shown
      }
    } catch (error) {
      console.error('Error al crear grupo:', error);
      setError(error instanceof Error ? error.message : 'Error al crear el grupo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Crear Nuevo Grupo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {success ? (
          <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">¡Grupo creado con éxito!</h3>
            <p className="text-sm text-gray-500 mb-5">
              Tu nuevo grupo ha sido creado correctamente.
            </p>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del grupo *
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Ej: Amigos del gimnasio"
                required
                maxLength={50}
              />
            </div>
            
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (opcional)
              </label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Una breve descripción del propósito del grupo"
                maxLength={200}
              />
              <p className="mt-1 text-xs text-gray-500">
                {descripcion.length}/200 caracteres
              </p>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !nombre.trim()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creando...</span>
                  </>
                ) : (
                  <span>Crear Grupo</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default NuevoGrupoModal;
