import React from "react";
import {
  Moon,
  Globe2,
  Bell,
  Shield,
  ChevronDown,
  Info,
  Download,
  Lock,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useSettings } from "../../hooks/useSettings";
import { useNotifications } from "../../hooks/useNotifications";

/* ---------- UI helpers ---------- */

const Card: React.FC<
  React.PropsWithChildren<{
    title: string;
    icon?: React.ElementType;
    className?: string;
    comingSoon?: boolean;
    comingSoonNote?: string;
  }>
> = ({ title, icon: Icon, className, comingSoon, comingSoonNote, children }) => (
  <section
    className={`relative rounded-2xl border border-white/10 bg-gray-900/60 ${className ?? ""}`}
  >
    <header className="flex items-center justify-between gap-3 p-5">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5">
            <Icon className="h-4 w-4 text-gray-300" />
          </div>
        )}
        <h2 className="text-lg font-semibold text-white leading-none">{title}</h2>
      </div>

      {comingSoon && (
        <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/30 bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-200">
          <Lock className="h-3.5 w-3.5" />
          Próximamente
        </span>
      )}
    </header>

    {/* Contenido (bloqueado si es comingSoon) */}
    <div
      aria-disabled={comingSoon ? true : undefined}
      className={`px-5 pb-4 ${comingSoon ? "pointer-events-none select-none opacity-60" : ""}`}
    >
      {children}
    </div>

    {/* Banner inferior para "Disponible pronto" */}
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
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-2">
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium text-gray-300">{children}</div>
);

const Hint = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs text-gray-400">{children}</div>
);

