# Implementación del Coach con IA

## 📋 Resumen

Se ha implementado una funcionalidad completa de "Coach con IA" que se integra en la página de Reportes. El sistema genera consejos personalizados basados en el progreso del usuario utilizando Google Gemini.

## 🏗️ Arquitectura

### Hooks Creados

#### `useCoachIA.tsx`
Hook personalizado que gestiona la comunicación con los endpoints del Coach con IA.

**Funcionalidades:**
- Obtener consejos diarios del endpoint `/api/ia-coach/consejo-diario`
- Registrar interacciones con consejos en `/api/ia-coach/interaccion`
- Actualizar/generar nuevos consejos en `/api/ia-coach/actualizar-consejo`
- Gestionar estados de carga y errores
- Actualizar localmente el estado de consejos leídos

**Estados Devueltos:**
```typescript
{
  consejos: Consejo[]              // Lista de consejos del día
  loading: boolean                  // Estado de carga
  error: string | null              // Mensaje de error si existe
  fecha: string                      // Fecha de los consejos
  registrarInteraccion: (id, accion) => Promise<boolean>
  recargarConsejos: () => Promise<void>
  actualizarConsejos: () => Promise<boolean>
}
```

### Componentes Creados

#### `ConsejoCard.tsx`
Componente que renderiza una tarjeta individual de un consejo.

**Características:**
- Muestra icono y color según el tipo de consejo
- Contenido expandible (ver más / ver menos)
- Botones de acción: visto, seguido, archivado, ignorado
- Indicador de fecha y estado de lectura
- Soporte para markdown simple en el contenido

**Tipos de consejos:**
- `motivacion` ❤️ - Para motivar al usuario
- `mejora_habito` 💡 - Sugerencias de mejora
- `reto` ⚡ - Desafíos para completar
- `celebracion` 🏆 - Celebración de logros

#### `CoachIASection.tsx`
Sección principal que agrupa la funcionalidad del Coach.

**Características:**
- Header con información del coach
- Botón para recargar consejos (obtener los guardados)
- Botón para generar nuevos consejos (regenerar con IA)
- Gestión de estados: carga, error, vacío
- Visualización de grid de consejos
- Resumen de consejos leídos
- Información educativa sobre el uso

### Integración en Reportes

El componente `CoachIASection` se integra en la página `reportes.tsx` en la siguiente sección:

```tsx
{/* Coach con IA - Activo */}
<section className="space-y-3">
  <CoachIASection />
</section>
```

## 🔌 Endpoints Utilizados

### 1. Obtener Consejo Diario

```
GET /api/ia-coach/consejo-diario
```

**Headers Requeridos:**
```
Authorization: Bearer {TOKEN_CLERK}
Content-Type: application/json
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "consejos": [
      {
        "id": "uuid",
        "tipo": "motivacion",
        "titulo": "¡Vas muy bien esta semana!",
        "contenido": "### 🎯 ¡Vamos que vas fuerte!\n\nHe analizado tu progreso...",
        "leido": true,
        "generado_en": "2025-12-05T22:00:00"
      }
    ],
    "total_consejos": 2,
    "fecha": "2025-12-05"
  }
}
```

### 2. Registrar Interacción

```
POST /api/ia-coach/interaccion
```

**Headers Requeridos:**
```
Authorization: Bearer {TOKEN_CLERK}
Content-Type: application/json
```

**Body:**
```json
{
  "id_consejo": "uuid",
  "accion": "seguido"  // "visto" | "archivado" | "seguido" | "ignorado"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Interacción registrada correctamente"
}
```

### 3. Actualizar/Generar Nuevos Consejos

```
POST /api/ia-coach/actualizar-consejo
```

**Headers Requeridos:**
```
Authorization: Bearer {TOKEN_CLERK}
Content-Type: application/json
```

