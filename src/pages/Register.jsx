import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    if(!email || !password){ alert('Completa los campos'); return; }
    // Save to localStorage simple users array
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]')
    users.push({ email, password })
    localStorage.setItem('mock_users', JSON.stringify(users))
    alert('Registrado (mock). Ahora inicia sesión.')
    navigate('/login')
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl mb-6">Registro (mock)</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Contraseña</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <button className="w-full bg-green-600 text-white py-2 rounded">Registrar</button>
        </form>
        <p className="mt-4 text-sm">¿Ya tienes cuenta? <Link to="/login" className="text-blue-600">Entrar</Link></p>
      </div>
    </div>
  )
}
