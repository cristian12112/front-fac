import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import AddClient from './pages/AddClient'
import Header from './components/Header'

function RequireAuth({ children }){
  const user = localStorage.getItem('mock_user')
  return user ? children : <Navigate to="/login" replace />
}

export default function App(){
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<RequireAuth><Header/><Dashboard/></RequireAuth>} />
        <Route path="/clients" element={<RequireAuth><Header/><Clients/></RequireAuth>} />
        <Route path="/clients/new" element={<RequireAuth><Header/><AddClient/></RequireAuth>} />
      </Routes>
    </div>
  )
}
