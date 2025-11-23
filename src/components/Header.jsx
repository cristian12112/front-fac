import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { notify } from '../utils/notify'

export default function Header(){
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('mock_user')
    notify.info('Sesión cerrada correctamente')
    navigate('/login')
  }
  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sistema de Factoring</h1>
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/" className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Dashboard</Link>
          <Link to="/clients" className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Clientes</Link>
          <Link to="/entidaFin" className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Entidades</Link>
          <Link to="/factura" className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Facturas</Link>
          <Link to="/garantia" className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Garantías</Link>
          <Link to="/contratofactoring" className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Contratos</Link>
          <div className="ml-4 flex items-center gap-2">
            <ThemeToggle />
            <button onClick={logout} className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg hover:from-red-600 hover:to-red-800 font-medium shadow-md hover:shadow-lg transition-all">
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
