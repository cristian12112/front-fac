import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { notify, confirmDialog } from '../utils/notify'

const sample = [
  { id:1, nombre:'Acme S.A.', tipoDocumento:'RUC', documento:'20123456789', direccion:'Av. Siempreviva 123', telefono:'987654321', email:'contacto@acme.com', estado:'Activo', tipoCliente:'Cliente', lineaCredito: '200000', limiteFactura: '80000' },
  { id:2, nombre:'Empresa XYZ', tipoDocumento:'DNI', documento:'12345678', direccion:'Calle Falsa 456', telefono:'912345678', email:'info@xyz.com', estado:'Activo', tipoCliente:'Cliente', lineaCredito: '150000', limiteFactura: '60000' },
]

export default function Clients(){
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroTipo, setFiltroTipo] = useState('Todos')

  useEffect(()=>{
    const saved = JSON.parse(localStorage.getItem('mock_clients') || 'null')
    if(saved) {
      setData(saved)
      setFilteredData(saved)
    } else {
      setData(sample)
      setFilteredData(sample)
      localStorage.setItem('mock_clients', JSON.stringify(sample))
    }
  },[])

  useEffect(() => {
    let resultado = [...data]

    // Filtrar por búsqueda
    if (searchTerm) {
      resultado = resultado.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.documento.includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por estado
    if (filtroEstado !== 'Todos') {
      resultado = resultado.filter(c => c.estado === filtroEstado)
    }

    // Filtrar por tipo
    if (filtroTipo !== 'Todos') {
      resultado = resultado.filter(c => (c.tipoCliente || 'Cliente') === filtroTipo)
    }

    setFilteredData(resultado)
  }, [searchTerm, filtroEstado, filtroTipo, data])

  const del = (id) => {
    if(!confirmDialog('¿Eliminar este cliente?')) return;
    const next = data.filter(d=>d.id!==id)
    setData(next)
    localStorage.setItem('mock_clients', JSON.stringify(next))
    notify.success('Cliente eliminado correctamente')
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Clientes</h2>
            <p className="text-gray-600 dark:text-gray-400">Gestión de clientes del sistema</p>
          </div>
          <Link
            to="/clients/new"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <span className="text-xl">+</span>
            Agregar Cliente
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, documento o email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option>Todos</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option>Todos</option>
              <option>Cliente</option>
              <option>Deudor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Clientes</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="text-green-600 dark:text-green-400 text-sm font-medium">Activos</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.filter(c => c.estado === 'Activo').length}</div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-600/20 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Inactivos</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{data.filter(c => c.estado === 'Inactivo').length}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Documento</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Dirección</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                        {c.nombre.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{c.nombre}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {c.tipoDocumento}
                      </span>
                      <div className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-mono">{c.documento}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      c.tipoCliente === 'Cliente'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                    }`}>
                      {c.tipoCliente || 'Cliente'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700 dark:text-gray-300">{c.telefono}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 max-w-xs truncate">{c.direccion}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      c.estado === 'Activo'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                    }`}>
                      {c.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/clients/edit/${c.id}`}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => del(c.id)}
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
          {filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {data.length === 0 ? 'No hay clientes registrados' : 'No se encontraron clientes con los filtros aplicados'}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
