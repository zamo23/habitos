import { Plan, Pago } from '../../../Backend/Dao/FacturacionDAO';

interface BoletaProps {
  pago: Pago;
  plan: Plan;
}

export const generarBoletaHTML = ({ pago, plan }: BoletaProps): string => {
  const fecha = new Date(pago.fecha_pago).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Comprobante de Pago - Habitos</title>
      <style>
        :root {
          --primary-color: #10b981;
          --border-color: #e5e7eb;
          --text-primary: #111827;
          --text-secondary: #4b5563;
        }

        body {
          font-family: 'Segoe UI', system-ui, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          color: var(--text-primary);
          line-height: 1.5;
        }

        .boleta {
          border: 1px solid var(--border-color);
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid var(--border-color);
        }

        .logo-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }

        .logo {
          width: 50px;
          height: 50px;
          margin-right: 15px;
        }

        .brand {
          font-size: 32px;
          font-weight: 700;
          color: var(--primary-color);
        }

        .titulo-comprobante {
          font-size: 24px;
          color: var(--text-secondary);
          margin-top: 10px;
        }

        .info-section {
          margin-bottom: 30px;
        }

        .info-section h2 {
          font-size: 18px;
          color: var(--text-secondary);
          margin-bottom: 15px;
          font-weight: 600;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 8px 0;
        }

        .info-label {
          font-weight: 500;
          color: var(--text-secondary);
        }

        .info-value {
          font-weight: 600;
        }

        .plan-details {
          background-color: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }

        .total {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid var(--border-color);
        }

        .total .info-row {
          font-size: 20px;
        }

        .total .info-value {
          color: var(--primary-color);
          font-size: 24px;
        }

        .footer {
          margin-top: 40px;
          text-align: center;
          color: var(--text-secondary);
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="boleta">
        <div class="header">
          <div class="logo-container">
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMxMGI5ODEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjIgMTEuMDhWMTJhMTAgMTAgMCAxIDEtNS45My05LjE0Ii8+PHBvbHlsaW5lIHBvaW50cz0iMjIgNCAxMiAxNC4wMSA5IDExLjAxIi8+PC9zdmc+" 
                 alt="Habitos Logo" 
                 class="logo">
            <div class="brand">Habitos</div>
          </div>
          <div class="titulo-comprobante">Comprobante de Pago</div>
        </div>

        <div class="info-section">
          <h2>Detalles del Pago</h2>
          <div class="info-row">
            <span class="info-label">Número de Factura:</span>
            <span class="info-value">#${pago.id}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Fecha:</span>
            <span class="info-value">${fecha}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Estado:</span>
            <span class="info-value" style="color: ${pago.estado === 'confirmado' ? '#059669' : '#eab308'}">
              ${pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}
            </span>
          </div>
        </div>

        <div class="info-section">
          <h2>Detalles del Plan</h2>
          <div class="plan-details">
            <div class="info-row">
              <span class="info-label">Plan:</span>
              <span class="info-value">${plan.nombre}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Máximo de Hábitos:</span>
              <span class="info-value">${plan.max_habitos}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Grupos Permitidos:</span>
              <span class="info-value">${plan.permite_grupos ? 'Sí' : 'No'}</span>
            </div>
            ${pago.descripcion ? `
            <div class="info-row">
              <span class="info-label">Descripción:</span>
              <span class="info-value">${pago.descripcion}</span>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="total">
          <div class="info-row">
            <span class="info-label">Total:</span>
            <span class="info-value">
              ${plan.moneda} ${(pago.monto_centavos / 100).toFixed(2)}
            </span>
          </div>
        </div>

        <div class="footer">
          <p>Gracias por confiar en Habitos</p>
          <p>Este documento no tiene valor fiscal</p>
          <p>Fecha de emisión: ${new Date().toLocaleDateString("es-ES")}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
