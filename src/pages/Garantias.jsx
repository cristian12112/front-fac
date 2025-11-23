import React, { useState, useEffect } from 'react'
import { notify, confirmDialog } from '../utils/notify'

const sampleGarantias = [
  {
    id: 1,
    codigo: 'GAR-2025-001',
    facturaId: 1,
    facturaNumero: 'F001-00001',
    tipoGarantia: 'Hipotecaria',
    descripcion: 'Propiedad ubicada en Av. Principal 123',
    valorGarantia: 50000.00,
    fechaRegistro: '2025-01-15',
    estado: 'Vigente',
    observaciones: 'Inmueble registrado en SUNARP'
  },
  {
    id: 2,
    codigo: 'GAR-2025-002',
    facturaId: 2,
    facturaNumero: 'F001-00002',
    tipoGarantia: 'Prendaria',
    descripcion: 'Vehículo Toyota Corolla 2023',
    valorGarantia: 35000.00,
    fechaRegistro: '2025-01-18',
    estado: 'Vigente',
    observaciones: 'Vehículo en buen estado'
  }
]

export default function Garantias(){
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [facturas, setFacturas] = useState([])
  const [form, setForm] = useState({
    codigo: '',
    facturaId: '',
    facturaNumero: '',
    tipoGarantia: 'Hipotecaria',
    descripcion: '',
    valorGarantia: '',
    fechaRegistro: '',
    estado: 'Vigente',
    observaciones: ''
  })

  useEffect(() => {
    const savedGarantias = JSON.parse(localStorage.getItem('mock_garantias') || 'null')
    const savedFacturas = JSON.parse(localStorage.getItem('mock_facturas') || '[]')

    setFacturas(savedFacturas)

    if(savedGarantias) setData(savedGarantias)
    else {
      setData(sampleGarantias)
      localStorage.setItem('mock_garantias', JSON.stringify(sampleGarantias))
    }
  }, [])

  const openModal = (garantia = null) => {
    if(garantia) {
      setEditingId(garantia.id)
      setForm(garantia)
    } else {
      setEditingId(null)
      setForm({
        codigo: '',
        facturaId: '',
        facturaNumero: '',
        tipoGarantia: 'Hipotecaria',
        descripcion: '',
        valorGarantia: '',
        fechaRegistro: '',
        estado: 'Vigente',
        observaciones: ''
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

    const factura = facturas.find(f => f.id === parseInt(form.facturaId))

    const garantiaData = {
      ...form,
      facturaNumero: factura ? factura.numeroFactura : form.facturaNumero,
      valorGarantia: parseFloat(form.valorGarantia)
    }

    let updated
    if(editingId) {
      updated = data.map(item => item.id === editingId ? { ...garantiaData, id: editingId } : item)
      notify.success('Garantía actualizada correctamente')
    } else {
      const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1
      updated = [...data, { ...garantiaData, id: newId }]
      notify.success('Garantía registrada exitosamente')
    }
    setData(updated)
    localStorage.setItem('mock_garantias', JSON.stringify(updated))
    closeModal()
  }

  const handleDelete = (id) => {
    if(!confirmDialog('¿Eliminar esta garantía?')) return
    const updated = data.filter(d => d.id !== id)
    setData(updated)
    localStorage.setItem('mock_garantias', JSON.stringify(updated))
    notify.success('Garantía eliminada correctamente')
  }

  const update = (key, value) => setForm({...form, [key]: value})

  const getEstadoBadge = (estado) => {
    const badges = {
      'Vigente': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      'Ejecutada': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      'Liberada': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'Vencida': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
    }
    return badges[estado] || badges['Vigente']
  }

  const totalValor = data.reduce((sum, g) => sum + parseFloat(g.valorGarantia || 0), 0)

  return (
    <main className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Garantías</h2>
            <p className="text-gray-600 dark:text-gray-400">Gestión de garantías asociadas a facturas</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <span className="text-xl">+</span>
            Nueva Garantía
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
          <div className="text-orange-600 dark:text-orange-400 text-sm font-medium">Total Garantías</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="text-green-600 dark:text-green-400 text-sm font-medium">Vigentes</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.filter(g => g.estado === 'Vigente').length}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Liberadas</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.filter(g => g.estado === 'Liberada').length}</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <div className="text-red-600 dark:text-red-400 text-sm font-medium">Ejecutadas</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.filter(g => g.estado === 'Ejecutada').length}</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
          <div className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Valor Total</div>
          <div className="text-xl font-bold text-gray-800 dark:text-white mt-1">S/. {totalValor.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Código</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Factura</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Fecha Registro</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((garantia) => (
                <tr key={garantia.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono font-semibold text-gray-900 dark:text-white">{garantia.codigo}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-gray-700 dark:text-gray-300">{garantia.facturaNumero}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                      {garantia.tipoGarantia}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 max-w-xs truncate">{garantia.descripcion}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      S/. {parseFloat(garantia.valorGarantia).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{garantia.fechaRegistro}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(garantia.estado)}`}>
                      {garantia.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(garantia)}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(garantia.id)}
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
              No hay garantías registradas
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingId ? 'Editar Garantía' : 'Nueva Garantía'}
              </h3>
              <button onClick={closeModal} className="text-2xl hover:bg-white/20 w-8 h-8 rounded-full transition-colors">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Código *</label>
                  <input
                    type="text"
                    value={form.codigo}
                    onChange={(e) => update('codigo', e.target.value)}
                    placeholder="GAR-2025-001"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Factura Asociada *</label>
                  <select
                    value={form.facturaId}
                    onChange={(e) => update('facturaId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Seleccionar factura</option>
                    {facturas.map(f => (
                      <option key={f.id} value={f.id}>{f.numeroFactura} - {f.clienteNombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Garantía *</label>
                  <select
                    value={form.tipoGarantia}
                    onChange={(e) => update('tipoGarantia', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  >
                    <option>Hipotecaria</option>
                    <option>Prendaria</option>
                    <option>Fianza</option>
                    <option>Letra de Cambio</option>
                    <option>Pagaré</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor de Garantía (S/.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.valorGarantia}
                    onChange={(e) => update('valorGarantia', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha de Registro *</label>
                  <input
                    type="date"
                    value={form.fechaRegistro}
                    onChange={(e) => update('fechaRegistro', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado *</label>
                  <select
                    value={form.estado}
                    onChange={(e) => update('estado', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  >
                    <option>Vigente</option>
                    <option>Ejecutada</option>
                    <option>Liberada</option>
                    <option>Vencida</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción *</label>
                  <input
                    type="text"
                    value={form.descripcion}
                    onChange={(e) => update('descripcion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observaciones</label>
                  <textarea
                    value={form.observaciones}
                    onChange={(e) => update('observaciones', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-lg hover:from-orange-600 hover:to-orange-800 font-medium shadow-lg hover:shadow-xl transition-all"
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
