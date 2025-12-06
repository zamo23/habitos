import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import {
  Gift,
  Crown,
  Star,
  Info,
} from "lucide-react";
import { FeatureDisplay, type Feature } from "./FeatureDisplay";
import { PlanControl } from "../../../Backend/Controlador/PlanControl";
import { PlanDTO, SuscripcionDTO } from "../../../Backend/Dto/PlanDTO";

/* ------------------ Tipos y helpers ------------------ */
type PlanCode = keyof typeof PLAN_UI_CONFIG;
type Period = "monthly" | "annual";

interface PlanUIConfig {
  color: "emerald" | "blue" | "purple";
  desc: string;
  features: (string | Feature)[];
  precioMensual: number;
  precioAnual: number;
}

const PLAN_UI_CONFIG: Record<string, PlanUIConfig> = {
  gratis: {
    color: "emerald",
    desc: "Para comenzar tu viaje de hábitos.",
    precioMensual: 0,
    precioAnual: 0,
    features: [
      "Seguimiento de hasta 3 hábitos",
      "Estadísticas básicas",
      "Recordatorios diarios",
      "Soporte por email",
    ],
  },
  estandar: {
    color: "blue",
    desc: "Lleva tus hábitos al siguiente nivel.",
    precioMensual: 3,
    precioAnual: 30,
    features: [
      "Seguimiento de hasta 10 hábitos",
      "Estadísticas avanzadas",
      {
        text: "Recordatorios personalizados",
        badge: "Disponible pronto"
      },
      "Soporte prioritario",
      {
        text: "Exportación de datos",
        badge: "Disponible pronto"
      },
    ],
  },
  premium: {
    color: "purple",
    desc: "Para equipos y familias.",
    precioMensual: 5,
    precioAnual: 50,
    features: [
      "Seguimiento ilimitado de hábitos",
      "Todo lo de Standard",
      "Hábitos grupales",
      "Panel de administración",
      "Soporte 24/7",
      "Coaching IA",
    ],
  },
};

const colorClasses = (c: PlanUIConfig["color"]) => {
  switch (c) {
    case "emerald":
      return {
        text: "text-emerald-300",
        badge: "text-emerald-300",
        btn: "bg-emerald-600 hover:bg-emerald-700",
      };
    case "blue":
      return {
        text: "text-blue-300",
        badge: "text-blue-300",
        btn: "bg-blue-600 hover:bg-blue-700",
      };
    case "purple":
      return {
        text: "text-purple-300",
        badge: "text-purple-300",
        btn: "bg-purple-600 hover:bg-purple-700",
      };
  }
};

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-300">
    {children}
  </span>
);

/* ------------------ Componente principal ------------------ */

