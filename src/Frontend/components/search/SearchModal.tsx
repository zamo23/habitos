import React, { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { 
    searchQuery, 
    handleSearch, 
    results,
    handleResultClick 
  } = useSearch();
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Enfocar el input cuando se abre el modal
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Manejar el click en un resultado
  const handleResultSelection = (link: string) => {
    handleResultClick(link);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-sm"
      onClick={onClose} // Cierra el modal al hacer clic en cualquier parte
    >
      {/* Header con espacio extra arriba */}
      <div className="pt-20 px-4">
        <div className="mx-auto max-w-3xl relative">
          {/* Input de búsqueda */}
          <div 
            className="relative"
            onClick={(e) => e.stopPropagation()} // Previene que el click en el input cierre el modal
          >
            <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="search"
              placeholder="Escribe para buscar..."
              className="w-full h-12 rounded-xl border border-white/10 bg-gray-900/50 pl-10 pr-3 text-base text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div 
        className="mx-auto max-w-3xl px-4 mt-6"
        onClick={(e) => e.stopPropagation()} // Previene que el click en los resultados cierre el modal
      >
        {searchQuery && results.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No se encontraron resultados para "{searchQuery}"
          </div>
        ) : results.length > 0 ? (
          <div className="rounded-lg border border-white/10 bg-gray-900/50">
            <div className="divide-y divide-white/10">
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleResultSelection(result.link)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-colors flex items-start gap-3 group"
                >
                  <div className="mt-1 flex-shrink-0">
                    {result.type === 'habito' ? (
                      <Search className={`w-5 h-5 ${
                        result.description.includes('eliminar') ? 'text-red-400' : 'text-blue-400'
                      }`} />
                    ) : (
                      <Search className="w-5 h-5 text-purple-400" />
                    )}
                  </div>
                  <div>
                    <div className={`text-sm font-medium text-white ${
                      result.type === 'habito'
                        ? result.description.includes('eliminar')
                          ? 'group-hover:text-red-400'
                          : 'group-hover:text-blue-400'
                        : 'group-hover:text-purple-400'
                    }`}>
                      {result.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {result.description}
                    </div>
                    {result.date && (
                      <div className="text-xs text-gray-500 mt-1">
                        {result.date}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchModal;
