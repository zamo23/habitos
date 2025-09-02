import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../layouts/state/HabitsContext';

interface SearchResult {
  type: 'habito' | 'registro' | 'actividad';
  title: string;
  description: string;
  link: string;
  date?: string;
}

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { habits, activities } = useHabits();

  useEffect(() => {
    const searchInData = (query: string) => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const searchTerm = query.toLowerCase();
      const foundResults: SearchResult[] = [];

      // Buscar en hábitos
      habits?.forEach(habit => {
        if (habit.titulo.toLowerCase().includes(searchTerm)) {
          foundResults.push({
            type: 'habito',
            title: habit.titulo,
            description: habit.tipo === 'hacer' ? 'Hábito a desarrollar' : 'Hábito a eliminar',
            link: `/home/habit/${habit.id}`,
          });
        }
      });

      // Buscar en registros de hoy
      habits?.forEach(habit => {
        const registro = habit.registro_hoy;
        if (registro && registro.comentario?.toLowerCase().includes(searchTerm)) {
          foundResults.push({
            type: 'registro',
            title: `Registro de ${habit.titulo}`,
            description: registro.comentario,
            link: `/home/habit/${habit.id}`,
            date: registro.fecha_local_usuario
          });
        }
      });

      setResults(foundResults);
    };

    // Debounce la búsqueda para no sobrecargar
    const timeoutId = setTimeout(() => {
      searchInData(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, habits, activities]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowResults(true);
  };

  const handleResultClick = (link: string) => {
    setShowResults(false);
    navigate(link);
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
    results,
    showResults,
    setShowResults,
    handleResultClick
  };
};
