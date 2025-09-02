import React from "react";
import {
  BarChart3,
  Lock,
  CalendarDays,
  TrendingUp,
  Activity,
  Download,
  PieChart,
  LineChart,
  Table,
  Filter,
  FileText,
  Bot,
} from "lucide-react";

/* ---------- Pequeños helpers UI ---------- */

const SoonBadge = () => (
  <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/30 bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-200">
    <Lock className="h-3.5 w-3.5" />
    Próximamente
  </span>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-300">
    {children}
  </span>
);

type PreviewKind = "coach" | "trend" | "heatmap";

const PreviewCard: React.FC<{
  icon: React.ElementType;
  title: string;
  kind: PreviewKind;
}> = ({ icon: Icon, title, kind }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-blue-300" />
          <h3 className="text-base font-semibold text-white">{title}</h3>
        </div>
        <SoonBadge />
      </div>

      {/* Esqueletos por tipo */}
      {kind === "coach" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            {/* Mensaje del coach */}
            <div className="mb-2 flex items-start gap-2">
              <div className="h-7 w-7 rounded-full bg-blue-600/30" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-gray-700/70" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-700/70" />
              </div>
            </div>
            {/* Mensaje del usuario */}
            <div className="ml-10 flex justify-end">
              <div className="space-y-2">
                <div className="h-3 w-40 animate-pulse rounded bg-gray-700/70" />
              </div>
            </div>
            {/* Mensaje del coach */}
            <div className="mt-3 flex items-start gap-2">
              <div className="h-7 w-7 rounded-full bg-blue-600/30" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-4/5 animate-pulse rounded bg-gray-700/70" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-700/70" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 flex-1 rounded-lg border border-white/10 bg-white/5" />
            <div className="h-9 w-16 rounded-lg border border-white/10 bg-white/5" />
          </div>
        </div>
      )}

      {kind === "trend" && (
        <div className="mt-2 h-40 w-full rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="flex h-full items-end gap-2">
            {[28, 52, 36, 64, 40, 70, 55].map((h, i) => (
              <div
                key={i}
                className="w-6 animate-pulse rounded bg-gray-700/70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      )}

      {kind === "heatmap" && (
        <div className="mt-2 rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 * 7 }).map((_, i) => (
              <div key={i} className="h-5 w-5 animate-pulse rounded bg-gray-700/70" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FeatureItem: React.FC<{ icon: React.ElementType; text: string }> = ({
  icon: Icon,
  text,
}) => (
  <li className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
    <Icon className="mt-0.5 h-4 w-4 text-emerald-300" />
    <span className="text-sm text-gray-200">{text}</span>
  </li>
);

/* ---------- Página Reportes ---------- */

const Reportes: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-400" />
          <h1 className="text-3xl font-extrabold tracking-tight">Reportes</h1>
        </div>
        <SoonBadge />
      </div>

      {/* Hero / Aviso */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/30 via-indigo-900/20 to-purple-900/30 p-6">
        <div className="pointer-events-none absolute -top-8 right-0 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-0 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10">
              <Lock className="h-5 w-5 text-yellow-200" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Reportes — Disponible pronto
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-300">
                Estamos preparando un módulo con gráficos, filtros, exportaciones
                y un <strong>Coach con IA</strong> para guiarte con ideas y retos.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Chip>
                  <FileText className="h-3.5 w-3.5" /> Informe PDF
                </Chip>
                <Chip>
                  <Table className="h-3.5 w-3.5" /> Exportar CSV
                </Chip>
                <Chip>
                  <Filter className="h-3.5 w-3.5" /> Filtros por fecha
                </Chip>
              </div>
            </div>
          </div>

          <button
            disabled
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-300"
            title="Próximamente"
          >
            Avísenme cuando esté listo
          </button>
        </div>
      </section>

      {/* Vistas previas bloqueadas */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <PreviewCard icon={Bot} title="Coach con IA" kind="coach" />
        <PreviewCard icon={TrendingUp} title="Tendencia de hábitos" kind="trend" />
        <PreviewCard icon={Activity} title="Mapa de actividad" kind="heatmap" />
      </div>

      {/* Qué traerá */}
      <section className="rounded-2xl border border-white/10 bg-gray-900/60 p-6">
        <h3 className="text-lg font-semibold text-white">Lo que incluirá</h3>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureItem icon={Bot} text="Coach con IA para consejos y retos" />
          <FeatureItem icon={Download} text="Exportar a PDF y CSV" />
          <FeatureItem icon={LineChart} text="Gráficos de líneas por racha" />
          <FeatureItem icon={PieChart} text="Distribución de éxitos vs fallos" />
          <FeatureItem icon={CalendarDays} text="Filtros por rango de fechas" />
          <FeatureItem icon={TrendingUp} text="Comparativas por período" />
        </ul>
      </section>
    </div>
  );
};

export default Reportes;