**Body:** (vacío)

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "consejos": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "tipo_consejo": "motivacion",
        "titulo": "¡Vas muy bien esta semana!",
        "contenido": "# 🎯 ¡Vas muy bien esta semana!\n\nHe analizado tu progreso esta semana y estoy impresionado.\nCompletaste 35 de 42 hábitos (83% de éxito). Eso es excelente.",
        "leido": false,
        "generado_en": "2025-12-06T22:00:00"
      }
    ],
    "total_consejos": 1,
    "fecha": "2025-12-06",
    "actualizado": true
  }
}
```

**Respuesta Error (401):**
```json
{
  "success": false,
  "message": "No se pudo obtener el ID del usuario"
}
```

**Respuesta Error (400):**
```json
{
  "success": false,
  "message": "Error de validación"
}
```

**Respuesta Error (500):**
```json
{
  "success": false,
  "message": "Error al generar el consejo del día",
  "error": "Detalles del error (solo en DEBUG=True)"
}
```

## 🎨 Características de Diseño

### Estilos y Colores

- **Motivación**: Rojo (#ef4444) - Para consejos motivacionales
- **Mejora de Hábito**: Amarillo (#f59e0b) - Para sugerencias de mejora
- **Reto**: Naranja (#ea580c) - Para desafíos
- **Celebración**: Verde (#10b981) - Para logros

### Estados Visuales

1. **Cargando**: Spinner animado con ícono del bot
2. **Error**: Banner rojo con mensaje de error
3. **Vacío**: Mensaje informativo para cuando no hay consejos
4. **Consejos**: Grid responsive con tarjetas expandibles

## 📱 Responsividad

- **Desktop**: 1 columna de consejos
- **Adapts**: Los botones de acción se adaptan a dispositivos móviles
- **Hover Effects**: Sombra y transiciones suaves en las tarjetas

## 🔄 Flujo de Funcionamiento

## 🔄 Flujo de Funcionamiento

### Botones Disponibles

#### 1. **Recargar** (Botón Azul - RotateCw)
- Obtiene los consejos ya generados del día
- Usa endpoint: `GET /api/ia-coach/consejo-diario`
- Útil cuando necesitas ver los consejos nuevamente
- No regenera consejos, solo recarga los existentes

#### 2. **Nuevos Consejos** (Botón Morado - Zap)
- Fuerza la regeneración de nuevos consejos con Google Gemini
- Usa endpoint: `POST /api/ia-coach/actualizar-consejo`
- Genera consejos completamente nuevos basados en el progreso actual
- Marca los nuevos consejos como no leídos
- Reemplaza los consejos anteriores del día

### Flujo Detallado

1. **Primera solicitud del día**:
   - El usuario abre la sección del Coach
   - Se obtienen los consejos con `GET /api/ia-coach/consejo-diario`
   - Backend genera consejos con Google Gemini
   - Los consejos se marcan como `leido: true` automáticamente
   - Se cachean en el backend para el resto del día

2. **Recargar durante el día**:
   - El usuario hace clic en "Recargar"
   - Se obtienen los mismos consejos generados anteriormente
   - Sin llamadas adicionales a Google Gemini

3. **Generar nuevos consejos**:
   - El usuario hace clic en "Nuevos Consejos"
   - Se realiza POST a `/api/ia-coach/actualizar-consejo`
   - Backend fuerza la regeneración con Google Gemini
   - Los nuevos consejos se marcan como `leido: false`
   - Los consejos anteriores son reemplazados

4. **Interacciones del usuario**:
   - Al hacer clic en acciones (seguido, archivado, ignorado)
   - Se registra en `/api/ia-coach/interaccion`
   - El estado local se actualiza inmediatamente
   - Se guardan para análisis posterior

## 📦 Dependencias

- `@clerk/clerk-react` - Para autenticación
- `lucide-react` - Para iconos
- `recharts` - (Disponible si se necesitan gráficos en el futuro)

## 🛠️ Buenas Prácticas Implementadas

✅ **Manejo de errores**: Try-catch en funciones async
✅ **Estados de carga**: Componentes informativos para cada estado
✅ **Validación**: Verificación de token antes de hacer requests
✅ **TypeScript**: Tipos explícitos para todo
✅ **Componentes reutilizables**: `ConsejoCard` es independiente
✅ **Optimización**: Actualización local del estado para mejor UX
✅ **Accesibilidad**: Títulos descriptivos en botones
✅ **Responsive**: Diseño adaptativo a todos los dispositivos
✅ **Markdown support**: Renderizado básico de markdown en consejos
✅ **Separación de responsabilidades**: Hook para lógica, componentes para UI

## 📝 Uso en Componentes

### Usar el hook directamente:

```tsx
import { useCoachIA } from "../hooks/useCoachIA";

function MiComponente() {
  const { consejos, loading, registrarInteraccion } = useCoachIA();
  
  const handleSeguir = async (id: string) => {
    await registrarInteraccion(id, "seguido");
  };
  
  return (
    // Tu UI aquí
  );
}
```

### Usar el componente completo:

```tsx
import CoachIASection from "../components/CoachIASection";

export default function Reportes() {
  return (
    <div>
      <CoachIASection />
    </div>
  );
}
```

## 🚀 Próximas Mejoras Posibles

- Filtrar consejos por tipo
- Historial de consejos archivados
- Estadísticas de qué acciones fueron más comunes
- Integración con notificaciones para nuevos consejos
- Compartir consejos con amigos
- Seguimiento de consejos seguidos
