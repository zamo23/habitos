import React, { useState } from "react";
import {
  ThumbsUp,
  Archive,
  Eye,
  EyeOff,
  Lightbulb,
  Award,
  Zap,
  Heart,
  Loader,
} from "lucide-react";
import { Consejo } from "../hooks/useCoachIA";

interface ConsejoCardProps {
  consejo: Consejo;
  onAccion?: (accion: "visto" | "archivado" | "seguido" | "ignorado") => Promise<boolean>;
}

const getIconoYColor = (tipo: Consejo["tipo"]) => {
  switch (tipo) {
    case "motivacion":
      return { icon: Heart, color: "text-red-400", bgColor: "bg-red-900/20", border: "border-red-400/20" };
    case "mejora_habito":
      return { icon: Lightbulb, color: "text-yellow-400", bgColor: "bg-yellow-900/20", border: "border-yellow-400/20" };
    case "reto":
      return { icon: Zap, color: "text-orange-400", bgColor: "bg-orange-900/20", border: "border-orange-400/20" };
    case "celebracion":
      return { icon: Award, color: "text-green-400", bgColor: "bg-green-900/20", border: "border-green-400/20" };
    case "felicitacion":
      return { icon: Award, color: "text-purple-400", bgColor: "bg-purple-900/20", border: "border-purple-400/20" };
    case "ruptura_racha":
      return { icon: Lightbulb, color: "text-blue-400", bgColor: "bg-blue-900/20", border: "border-blue-400/20" };
    default:
      return { icon: Lightbulb, color: "text-blue-400", bgColor: "bg-blue-900/20", border: "border-blue-400/20" };
  }
};

const etiquetaTipo: Record<Consejo["tipo"], string> = {
  motivacion: "Motivación",
  mejora_habito: "Mejora de Hábito",
  reto: "Reto",
  celebracion: "Celebración",
  felicitacion: "¡Felicitación!",
  ruptura_racha: "Ruptura de Racha",
};

// Helper function to render markdown text with bold support
const renderMarkdownText = (text: string) => {
  const parts: (string | React.ReactNode)[] = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the bold part
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    // Add bold part
    parts.push(
      <span key={`bold-${match.index}`} className="font-semibold text-white">
        {match[1]}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

const ConsejoCard: React.FC<ConsejoCardProps> = ({ consejo, onAccion }) => {
  const [loading, setLoading] = useState(false);
  const [expandido, setExpandido] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const { icon: Icon, color, bgColor, border } = getIconoYColor(consejo.tipo);

  React.useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      const clientHeight = contentRef.current.clientHeight;
      setNeedsExpand(scrollHeight > clientHeight + 10); // 10px de tolerancia
    }
  }, [consejo]);

  const handleAccion = async (accion: "visto" | "archivado" | "seguido" | "ignorado") => {
    setLoading(true);
    try {
      if (onAccion) {
        await onAccion(accion);
      }
    } finally {
      setLoading(false);
    }
  };

  const fecha = new Date(consejo.generado_en);
  const fechaFormato = fecha.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`rounded-xl border transition-all ${border} ${bgColor} p-4 hover:shadow-lg hover:shadow-current/20`}
    >
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`h-5 w-5 ${color}`} />
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${bgColor} ${color}`}>
              {etiquetaTipo[consejo.tipo]}
            </span>
            {consejo.leido && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Leído
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-white">{consejo.titulo}</h3>
        </div>
      </div>

      {/* Contenido */}
      <div className="mt-3">
        <div
          ref={contentRef}
          className={`text-sm text-gray-300 transition-all overflow-hidden ${
            expandido ? "max-h-none" : "max-h-24"
          }`}
        >
          <div className="prose prose-invert max-w-none text-sm">
            {/* Renderizar el contenido como markdown simple */}
            {consejo.contenido.split("\n").map((linea, i) => {
              // Detectar títulos (###)
              if (linea.startsWith("###")) {
                return (
                  <h3 key={i} className="font-semibold text-white mt-2 mb-1">
                    {renderMarkdownText(linea.replace(/^###\s*/, ""))}
                  </h3>
                );
              }
              // Detectar listas (-)
              if (linea.startsWith("-")) {
                return (
                  <div key={i} className="ml-4 text-gray-300">
                    • {renderMarkdownText(linea.replace(/^-\s*/, ""))}
                  </div>
                );
              }
              // Líneas normales
              if (linea.trim()) {
                return (
                  <p key={i} className="text-gray-300 mb-2">
                    {renderMarkdownText(linea)}
                  </p>
                );
              }
              return <div key={i} className="h-2" />;
            })}
          </div>
        </div>

        {!expandido && needsExpand && (
          <button
            onClick={() => setExpandido(true)}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            Leer más
          </button>
        )}

        {expandido && (
          <button
            onClick={() => setExpandido(false)}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            Mostrar menos
          </button>
        )}
      </div>

      {/* Pie con fecha y acciones */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="text-xs text-gray-500">{fechaFormato}</span>

        <div className="flex items-center gap-2">
          {/* Botón Marcar como visto */}
          <button
            onClick={() => handleAccion("visto")}
            disabled={loading || consejo.leido}
            className={`p-2 rounded-lg transition-colors ${
              consejo.leido
                ? "bg-gray-800/50 text-gray-600 cursor-default"
                : "bg-gray-800/50 text-gray-300 hover:bg-blue-900/30 hover:text-blue-400"
            }`}
            title={consejo.leido ? "Ya marcado como leído" : "Marcar como leído"}
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
          </button>

          {/* Botón Seguir consejo */}
          <button
            onClick={() => handleAccion("seguido")}
            disabled={loading}
            className="p-2 rounded-lg bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors disabled:opacity-50"
            title="Seguir este consejo"
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
          </button>

          {/* Botón Archivar */}
          <button
            onClick={() => handleAccion("archivado")}
            disabled={loading}
            className="p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-orange-900/30 hover:text-orange-400 transition-colors disabled:opacity-50"
            title="Archivar este consejo"
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
          </button>

          {/* Botón Ignorar */}
          <button
            onClick={() => handleAccion("ignorado")}
            disabled={loading}
            className="p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-red-900/30 hover:text-red-400 transition-colors disabled:opacity-50"
            title="Ignorar este consejo"
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsejoCard;
