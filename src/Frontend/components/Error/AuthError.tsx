import React from 'react';
import ErrorView from './ErrorView';

const AuthError: React.FC = () => {
  return (
    <ErrorView
      title="Acceso denegado"
      message="Necesitas iniciar sesión para acceder a esta página."
      showLoginButton={true}
    />
  );
};

export default AuthError;
