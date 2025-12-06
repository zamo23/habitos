// src/Frontend/layouts/barra/barra.tsx
import React from "react";
import {
  Home,
  LayoutDashboard,
  BarChart3,
  Gift,
  Settings,
  Receipt,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHabits } from "../state/HabitsContext";
import { useSubscription } from "../state/SubscriptionContext";

export type NavKey = "home" | "dashboard" | "reports" | "perks" | "settings" | "billing";

export interface DashboardNavProps {
  active: NavKey;
  onSelect: (key: NavKey) => void;
}

// Elementos principales para la barra móvil
const MAIN_NAV_ITEMS: { key: NavKey; label: string; icon: React.ElementType }[] = [
  { key: "home", label: "Inicio", icon: Home },
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "reports", label: "Reportes", icon: BarChart3 },
  { key: "perks", label: "Beneficios", icon: Gift },
];

// Elementos del menú más para móvil
const MORE_NAV_ITEMS: { key: NavKey; label: string; icon: React.ElementType }[] = [
  // { key: "billing", label: "Facturación", icon: Receipt },
  { key: "settings", label: "Ajustes", icon: Settings },
];

// Todos los elementos para la vista de escritorio
const NAV_ITEMS = [...MAIN_NAV_ITEMS, ...MORE_NAV_ITEMS];

