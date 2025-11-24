// Validación de RUC peruano (11 dígitos con checksum)
export const validarRUC = (ruc) => {
  if (!ruc || ruc.length !== 11) return false

  // Solo números
  if (!/^\d{11}$/.test(ruc)) return false

  // Debe empezar con 10, 15, 16, 17 o 20
  const prefijo = ruc.substring(0, 2)
  if (!['10', '15', '16', '17', '20'].includes(prefijo)) return false

  // Validar dígito verificador
  const factores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
  let suma = 0

  for (let i = 0; i < 10; i++) {
    suma += parseInt(ruc.charAt(i)) * factores[i]
  }

  const resto = suma % 11
  const digitoVerificador = resto === 0 ? 0 : resto === 1 ? 1 : 11 - resto

  return parseInt(ruc.charAt(10)) === digitoVerificador
}

// Validación de DNI peruano (8 dígitos)
export const validarDNI = (dni) => {
  if (!dni || dni.length !== 8) return false

  // Solo números
  if (!/^\d{8}$/.test(dni)) return false

  return true
}

// Validación de CE (Carnet de Extranjería)
export const validarCE = (ce) => {
  if (!ce || ce.length < 9 || ce.length > 12) return false

  // Puede contener letras y números
  if (!/^[A-Z0-9]+$/i.test(ce)) return false

  return true
}

// Validación de Pasaporte
export const validarPasaporte = (pasaporte) => {
  if (!pasaporte || pasaporte.length < 6 || pasaporte.length > 12) return false

  // Puede contener letras y números
  if (!/^[A-Z0-9]+$/i.test(pasaporte)) return false

  return true
}

// Validar documento según tipo
export const validarDocumento = (tipo, numero) => {
  switch (tipo) {
    case 'RUC':
      return validarRUC(numero)
    case 'DNI':
      return validarDNI(numero)
    case 'CE':
      return validarCE(numero)
    case 'Pasaporte':
      return validarPasaporte(numero)
    default:
      return false
  }
}

// Validar email
export const validarEmail = (email) => {
  if (!email) return true // Email es opcional
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Validar teléfono peruano
export const validarTelefono = (telefono) => {
  if (!telefono) return true // Teléfono es opcional

  // 9 dígitos, opcionalmente puede empezar con +51
  const regex = /^(\+51)?[0-9]{9}$/
  return regex.test(telefono.replace(/\s/g, ''))
}

// Validar que fecha2 sea posterior a fecha1
export const validarFechaPosterior = (fecha1, fecha2) => {
  if (!fecha1 || !fecha2) return false
  return new Date(fecha2) > new Date(fecha1)
}

// Validar que la fecha no sea futura
export const validarFechaNoFutura = (fecha) => {
  if (!fecha) return false
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return new Date(fecha) <= hoy
}

// Validar monto
export const validarMonto = (monto, min = 0, max = Infinity) => {
  const num = parseFloat(monto)
  if (isNaN(num)) return false
  return num > min && num <= max
}

// Validar tasa de descuento
export const validarTasa = (tasa) => {
  const num = parseFloat(tasa)
  if (isNaN(num)) return false
  return num >= 0 && num <= 100
}

// Calcular días entre fechas
export const calcularDias = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio)
  const fin = new Date(fechaFin)
  const diferencia = fin - inicio
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24))
}

// Calcular monto neto después del descuento
export const calcularMontoNeto = (monto, tasaDescuento, dias) => {
  const montoNum = parseFloat(monto)
  const tasaNum = parseFloat(tasaDescuento)

  if (isNaN(montoNum) || isNaN(tasaNum) || isNaN(dias)) return 0

  // Fórmula: Monto - (Monto * Tasa/100 * Días/360)
  const descuento = montoNum * (tasaNum / 100) * (dias / 360)
  return montoNum - descuento
}

// Calcular el descuento total
export const calcularDescuento = (monto, tasaDescuento, dias) => {
  const montoNum = parseFloat(monto)
  const tasaNum = parseFloat(tasaDescuento)

  if (isNaN(montoNum) || isNaN(tasaNum) || isNaN(dias)) return 0

  return montoNum * (tasaNum / 100) * (dias / 360)
}

// Verificar si un documento ya existe en la lista
export const existeDocumento = (documento, listaClientes, idActual = null) => {
  return listaClientes.some(cliente =>
    cliente.documento === documento && cliente.id !== idActual
  )
}

// Verificar si un número de factura ya existe
export const existeNumeroFactura = (numeroFactura, listaFacturas, idActual = null) => {
  return listaFacturas.some(factura =>
    factura.numeroFactura === numeroFactura && factura.id !== idActual
  )
}

// Obtener mensaje de error para documento
export const getMensajeErrorDocumento = (tipo, numero) => {
  if (!numero) return `El ${tipo} es requerido`

  switch (tipo) {
    case 'RUC':
      if (numero.length !== 11) return 'El RUC debe tener 11 dígitos'
      if (!/^\d{11}$/.test(numero)) return 'El RUC solo debe contener números'
      if (!validarRUC(numero)) return 'El RUC no es válido (dígito verificador incorrecto)'
      break
    case 'DNI':
      if (numero.length !== 8) return 'El DNI debe tener 8 dígitos'
      if (!/^\d{8}$/.test(numero)) return 'El DNI solo debe contener números'
      break
    case 'CE':
      if (numero.length < 9 || numero.length > 12) return 'El CE debe tener entre 9 y 12 caracteres'
      break
    case 'Pasaporte':
      if (numero.length < 6 || numero.length > 12) return 'El Pasaporte debe tener entre 6 y 12 caracteres'
      break
  }

  return null
}
