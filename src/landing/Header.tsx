import React, { useEffect, useState } from "react";
import {
  Target,
  Menu,
} from "lucide-react";

type Theme = "light" | "dark" | "system";

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick }) => {
  const [theme] = useState<Theme>("system");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;

      if (theme === "system") {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", systemPrefersDark);
      } else {
        root.classList.toggle("dark", theme === "dark");
      }
    };

    applyTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  return (
    <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barra principal */}
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Habitos
            </span>
          </a>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              Características
            </a>
            <a
              href="#descargas"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              Descargas
            </a>
            <a
              href="#about"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              Acerca de
            </a>
            <a
              href="#faq"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              Preguntas
            </a>
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
            </div>

            <button
              onClick={onLoginClick}
              className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              type="button"
            >
              Iniciar Sesión
            </button>

            <button
              onClick={onRegisterClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              type="button"
            >
              Registrarse
            </button>

            {/* Botón menú mobile */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden text-gray-600 dark:text-gray-300"
              aria-label="Abrir menú"
              aria-expanded={mobileMenuOpen}
              type="button"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Menú mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-4">
            </div>
            <nav className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Características
              </a>
              <a
                href="#descargas"
                className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Descargas
              </a>
              <a
                href="#about"
                className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Acerca de
              </a>
              <a
                href="#faq"
                className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preguntas
              </a>

              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  className="flex-1 text-gray-700 dark:text-gray-200 font-medium py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  type="button"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onRegisterClick();
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                  type="button"
                >
                  Registrarse
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
