import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Correo o contraseña incorrectos')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-pink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Blondie <span className="text-pink-300">Cosmetic</span></h1>
          <p className="text-pink-400 text-xs tracking-widest uppercase">Sistema de ventas</p>
        </div>
        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div>
            <label className="text-pink-300 text-xs mb-1 block">Correo</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 outline-none focus:border-pink-400"
              required
            />
          </div>
          <div>
            <label className="text-pink-300 text-xs mb-1 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 outline-none focus:border-pink-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-white/20 text-xs mt-6">Solo usuarios autorizados</p>
      </div>
    </div>
  )
}