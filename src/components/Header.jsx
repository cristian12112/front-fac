import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Header(){
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('mock_user')
    navigate('/login')
  }
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Factoring - Mock Frontend</h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Dashboard</Link>
          <Link to="/clients" className="hover:underline">Clientes</Link>
          <Link to="/entidaFin" className="hover:underline">Entidades Financiera</Link>
          <Link to="/factura" className="hover:underline">Factura</Link>
          <Link to="/garantia" className="hover:underline">Garantia</Link>
          <Link to="/contratofactoring" className="hover:underline">Contrato Factoring</Link>
          <ThemeToggle />
          <button onClick={logout} className="ml-4 px-3 py-1 bg-red-500 text-white rounded">Cerrar sesión</button>
        </nav>
      </div>
    </header>
  )
}
