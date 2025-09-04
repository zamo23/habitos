import React from "react";
import { CalendarDays, Download, Info, Lock } from "lucide-react";
import { useFacturacion } from "../../hooks/useFacturacion";
import { generarBoletaHTML } from "./BoletaTemplate";

interface BoletaPago {
  id: string;
  fecha_pago: string;
  moneda: string;
  monto_centavos: number;
  plan: string;
  descripcion?: string;
  estado: string;
}
interface BoletaPlan {
  codigo: string;
  max_habitos: number | null;
  moneda: string;
  nombre: string;
  permite_grupos: boolean;
  precio_centavos: number;
}
/* ---------- UI helpers (mismo patrón que SettingsPage) ---------- */
const Card: React.FC<
  React.PropsWithChildren<{
    title: string;
    icon?: React.ElementType;
    className?: string;
    comingSoon?: boolean;
    comingSoonNote?: string;
    actions?: React.ReactNode;
  }>
> = ({
  title,
  icon: Icon,
  className,
  comingSoon,
  comingSoonNote,
  actions,
  children,
}) => (
  <section
    className={`relative rounded-2xl border border-white/10 bg-gray-900/60 ${className ?? ""}`}
  >
    <header className="flex items-center justify-between gap-3 p-5">
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5">
            <Icon className="h-4 w-4 text-gray-300" />
          </div>
        )}
        <h2 className="truncate text-lg font-semibold text-white leading-none">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        {comingSoon && (
          <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/30 bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-200">
            <Lock className="h-3.5 w-3.5" />
            Próximamente
          </span>
        )}
      </div>
    </header>
    <div
      aria-disabled={comingSoon ? true : undefined}
      className={`px-5 pb-4 ${comingSoon ? "pointer-events-none select-none opacity-60" : ""}`}
    >
      {children}
    </div>
    {comingSoon && (
      <div className="flex items-start gap-2 rounded-b-2xl border-t border-yellow-400/20 bg-yellow-500/10 px-5 py-3 text-sm text-yellow-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <div className="font-medium">Disponible pronto</div>
          <div className="text-yellow-100/90">
            {comingSoonNote ||
              "Vista previa del diseño final. Esta sección aún no está habilitada."}
          </div>
        </div>
      </div>
    )}
  </section>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between">
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium text-gray-300">{children}</div>
);

const Hint = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs text-gray-400">{children}</div>
);

const Button = ({
  children,
  intent = "primary",
  disabled,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  intent?: "primary" | "danger" | "ghost" | "blue";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) => {
  const base =
    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold";
  const styles =
    intent === "primary"
      ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : intent === "danger"
      ? "bg-rose-600 text-white hover:bg-rose-700"
      : intent === "blue"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${className} disabled:opacity-60`}
    >
      {children}
    </button>
  );
};

const handlePrevisualizar = (pago: BoletaPago, plan: BoletaPlan) => {
  const boletaHTML = generarBoletaHTML({ pago, plan });

  // Crear el blob y abrir en nueva ventana
  // Usamos text/html para mostrar la boleta como HTML
  const blob = new Blob([boletaHTML], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);

  // Abrir en una nueva ventana
  const width = Math.min(800, window.innerWidth * 0.9);
  const height = window.innerHeight * 0.9;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  const ventana = window.open(
    url,
    'Vista previa de boleta',
    `width=${width},height=${height},left=${left},top=${top}`
  );

  // Agregar botón de descarga en la ventana previsualizada
  if (ventana) {
    ventana.onload = () => {
      const botonDescargar = ventana.document.createElement('button');
      botonDescargar.innerHTML = 'Descargar Boleta';
      botonDescargar.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background-color: #10b981;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.2s;
        z-index: 1000;
      `;
      botonDescargar.onmouseover = () => {
        botonDescargar.style.backgroundColor = '#059669';
      };
      botonDescargar.onmouseout = () => {
        botonDescargar.style.backgroundColor = '#10b981';
      };
      botonDescargar.onclick = () => {
        const a = ventana.document.createElement('a');
        a.href = url;
        a.download = `boleta-${pago.id}.html`;
        a.click();
      };
      ventana.document.body.appendChild(botonDescargar);
    };
  }

  // Limpiar el URL cuando se cierre la ventana
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
};

/* ---------- Página: Facturación ---------- */

