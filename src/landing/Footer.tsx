import { Target } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + Descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Habitos</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              La aplicación que te ayuda a construir hábitos positivos y eliminar los negativos.
              Diseñada con amor para transformar vidas.
            </p>
            <p className="text-gray-500 text-sm">
              Desarrollado por Luis Zamora • Versión 1.0 • En desarrollo continuo
            </p>
          </div>

          {/* Producto */}
          <div>
            <h3 className="font-semibold mb-4">Producto</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Características</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Precios</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Centro de ayuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
            </ul>
          </div>
        </div>

        {/* Derechos */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; 2025 Habitos. Todos los derechos reservados. Hecho con ❤️ en Perú.</p>
        </div>
      </div>
    </footer>
  );
};