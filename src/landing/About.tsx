import { CheckCircle2 } from "lucide-react";

export const About = () => {
  return (
    <section id="about" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Texto principal */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Sobre Habitos
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Habitos nace de la pasión por ayudar a las personas a alcanzar su máximo potencial. 
              Como desarrollador independiente, entiendo las luchas diarias para mantener buenos hábitos 
              y eliminar los que nos limitan.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Esta es la primera versión de una aplicación diseñada con amor y dedicación, 
              con el objetivo de hacer el cambio de hábitos accesible, divertido y sostenible para todos.
            </p>

            {/* Tarjeta de autor */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">LZ</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Luis Zamora</h3>
                  <p className="text-gray-600 dark:text-gray-400">Desarrollador Independiente</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "Mi misión es crear herramientas que empoderen a las personas para construir 
                la vida que realmente desean, un hábito a la vez."
              </p>
            </div>
          </div>

          {/* Lista de beneficios */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              ¿Por qué Habitos?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Enfoque científico</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Basado en investigación sobre formación de hábitos</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Diseño intuitivo</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Interfaz simple que no abruma</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Apoyo constante</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Desarrollo continuo basado en feedback</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Comunidad</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Conecta con personas con objetivos similares</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
