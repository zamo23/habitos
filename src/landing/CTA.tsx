import { ArrowRight } from 'lucide-react';

interface CTAProps {
  onRegisterClick: () => void;
}

export const CTA = ({ onRegisterClick }: CTAProps) => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          ¿Listo para transformar tus hábitos?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Únete a nuestra comunidad y comienza tu transformación personal. Acceso completo y gratuito para todos, sin limitaciones.
        </p>
        <button
          onClick={onRegisterClick}
          className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 inline-flex items-center text-lg"
        >
          Comenzar ahora
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </section>
  );
};