const Facturacion: React.FC = () => {
  const { data, loading, error } = useFacturacion();

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Facturación
          </h1>
          <p className="mt-1 text-gray-400">
            Administra tu plan y revisa tu historial
          </p>
        </div>

        {/* Skeleton: Resumen del plan + uso */}
        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
          <Card title="Plan actual">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse">
              <Row>
                <div className="min-w-0">
                  <div className="h-4 w-24 bg-white/10 rounded" />
                  <div className="h-3 w-32 bg-white/10 rounded mt-2" />
                </div>
                <div className="text-right">
                  <div className="h-6 w-20 bg-white/10 rounded" />
                </div>
              </Row>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-4 w-48 bg-white/10 rounded" />
              </div>
            </div>
          </Card>

          <Card title="Resumen de uso">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse">
              <div className="h-4 w-3/4 bg-white/10 rounded" />
            </div>
          </Card>
        </div>

        {/* Skeleton: Historial de facturación */}
        <Card title="Historial de facturación">
          <div className="min-w-0 overflow-x-auto rounded-xl border border-white/10 bg-white/5">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                  <th className="px-5 py-3 font-medium">Factura</th>
                  <th className="px-5 py-3 font-medium">Fecha</th>
                  <th className="px-5 py-3 font-medium">Monto</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 text-right font-medium">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-white/10 rounded" />
                        <div className="h-3 w-40 bg-white/10 rounded" />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-28 bg-white/10 rounded" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-20 bg-white/10 rounded" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-24 bg-white/10 rounded" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="h-8 w-16 bg-white/10 rounded ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Facturación
          </h1>
        </div>
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { plan, suscripcion, historial_pagos } = data;

  const precio =
    plan?.precio_centavos === 0
      ? "Gratis"
      : `${plan?.moneda} ${(plan?.precio_centavos / 100).toFixed(2)}`;

  const proxFactura = suscripcion?.periodo_fin
    ? new Date(suscripcion.periodo_fin).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No aplica";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Facturación
        </h1>
        <p className="mt-1 text-gray-400">
          Administra tu plan y revisa tu historial
        </p>
      </div>

      {/* Resumen del plan + uso */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card
          title="Plan actual"
          actions={
            <div className="flex-shrink-0">
              <Button intent="blue">Cambiar plan</Button>
            </div>
          }
        >
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <Row>
              <div className="min-w-0 flex-1">
                <Label>{plan?.nombre || "Plan"}</Label>
                <Hint>{"Detalles del plan"}</Hint>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xl font-semibold text-white">{precio}</div>
                {plan?.precio_centavos > 0 && (
                  <div className="text-xs text-gray-400">/ mes</div>
                )}
              </div>
            </Row>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-300">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              <span>
                Próxima factura:{" "}
                <span className="text-gray-200">{proxFactura}</span>
              </span>
            </div>
          </div>
        </Card>

        <Card
          title="Resumen de uso"
          comingSoon
          comingSoonNote="Pronto verás métricas de consumo y límites."
        >
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-gray-400">
              Información detallada sobre el uso de tu plan estará disponible
              próximamente.
            </div>
          </div>
        </Card>
      </div>

      {/* Historial de facturación */}
      <Card title="Historial de facturación">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                  <th className="w-[30%] px-5 py-3 font-medium">Factura</th>
                  <th className="w-[25%] px-5 py-3 font-medium">Fecha</th>
                  <th className="w-[15%] px-5 py-3 font-medium">Monto</th>
                  <th className="w-[15%] px-5 py-3 font-medium">Estado</th>
                  <th className="w-[15%] px-5 py-3 text-right font-medium">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {!historial_pagos || historial_pagos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-gray-400"
                    >
                      No hay facturas registradas.
                    </td>
                  </tr>
                ) : (
                  historial_pagos.map((pago: BoletaPago) => {
                    const fecha = new Date(pago.fecha_pago).toLocaleString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    );
                    const estadoClasses =
                      pago.estado === "confirmado"
                        ? "bg-green-500/10 text-green-300"
                        : "bg-yellow-500/10 text-yellow-300";

                    return (
                      <tr key={pago.id} className="hover:bg-white/5">
                        <td className="px-5 py-4 align-top">
                          <div className="space-y-1">
                            <div className="font-medium text-white">
                              {pago.plan}
                            </div>
                            <div className="text-sm text-gray-400">
                              {pago.descripcion}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 align-top text-sm text-gray-300">
                          {fecha}
                        </td>
                        <td className="px-5 py-4 align-top text-sm font-medium text-white">
                          {pago.moneda} {(pago.monto_centavos / 100).toFixed(2)}
                        </td>
                        <td className="px-5 py-4 align-top">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoClasses}`}
                          >
                            {pago.estado.charAt(0).toUpperCase() +
                              pago.estado.slice(1)}
                          </span>
                        </td>
                        <td className="px-5 py-4 align-top text-right">
                          <div className="flex justify-end">
                            <Button
                              intent="ghost"
                              onClick={() => handlePrevisualizar(pago, plan)}
                              className="whitespace-nowrap"
                            >
                              <Download className="h-4 w-4" />
                              <span className="hidden sm:inline">Ver Boleta</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Facturacion;

