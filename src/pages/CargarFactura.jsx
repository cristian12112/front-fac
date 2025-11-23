import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { notify } from '../utils/notify'
import { exportToXML, exportToExcel, exportToPDF } from '../utils/exportUtils'

export default function CargarFactura() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [clientes, setClientes] = useState([])
  const [entidades, setEntidades] = useState([])
  const [archivoFactura, setArchivoFactura] = useState(null)
  const [facturaCreada, setFacturaCreada] = useState(null)

  const [formData, setFormData] = useState({
    clienteId: '',
    clienteNombre: '',
    numeroFactura: '',
    monto: '',
    fechaEmision: '',
    fechaVencimiento: '',
    tasaDescuento: '',
    modalidadPago: '',
    entidadId: '',
    entidadNombre: '',
    archivoNombre: '',
    estado: 'Pendiente'
  })

  useEffect(() => {
    const savedClientes = JSON.parse(localStorage.getItem('mock_clients') || '[]')
    const savedEntidades = JSON.parse(localStorage.getItem('mock_entidades') || '[]')
    setClientes(savedClientes)
    setEntidades(savedEntidades)
  }, [])

  const steps = [
    { number: 1, title: 'Seleccionar Cliente', icon: '👤' },
    { number: 2, title: 'Cargar Factura', icon: '📄' },
    { number: 3, title: 'Modalidad de Pago', icon: '💳' },
    { number: 4, title: 'Entidad Financiera', icon: '🏦' },
    { number: 5, title: 'Descargar Documentos', icon: '📥' }
  ]

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 4) {
        // Guardar factura antes de ir al paso 5
        guardarFactura()
      }
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.clienteId) {
          notify.warning('Por favor selecciona un cliente')
          return false
        }
        return true
      case 2:
        if (!formData.numeroFactura || !formData.monto || !formData.fechaEmision || !formData.fechaVencimiento) {
          notify.warning('Por favor completa todos los campos de la factura')
          return false
        }
        if (!archivoFactura) {
          notify.warning('Por favor carga el archivo de la factura')
          return false
        }
        return true
      case 3:
        if (!formData.modalidadPago) {
          notify.warning('Por favor selecciona una modalidad de pago')
          return false
        }
        return true
      case 4:
        if (!formData.entidadId) {
          notify.warning('Por favor selecciona una entidad financiera')
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleClienteChange = (e) => {
    const clienteId = e.target.value
    const cliente = clientes.find(c => c.id === parseInt(clienteId))
    setFormData({
      ...formData,
      clienteId,
      clienteNombre: cliente ? cliente.nombre : ''
    })
  }

  const handleEntidadChange = (e) => {
    const entidadId = e.target.value
    const entidad = entidades.find(e => e.id === parseInt(entidadId))
    setFormData({
      ...formData,
      entidadId,
      entidadNombre: entidad ? entidad.nombre : '',
      tasaDescuento: entidad ? entidad.tasaInteres : formData.tasaDescuento
    })
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setArchivoFactura(file)
      setFormData({
        ...formData,
        archivoNombre: file.name
      })
      notify.success(`Archivo ${file.name} cargado correctamente`)
    }
  }

  const guardarFactura = () => {
    const facturas = JSON.parse(localStorage.getItem('mock_facturas') || '[]')
    const newId = facturas.length > 0 ? Math.max(...facturas.map(f => f.id)) + 1 : 1

    const nuevaFactura = {
      id: newId,
      ...formData,
      monto: parseFloat(formData.monto)
    }

    facturas.push(nuevaFactura)
    localStorage.setItem('mock_facturas', JSON.stringify(facturas))
    setFacturaCreada(nuevaFactura)
    notify.success('Factura guardada exitosamente')
  }

  const handleExportXML = () => {
    if (facturaCreada) {
      exportToXML(facturaCreada, `factura_${facturaCreada.numeroFactura}`)
      notify.success('XML descargado correctamente')
    }
  }

  const handleExportExcel = () => {
    if (facturaCreada) {
      const data = [{
        'Número Factura': facturaCreada.numeroFactura,
        'Cliente': facturaCreada.clienteNombre,
        'Entidad': facturaCreada.entidadNombre,
        'Monto': facturaCreada.monto,
        'Fecha Emisión': facturaCreada.fechaEmision,
        'Fecha Vencimiento': facturaCreada.fechaVencimiento,
        'Tasa %': facturaCreada.tasaDescuento,
        'Modalidad': facturaCreada.modalidadPago,
        'Estado': facturaCreada.estado
      }]
      exportToExcel(data, `factura_${facturaCreada.numeroFactura}`)
      notify.success('Excel descargado correctamente')
    }
  }

  const handleExportPDF = () => {
    if (facturaCreada) {
      exportToPDF(facturaCreada, `factura_${facturaCreada.numeroFactura}`)
      notify.success('PDF descargado correctamente')
    }
  }

  const handleFinalizar = () => {
    notify.success('Proceso completado exitosamente')
    navigate('/factura')
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Cargar Nueva Factura</h2>
        <p className="text-gray-600 dark:text-gray-400">Sigue los pasos para registrar una nueva factura</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                  currentStep === step.number
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white scale-110 shadow-lg'
                    : currentStep > step.number
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {currentStep > step.number ? '✓' : step.icon}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-semibold ${
                    currentStep >= step.number ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    Paso {step.number}
                  </div>
                  <div className={`text-xs ${
                    currentStep >= step.number ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'
                  }`}>
                    {step.title}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                  currentStep > step.number ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 min-h-[400px]">

        {/* Paso 1: Seleccionar Cliente */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Selecciona el Cliente</h3>
              <p className="text-gray-600 dark:text-gray-400">Elige el cliente asociado a esta factura</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Cliente *
              </label>
              <select
                value={formData.clienteId}
                onChange={handleClienteChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all text-lg"
              >
                <option value="">-- Seleccionar Cliente --</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} - {cliente.documento}
                  </option>
                ))}
              </select>

              {formData.clienteId && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Cliente Seleccionado:</h4>
                  <p className="text-gray-700 dark:text-gray-300">{formData.clienteNombre}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Paso 2: Cargar Factura */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Datos de la Factura</h3>
              <p className="text-gray-600 dark:text-gray-400">Ingresa los detalles y carga el archivo</p>
            </div>

            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número de Factura *
                </label>
                <input
                  type="text"
                  value={formData.numeroFactura}
                  onChange={e => setFormData({...formData, numeroFactura: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="F001-00001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monto (S/.) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.monto}
                  onChange={e => setFormData({...formData, monto: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha de Emisión *
                </label>
                <input
                  type="date"
                  value={formData.fechaEmision}
                  onChange={e => setFormData({...formData, fechaEmision: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha de Vencimiento *
                </label>
                <input
                  type="date"
                  value={formData.fechaVencimiento}
                  onChange={e => setFormData({...formData, fechaVencimiento: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cargar Archivo de Factura *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Subir archivo</span>
                        <input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png,.xml"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PDF, JPG, PNG, XML hasta 10MB
                    </p>
                  </div>
                </div>
                {archivoFactura && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-800 dark:text-green-300 font-medium">{archivoFactura.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Paso 3: Modalidad de Pago */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Modalidad de Pago</h3>
              <p className="text-gray-600 dark:text-gray-400">Selecciona cómo se realizará el pago</p>
            </div>

            <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Descuento Directo', 'Cobranza', 'Confirming', 'Factoring con Recurso', 'Factoring sin Recurso'].map((modalidad) => (
                <label
                  key={modalidad}
                  className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.modalidadPago === modalidad
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="modalidad"
                    value={modalidad}
                    checked={formData.modalidadPago === modalidad}
                    onChange={e => setFormData({...formData, modalidadPago: e.target.value})}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-800 dark:text-white font-medium">{modalidad}</span>
                  {formData.modalidadPago === modalidad && (
                    <svg className="absolute top-2 right-2 w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Paso 4: Entidad Financiera */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Entidad Financiera</h3>
              <p className="text-gray-600 dark:text-gray-400">Selecciona la entidad que financiará la factura</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 gap-4">
                {entidades.map(entidad => (
                  <label
                    key={entidad.id}
                    className={`relative flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.entidadId === entidad.id.toString()
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 shadow-lg'
                        : 'border-gray-300 dark:border-gray-600 hover:border-cyan-300 hover:shadow-md'
                    }`}
                  >
                    <input
                      type="radio"
                      name="entidad"
                      value={entidad.id}
                      checked={formData.entidadId === entidad.id.toString()}
                      onChange={handleEntidadChange}
                      className="w-5 h-5 text-cyan-600 focus:ring-cyan-500"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-gray-800 dark:text-white">{entidad.nombre}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{entidad.tipo} - {entidad.ruc}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 dark:text-gray-400">Tasa de Interés</div>
                          <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{entidad.tasaInteres}%</div>
                        </div>
                      </div>
                    </div>
                    {formData.entidadId === entidad.id.toString() && (
                      <svg className="absolute top-3 right-3 w-7 h-7 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Paso 5: Descargar Documentos */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">¡Factura Registrada Exitosamente!</h3>
              <p className="text-gray-600 dark:text-gray-400">Descarga los documentos en el formato que prefieras</p>
            </div>

            {facturaCreada && (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Resumen */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Resumen de la Factura</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Número:</span>
                      <p className="font-semibold text-gray-800 dark:text-white">{facturaCreada.numeroFactura}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Cliente:</span>
                      <p className="font-semibold text-gray-800 dark:text-white">{facturaCreada.clienteNombre}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Monto:</span>
                      <p className="font-semibold text-green-600 dark:text-green-400">S/. {parseFloat(facturaCreada.monto).toLocaleString('es-PE', {minimumFractionDigits: 2})}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Entidad:</span>
                      <p className="font-semibold text-gray-800 dark:text-white">{facturaCreada.entidadNombre}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Modalidad:</span>
                      <p className="font-semibold text-gray-800 dark:text-white">{facturaCreada.modalidadPago}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Tasa:</span>
                      <p className="font-semibold text-cyan-600 dark:text-cyan-400">{facturaCreada.tasaDescuento}%</p>
                    </div>
                  </div>
                </div>

                {/* Botones de descarga */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={handleExportXML}
                    className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>Descargar XML</span>
                    </div>
                  </button>

                  <button
                    onClick={handleExportExcel}
                    className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Descargar Excel</span>
                    </div>
                  </button>

                  <button
                    onClick={handleExportPDF}
                    className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-pink-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Descargar PDF</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            currentStep === 1
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-500 hover:bg-gray-600 text-white shadow-md hover:shadow-lg'
          }`}
        >
          ← Anterior
        </button>

        {currentStep < 5 ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Siguiente →
          </button>
        ) : (
          <button
            onClick={handleFinalizar}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Finalizar ✓
          </button>
        )}
      </div>
    </main>
  )
}
