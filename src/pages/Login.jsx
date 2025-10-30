import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    // Mock login: accept any non-empty credentials
    if(!email || !password){ alert('Ingresa email y contraseña'); return; }
    const user = { email }
    localStorage.setItem('mock_user', JSON.stringify(user))
    navigate('/')
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl mb-6">Iniciar sesión</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Contraseña</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded">Entrar (mock)</button>
        </form>
        <p className="mt-4 text-sm">¿No tienes cuenta? <Link to="/register" className="text-blue-600">Regístrate</Link></p>
      </div>
    </div>
  )
}
