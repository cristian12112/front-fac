import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { notify, confirmDialog } from '../utils/notify'
import { exportToXML, exportToExcel, exportToPDF } from '../utils/exportUtils'

const sampleFacturas = [
  {
    id: 1,
    numeroFactura: 'F001-00001',
    clienteId: 1,
    clienteNombre: 'Acme S.A.',
    entidadId: 1,
    entidadNombre: 'Banco de Crédito del Perú',
    monto: 15000.00,
    fechaEmision: '2025-01-15',
    fechaVencimiento: '2025-03-15',
    estado: 'Aprobada',
    tasaDescuento: '12.5'
  },
  {
    id: 2,
    numeroFactura: 'F001-00002',
    clienteId: 2,
    clienteNombre: 'Empresa XYZ',
    entidadId: 2,
    entidadNombre: 'Interbank',
    monto: 25000.00,
    fechaEmision: '2025-01-18',
    fechaVencimiento: '2025-04-18',
    estado: 'Pendiente',
    tasaDescuento: '13.0'
  }
]

export default function Facturas(){
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [clientes, setClientes] = useState([])
  const [entidades, setEntidades] = useState([])
  const [form, setForm] = useState({
    numeroFactura: '',
    clienteId: '',
    clienteNombre: '',
    entidadId: '',
    entidadNombre: '',
    monto: '',
    fechaEmision: '',
    fechaVencimiento: '',
    estado: 'Pendiente',
    tasaDescuento: ''
  })

  useEffect(() => {
    const savedFacturas = JSON.parse(localStorage.getItem('mock_facturas') || 'null')
    const savedClientes = JSON.parse(localStorage.getItem('mock_clients') || '[]')
    const savedEntidades = JSON.parse(localStorage.getItem('mock_entidades') || '[]')

    setClientes(savedClientes)
    setEntidades(savedEntidades)

    if(savedFacturas) setData(savedFacturas)
    else {
      setData(sampleFacturas)
      localStorage.setItem('mock_facturas', JSON.stringify(sampleFacturas))
    }
  }, [])

  const openModal = (factura = null) => {
    if(factura) {
      setEditingId(factura.id)
      setForm(factura)
    } else {
      setEditingId(null)
      setForm({
        numeroFactura: '',
        clienteId: '',
        clienteNombre: '',
        entidadId: '',
        entidadNombre: '',
        monto: '',
        fechaEmision: '',
        fechaVencimiento: '',
        estado: 'Pendiente',
        tasaDescuento: ''
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const cliente = clientes.find(c => c.id === parseInt(form.clienteId))
    const entidad = entidades.find(e => e.id === parseInt(form.entidadId))

    const facturaData = {
      ...form,
      clienteNombre: cliente ? cliente.nombre : form.clienteNombre,
      entidadNombre: entidad ? entidad.nombre : form.entidadNombre,
      monto: parseFloat(form.monto)
    }

    let updated
    if(editingId) {
      updated = data.map(item => item.id === editingId ? { ...facturaData, id: editingId } : item)
      notify.success('Factura actualizada correctamente')
    } else {
      const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1
      updated = [...data, { ...facturaData, id: newId }]
      notify.success('Factura registrada exitosamente')
    }
    setData(updated)
    localStorage.setItem('mock_facturas', JSON.stringify(updated))
    closeModal()
  }

  const handleDelete = (id) => {
    if(!confirmDialog('¿Eliminar esta factura?')) return
    const updated = data.filter(d => d.id !== id)
    setData(updated)
    localStorage.setItem('mock_facturas', JSON.stringify(updated))
    notify.success('Factura eliminada correctamente')
  }

  const update = (key, value) => setForm({...form, [key]: value})

  const getEstadoBadge = (estado) => {
    const badges = {
      'Pendiente': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      'Aprobada': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      'Rechazada': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      'Pagada': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    }
    return badges[estado] || badges['Pendiente']
  }

  const totalMonto = data.reduce((sum, f) => sum + parseFloat(f.monto || 0), 0)

  return (
    <main className="max-w-[1600px] mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Facturas</h2>
            <p className="text-gray-600 dark:text-gray-400">Gestión de facturas para factoring</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/factura/cargar"
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Cargar Factura
            </Link>
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <span className="text-xl">+</span>
              Registro Rápido
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="text-green-600 dark:text-green-400 text-sm font-medium">Total Facturas</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.length}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Pendientes</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.filter(f => f.estado === 'Pendiente').length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="text-green-600 dark:text-green-400 text-sm font-medium">Aprobadas</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.filter(f => f.estado === 'Aprobada').length}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Pagadas</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.filter(f => f.estado === 'Pagada').length}</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
          <div className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Monto Total</div>
          <div className="text-xl font-bold text-gray-800 dark:text-white mt-1">S/. {totalMonto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px]">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">N° Factura</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Cliente</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Entidad Financiera</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Monto</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">F. Emisión</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">F. Vencimiento</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Tasa %</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Estado</th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((factura) => (
                <tr key={factura.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-mono font-semibold text-gray-900 dark:text-white">{factura.numeroFactura}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-gray-700 dark:text-gray-300 max-w-[200px] truncate" title={factura.clienteNombre}>
                      {factura.clienteNombre}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-gray-700 dark:text-gray-300 max-w-[200px] truncate" title={factura.entidadNombre}>
                      {factura.entidadNombre}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      S/. {parseFloat(factura.monto).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300 text-sm">{factura.fechaEmision}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300 text-sm">{factura.fechaVencimiento}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">{factura.tasaDescuento}%</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(factura.estado)}`}>
                      {factura.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Dropdown de descargas */}
                      <div className="relative group">
                        <button className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Descargar
                        </button>
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 border border-gray-200 dark:border-gray-600">
                          <button
                            onClick={() => {
                              exportToXML(factura, `factura_${factura.numeroFactura}`)
                              notify.success('XML descargado')
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 flex items-center gap-2 rounded-t-lg"
                          >
                            <span className="text-orange-500">📄</span> XML
                          </button>
                          <button
                            onClick={() => {
                              const data = [{
                                'Número': factura.numeroFactura,
                                'Cliente': factura.clienteNombre,
                                'Entidad': factura.entidadNombre,
                                'Monto': factura.monto,
                                'Emisión': factura.fechaEmision,
                                'Vencimiento': factura.fechaVencimiento,
                                'Tasa %': factura.tasaDescuento,
                                'Estado': factura.estado
                              }]
                              exportToExcel(data, `factura_${factura.numeroFactura}`)
                              notify.success('Excel descargado')
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2"
                          >
                            <span className="text-green-500">📊</span> Excel
                          </button>
                          <button
                            onClick={() => {
                              exportToPDF(factura, `factura_${factura.numeroFactura}`)
                              notify.success('PDF descargado')
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 rounded-b-lg"
                          >
                            <span className="text-red-500">📑</span> PDF
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => openModal(factura)}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(factura.id)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No hay facturas registradas
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingId ? 'Editar Factura' : 'Nueva Factura'}
              </h3>
              <button onClick={closeModal} className="text-2xl hover:bg-white/20 w-8 h-8 rounded-full transition-colors">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de Factura *</label>
                  <input
                    type="text"
                    value={form.numeroFactura}
                    onChange={(e) => update('numeroFactura', e.target.value)}
                    placeholder="F001-00001"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cliente *</label>
                  <select
                    value={form.clienteId}
                    onChange={(e) => update('clienteId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Entidad Financiera *</label>
                  <select
                    value={form.entidadId}
                    onChange={(e) => update('entidadId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Seleccionar entidad</option>
                    {entidades.map(e => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monto (S/.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.monto}
                    onChange={(e) => update('monto', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha de Emisión *</label>
                  <input
                    type="date"
                    value={form.fechaEmision}
                    onChange={(e) => update('fechaEmision', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha de Vencimiento *</label>
                  <input
                    type="date"
                    value={form.fechaVencimiento}
                    onChange={(e) => update('fechaVencimiento', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tasa de Descuento (%) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.tasaDescuento}
                    onChange={(e) => update('tasaDescuento', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado *</label>
                  <select
                    value={form.estado}
                    onChange={(e) => update('estado', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option>Pendiente</option>
                    <option>Aprobada</option>
                    <option>Rechazada</option>
                    <option>Pagada</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
