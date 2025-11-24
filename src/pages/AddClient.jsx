import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { notify } from '../utils/notify'
import { buscarDatosRUC } from '../utils/sunatApi'
import { validarDocumento, validarEmail, validarTelefono, getMensajeErrorDocumento, existeDocumento } from '../utils/validations'

export default function AddClient(){
  const { id } = useParams()
  const [form, setForm] = useState({
    nombre:'', tipoDocumento:'RUC', documento:'', direccion:'', telefono:'', email:'', contacto:'', fechaRegistro:'', estado:'Activo', tipoCliente:'Cliente', observaciones:'', ciiu:'', actividadEconomica:'', lineaCredito: '', limiteFactura: ''
  })
  const [consultando, setConsultando] = useState(false)
  const [clientes, setClientes] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const savedClientes = JSON.parse(localStorage.getItem('mock_clients') || '[]')
    setClientes(savedClientes)

    // Si hay ID, cargar datos del cliente para editar
    if (id) {
      const cliente = savedClientes.find(c => c.id === parseInt(id))
      if (cliente) {
        setForm(cliente)
      } else {
        notify.error('Cliente no encontrado')
        navigate('/clients')
      }
    }
  }, [id, navigate])

  const update = (k,v) => setForm({...form, [k]: v})

  const handleConsultarRUC = async () => {
    const ruc = form.documento;

    if (!ruc) {
      notify.warning('Ingresa un número de RUC');
      return;
    }

    if (ruc.length !== 11) {
      notify.warning('El RUC debe tener 11 dígitos');
      return;
    }

    setConsultando(true);
    notify.info('Consultando SUNAT...');

    const resultado = await buscarDatosRUC(ruc);

    setConsultando(false);

    if (resultado.success) {
      setForm({
        ...form,
        nombre: resultado.razonSocial,
        direccion: resultado.direccion,
        ciiu: resultado.ciiu,
        actividadEconomica: resultado.actividadEconomica
      });
      notify.success('Datos obtenidos de SUNAT correctamente');
    } else {
      notify.error(resultado.message || 'No se pudo consultar el RUC');
    }
  }

  const submit = (e) => {
    e.preventDefault()

    // Validar documento
    const errorDocumento = getMensajeErrorDocumento(form.tipoDocumento, form.documento)
    if (errorDocumento) {
      notify.error(errorDocumento)
      return
    }

    // Validar duplicados
    if (existeDocumento(form.documento, clientes, id ? parseInt(id) : null)) {
      notify.error(`Ya existe un cliente con el ${form.tipoDocumento} ${form.documento}`)
      return
    }

    // Validar email
    if (form.email && !validarEmail(form.email)) {
      notify.error('El email no es válido')
      return
    }

    // Validar teléfono
    if (form.telefono && !validarTelefono(form.telefono)) {
      notify.error('El teléfono no es válido (debe tener 9 dígitos)')
      return
    }

    const clients = JSON.parse(localStorage.getItem('mock_clients') || '[]')

    if (id) {
      // Editar cliente existente
      const index = clients.findIndex(c => c.id === parseInt(id))
      if (index !== -1) {
        clients[index] = { ...form, id: parseInt(id) }
        localStorage.setItem('mock_clients', JSON.stringify(clients))
        notify.success('Cliente actualizado exitosamente')
      }
    } else {
      // Agregar nuevo cliente
      const newId = clients.length ? Math.max(...clients.map(c=>c.id))+1 : 1
      clients.push({ id: newId, ...form })
      localStorage.setItem('mock_clients', JSON.stringify(clients))
      notify.success('Cliente agregado exitosamente')
    }

    navigate('/clients')
  }

  const cancel = () => {
    navigate('/clients')
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-4">
            <h2 className="text-2xl font-bold">{id ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}</h2>
            <p className="text-blue-100 text-sm mt-1">{id ? 'Actualiza la información del cliente' : 'Complete el formulario para registrar un nuevo cliente'}</p>
          </div>

          <form onSubmit={submit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre / Razón Social *</label>
                <input
                  value={form.nombre}
                  onChange={e=>update('nombre', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  placeholder="Ingrese nombre o razón social"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo Documento *</label>
                <select
                  value={form.tipoDocumento}
                  onChange={e=>update('tipoDocumento', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option>RUC</option>
                  <option>DNI</option>
                  <option>CE</option>
                  <option>Pasaporte</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de Documento *</label>
                <div className="flex gap-2">
                  <input
                    value={form.documento}
                    onChange={e=>update('documento', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    placeholder="Ingrese número de documento"
                    maxLength={form.tipoDocumento === 'RUC' ? 11 : form.tipoDocumento === 'DNI' ? 8 : 12}
                  />
                  {form.tipoDocumento === 'RUC' && (
                    <button
                      type="button"
                      onClick={handleConsultarRUC}
                      disabled={consultando}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        consultando
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg'
                      } text-white flex items-center gap-2`}
                    >
                      {consultando ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Consultando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>Consultar SUNAT</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                {form.tipoDocumento === 'RUC' && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Ingresa el RUC y haz clic en "Consultar SUNAT" para autocompletar
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha de Registro</label>
                <input
                  type="date"
                  value={form.fechaRegistro}
                  onChange={e=>update('fechaRegistro', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e=>update('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="email@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={e=>update('telefono', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="999999999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Persona de Contacto</label>
                <input
                  value={form.contacto}
                  onChange={e=>update('contacto', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nombre del contacto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado *</label>
                <select
                  value={form.estado}
                  onChange={e=>update('estado', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Cliente *</label>
                <select
                  value={form.tipoCliente}
                  onChange={e=>update('tipoCliente', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option>Cliente</option>
                  <option>Deudor</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dirección</label>
                <input
                  value={form.direccion}
                  onChange={e=>update('direccion', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Dirección completa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CIIU</label>
                <input
                  value={form.ciiu}
                  onChange={e=>update('ciiu', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Código CIIU"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Actividad Económica</label>
                <input
                  value={form.actividadEconomica}
                  onChange={e=>update('actividadEconomica', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Descripción de actividad económica"
                />
              </div>

              {form.tipoCliente === 'Cliente' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Línea de Crédito (S/.)
                      <span className="ml-2 text-xs text-gray-500">Opcional</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.lineaCredito}
                      onChange={e=>update('lineaCredito', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="100000.00"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Monto total de crédito aprobado</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Límite por Factura (S/.)
                      <span className="ml-2 text-xs text-gray-500">Opcional</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.limiteFactura}
                      onChange={e=>update('limiteFactura', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="50000.00"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Monto máximo por factura individual</p>
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observaciones</label>
                <textarea
                  value={form.observaciones}
                  onChange={e=>update('observaciones', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Información adicional del cliente..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={cancel}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 font-medium shadow-lg hover:shadow-xl transition-all"
              >
                {id ? 'Actualizar Cliente' : 'Guardar Cliente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
