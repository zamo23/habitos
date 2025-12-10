import { ChevronDown, Search } from "lucide-react";
import { useState, useMemo } from "react";

const styles = `
  .neon-faq {
    transition: all 0.3s ease;
  }
  
  .neon-faq:hover {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.3) !important;
  }
`;

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "¿Qué es una PWA?",
    answer: "Una Aplicación Web Progresiva (PWA) es una app que combina lo mejor de la web y las aplicaciones móviles. Funciona en navegadores, se puede instalar como app nativa, y puedes acceder desde cualquier dispositivo."
  },
  {
    question: "¿Puedo usar Hábitos sin instalarla?",
    answer: "Sí, puedes acceder a Hábitos directamente desde cualquier navegador web. La instalación es opcional pero recomendada para una mejor experiencia y acceso rápido."
  },
  {
    question: "¿Es seguro usar Hábitos?",
    answer: "Sí, usamos conexiones encriptadas (HTTPS) y almacenamiento seguro. Tus datos personales nunca se comparten con terceros sin tu consentimiento."
  },
  {
    question: "¿Qué dispositivos soporta?",
    answer: "Hábitos funciona en cualquier dispositivo con un navegador moderno: Android, iOS, Windows, Mac y Linux. La instalación como app funciona mejor en Android y Windows."
  },
  {
    question: "¿Cómo recupero mis datos si pierdo mi dispositivo?",
    answer: "Tus datos se guardan en tu cuenta. Si inicias sesión en otro dispositivo, todos tus hábitos y registros estarán disponibles automáticamente."
  },
  {
    question: "¿Cuánto espacio ocupa?",
    answer: "Hábitos es muy ligera, ocupa menos de 10MB cuando está instalada. Perfecto para dispositivos con poco almacenamiento."
  },
  {
    question: "¿Hay costo?",
    answer: "Hábitos es completamente gratuita. Puedes usar todas las características sin pagar nada."
  },
  {
    question: "¿Cómo empiezo a crear mis primeros hábitos?",
    answer: "Al registrarte, accedes al dashboard. Desde allí puedes crear nuevos hábitos, establecer recordatorios y comenzar a registrar tu progreso diario."
  },
  {
    question: "¿Puedo compartir hábitos con amigos?",
    answer: "Sí, puedes crear hábitos grupales y invitar a tus amigos. Los hábitos grupales te permiten motivarte mutuamente y celebrar logros juntos."
  },
  {
    question: "¿Con qué frecuencia debo registrar mis hábitos?",
    answer: "Puedes registrar tus hábitos diariamente. Nuestro sistema de rachas te motiva a mantener consistencia, pero lo importante es tu progreso personal."
  }
];

export const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return faqItems;
    
    const query = searchQuery.toLowerCase();
    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white dark:bg-gray-900">
      <style>{styles}</style>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Preguntas Frecuentes</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Respuestas a las preguntas más comunes sobre Hábitos
          </p>
          
          {/* Buscador */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Busca una pregunta..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setExpandedIndex(null);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>

          {filteredItems.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400 mt-8">
              No encontramos preguntas que coincidan con tu búsqueda. Intenta con otras palabras.
            </p>
          )}
        </div>

        {/* Lista de FAQs */}
        {filteredItems.length > 0 && (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full px-6 py-4 flex items-start justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <span className="text-base font-semibold text-gray-900 dark:text-white pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform flex-shrink-0 mt-0.5 ${
                      expandedIndex === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedIndex === index && (
                  <div className="px-6 py-4 bg-gray-100 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Sección de contacto */}
        {filteredItems.length > 0 && (
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-blue-200 dark:border-blue-900/30">

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              ¿No encontraste lo que buscas?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Contáctanos en el formulario de soporte y te ayudaremos lo antes posible.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Ir a Contacto →
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
