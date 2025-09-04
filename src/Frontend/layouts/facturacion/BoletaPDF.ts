import html2pdf from "html2pdf.js";

interface GenerarPDFOptions {
  filename: string;
  html: string;
}

export const generarPDF = async ({ filename, html }: GenerarPDFOptions): Promise<void> => {
  if (!navigator.onLine) {
    throw new Error('No hay conexión a internet. Por favor, verifica tu conexión.');
  }

  const tempElement = document.createElement('div');
  tempElement.style.position = 'absolute';
  tempElement.style.left = '-9999px';
  tempElement.style.top = '-9999px';
  tempElement.innerHTML = html;
  document.body.appendChild(tempElement);

  try {
    const options = {
      margin: 10,
      filename: filename,
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };

    await new Promise(resolve => setTimeout(resolve, 500));

    const pdf = await html2pdf()
      .from(tempElement)
      .set(options)
      .toPdf()
      .get('pdf');

    pdf.save(filename);

  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Hubo un error al generar el PDF. Por favor, intenta de nuevo.'
    );
  } finally {
    if (document.body.contains(tempElement)) {
      document.body.removeChild(tempElement);
    }
  }
};

