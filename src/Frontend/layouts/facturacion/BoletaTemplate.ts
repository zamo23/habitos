interface BoletaData {
  pago: {
    id: string;
    fecha_pago: string;
    moneda: string;
    monto_centavos: number;
    plan: string;
    descripcion?: string;
    estado: string;
  };
  plan: {
    codigo: string;
    max_habitos: number | null;
    moneda: string;
    nombre: string;
    permite_grupos: boolean;
    precio_centavos: number;
  };
}

const CheckIcon = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" fill="#10b981" opacity="0.1"/>
  <path d="M17 9l-7 7-3-3" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export const generarBoletaHTML = ({ pago, plan }: BoletaData): string => {
  const maxHabitosText = plan.max_habitos === null ? "Ilimitado" : `${plan.max_habitos} hábitos`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Comprobante de Pago - Habitos</title>
      <style>
        :root {
          --primary-color: #10b981;
          --primary-light: #d1fae5;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --text-muted: #9ca3af;
          --border-color: #e5e7eb;
          --bg-light: #f9fafb;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }

        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 100%;
          margin: 0;
          padding: 0;
          background-color: var(--bg-light);
          color: var(--text-primary);
          line-height: 1.5;
        }

        @media screen {
          body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
        }

        .boleta {
          background-color: white;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 800px;
          margin: auto;
        }

        @media screen and (min-width: 640px) {
          .boleta {
            padding: 40px;
          }
        }

        @media screen and (max-width: 639px) {
          .boleta {
            padding: 24px;
            border-radius: 8px;
          }
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid var(--border-color);
        }

        .logo {
          font-size: clamp(24px, 5vw, 32px);
          font-weight: bold;
          color: var(--primary-color);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .logo svg {
          width: clamp(32px, 8vw, 40px);
          height: clamp(32px, 8vw, 40px);
        }

        .comprobante-titulo {
          font-size: clamp(16px, 4vw, 20px);
          color: var(--text-secondary);
        }

        .info-section {
          margin-bottom: 32px;
        }

        .info-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        @media screen and (min-width: 480px) {
          .info-row {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
          }
        }

        .info-label {
          font-weight: 500;
          color: var(--text-secondary);
          min-width: 140px;
        }

        .info-value {
          font-weight: 600;
          color: var(--text-primary);
          word-break: break-word;
        }

        @media screen and (max-width: 479px) {
          .info-value {
            width: 100%;
          }
        }

        .plan-details {
          background-color: var(--bg-light);
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
        }

        .total {
          margin-top: 32px;
          padding-top: 20px;
          border-top: 2px solid var(--border-color);
        }

        .total .info-label {
          font-size: 18px;
          color: var(--text-primary);
        }

        .total .info-value {
          font-size: clamp(20px, 5vw, 24px);
          color: var(--primary-color);
        }

        .estado {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 9999px;
          font-weight: 500;
          font-size: 14px;
          white-space: nowrap;
        }

        .estado.confirmado {
          background-color: var(--primary-light);
          color: #065f46;
        }

        .estado.pendiente {
          background-color: #fef3c7;
          color: #92400e;
        }

        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 14px;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      </style>
    </head>
    <body>
      <div class="boleta">
        <div class="header">
          <div class="logo">
            ${CheckIcon}
            Habitos
          </div>
          <div class="comprobante-titulo">Comprobante de Pago</div>
        </div>
        
        <div class="info-section">
          <div class="info-row">
            <span class="info-label">Número de Factura:</span>
            <span class="info-value">#${pago.id}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Fecha:</span>
            <span class="info-value">${new Date(pago.fecha_pago).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Estado:</span>
            <span class="info-value" style="color: ${pago.estado === 'confirmado' ? '#059669' : '#eab308'}">
              ${pago.estado === 'confirmado' ? '✓' : '⏳'} ${pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}
            </span>
          </div>
        </div>

        <div class="plan-details">
          <div class="info-row">
            <span class="info-label">Plan:</span>
            <span class="info-value">${plan.nombre}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Máximo de hábitos:</span>
            <span class="info-value">${maxHabitosText}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Grupos permitidos:</span>
            <span class="info-value">${plan.permite_grupos ? 'Sí' : 'No'}</span>
          </div>
          
          ${pago.descripcion ? `
          <div class="info-row">
            <span class="info-label">Descripción:</span>
            <span class="info-value">${pago.descripcion}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="total info-row">
          <span class="info-label">Total:</span>
          <span class="info-value">${pago.moneda} ${(pago.monto_centavos / 100).toFixed(2)}</span>
        </div>

        <div class="footer">
          Gracias por confiar en Habitos para el desarrollo de tus hábitos.
        </div>
      </div>
    </body>
    </html>
  `;
};