import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Caja() {
  const [ventas, setVentas] = useState([])
  const [gastos, setGastos] = useState([])
  const [form, setForm] = useState({ descripcion: '', monto: '', categoria: 'operacion' })
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)

  useEffect(function() { cargarDatos() }, [])

  const cargarDatos = async function() {
    const hoy = new Date().toISOString().split('T')[0]
    const { data: v } = await supabase.from('ventas').select('*').gte('created_at', hoy)
    const { data: g } = await supabase.from('gastos').select('*').eq('fecha', hoy)
    if (v) setVentas(v)
    if (g) setGastos(g)
  }

  const guardarGasto = async function() {
    if (!form.descripcion || !form.monto) return
    setLoading(true)
    const { error } = await supabase.from('gastos').insert([{
      descripcion: form.descripcion,
      monto: parseFloat(form.monto),
      categoria: form.categoria,
      fecha: new Date().toISOString().split('T')[0]
    }])
    if (!error) {
      await cargarDatos()
      setForm({ descripcion: '', monto: '', categoria: 'operacion' })
      setExito(true)
      setTimeout(function() { setExito(false) }, 2000)
    }
    setLoading(false)
  }

  const totalVentas = ventas.reduce(function(acc, v) { return acc + v.total }, 0)
  const totalGastos = gastos.reduce(function(acc, g) { return acc + g.monto }, 0)
  const efectivo = ventas.filter(function(v) { return v.metodo_pago === 'efectivo' }).reduce(function(acc, v) { return acc + v.total }, 0)
  const tarjeta = ventas.filter(function(v) { return v.metodo_pago === 'tarjeta' }).reduce(function(acc, v) { return acc + v.total }, 0)
  const transferencia = ventas.filter(function(v) { return v.metodo_pago === 'transferencia' }).reduce(function(acc, v) { return acc + v.total }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-950 px-6 py-4 flex items-center justify-between">
        <Link to="/"><h1 className="text-xl font-bold text-white">Blondie <span className="text-pink-300">Cosmetic</span></h1></Link>
        <span className="text-pink-300 text-sm">Caja del dia</span>
      </div>
      <div className="p-4 max-w-2xl mx-auto flex flex-col gap-4">
        <div className="bg-pink-950 rounded-2xl p-4 grid grid-cols-2 gap-3">
          <div><p className="text-pink-400 text-xs">Total ventas</p><p className="text-white text-2xl font-bold">${totalVentas}</p></div>
          <div><p className="text-pink-400 text-xs">Total gastos</p><p className="text-red-400 text-2xl font-bold">${totalGastos}</p></div>
          <div><p className="text-pink-400 text-xs">Ganancia neta</p><p className="text-green-400 text-2xl font-bold">${totalVentas - totalGastos}</p></div>
          <div><p className="text-pink-400 text-xs">Transacciones</p><p className="text-white text-2xl font-bold">{ventas.length}</p></div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-pink-100">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Desglose de caja</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between"><span className="text-sm text-gray-600">Efectivo</span><span className="text-sm font-bold text-gray-800">${efectivo}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-600">Tarjeta</span><span className="text-sm font-bold text-gray-800">${tarjeta}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-600">Transferencia</span><span className="text-sm font-bold text-gray-800">${transferencia}</span></div>
            <div className="border-t border-gray-100 pt-2 flex justify-between"><span className="text-sm font-bold text-gray-700">Total</span><span className="text-sm font-bold text-pink-600">${totalVentas}</span></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-pink-100">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Registrar gasto del dia</p>
          {exito && <div className="bg-green-50 border border-green-200 rounded-xl p-2 mb-3 text-sm text-green-700 text-center">Gasto registrado</div>}
          <div className="flex flex-col gap-3">
            <input value={form.descripcion} onChange={function(e) { setForm({...form, descripcion: e.target.value}) }} placeholder="Descripcion del gasto" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
            <input type="number" value={form.monto} onChange={function(e) { setForm({...form, monto: e.target.value}) }} placeholder="Monto $" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
            <select value={form.categoria} onChange={function(e) { setForm({...form, categoria: e.target.value}) }} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
              <option value="operacion">Operacion</option>
              <option value="producto">Producto</option>
              <option value="servicio">Servicio</option>
              <option value="otro">Otro</option>
            </select>
            <button onClick={guardarGasto} disabled={loading} className="w-full bg-pink-600 text-white font-medium py-3 rounded-xl text-sm">{loading ? 'Guardando...' : 'Registrar gasto'}</button>
          </div>
        </div>
        {gastos.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-pink-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Gastos de hoy</p>
            {gastos.map(function(g) {
              return (
                <div key={g.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div><p className="text-sm text-gray-800">{g.descripcion}</p><p className="text-xs text-gray-400">{g.categoria}</p></div>
                  <p className="text-sm font-bold text-red-500">${g.monto}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
