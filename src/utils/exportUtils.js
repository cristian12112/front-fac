import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Exportar a Excel
export const exportToExcel = (data, filename = 'factura') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Factura');

  // Ajustar ancho de columnas
  const cols = Object.keys(data[0] || {}).map(() => ({ wch: 20 }));
  worksheet['!cols'] = cols;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Exportar a XML
export const exportToXML = (factura, filename = 'factura') => {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Factura>
  <NumeroFactura>${factura.numeroFactura}</NumeroFactura>
  <Cliente>
    <Nombre>${factura.clienteNombre}</Nombre>
    <ID>${factura.clienteId}</ID>
  </Cliente>
  <EntidadFinanciera>
    <Nombre>${factura.entidadNombre}</Nombre>
    <ID>${factura.entidadId}</ID>
  </EntidadFinanciera>
  <Monto>${factura.monto}</Monto>
  <Moneda>PEN</Moneda>
  <FechaEmision>${factura.fechaEmision}</FechaEmision>
  <FechaVencimiento>${factura.fechaVencimiento}</FechaVencimiento>
  <TasaDescuento>${factura.tasaDescuento}</TasaDescuento>
  <Estado>${factura.estado}</Estado>
  <ModalidadPago>${factura.modalidadPago || 'No especificado'}</ModalidadPago>
  <ArchivoAdjunto>${factura.archivoNombre || 'N/A'}</ArchivoAdjunto>
</Factura>`;

  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Exportar a PDF
export const exportToPDF = (factura, filename = 'factura') => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246); // Blue
  doc.text('FACTURA DE FACTORING', 105, 20, { align: 'center' });

  // Línea decorativa
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);

  // Información de la factura
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  const startY = 35;
  const lineHeight = 8;

  // Información general
  doc.setFont(undefined, 'bold');
  doc.text('INFORMACIÓN GENERAL', 20, startY);
  doc.setFont(undefined, 'normal');

  doc.text(`Número de Factura:`, 20, startY + lineHeight);
  doc.text(factura.numeroFactura, 80, startY + lineHeight);

  doc.text(`Estado:`, 20, startY + lineHeight * 2);
  doc.text(factura.estado, 80, startY + lineHeight * 2);

  doc.text(`Fecha de Emisión:`, 20, startY + lineHeight * 3);
  doc.text(factura.fechaEmision, 80, startY + lineHeight * 3);

  doc.text(`Fecha de Vencimiento:`, 20, startY + lineHeight * 4);
  doc.text(factura.fechaVencimiento, 80, startY + lineHeight * 4);

  // Cliente
  doc.setFont(undefined, 'bold');
  doc.text('INFORMACIÓN DEL CLIENTE', 20, startY + lineHeight * 6);
  doc.setFont(undefined, 'normal');

  doc.text(`Cliente:`, 20, startY + lineHeight * 7);
  doc.text(factura.clienteNombre, 80, startY + lineHeight * 7);

  // Entidad Financiera
  doc.setFont(undefined, 'bold');
  doc.text('ENTIDAD FINANCIERA', 20, startY + lineHeight * 9);
  doc.setFont(undefined, 'normal');

  doc.text(`Entidad:`, 20, startY + lineHeight * 10);
  doc.text(factura.entidadNombre, 80, startY + lineHeight * 10);

  // Detalles financieros
  doc.setFont(undefined, 'bold');
  doc.text('DETALLES FINANCIEROS', 20, startY + lineHeight * 12);
  doc.setFont(undefined, 'normal');

  doc.text(`Monto:`, 20, startY + lineHeight * 13);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(22, 163, 74); // Green
  doc.text(`S/. ${parseFloat(factura.monto).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, 80, startY + lineHeight * 13);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');

  doc.text(`Tasa de Descuento:`, 20, startY + lineHeight * 14);
  doc.text(`${factura.tasaDescuento}%`, 80, startY + lineHeight * 14);

  doc.text(`Modalidad de Pago:`, 20, startY + lineHeight * 15);
  doc.text(factura.modalidadPago || 'No especificado', 80, startY + lineHeight * 15);

  // Archivo adjunto
  if (factura.archivoNombre) {
    doc.text(`Archivo Adjunto:`, 20, startY + lineHeight * 16);
    doc.text(factura.archivoNombre, 80, startY + lineHeight * 16);
  }

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text('Documento generado por Sistema de Factoring Pro', 105, 280, { align: 'center' });
  doc.text(new Date().toLocaleString('es-PE'), 105, 285, { align: 'center' });

  // Guardar PDF
  doc.save(`${filename}.pdf`);
};

// Exportar múltiples facturas a Excel
export const exportMultipleToExcel = (facturas, filename = 'facturas') => {
  const data = facturas.map(f => ({
    'Número': f.numeroFactura,
    'Cliente': f.clienteNombre,
    'Entidad': f.entidadNombre,
    'Monto': parseFloat(f.monto),
    'Fecha Emisión': f.fechaEmision,
    'Fecha Vencimiento': f.fechaVencimiento,
    'Tasa %': f.tasaDescuento,
    'Estado': f.estado,
    'Modalidad': f.modalidadPago || 'N/A'
  }));

  exportToExcel(data, filename);
};
