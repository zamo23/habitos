import React, { useEffect, useState } from "react";
import {
  Menu,
} from "lucide-react";

type Theme = "light" | "dark" | "system";

const styles = `
  .nav-link {
    color: white;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .nav-link:hover {
    text-shadow: 0 0 10px rgba(59, 130, 246, 0.6), 0 0 20px rgba(96, 165, 250, 0.4);
  }
`;

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
    <>
      <style>{styles}</style>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            {/* Barra flotante redondeada */}
            <div className="flex justify-between items-center bg-transparent border border-gray-200 dark:border-gray-700 rounded-full px-6 py-3 backdrop-blur-sm shadow-lg shadow-blue-500/10 dark:shadow-blue-400/10">
              {/* Logo */}
              <a href="#" className="flex items-center gap-0.5">
                <img src="/favicon.svg" alt="Hábitos" className="w-8 h-8" />
                <span className="text-base font-bold text-white hidden sm:inline">abitos</span>
              </a>

              {/* Nav (desktop) - oculto en pantallas pequeñas */}
              <nav className="hidden lg:flex items-center space-x-6">
                <a
                  href="#features"
                  className="nav-link font-medium text-sm"
                >
                  Características
                </a>
                <a
                  href="#descargas"
                  className="nav-link font-medium text-sm"
                >
                  Descargas
                </a>
                <a
                  href="#about"
                  className="nav-link font-medium text-sm"
                >
                  Acerca de
                </a>
                <a
                  href="#faq"
                  className="nav-link font-medium text-sm"
                >
                  Preguntas
                </a>
              </nav>

              {/* Acciones */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onLoginClick}
                  className="hidden sm:block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors text-sm"
                  type="button"
                >
                  Iniciar Sesión
                </button>

                <button
                  onClick={onRegisterClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-full transition-colors text-sm whitespace-nowrap"
                  type="button"
                >
                  Registrarse
                </button>

                {/* Botón menú mobile */}
                <button
                  onClick={() => setMobileMenuOpen((v) => !v)}
                  className="lg:hidden text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  aria-label="Abrir menú"
                  aria-expanded={mobileMenuOpen}
                  type="button"
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Espaciador para compensar el header fixed */}
      <div className="h-20"></div>

      {/* Menú mobile */}
      {mobileMenuOpen && (
        <div className="fixed top-20 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-40 p-4">
          <nav className="flex flex-col space-y-3 max-w-7xl mx-auto">
            <a
              href="#features"
              className="nav-link font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Características
            </a>
            <a
              href="#descargas"
              className="nav-link font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Descargas
            </a>
            <a
              href="#about"
              className="nav-link font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Acerca de
            </a>
            <a
              href="#faq"
              className="nav-link font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Preguntas
            </a>

            <div className="pt-3 flex items-center gap-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLoginClick();
                }}
                className="flex-1 text-gray-700 dark:text-gray-300 font-medium py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm mt-3"
                type="button"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onRegisterClick();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm mt-3"
                type="button"
              >
                Registrarse
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
