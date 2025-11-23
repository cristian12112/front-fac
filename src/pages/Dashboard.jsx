import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  const [stats, setStats] = useState({
    clientes: 0,
    facturas: 0,
    contratos: 0,
    garantias: 0,
    entidadesFinancieras: 0,
    montoFacturado: 0
  })

  useEffect(() => {
    const clientes = JSON.parse(localStorage.getItem('mock_clients') || '[]')
    const facturas = JSON.parse(localStorage.getItem('mock_facturas') || '[]')
    const contratos = JSON.parse(localStorage.getItem('mock_contratos') || '[]')
    const garantias = JSON.parse(localStorage.getItem('mock_garantias') || '[]')
    const entidades = JSON.parse(localStorage.getItem('mock_entidades') || '[]')

    const montoTotal = facturas.reduce((sum, f) => sum + (parseFloat(f.monto) || 0), 0)

    setStats({
      clientes: clientes.length,
      facturas: facturas.length,
      contratos: contratos.length,
      garantias: garantias.length,
      entidadesFinancieras: entidades.length,
      montoFacturado: montoTotal
    })
  }, [])

  const StatCard = ({ title, value, icon, gradient, link }) => (
    <Link to={link} className="block group">
      <div className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${gradient} p-6 text-white`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white opacity-10"></div>
        <div className="relative z-10">
          <div className="text-4xl mb-2">{icon}</div>
          <div className="text-3xl font-bold mb-1">{value}</div>
          <div className="text-sm opacity-90">{title}</div>
        </div>
        <div className="absolute bottom-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )

  return (
    <main className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Resumen general del sistema de factoring</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Clientes"
          value={stats.clientes}
          icon="👥"
          gradient="bg-gradient-to-br from-blue-500 to-blue-700"
          link="/clients"
        />
        <StatCard
          title="Facturas Activas"
          value={stats.facturas}
          icon="📄"
          gradient="bg-gradient-to-br from-green-500 to-green-700"
          link="/factura"
        />
        <StatCard
          title="Contratos Vigentes"
          value={stats.contratos}
          icon="📋"
          gradient="bg-gradient-to-br from-purple-500 to-purple-700"
          link="/contratofactoring"
        />
        <StatCard
          title="Garantías"
          value={stats.garantias}
          icon="🔒"
          gradient="bg-gradient-to-br from-orange-500 to-orange-700"
          link="/garantia"
        />
        <StatCard
          title="Entidades Financieras"
          value={stats.entidadesFinancieras}
          icon="🏦"
          gradient="bg-gradient-to-br from-cyan-500 to-cyan-700"
          link="/entidaFin"
        />
        <StatCard
          title="Monto Facturado"
          value={`S/. ${stats.montoFacturado.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon="💰"
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
          link="/factura"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <span>⚡</span>
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            <Link to="/clients/new" className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
              <span className="text-gray-700 dark:text-gray-300">Agregar nuevo cliente</span>
              <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link to="/factura" className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group">
              <span className="text-gray-700 dark:text-gray-300">Registrar nueva factura</span>
              <span className="text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link to="/contratofactoring" className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group">
              <span className="text-gray-700 dark:text-gray-300">Crear contrato de factoring</span>
              <span className="text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <span>📊</span>
            Estado del Sistema
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Clientes Activos</span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                {stats.clientes} registrados
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Facturas Pendientes</span>
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">
                {stats.facturas} en proceso
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Contratos Vigentes</span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                {stats.contratos} activos
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
