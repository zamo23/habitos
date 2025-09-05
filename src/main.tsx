import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./serviceWorkerRegistration";

import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { esES } from "@clerk/localizations";
import { dark } from "@clerk/themes";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

if (!publishableKey) {
  throw new Error("Missing Clerk Publishable Key. Check your .env file.");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={publishableKey}
      localization={esES}
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#3B82F6" },
        elements: {
          card:
            "bg-gray-900/95 text-white rounded-2xl shadow-xl border border-white/10 backdrop-blur-md",
          headerTitle: "text-white",
          headerSubtitle: "text-gray-300",
          formFieldLabel: "text-gray-300",
          formFieldInput:
            "bg-gray-800 text-white border border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          formButtonPrimary:
            "bg-blue-600 hover:bg-blue-700 text-white font-semibold",
          socialButtonsBlockButton:
            "bg-gray-800 text-white hover:bg-gray-700 border border-white/10",
          dividerLine: "bg-white/10",
          dividerText: "text-gray-400",
          footerAction: "text-gray-300",
          footerActionLink: "text-blue-400 hover:text-blue-300",
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);

// Registra el Service Worker para habilitar funcionalidades PWA
registerServiceWorker();
