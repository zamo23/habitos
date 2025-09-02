import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Aquí puedes implementar la lógica para buscar en tus hábitos, actividades, etc.
  // Por ahora mostraremos solo el query de búsqueda

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Resultados de búsqueda</h1>
      <p className="text-gray-400">
        Mostrando resultados para: <span className="text-white">{query}</span>
      </p>
      
      {/* Aquí puedes agregar la lista de resultados */}
      <div className="mt-8">
        {/* Ejemplo de placeholder para resultados */}
        <div className="text-gray-400">
          No se encontraron resultados para tu búsqueda.
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
