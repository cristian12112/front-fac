import React, { useState, useEffect } from 'react'
import { notify, confirmDialog } from '../utils/notify'

const sampleContratos = [
  {
    id: 1,
    numeroContrato: 'CONT-2025-001',
    clienteId: 1,
    clienteNombre: 'Acme S.A.',
    entidadId: 1,
    entidadNombre: 'Banco de Crédito del Perú',
    montoMaximo: 100000.00,
    tasaInteres: 12.5,
    comision: 2.0,
    fechaInicio: '2025-01-01',
    fechaVencimiento: '2025-12-31',
    plazoFacturas: 90,
    estado: 'Vigente',
    condiciones: 'Facturas de clientes aprobados, plazo máximo 90 días'
  },
  {
    id: 2,
    numeroContrato: 'CONT-2025-002',
    clienteId: 2,
    clienteNombre: 'Empresa XYZ',
    entidadId: 2,
    entidadNombre: 'Interbank',
    montoMaximo: 150000.00,
    tasaInteres: 13.0,
    comision: 2.5,
    fechaInicio: '2025-01-15',
    fechaVencimiento: '2026-01-15',
    plazoFacturas: 60,
    estado: 'Vigente',
    condiciones: 'Facturas comerciales, evaluación crediticia previa'
  }
]

export default function ContratosFactoring(){
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [clientes, setClientes] = useState([])
  const [entidades, setEntidades] = useState([])
  const [form, setForm] = useState({
    numeroContrato: '',
    clienteId: '',
    clienteNombre: '',
    entidadId: '',
    entidadNombre: '',
    montoMaximo: '',
    tasaInteres: '',
    comision: '',
    fechaInicio: '',
    fechaVencimiento: '',
    plazoFacturas: '',
    estado: 'Vigente',
    condiciones: ''
  })

  useEffect(() => {
    const savedContratos = JSON.parse(localStorage.getItem('mock_contratos') || 'null')
    const savedClientes = JSON.parse(localStorage.getItem('mock_clients') || '[]')
    const savedEntidades = JSON.parse(localStorage.getItem('mock_entidades') || '[]')

    setClientes(savedClientes)
    setEntidades(savedEntidades)

    if(savedContratos) setData(savedContratos)
    else {
      setData(sampleContratos)
      localStorage.setItem('mock_contratos', JSON.stringify(sampleContratos))
    }
  }, [])

  const openModal = (contrato = null) => {
    if(contrato) {
      setEditingId(contrato.id)
      setForm(contrato)
    } else {
      setEditingId(null)
      setForm({
        numeroContrato: '',
        clienteId: '',
        clienteNombre: '',
        entidadId: '',
        entidadNombre: '',
        montoMaximo: '',
        tasaInteres: '',
        comision: '',
        fechaInicio: '',
        fechaVencimiento: '',
        plazoFacturas: '',
        estado: 'Vigente',
        condiciones: ''
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

    const contratoData = {
      ...form,
      clienteNombre: cliente ? cliente.nombre : form.clienteNombre,
      entidadNombre: entidad ? entidad.nombre : form.entidadNombre,
      montoMaximo: parseFloat(form.montoMaximo),
      tasaInteres: parseFloat(form.tasaInteres),
      comision: parseFloat(form.comision),
      plazoFacturas: parseInt(form.plazoFacturas)
    }

    let updated
    if(editingId) {
      updated = data.map(item => item.id === editingId ? { ...contratoData, id: editingId } : item)
      notify.success('Contrato actualizado correctamente')
    } else {
      const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1
      updated = [...data, { ...contratoData, id: newId }]
      notify.success('Contrato creado exitosamente')
    }
    setData(updated)
    localStorage.setItem('mock_contratos', JSON.stringify(updated))
    closeModal()
  }

  const handleDelete = (id) => {
    if(!confirmDialog('¿Eliminar este contrato?')) return
    const updated = data.filter(d => d.id !== id)
    setData(updated)
    localStorage.setItem('mock_contratos', JSON.stringify(updated))
    notify.success('Contrato eliminado correctamente')
  }

  const update = (key, value) => setForm({...form, [key]: value})

  const getEstadoBadge = (estado) => {
    const badges = {
      'Vigente': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      'Vencido': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      'Cancelado': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400',
      'Suspendido': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    }
    return badges[estado] || badges['Vigente']
  }

  const totalMonto = data.reduce((sum, c) => sum + parseFloat(c.montoMaximo || 0), 0)

  return (
    <main className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Contratos de Factoring</h2>
            <p className="text-gray-600 dark:text-gray-400">Gestión de contratos entre clientes y entidades financieras</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <span className="text-xl">+</span>
            Nuevo Contrato
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Contratos</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="text-green-600 dark:text-green-400 text-sm font-medium">Vigentes</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.filter(c => c.estado === 'Vigente').length}</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
          <div className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Monto Total</div>
          <div className="text-xl font-bold text-gray-800 dark:text-white mt-1">S/. {totalMonto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Tasa Promedio</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
            {data.length > 0 ? (data.reduce((sum, c) => sum + parseFloat(c.tasaInteres || 0), 0) / data.length).toFixed(2) : '0.00'}%
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">N° Contrato</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Entidad</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Monto Máx.</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tasa %</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Vigencia</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((contrato) => (
                <tr key={contrato.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono font-semibold text-gray-900 dark:text-white">{contrato.numeroContrato}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{contrato.clienteNombre}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{contrato.entidadNombre}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      S/. {parseFloat(contrato.montoMaximo).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">{contrato.tasaInteres}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-700 dark:text-gray-300">{contrato.fechaInicio}</div>
                      <div className="text-gray-500 dark:text-gray-400">{contrato.fechaVencimiento}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(contrato.estado)}`}>
                      {contrato.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(contrato)}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(contrato.id)}
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
              No hay contratos registrados
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingId ? 'Editar Contrato de Factoring' : 'Nuevo Contrato de Factoring'}
              </h3>
              <button onClick={closeModal} className="text-2xl hover:bg-white/20 w-8 h-8 rounded-full transition-colors">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de Contrato *</label>
                  <input
                    type="text"
                    value={form.numeroContrato}
                    onChange={(e) => update('numeroContrato', e.target.value)}
                    placeholder="CONT-2025-001"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cliente *</label>
                  <select
                    value={form.clienteId}
                    onChange={(e) => update('clienteId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Seleccionar entidad</option>
                    {entidades.map(e => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monto Máximo (S/.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.montoMaximo}
                    onChange={(e) => update('montoMaximo', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tasa de Interés (%) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.tasaInteres}
                    onChange={(e) => update('tasaInteres', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comisión (%) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.comision}
                    onChange={(e) => update('comision', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha de Inicio *</label>
                  <input
                    type="date"
                    value={form.fechaInicio}
                    onChange={(e) => update('fechaInicio', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha de Vencimiento *</label>
                  <input
                    type="date"
                    value={form.fechaVencimiento}
                    onChange={(e) => update('fechaVencimiento', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plazo Facturas (días) *</label>
                  <input
                    type="number"
                    value={form.plazoFacturas}
                    onChange={(e) => update('plazoFacturas', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado *</label>
                  <select
                    value={form.estado}
                    onChange={(e) => update('estado', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option>Vigente</option>
                    <option>Vencido</option>
                    <option>Cancelado</option>
                    <option>Suspendido</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condiciones del Contrato</label>
                  <textarea
                    value={form.condiciones}
                    onChange={(e) => update('condiciones', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Especificar condiciones, restricciones y requisitos del contrato..."
                  />
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
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 font-medium shadow-lg hover:shadow-xl transition-all"
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
