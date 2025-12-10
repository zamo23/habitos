import { Download, Smartphone, Globe } from "lucide-react";

const styles = `
  .neon-card {
    transition: all 0.3s ease;
  }
  
  .neon-card:hover {
    box-shadow: 0 0 20px currentColor, 0 0 30px currentColor !important;
  }
`;

export const Descargas = () => {
  return (
    <section id="descargas" className="py-24 bg-white dark:bg-gray-900">
      <style>{styles}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Descargar Hábitos</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Instala nuestra PWA en tu dispositivo y accede a todos tus hábitos en cualquier momento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Web App */}
          <div className="neon-card bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border-2 border-blue-500 transition-all" style={{boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'}}>

            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Acceso Web</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Accede a Hábitos directamente desde tu navegador. Sin instalación requerida.
            </p>
            <a
              href="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              <Globe className="w-5 h-5" />
              <span>Ir a la App</span>
            </a>
          </div>

          {/* PWA Install */}
          <div className="neon-card bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border-2 border-purple-500 transition-all" style={{boxShadow: '0 0 10px rgba(147, 51, 234, 0.3)'}}>

            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Instalar PWA</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Instala Hábitos como una app nativa en tu dispositivo. Funciona sin conexión.
            </p>
            <button
              onClick={() => {
                alert('La opción de instalación aparecerá en tu navegador cuando visites la app');
              }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Instalar App</span>
            </button>
          </div>
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-blue-200 dark:border-blue-900/30">

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">¿Cómo instalar?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">📱 En móvil</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Abre Hábitos en tu navegador</li>
                <li>Toca el menú (tres puntos)</li>
                <li>Selecciona "Instalar app"</li>
                <li>¡Listo! Aparecerá en tu pantalla</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">💻 En PC</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Abre Hábitos en Chrome/Edge</li>
                <li>Haz clic en el icono de instalación</li>
                <li>Confirma la instalación</li>
                <li>¡Ya puedes usar Hábitos sin navegador!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