const Beneficios: React.FC = () => {
  const navigate = useNavigate();
  const [period] = useState<Period>("monthly");
  const [currentSuscripcion, setCurrentSuscripcion] = useState<SuscripcionDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const planControl = new PlanControl();

  const { getToken } = useAuth();

  useEffect(() => {
    const cargarSuscripcion = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const suscripcion = await planControl.obtenerSuscripcionActual(token);
        setCurrentSuscripcion(suscripcion);
        setError(null);
      } catch (err) {
        console.error('Error al cargar suscripción:', err);
        setError("Error al cargar la información del plan");
      } finally {
        setLoading(false);
      }
    };
    cargarSuscripcion();
  }, [getToken]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-gray-700" />
            <div className="h-8 w-32 rounded bg-gray-700" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-40 rounded bg-gray-700" />
          </div>
        </div>

        {/* Current Plan Skeleton */}
        <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 w-full">
              <div className="flex items-center gap-2">
                <div className="h-6 w-32 rounded bg-gray-700" />
                <div className="h-6 w-24 rounded bg-gray-700" />
              </div>
              <div className="h-4 w-3/4 rounded bg-gray-700" />
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-700" />
                <div className="h-4 w-full rounded bg-gray-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Upgrades Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-40 rounded bg-gray-700" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-gray-900/60 p-5">
                <div className="space-y-4">
                  <div>
                    <div className="h-6 w-32 rounded bg-gray-700 mb-2" />
                    <div className="h-4 w-3/4 rounded bg-gray-700" />
                  </div>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-gray-700" />
                        <div className="h-4 w-full rounded bg-gray-700" />
                      </div>
                    ))}
                  </div>
                  <div className="h-10 w-full rounded bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table Skeleton */}
        <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gray-700" />
            <div className="h-5 w-48 rounded bg-gray-700" />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-gray-700" />
                  <div className="h-5 w-24 rounded bg-gray-700" />
                </div>
                <div className="space-y-2">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-gray-700" />
                      <div className="h-4 w-full rounded bg-gray-700" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !currentSuscripcion)
    return (
      <div className="text-red-500">
        Error: {error || "No se pudo cargar la información del plan"}
      </div>
    );

  const serverPlan: PlanDTO = currentSuscripcion.plan;
  const effectiveCode: PlanCode = 
    (PLAN_UI_CONFIG[serverPlan.codigo] ? serverPlan.codigo : "free") as PlanCode;
  const effectiveName = serverPlan.nombre;
  const currentUI = PLAN_UI_CONFIG[effectiveCode];
  const getUpgradeCodes = (code: PlanCode): PlanCode[] =>
    code === "gratis" ? ["estandar", "premium"] : code === "estandar" ? ["premium"] : [];

  const upgradeCodes = getUpgradeCodes(effectiveCode);

  const upgrades = upgradeCodes.map((code) => ({
    code,
    name: capitalize(code),
    ui: PLAN_UI_CONFIG[code],
  }));

  const handleUpgrade = (code: PlanCode) => {
    const planUI = PLAN_UI_CONFIG[code];
    const planInfo = {
      code,
      name: capitalize(code),
      price: period === "annual" ? planUI.precioAnual : planUI.precioMensual,
      period
    };
    
    // Usar replace: false para mantener la historia de navegación
    navigate("/perks/payment", { 
      state: planInfo,
      replace: false
    });
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-blue-400" />
          <h1 className="text-3xl font-extrabold tracking-tight">Beneficios</h1>
        </div>

  
      </div>

      {/* Tu plan actual */}
      <section className="rounded-2xl border border-white/10 bg-gray-900/60 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2">
              <h2 className="text-lg font-semibold">Tu plan actual</h2>
              <Badge>Plan {effectiveName}</Badge>
            </div>
            <p className="text-gray-400">{currentUI.desc}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {currentUI.features.map((feature, i) => (
            <FeatureDisplay key={i} feature={feature} />
          ))}
        </div>
      </section>

      {/* Upgrades disponibles */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Mejorar tu plan</h3>

        {upgrades.length === 0 ? (
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4 text-purple-200">
            Ya estás en el plan más alto. ¡Gracias por apoyar el proyecto! 💜
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {upgrades.map(({ code, name, ui }) => (
              <div key={code} className="rounded-2xl border border-white/10 bg-gray-900/60 p-5">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-gray-400">{ui.desc}</p>
                  </div>

                  <div className="space-y-2">
                    {ui.features.map((feature, i) => (
                      <FeatureDisplay key={i} feature={feature} />
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleUpgrade(code)}
                      className={`w-full rounded-lg px-4 py-2 font-semibold text-white ${
                        code === "premium"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      Actualizar por S/. {period === "annual" ? ui.precioAnual : ui.precioMensual}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Comparador */}
      <section className="rounded-2xl border border-white/10 bg-gray-900/60 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-gray-300" />
          <h4 className="text-base font-semibold">¿Qué incluye cada plan?</h4>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {(Object.entries(PLAN_UI_CONFIG) as [PlanCode, PlanUIConfig][]).map(
            ([code, ui]) => {
              const colors = colorClasses(ui.color);
              return (
                <div key={code} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {code === "premium" ? (
                      <Crown className={`h-5 w-5 ${colors.text}`} />
                    ) : (
                      <Star className={`h-5 w-5 ${colors.text}`} />
                    )}
                    <h5 className={`font-semibold ${colors.text}`}>
                      {capitalize(code)}
                    </h5>
                  </div>
                  <div className="space-y-2">
                    {ui.features.map((feature, i) => (
                      <FeatureDisplay 
                        key={i} 
                        feature={feature} 
                        textColor="text-gray-400" 
                        checkColor="text-gray-500" 
                      />
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>
    </div>
  );
};

function capitalize(code: string) {
  return code.charAt(0).toUpperCase() + code.slice(1);
}

export default Beneficios;
