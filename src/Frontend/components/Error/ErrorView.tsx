import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, AlertCircle, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

interface ErrorViewProps {
  title?: string;
  message?: string;
  showLoginButton?: boolean;
}

const ErrorView: React.FC<ErrorViewProps> = ({
  title = 'Página no encontrada',
  message = 'Lo sentimos, la página que buscas no existe o no tienes acceso a ella.',
  showLoginButton = true
}) => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-white">
            {title}
          </h1>
          
          <p className="text-gray-400">
            {message}
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
          >
            <HomeIcon className="w-4 h-4" />
            Ir al inicio
          </button>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver atrás
          </button>

          {showLoginButton && !isSignedIn && (
            <button
              onClick={() => navigate('/?login')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <LogIn className="w-4 h-4" />
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorView;
