import { ArrowRight } from 'lucide-react';

const styles = `
  .neon-button {
    transition: all 0.3s ease;
  }
  
  .neon-button:hover {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4) !important;
  }
`;

interface CTAProps {
  onRegisterClick: () => void;
}

export const CTA = ({ onRegisterClick }: CTAProps) => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
      <style>{styles}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Únete a nuestra comunidad y comienza tu transformación personal. Acceso completo y gratuito para todos, sin limitaciones.
        </p>
        <button
          onClick={onRegisterClick}
          className="neon-button bg-white hover:bg-gray-100 text-blue-600 font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 inline-flex items-center text-lg border-2 border-white"
          style={{boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'}}
        >
          Comenzar ahora
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </section>
  );
};
