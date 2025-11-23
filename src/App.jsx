import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import AddClient from './pages/AddClient'
import EntidadesFinancieras from './pages/EntidadesFinancieras'
import Facturas from './pages/Facturas'
import CargarFactura from './pages/CargarFactura'
import Garantias from './pages/Garantias'
import ContratosFactoring from './pages/ContratosFactoring'
import Header from './components/Header'

function RequireAuth({ children }){
  const user = localStorage.getItem('mock_user')
  return user ? children : <Navigate to="/login" replace />
}

export default function App(){
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<RequireAuth><Header/><Dashboard/></RequireAuth>} />
        <Route path="/clients" element={<RequireAuth><Header/><Clients/></RequireAuth>} />
        <Route path="/clients/new" element={<RequireAuth><Header/><AddClient/></RequireAuth>} />
        <Route path="/entidaFin" element={<RequireAuth><Header/><EntidadesFinancieras/></RequireAuth>} />
        <Route path="/factura" element={<RequireAuth><Header/><Facturas/></RequireAuth>} />
        <Route path="/factura/cargar" element={<RequireAuth><Header/><CargarFactura/></RequireAuth>} />
        <Route path="/garantia" element={<RequireAuth><Header/><Garantias/></RequireAuth>} />
        <Route path="/contratofactoring" element={<RequireAuth><Header/><ContratosFactoring/></RequireAuth>} />
      </Routes>
    </div>
  )
}
