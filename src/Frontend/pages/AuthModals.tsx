// components/Auth.tsx
import React from "react";
import { X } from "lucide-react";
import { SignIn, SignUp } from "@clerk/clerk-react";

interface AuthProps {
  mode: "signIn" | "signUp";
  onClose: () => void;
  afterUrl?: string;
}

export const Auth: React.FC<AuthProps> = ({
  mode,
  onClose,
  afterUrl = "/dashboard",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay oscuro */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* contenedor del modal */}
      <div className="relative w-full max-w-md">
        {/* Clerk dibuja la card dentro de aquí */}
        <div className="relative">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-3 top-3 z-20 rounded-lg p-1.5 
                       text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>

          {mode === "signIn" ? (
            <SignIn
              afterSignInUrl={afterUrl}
              signUpUrl="/sign-up"
              appearance={{
                elements: {
                  card: "relative", 
                },
              }}
            />
          ) : (
            <SignUp
              afterSignUpUrl={afterUrl}
              signInUrl="/sign-in"
              appearance={{
                elements: {
                  card: "relative",
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
