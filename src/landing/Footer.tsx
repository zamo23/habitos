import { Mail, Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo + Descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-1 mb-6">
              <img src="/favicon.svg" alt="Hábitos" className="w-10 h-10" />
              <span className="text-2xl font-bold text-white">abitos</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md leading-relaxed">
              La aplicación que te ayuda a construir hábitos positivos y eliminar los negativos.
              Diseñada con amor para transformar vidas.
            </p>
            <p className="text-gray-500 text-sm">
              Desarrollado por Luis Zamora • Versión 1.0 • <a href="https://github.com/zamo23/habitos.git" className="text-blue-400 hover:text-blue-300 transition-colors">Ver en GitHub</a>
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Enlaces Rápidos</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#features" className="hover:text-blue-400 transition-colors duration-200">Características</a></li>
              <li><a href="#descargas" className="hover:text-blue-400 transition-colors duration-200">Descargas</a></li>
              <li><a href="#faq" className="hover:text-blue-400 transition-colors duration-200">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">Privacidad</a></li>
            </ul>
          </div>
        </div>

        {/* Social & Contact */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm">¿Preguntas? <a href="mailto:info@habitos.zm-app.com" className="text-blue-400 hover:text-blue-300 transition-colors">Contáctanos</a></p>
            <div className="flex space-x-6">
              <a href="mailto:info@habitos.zm-app.com" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://github.com/zamo23/habitos.git" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Derechos */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2025 Habitos. Todos los derechos reservados. Hecho con ❤️ en Perú.</p>
        </div>
      </div>
    </footer>
  );
};