export default function DashboardNav({ active, onSelect }: DashboardNavProps) {
  const navigate = useNavigate();
  const { habits } = useHabits();
  const { subscription, isLoading, error } = useSubscription();
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  // Manejar el cierre del modal con animación
  const handleCloseModal = () => {
    setIsClosing(true);
    // Esperar a que termine la animación antes de ocultar
    setTimeout(() => {
      setShowMoreMenu(false);
      setIsClosing(false);
    }, 300);
  };

  // Prevenir scroll cuando el modal está abierto
  React.useEffect(() => {
    if (showMoreMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMoreMenu]);

  // Debug
  React.useEffect(() => {
    if (!isLoading && subscription) {
    }
  }, [subscription, isLoading]);

  const total = habits?.length ?? 0;
  const isPremium = subscription?.plan.codigo === 'premium';
  const maxHabits = subscription?.plan.max_habitos;
  // Si es premium o max_habitos es null, mostramos progreso 0 (ilimitado)
  const percent = isPremium || maxHabits === null
    ? 0
    : Math.min(100, Math.round((total / (maxHabits ?? 5)) * 100));

  return (
    <>
      {/* Sidebar (md+) fijo al hacer scroll */}
      <aside className="hidden md:block md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:overflow-auto self-start">
        <div className="rounded-2xl border border-white/10 bg-gray-900/40 p-3">
          <div className="mb-3 text-xs uppercase tracking-wider text-gray-400">
            Navegación
          </div>
          <nav className="space-y-2">
            {NAV_ITEMS.map(({ key, icon: Icon, label }) => {
              const isActive = key === active;
              return (
                <button
                  key={key}
                  onClick={() => {
                    onSelect(key);
                    navigate(`/${key}`);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                  ${isActive
                      ? "bg-emerald-900/30 text-emerald-300 border border-emerald-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Tarjeta de plan */}
          <div className="mt-6 rounded-xl border border-white/10 bg-gray-900/50 p-4">
            <div className={`text-sm font-semibold ${subscription?.plan.codigo === 'premium'
              ? 'text-purple-300'
              : 'text-gray-300'
              }`}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-emerald-500"></div>
                  <span>Cargando plan...</span>
                </div>
              ) : error ? (
                <div className="text-red-400">Error cargando plan</div>
              ) : (
                subscription?.plan.nombre ?? 'Plan no disponible'
              )}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              Hábitos: {total} {isPremium || maxHabits === null ? (
                <span className="text-purple-300">/ ∞</span>
              ) : (
                `/${maxHabits ?? 5}`
              )}
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-800">
              <div
                className={`h-full bg-gradient-to-r ${isPremium
                  ? 'from-purple-600 to-pink-600'
                  : 'from-blue-600 to-purple-600'
                  }`}
                style={{ width: `${percent}%` }}
              />
            </div>
            {subscription?.plan.codigo !== 'premium' && (
              <button
                onClick={() => window.location.href = '/perks'}
                className="mt-4 w-full rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-500/20"
              >
                Mejorar plan
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Bottom bar (móvil) fixed y siempre visible */}
      <div className="md:hidden fixed-nav-bottom border-t border-white/10 bg-gray-950 shadow-lg">
        <nav className="grid grid-cols-5 gap-1 px-2 py-2 bg-gray-950" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
          {MAIN_NAV_ITEMS.map(({ key, icon: Icon, label }) => {
            const isActive = key === active;
            return (
              <button
                key={key}
                onClick={() => {
                  onSelect(key);
                  navigate(`/${key}`);
                }}
                className="flex flex-col items-center justify-center py-1.5"
                aria-label={label}
                title={label}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-gray-400"}`} />
                <span className={`mt-0.5 text-[11px] ${isActive ? "text-blue-300" : "text-gray-400"}`}>
                  {label}
                </span>
              </button>
            );
          })}

            {/* Botón Más */}
            <button
              onClick={() => setShowMoreMenu(true)}
                className="flex flex-col items-center justify-center py-1.5 w-full"
                aria-label="Más"
                title="Más opciones"
              >
                <Settings className={`w-5 h-5 ${MORE_NAV_ITEMS.some(item => item.key === active) ? "text-blue-400" : "text-gray-400"}`} />
                <span className={`mt-0.5 text-[11px] ${MORE_NAV_ITEMS.some(item => item.key === active) ? "text-blue-300" : "text-gray-400"}`}>
                  Más
                </span>
              </button>
          </nav>
              {/* Modal de pantalla completa */}
              {showMoreMenu && (
                <>
                  {/* Overlay con efecto de desenfoque */}
                  <div
                    className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'
                      }`}
                    onClick={handleCloseModal}
                  />

                {/* Modal que se desliza desde abajo */}
                <div className={`fixed inset-x-0 bottom-0 z-[51] bg-gray-950 rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out ${isClosing ? 'translate-y-full' : 'translate-y-0'
                  }`}>
                  <div className="relative px-4 pb-8 pt-6">
                  {/* Línea decorativa superior */}
                  <div className="absolute left-1/2 top-3 h-1 w-12 -translate-x-1/2 rounded-full bg-gray-800" />

                  {/* Botón cerrar */}
                  <button
                    onClick={handleCloseModal}
                    className="absolute right-4 top-6 rounded-full p-2 text-gray-400 hover:bg-white/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Título */}
                  <h3 className="mb-6 text-lg font-semibold text-white pl-1">Menú Principal</h3>

                  {/* Lista de opciones */}
                  <div className="space-y-2">
                    {NAV_ITEMS.map(({ key, icon: Icon, label }) => {
                      const isActive = key === active;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            handleCloseModal();
                            setTimeout(() => {
                              onSelect(key);
                              navigate(`/${key}`);
                            }, 300);
                          }}
                          className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors ${isActive
                            ? "bg-blue-500/20 text-blue-300"
                            : "text-gray-300 hover:bg-white/5"
                            }`}
                        >
                          <div className={`rounded-lg p-2 ${isActive ? "bg-blue-500/20" : "bg-gray-800"
                            }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{label}</div>
                            <div className="text-xs text-gray-400">
                              {key === "home" && "Gestiona tus hábitos diarios"}
                              {key === "dashboard" && "Visualiza tu progreso"}
                              {key === "reports" && "Analiza tu rendimiento"}
                              {key === "perks" && "Descubre beneficios premium"}
                              {key === "billing" && "Gestiona tu suscripción"}
                              {key === "settings" && "Personaliza tu experiencia"}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
          </>
        )}
      </div>
    </>
  );
};
