import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { notify } from '../utils/notify'

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    if(!email || !password || !confirmPassword){
      notify.warning('Por favor completa todos los campos')
      return;
    }
    if(password !== confirmPassword){
      notify.error('Las contraseñas no coinciden')
      return;
    }
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]')
    users.push({ email, password })
    localStorage.setItem('mock_users', JSON.stringify(users))
    notify.success('Registro exitoso. Ahora puedes iniciar sesión')
    navigate('/login')
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Register card */}
      <div className="relative w-full max-w-md px-6">
        {/* Glassmorphism card */}
        <div className="relative backdrop-blur-xl bg-white/10 dark:bg-white/5 rounded-3xl shadow-2xl border border-white/20 p-8 transition-all duration-500 hover:shadow-emerald-500/50">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-20 blur-xl"></div>

          <div className="relative z-10">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 hover:rotate-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 blur-lg opacity-50"></div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent">
                Únete Ahora
              </h1>
              <p className="text-gray-300 text-sm font-medium">Crea tu cuenta y comienza a gestionar</p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-5">
              {/* Email Input */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 ml-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:bg-white/20 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 outline-none"
                    placeholder="correo@empresa.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 ml-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:bg-white/20 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 outline-none"
                    placeholder="••••••••••"
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-200 mb-2 ml-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e=>setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:bg-white/20 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 outline-none"
                    placeholder="••••••••••"
                  />
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-2">
                <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0" />
                <label className="text-sm text-gray-300">
                  Acepto los <a href="#" className="text-emerald-400 hover:text-emerald-300 font-medium">términos y condiciones</a> y la <a href="#" className="text-emerald-400 hover:text-emerald-300 font-medium">política de privacidad</a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-full py-4 rounded-xl font-bold text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 transition-all duration-300 group-hover:scale-110"></div>
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}></div>
                <span className="relative flex items-center justify-center gap-2">
                  Crear Mi Cuenta
                  <svg className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-400">o regístrate con</span>
              </div>
            </div>

            {/* Social Register */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                <span className="font-medium group-hover:text-emerald-300 transition-colors">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                <span className="font-medium group-hover:text-emerald-300 transition-colors">GitHub</span>
              </button>
            </div>

            {/* Login Link */}
            <p className="mt-8 text-center text-sm">
              <span className="text-gray-400">¿Ya tienes una cuenta? </span>
              <Link to="/login" className="font-bold text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text hover:from-emerald-300 hover:to-teal-300 transition-all">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-emerald-500/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-500/30 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
      </div>
    </div>
  )
}
