import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MisGrupos from '../../components/grupos/MisGrupos';
import NuevoGrupoModal from '../../components/grupos/NuevoGrupoModal';
import { Users, UserPlus } from 'lucide-react';

const GruposPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleGroupCreated = (grupoId: string) => {
    setShowCreateModal(false);
    // Navigate to the new group
    navigate(`/dashboard/grupal/${grupoId}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Grupos
        </h1>
        <p className="mt-1 text-gray-600">
          Gestiona tus grupos y comparte hábitos con otras personas.
        </p>
      </div>

      {/* Invitar con link */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-start md:items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <UserPlus className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-800">Invitar a un grupo</h3>
            <p className="text-sm text-blue-600">
              Puedes invitar a otras personas a tus grupos desde la página de detalles del grupo.
            </p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/home')}
          className="mt-3 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 self-start md:self-center"
        >
          Ver mis hábitos
        </button>
      </div>

      {/* Lista de grupos */}
      <MisGrupos onCreateGroup={handleOpenCreateModal} />

      {/* Modal de crear grupo */}
      {showCreateModal && (
        <NuevoGrupoModal 
          isOpen={showCreateModal}
          onClose={handleCloseCreateModal}
          onSuccess={handleGroupCreated}
        />
      )}
    </div>
  );
};

export default GruposPage;
