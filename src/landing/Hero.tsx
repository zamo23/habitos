import { ArrowRight, Zap } from 'lucide-react';

interface HeroProps {
  onRegisterClick: () => void;
}

export const Hero = ({ onRegisterClick }: HeroProps) => {
  return (
    <section className="pt-20 pb-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            🚀 Premium GRATIS para todos los usuarios
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Transforma tus hábitos,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              transforma tu vida
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Crea hábitos positivos y elimina los negativos con HabitFlow. La aplicación diseñada 
            para ayudarte a construir la mejor versión de ti mismo, paso a paso.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={onRegisterClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 flex items-center"
            >
              Comenzar gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold px-8 py-4 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400">
              Ver demo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
            </div>
            <div className="text-center">
            </div>
            <div className="text-center">
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
