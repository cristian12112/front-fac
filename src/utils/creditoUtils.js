// Utilidades para gestión de crédito

// Calcular crédito utilizado por un cliente
export const calcularCreditoUtilizado = (clienteId, facturas) => {
  return facturas
    .filter(f =>
      f.clienteId === clienteId &&
      (f.estado === 'Pendiente' || f.estado === 'Aprobada')
    )
    .reduce((sum, f) => sum + parseFloat(f.monto || 0), 0)
}

// Calcular crédito disponible
export const calcularCreditoDisponible = (cliente, facturas) => {
  const lineaCredito = parseFloat(cliente.lineaCredito || 0)
  if (lineaCredito === 0) return Infinity // Sin límite

  const utilizado = calcularCreditoUtilizado(cliente.id, facturas)
  return lineaCredito - utilizado
}

// Validar si una factura excede el límite
export const validarLimitesCredito = (cliente, montoFactura, facturas) => {
  const monto = parseFloat(montoFactura)

  // Validar límite por factura
  const limiteFactura = parseFloat(cliente.limiteFactura || 0)
  if (limiteFactura > 0 && monto > limiteFactura) {
    return {
      valido: false,
      mensaje: `El monto excede el límite por factura de S/. ${limiteFactura.toLocaleString('es-PE', {minimumFractionDigits: 2})}`
    }
  }

  // Validar línea de crédito disponible
  const lineaCredito = parseFloat(cliente.lineaCredito || 0)
  if (lineaCredito > 0) {
    const disponible = calcularCreditoDisponible(cliente, facturas)
    if (monto > disponible) {
      return {
        valido: false,
        mensaje: `Crédito insuficiente. Disponible: S/. ${disponible.toLocaleString('es-PE', {minimumFractionDigits: 2})}`
      }
    }
  }

  return { valido: true, mensaje: '' }
}

// Calcular porcentaje de utilización de línea de crédito
export const calcularPorcentajeUtilizacion = (cliente, facturas) => {
  const lineaCredito = parseFloat(cliente.lineaCredito || 0)
  if (lineaCredito === 0) return 0

  const utilizado = calcularCreditoUtilizado(cliente.id, facturas)
  return (utilizado / lineaCredito) * 100
}

// Obtener nivel de alerta según utilización
export const getNivelAlerta = (porcentaje) => {
  if (porcentaje >= 90) return { nivel: 'critico', color: 'red', mensaje: 'Crítico' }
  if (porcentaje >= 80) return { nivel: 'alto', color: 'orange', mensaje: 'Alto' }
  if (porcentaje >= 60) return { nivel: 'medio', color: 'yellow', mensaje: 'Medio' }
  return { nivel: 'bajo', color: 'green', mensaje: 'Bajo' }
}

// Obtener clientes cerca del límite
export const getClientesCercaLimite = (clientes, facturas, umbral = 80) => {
  return clientes
    .filter(c => parseFloat(c.lineaCredito || 0) > 0)
    .map(cliente => {
      const porcentaje = calcularPorcentajeUtilizacion(cliente, facturas)
      return { ...cliente, porcentajeUtilizacion: porcentaje }
    })
    .filter(c => c.porcentajeUtilizacion >= umbral)
    .sort((a, b) => b.porcentajeUtilizacion - a.porcentajeUtilizacion)
}
