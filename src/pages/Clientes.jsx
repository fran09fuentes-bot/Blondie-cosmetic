import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [vista, setVista] = useState('lista')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nombre: '', telefono: '', correo: '' })

  useEffect(function() { cargarClientes() }, [])

  const cargarClientes = async function() {
    const { data } = await supabase.from('clientes').select('*').order('nombre')
    if (data) setClientes(data)
  }

  const guardarCliente = async function() {
    if (!form.nombre) return
    setLoading(true)
    const { error } = await supabase.from('clientes').insert([form])
    if (!error) { await cargarClientes(); setVista('lista'); setForm({ nombre: '', telefono: '', correo: '' }) }
    setLoading(false)
  }

  const filtrados = clientes.filter(function(c) { return c.nombre.toLowerCase().includes(busqueda.toLowerCase()) })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-950 px-6 py-4 flex items-center justify-between">
        <Link to="/"><h1 className="text-xl font-bold text-white">Blondie <span className="text-pink-300">Cosmetic</span></h1></Link>
        <span className="text-pink-300 text-sm">Clientes</span>
      </div>
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex gap-2 mb-4">
          <button onClick={function() { setVista('lista') }} className={vista === 'lista' ? 'flex-1 py-2 rounded-xl text-sm font-medium bg-pink-600 text-white' : 'flex-1 py-2 rounded-xl text-sm font-medium bg-white border border-pink-200 text-pink-700'}>Ver clientes</button>
          <button onClick={function() { setVista('agregar') }} className={vista === 'agregar' ? 'flex-1 py-2 rounded-xl text-sm font-medium bg-pink-600 text-white' : 'flex-1 py-2 rounded-xl text-sm font-medium bg-white border border-pink-200 text-pink-700'}>+ Agregar</button>
        </div>
        {vista === 'lista' && (
          <div>
            <input value={busqueda} onChange={function(e) { setBusqueda(e.target.value) }} placeholder="Buscar cliente..." className="w-full bg-white border border-pink-100 rounded-xl px-4 py-2.5 text-sm mb-4 outline-none" />
            {filtrados.length === 0 && <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-pink-100">No hay clientes aun</div>}
            <div className="flex flex-col gap-3">
              {filtrados.map(function(c) {
                return (
                  <div key={c.id} className="bg-white rounded-2xl p-4 border border-pink-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">👤</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{c.nombre}</p>
                      <p className="text-xs text-gray-400">{c.telefono}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-pink-600">{c.puntos}</p>
                      <p className="text-xs text-gray-400">puntos</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {vista === 'agregar' && (
          <div className="bg-white rounded-2xl p-4 border border-pink-100 flex flex-col gap-4">
            <h2 className="font-bold text-pink-900">Nueva clienta</h2>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nombre</label>
              <input value={form.nombre} onChange={function(e) { setForm({...form, nombre: e.target.value}) }} placeholder="Nombre completo" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Telefono</label>
              <input value={form.telefono} onChange={function(e) { setForm({...form, telefono: e.target.value}) }} placeholder="555-1234" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Correo</label>
              <input value={form.correo} onChange={function(e) { setForm({...form, correo: e.target.value}) }} placeholder="correo@ejemplo.com" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
            </div>
            <button onClick={guardarCliente} disabled={loading || !form.nombre} className="w-full bg-pink-600 text-white font-medium py-3 rounded-xl text-sm">{loading ? 'Guardando...' : 'Guardar clienta'}</button>
          </div>
        )}
      </div>
    </div>
  )
}