const Toggle = ({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    aria-pressed={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition
      ${checked ? "bg-emerald-600" : "bg-gray-600"}
      ${disabled ? "opacity-60" : ""}`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white transition
        ${checked ? "translate-x-5" : "translate-x-1"}`}
    />
  </button>
);

const Select = ({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  disabled?: boolean;
}) => (
  <div className="relative w-full sm:w-96">
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none rounded-lg border border-white/10 bg-gray-800/70 px-3 py-2 pr-8 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
  </div>
);

const Button = ({
  children,
  intent = "primary",
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  intent?: "primary" | "danger" | "ghost" | "blue";
  disabled?: boolean;
  onClick?: () => void;
}) => {
  const base = "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold";
  const styles =
    intent === "primary"
      ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : intent === "danger"
        ? "bg-rose-600 text-white hover:bg-rose-700"
        : intent === "blue"
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10";
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles} disabled:opacity-60`}>
      {children}
    </button>
  );
};

/* ---------- Página: Configuración (con vistas bloqueadas) ---------- */

const SettingsPage: React.FC = () => {
  const { 
    timezones, 
    settings, 
    loading, 
    saving,
    error, 
    updateSettings 
  } = useSettings();
  const [darkMode, setDarkMode] = React.useState(true);
  
  // Integración de notificaciones
  const {
    remindersEnabled,
    streakAlertsEnabled,
    toggleReminders,
    toggleStreakAlerts
  } = useNotifications();
  
  const [notifDaily, setNotifDaily] = React.useState(remindersEnabled);
  const [notifWeekly, setNotifWeekly] = React.useState(false);
  const [notifStreak, setNotifStreak] = React.useState(streakAlertsEnabled);
  const [notifGroup, setNotifGroup] = React.useState(false);
  
  React.useEffect(() => {
    setNotifDaily(remindersEnabled);
    setNotifStreak(streakAlertsEnabled);
  }, [remindersEnabled, streakAlertsEnabled]);
  
  const handleDailyRemindersToggle = async (enabled: boolean) => {
    setNotifDaily(enabled);
    await toggleReminders(enabled);
  };

  const handleStreakAlertsToggle = async (enabled: boolean) => {
    setNotifStreak(enabled);
    await toggleStreakAlerts(enabled);
  };

  const timezoneOptions = timezones.map(tz => ({
    label: tz.label,
    value: tz.value
  }));

  const langOptions = [
    { label: "Español", value: "es" },
    { label: "English", value: "en" }
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Configuración</h1>
        <p className="mt-1 text-gray-400">Personaliza tu experiencia en Hábitos</p>
      </div>

      {/* Apariencia — BLOQUEADO */}
      <Card
        title="Apariencia"
        icon={Moon}
        comingSoon
        comingSoonNote="Aquí podrás alternar entre modo claro/oscuro y elegir acentos de color."
      >
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <Row>
            <div>
              <Label>Modo Oscuro</Label>
              <Hint>Cambia entre tema claro y oscuro</Hint>
            </div>
            <Toggle checked={darkMode} onChange={setDarkMode} disabled />
          </Row>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:w-80">
            <button className="h-9 rounded-lg border border-white/10 bg-gray-800/60 text-sm text-gray-300 opacity-60">
              Tema Claro
            </button>
            <button className="h-9 rounded-lg border border-white/10 bg-gray-800/60 text-sm text-gray-300 opacity-60">
              Tema Oscuro
            </button>
          </div>
        </div>
      </Card>

      {/* Notificaciones — BLOQUEADO */}
      <Card
        title="Notificaciones"
        icon={Bell}
        comingSoon
        comingSoonNote="Pronto podrás configurar recordatorios diarios, alertas de racha, reportes semanales y actualizaciones de grupo."
      >
        <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
          <div className="p-4">
            <Row>
              <div>
                <Label>Recordatorios Diarios</Label>
                <Hint>Recibe recordatorios para completar tus hábitos</Hint>
              </div>
              <Toggle 
                checked={notifDaily} 
                onChange={handleDailyRemindersToggle} 
                disabled 
              />
            </Row>
          </div>
          <div className="p-4">
            <Row>
              <div>
                <Label>Alertas de Racha</Label>
                <Hint>Notificaciones cuando estés cerca de superar tu récord</Hint>
              </div>
              <Toggle 
                checked={notifStreak} 
                onChange={handleStreakAlertsToggle} 
                disabled 
              />
            </Row>
          </div>
          <div className="p-4">
            <Row>
              <div>
                <Label>Reportes Semanales</Label>
                <Hint>Resumen semanal de tu progreso</Hint>
              </div>
              <Toggle checked={notifWeekly} onChange={setNotifWeekly} disabled />
            </Row>
          </div>
          <div className="p-4">
            <Row>
              <div>
                <Label>Actualizaciones de Grupo</Label>
                <Hint>Actividad en hábitos grupales</Hint>
              </div>
              <Toggle checked={notifGroup} onChange={setNotifGroup} disabled />
            </Row>
          </div>
        </div>
      </Card>

      {/* Idioma */}
      <Card title="Idioma" icon={Globe2}>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div>
            <Label>Selecciona tu idioma</Label>
            <Hint>Elige el idioma en el que prefieres ver la aplicación</Hint>
          </div>
          <div className="mt-4">
            <Select 
              value={settings.idioma}
              onChange={(value) => updateSettings({ idioma: value })}
              options={langOptions}
            />
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm text-blue-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <div className="font-medium">Próximos idiomas</div>
              <div className="text-blue-100/90">
                Tu preferencia de idioma se guardará y cuando estén disponibles nuevos idiomas, 
                la aplicación se actualizará automáticamente según tu región y preferencias.
              </div>
            </div>
          </div>
          {saving && (
            <div className="mt-2 flex items-center gap-2 text-sm text-emerald-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              Guardando...
            </div>
          )}
        </div>
      </Card>

      {/* Datos y Privacidad — BLOQUEADO */}
      <Card
        title="Datos y Privacidad"
        icon={Shield}
        comingSoon
        comingSoonNote="Podrás exportar tus datos en formato JSON y gestionar privacidad desde aquí."
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
            <div>
              <Label>Exportar Datos</Label>
              <Hint>Descarga todos tus datos en formato JSON</Hint>
            </div>
            <Button intent="blue" disabled>
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </Card>

      {/* Zona Horaria */}
      <Card title="Zona Horaria" icon={Globe2}>
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="space-y-4">
              <div>
                <Label>Tu zona horaria</Label>
                <Hint>Selecciona tu ubicación para mostrar las horas correctamente</Hint>
                <div className="mt-2">
                  {loading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Cargando zonas horarias...
                    </div>
                  ) : error ? (
                    <div className="flex items-center gap-2 text-sm text-rose-400">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  ) : (
                    <Select
                      value={settings.zona_horaria}
                      onChange={(value) => updateSettings({ zona_horaria: value })}
                      options={timezoneOptions}
                    />
                  )}
                </div>
                {saving && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-emerald-400">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Guardando...
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Label>Hora de cierre del día</Label>
                <Hint>¿A qué hora quieres que termine tu día de hábitos? (formato 24 horas)</Hint>
                <div className="mt-2">
                  <Select
                    value={settings.cierre_dia_hora.toString()}
                    onChange={(value) => updateSettings({ cierre_dia_hora: parseInt(value) })}
                    options={Array.from({ length: 24 }, (_, i) => ({
                      label: i.toString().padStart(2, '0') + ':00',
                      value: i.toString()
                    }))}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  * Los hábitos se resetearán automáticamente a esta hora
                </div>
                {saving && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-emerald-400">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Guardando...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Almacenamiento y Caché */}
      <Card title="Almacenamiento" icon={Download}>
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <Row>
              <div>
                <Label>Borrar caché de la aplicación</Label>
                <Hint>Limpia los datos temporales de la aplicación. Esto puede ayudar si tienes problemas de rendimiento.</Hint>
                <div className="mt-2 text-xs text-gray-500">
                  * No afectará a tus datos guardados ni a otras aplicaciones
                </div>
              </div>
              <Button
                intent="ghost"
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que quieres borrar la caché de la aplicación? La página se recargará después de la limpieza.')) {
                    window.location.href = '/clearcookies';
                  }
                }}
              >
                Limpiar caché
              </Button>
            </Row>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
