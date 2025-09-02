import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import {
  ChevronLeft,
  Flame,
  Trophy,
  Calendar,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { HabitoDetallesDTO } from "../../../Backend/Dto/HabitoDetallesDTO";
import { HabitoDetallesControl } from "../../../Backend/Controlador/HabitoDetallesControl";

/* -----------------------------
   UI helpers
----------------------------- */

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sublabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-5 shadow-lg backdrop-blur">
      <div className="flex items-center gap-3 text-gray-300">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800/60">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-sm">{label}</span>
      </div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
      {sublabel && <div className="mt-1 text-sm text-gray-400">{sublabel}</div>}
    </div>
  );
}

type Tone = "default" | "success" | "error" | "muted";

function Badge({
  children,
  tone = "default",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const tones: Record<Tone, string> = {
    success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    error: "bg-red-500/15 text-red-300 border-red-500/20",
    muted: "bg-gray-600/20 text-gray-300 border-gray-500/30",
    default: "bg-gray-700/40 text-gray-200 border-gray-600/40",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

const plural = (n: number, s: string, p?: string) => `${n} ${n === 1 ? s : p ?? s + "s"}`;

/* -----------------------------
   Vista principal
----------------------------- */

export default function HabitDetailView() {
  const { habitId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [habit, setHabit] = React.useState<HabitoDetallesDTO | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const controlador = React.useMemo(() => new HabitoDetallesControl(), []);

  React.useEffect(() => {
    const loadHabitDetails = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setError("Error de autenticación");
          return;
        }
        if (!habitId) {
          setError("ID de hábito no válido");
          return;
        }
        const details = await controlador.obtenerDetalles(habitId, token);
        setHabit(details);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar los detalles");
      } finally {
        setIsLoading(false);
      }
    };

    loadHabitDetails();
  }, [habitId, getToken, controlador]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-2xl border border-white/10 bg-gray-900/40 p-6 backdrop-blur-sm animate-pulse">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="h-8 w-24 rounded-lg bg-gray-700"></div>
              <div className="h-6 w-32 rounded-full bg-gray-700"></div>
            </div>
            <div className="mt-4">
              <div className="h-10 w-2/3 rounded-lg bg-gray-700"></div>
              <div className="mt-2 h-4 w-1/2 rounded-lg bg-gray-700"></div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-gray-900/60 p-5 shadow-lg backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gray-700"></div>
                  <div className="h-4 w-24 rounded-lg bg-gray-700"></div>
                </div>
                <div className="mt-3 h-8 w-16 rounded-lg bg-gray-700"></div>
                <div className="mt-1 h-4 w-32 rounded-lg bg-gray-700"></div>
              </div>
            ))}
          </div>

          {/* Historial Skeleton */}
          <div className="mt-8">
            <div className="mb-6">
              <div className="h-8 w-48 rounded-lg bg-gray-700"></div>
              <div className="mt-1 h-4 w-96 rounded-lg bg-gray-700"></div>
            </div>

            <div className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-gray-900/60">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-700"></div>
                    <div className="h-5 w-32 rounded-lg bg-gray-700"></div>
                  </div>
                  <div className="h-4 w-48 rounded-lg bg-gray-700"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !habit) {
    return (
      <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-6 text-center">
        <div className="mx-auto mb-4 h-12 w-12 text-red-500">
          <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">Error</h3>
        <p className="mt-2 text-sm text-gray-400">{error || "No se pudo cargar el hábito"}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const registroHoy = habit.registro_hoy;

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-2xl border border-white/10 bg-gray-900/40 p-6 backdrop-blur-sm">
          {/* Header (responsive) */}
          <div className="mb-8">
            {/* Fila 1: volver + chips (chips visibles solo en desktop) */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Volver</span>
              </button>

              {/* Chips en desktop */}
              <div className="hidden sm:flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                    habit.tipo === "hacer"
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  }`}
                >
                  {habit.tipo === "hacer" ? "Hacer" : "Dejar"}
                </span>

                {registroHoy?.completado && (
                  <Badge tone="success">
                    <CheckCircle2 className="h-4 w-4" />
                    {registroHoy.estado === "exito" ? "Completado" : "Registrado"}
                  </Badge>
                )}

                {!registroHoy?.puede_registrar && <Badge tone="muted">Ya registrado hoy</Badge>}
              </div>
            </div>

            {/* Chips en mobile: segunda fila con wrap */}
            <div className="mt-3 sm:hidden">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${
                    habit.tipo === "hacer"
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  }`}
                >
                  {habit.tipo === "hacer" ? "Hacer" : "Dejar"}
                </span>

                {registroHoy?.completado && (
                  <Badge tone="success" className="text-[11px]">
                    <CheckCircle2 className="h-4 w-4" />
                    Completado
                  </Badge>
                )}

                {!registroHoy?.puede_registrar && (
                  <Badge tone="muted" className="text-[11px]">
                    Registrado hoy
                  </Badge>
                )}
              </div>
            </div>

            {/* Título + meta */}
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-white">{habit.titulo}</h1>
              <p className="mt-2 text-sm text-gray-400">
                Creado hace {habit.dias_desde_creacion} días · {habit.estadisticas.total_registros} registros totales
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Flame}
              label="Racha Actual"
              value={habit.rachas.actual}
              sublabel={plural(habit.rachas.actual, "día", "días") + " consecutivos"}
            />
            <StatCard
              icon={Trophy}
              label="Mejor Racha"
              value={habit.rachas.mejor}
              sublabel={plural(habit.rachas.mejor, "día", "días") + " consecutivos"}
            />
            <StatCard
              icon={BarChart3}
              label="Tasa de Éxito"
              value={`${Math.round(habit.estadisticas.tasa_exito)}%`}
              sublabel={`${habit.estadisticas.total_exitos} de ${habit.estadisticas.total_registros} registros`}
            />
            <StatCard
              icon={Calendar}
              label="Promedio Semanal"
              value={habit.estadisticas.promedio_semanal.toFixed(1)}
              sublabel="veces por semana"
            />
          </div>

          {/* Registros recientes */}
          <div className="mt-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Historial de Registros</h2>
              <p className="mt-1 text-sm text-gray-400">
                Primer registro: {`${habit.estadisticas.primer_registro.fecha} ${habit.estadisticas.primer_registro.hora}`} ·
                {habit.estadisticas.total_exitos} éxitos
              </p>
            </div>

            <div className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-gray-900/60">
              {habit.registros_recientes.length > 0 ? (
                habit.registros_recientes.map((registro) => (
                  <div
                    key={registro.id}
                    className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          registro.estado === "exito"
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}
                      >
                        {registro.estado === "exito" ? "✓" : "×"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">
                          {`${registro.fecha} ${registro.hora}`}
                        </span>
                      </div>
                    </div>
                    {registro.comentario && (
                      <div className="text-sm text-gray-400 sm:text-right sm:max-w-[50%] mt-2 sm:mt-0 pl-11 sm:pl-0">
                        {registro.comentario}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-3 h-12 w-12 rounded-full bg-gray-800/60 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-300">Sin registros todavía</h3>
                  <p className="mt-1 text-sm text-gray-500">Comienza registrando tu progreso diario</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
