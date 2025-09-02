// components/Auth.tsx
import React from "react";
import { X } from "lucide-react";
import { SignIn, SignUp } from "@clerk/clerk-react";

interface AuthProps {
  mode: "signIn" | "signUp";
  onClose: () => void;
  afterUrl?: string;
}

export const Auth: React.FC<AuthProps> = ({ mode, onClose, afterUrl = "/dashboard" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* ⬇️ Contenedor que recorta (overflow-hidden) y con el mismo radio */}
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
        {/* ⬇️ Botón dentro del contenedor recortado */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-2 top-2 z-20 rounded-full p-1.5
                     bg-gray-900/80 text-white hover:bg-gray-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* ⬇️ Hacemos el card relativo para facilitar overlays internos si los necesitas */}
        {mode === "signIn" ? (
          <SignIn
            afterSignInUrl={afterUrl}
            signUpUrl="/sign-up"
            appearance={{ elements: { card: "relative rounded-2xl" } }}
          />
        ) : (
          <SignUp
            afterSignUpUrl={afterUrl}
            signInUrl="/sign-in"
            appearance={{ elements: { card: "relative rounded-2xl" } }}
          />
        )}
      </div>
    </div>
  );
};
