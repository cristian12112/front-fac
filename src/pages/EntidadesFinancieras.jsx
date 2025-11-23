import React, { useState, useEffect } from 'react'
import { notify, confirmDialog } from '../utils/notify'

const sampleEntidades = [
  {
    id: 1,
    nombre: 'Banco de Crédito del Perú',
    tipo: 'Banco',
    ruc: '20100047218',
    contacto: 'Juan Pérez',
    email: 'empresas@bcp.com.pe',
    telefono: '01-3131313',
    tasaInteres: '12.5',
    estado: 'Activo'
  },
  {
    id: 2,
    nombre: 'Interbank',
    tipo: 'Banco',
    ruc: '20100053455',
    contacto: 'María González',
    email: 'negocios@interbank.pe',
    telefono: '01-3111111',
    tasaInteres: '13.0',
    estado: 'Activo'
  }
]

export default function EntidadesFinancieras(){
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    nombre: '',
    tipo: 'Banco',
    ruc: '',
    contacto: '',
    email: '',
    telefono: '',
    tasaInteres: '',
    estado: 'Activo'
  })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mock_entidades') || 'null')
    if(saved) setData(saved)
    else {
      setData(sampleEntidades)
      localStorage.setItem('mock_entidades', JSON.stringify(sampleEntidades))
    }
  }, [])

  const openModal = (entidad = null) => {
    if(entidad) {
      setEditingId(entidad.id)
      setForm(entidad)
    } else {
      setEditingId(null)
      setForm({
        nombre: '',
        tipo: 'Banco',
        ruc: '',
        contacto: '',
        email: '',
        telefono: '',
        tasaInteres: '',
        estado: 'Activo'
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
    let updated
    if(editingId) {
      updated = data.map(item => item.id === editingId ? { ...form, id: editingId } : item)
      notify.success('Entidad financiera actualizada correctamente')
    } else {
      const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1
      updated = [...data, { ...form, id: newId }]
      notify.success('Entidad financiera creada exitosamente')
    }
    setData(updated)
    localStorage.setItem('mock_entidades', JSON.stringify(updated))
    closeModal()
  }

  const handleDelete = (id) => {
    if(!confirmDialog('¿Eliminar esta entidad financiera?')) return
    const updated = data.filter(d => d.id !== id)
    setData(updated)
    localStorage.setItem('mock_entidades', JSON.stringify(updated))
    notify.success('Entidad financiera eliminada correctamente')
  }

  const update = (key, value) => setForm({...form, [key]: value})

  return (
    <main className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Entidades Financieras</h2>
            <p className="text-gray-600 dark:text-gray-400">Gestión de bancos y entidades de factoring</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-cyan-500 to-cyan-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <span className="text-xl">+</span>
            Agregar Entidad
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-lg p-4 border border-cyan-200 dark:border-cyan-800">
          <div className="text-cyan-600 dark:text-cyan-400 text-sm font-medium">Total Entidades</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="text-green-600 dark:text-green-400 text-sm font-medium">Activas</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.filter(e => e.estado === 'Activo').length}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Bancos</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.filter(e => e.tipo === 'Banco').length}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">Tasa Promedio</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
            {data.length > 0 ? (data.reduce((sum, e) => sum + parseFloat(e.tasaInteres || 0), 0) / data.length).toFixed(2) : '0.00'}%
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Entidad</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">RUC</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tasa %</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((entidad) => (
                <tr key={entidad.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold">
                        {entidad.nombre.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{entidad.nombre}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{entidad.telefono}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      {entidad.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-mono text-sm">{entidad.ruc}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{entidad.contacto}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{entidad.email}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">{entidad.tasaInteres}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      entidad.estado === 'Activo'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                    }`}>
                      {entidad.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(entidad)}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(entidad.id)}
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
              No hay entidades financieras registradas
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingId ? 'Editar Entidad Financiera' : 'Nueva Entidad Financiera'}
              </h3>
              <button onClick={closeModal} className="text-2xl hover:bg-white/20 w-8 h-8 rounded-full transition-colors">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre de la Entidad *</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => update('nombre', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo *</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => update('tipo', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  >
                    <option>Banco</option>
                    <option>Financiera</option>
                    <option>Caja</option>
                    <option>Cooperativa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">RUC *</label>
                  <input
                    type="text"
                    value={form.ruc}
                    onChange={(e) => update('ruc', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contacto *</label>
                  <input
                    type="text"
                    value={form.contacto}
                    onChange={(e) => update('contacto', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => update('telefono', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado *</label>
                  <select
                    value={form.estado}
                    onChange={(e) => update('estado', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  >
                    <option>Activo</option>
                    <option>Inactivo</option>
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
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-800 font-medium shadow-lg hover:shadow-xl transition-all"
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
