import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Check,
  X,
  Flame,
  Plus,
  Trash2,
  MoreVertical,
  Loader2,
  Lock,
  Clock
} from "lucide-react";
import { useHabits, Habit as HabitBase } from "../state/HabitsContext";
type HabitType = "hacer" | "dejar" | "grupal";
type Habit = Omit<HabitBase, "tipo"> & { tipo: HabitType; disponibleEn?: string };
import NuevoRegistroHabito from "../../components/NuevoRegistroHabito";
import StreakAnimation from "../../components/StreakAnimation";

type TabKey = "hacer" | "dejar" | "grupal";

const labelMap: Record<TabKey, string> = {
  hacer: "Hacer",
  dejar: "Dejar",
  grupal: "Grupales",
};

/* Modal de confirmación genérico */
function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Eliminar",
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } catch (error) {
      console.error('Error en confirmación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-gray-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Tarjeta de hábito con menú de 3 puntos */
const HabitCard = ({
  habit,
  onDone,
  onFail,
  onRequestDelete,
}: {
  habit: Habit;
  onDone: (comentario?: string) => Promise<void>;
  onFail: (comentario?: string) => Promise<void>;
  onRequestDelete: () => Promise<void>;
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [registroOpen, setRegistroOpen] = React.useState(false);

  const [showAnimation, setShowAnimation] = React.useState(false);
  const [animationStreak, setAnimationStreak] = React.useState<number>(habit.rachas?.actual || 0);
  const [isFirstTimeForAnimation, setIsFirstTimeForAnimation] = React.useState<boolean>((habit.rachas?.actual || 0) === 0);

  const [isLoading, setIsLoading] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  // cerrar el menú al hacer click fuera
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // si cambia la racha del habit por re-render, ajusta baseline
  React.useEffect(() => {
    const s = habit.rachas?.actual || 0;
    setAnimationStreak(s);
    setIsFirstTimeForAnimation(s === 0);
  }, [habit.rachas?.actual]);

  const currentStreak = habit.rachas?.actual || 0;

  return (
    <div
      className="relative rounded-xl border border-white/10 bg-gray-900/60 p-4 sm:p-5"
      ref={ref}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
            habit.tipo === "hacer"
              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              : habit.tipo === "grupal"
              ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
              : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
          }`}>
            {habit.tipo === "hacer" ? "Hacer" : habit.tipo === "grupal" ? "Grupal" : "Dejar"}
          </span>
          {habit.tipo === "grupal" && (
            <Lock className="h-4 w-4 text-blue-400" />
          )}
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="rounded-full p-1.5 text-gray-300 hover:bg-white/10 hover:text-white"
          title="Opciones"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-2 top-10 z-50 w-44 overflow-hidden rounded-xl border border-white/10 bg-gray-900 p-1 shadow-lg"
          >
            <button
              onClick={async () => {
                try {
                  setIsLoading(true);
                  setMenuOpen(false);
                  await onRequestDelete();
                } catch (error) {
                  console.error('Error al eliminar:', error);
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-red-300 hover:bg-red-500/10 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Eliminar
            </button>
          </div>
        )}
      </div>

      <button 
        onClick={() => navigate(`/home/habit/${habit.id}`)}
        className="group block w-full text-left"
      >
        <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-blue-400">
          {habit.titulo}
        </h3>

        <div className="mt-2 flex items-center gap-3 text-sm text-gray-400">
          <div className="inline-flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="font-medium text-orange-300">
              {currentStreak} días
            </span>
          </div>
          <span>Mejor: {habit.rachas?.mejor || 0} días</span>
        </div>
      </button>

      <div className="mt-4">
        {habit.registro_hoy ? (
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              {habit.registro_hoy.estado === 'exito' ? (
                <>
                  <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300">
                    <Check className="h-4 w-4" />
                    Completado hoy
                  </div>
                  <button
                    onClick={() => {
                      // Vista manual: animación con la racha actual
                      setAnimationStreak(currentStreak);
                      setIsFirstTimeForAnimation(currentStreak === 0);
                      setShowAnimation(true);
                    }}
                    className="mr-2 rounded-full p-2.5 text-orange-300 transition-colors hover:bg-orange-600/20 hover:text-orange-200"
                    title="Ver racha actual"
                  >
                    <Flame className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setRegistroOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-gray-700/50 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600 shadow-sm shadow-black/10"
                >
                  <Plus className="h-4 w-4" />
                  Registrar
                </button>
              )}
            </div>
            {habit.registro_hoy.comentario && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-gray-300">
                {habit.registro_hoy.comentario}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {habit.disponibleEn ? (
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Disponible {habit.disponibleEn}</span>
              </div>
            ) : (
              <button
                onClick={() => setRegistroOpen(true)}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Registrar
              </button>
            )}
          </div>
        )}
      </div>

      <NuevoRegistroHabito
        isOpen={registroOpen}
        onClose={() => setRegistroOpen(false)}
        habitId={habit.id}
        habitType={habit.tipo === "grupal" ? "hacer" : habit.tipo}
        habitTitle={habit.titulo}
        onSuccess={async (comentario) => {
          try {
            // 1) Llamamos al endpoint y esperamos confirmación
            await onDone(comentario);

            // 2) Cerramos el modal antes de mostrar la animación
            setRegistroOpen(false);

            // 3) Lanzamos animación con racha +1 (baseline del cierre)
            const nextStreak = (habit.rachas?.actual || 0) + 1;
            setAnimationStreak(nextStreak);
            setIsFirstTimeForAnimation((habit.rachas?.actual || 0) === 0);
            setShowAnimation(true);

            // El estado global refrescará la tarjeta luego
          } catch (error) {
            console.error('❌ Error post-registro (success):', error);
          }
        }}
        onFail={async (comentario) => {
          try {
            await onFail(comentario);
            setRegistroOpen(false);
          } catch (error) {
            console.error('❌ Error post-registro (fail):', error);
          }
        }}
      />

      {showAnimation && (
        <StreakAnimation
          streak={animationStreak}
          isFirstTime={isFirstTimeForAnimation}
          onClose={() => {
            setShowAnimation(false);
          }}
        />
      )}
    </div>
  );
};

const EmptyState = ({
  isLoading = false,
  error = null,
}: {
  isLoading?: boolean;
  error?: string | null;
}) => (
  <div className="col-span-full rounded-2xl border border-white/10 bg-gray-900/40 p-10 text-center">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : error ? (
        <X className="h-6 w-6 text-red-400" />
      ) : (
        <Flame className="h-6 w-6" />
      )}
    </div>
    <h3 className="text-lg font-semibold text-white">
      {isLoading ? "Cargando hábitos..." :
       error ? "Error al cargar hábitos" :
       "No hay hábitos que mostrar"}
    </h3>
    <p className="mt-1 text-gray-400">
      {error ? error :
       !isLoading ? "Crea tu primer hábito con el botón verde de la esquina." :
       "Por favor espera mientras cargamos tus hábitos."}
    </p>
  </div>
);

const TabsPill = ({
  active,
  counts,
  onChange,
}: {
  active: TabKey;
  counts: Record<TabKey, number>;
  onChange: (tab: TabKey) => void;
}) => (
  <div className="rounded-2xl border border-white/10 bg-gray-800/60 p-1">
    <div className="grid grid-cols-3 gap-1">
      {(Object.keys(labelMap) as TabKey[]).map((key) => {
        const isLocked = key === 'grupal' && counts[key] === 0;
        return (
          <button
            key={key}
            onClick={() => !isLocked && onChange(key)}
            className={`rounded-xl py-3 text-center font-semibold transition relative
              ${
                active === key
                  ? "bg-gray-900 text-emerald-300 shadow-inner"
                  : isLocked 
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
          >
            <div className="inline-flex items-center justify-center gap-2">
              {labelMap[key]} ({counts[key]})
              {isLocked && <Lock className="h-4 w-4" />}
            </div>
            {isLocked && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 bg-gray-800 text-gray-300 text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Disponible próximamente
              </div>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

const Inicio: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { habits, markDone, markFail, removeHabit, isLoading, error } = useHabits();

  const [habitToDelete, setHabitToDelete] = React.useState<Habit | null>(null);
  const initialTab = (params.get("tab") as TabKey) || "hacer";
  const [activeTab, setActiveTab] = React.useState<TabKey>(initialTab);

  React.useEffect(() => {
    setParams((p) => {
      if (activeTab === "hacer") {
        p.delete("tab");
      } else {
        p.set("tab", activeTab);
      }
      return p;
    });
  }, [activeTab, setParams]);

  const counts: Record<TabKey, number> = {
    hacer: (habits as Habit[]).filter((h) => h.tipo === "hacer").length,
    dejar: (habits as Habit[]).filter((h) => h.tipo === "dejar").length,
    grupal: (habits as Habit[]).filter((h) => h.tipo === "grupal").length,
  };

  const filtered = (habits as Habit[]).filter((h) => h.tipo === activeTab);

  // 👇 Solo mostramos estado de "cargando" si todavía no tenemos datos
  const showInitialLoading = isLoading && habits.length === 0;

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-full overflow-x-hidden">
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Mis Hábitos
          </h1>
          <div className="text-right">
            <button
              onClick={() => navigate("/home/nueva?from=home")}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              Nuevo
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <p className="text-lg text-gray-300">
            {new Date().toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </p>
          <span className="text-sm text-emerald-400/80">
            {new Date().getHours() < 12 
              ? "¡Buenos días! Hoy será un gran día para tus hábitos" 
              : new Date().getHours() < 19 
                ? "¡Buenas tardes! Sigamos con energía" 
                : "¡Buenas noches! Repasemos tus logros de hoy"}
          </span>
        </div>
      </div>

      <TabsPill active={activeTab} counts={counts} onChange={setActiveTab} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {showInitialLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-gray-900/60 p-4 sm:p-5 animate-pulse">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-6 w-20 rounded-full bg-gray-700"></div>
                  <div className="h-8 w-8 rounded-full bg-gray-700"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-7 w-3/4 rounded-lg bg-gray-700"></div>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-24 rounded-lg bg-gray-700"></div>
                    <div className="h-5 w-32 rounded-lg bg-gray-700"></div>
                  </div>
                  <div className="mt-4 h-10 w-32 rounded-lg bg-gray-700"></div>
                </div>
              </div>
            ))}
          </>
        ) : error ? (
          <EmptyState error={error} />
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              onDone={async (comentario) => await markDone(h.id, comentario)}
              onFail={async (comentario) => await markFail(h.id, comentario)}
              onRequestDelete={async () => {
                setHabitToDelete(h);
                return Promise.resolve();
              }}
            />
          ))
        )}
      </div>

      <ConfirmDialog
        open={!!habitToDelete}
        title="Eliminar hábito"
        message={`¿Seguro que deseas eliminar "${habitToDelete?.titulo ?? ""}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar definitivamente"
        onClose={() => setHabitToDelete(null)}
        onConfirm={async () => {
          if (habitToDelete) {
            try {
              await removeHabit(habitToDelete.id);
              setHabitToDelete(null);
            } catch (error) {
              console.error('Error al eliminar hábito:', error);
            }
          }
        }}
      />
    </div>
  );
};

export default Inicio;
