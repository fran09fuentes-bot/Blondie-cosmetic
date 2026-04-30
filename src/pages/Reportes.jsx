import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Reporte() {
  const [ventasHoy, setVentasHoy] = useState([])
  const [ventasMes, setVentasMes] = useState([])
  const [tab, setTab] = useState('diario')

  useEffect(function() { cargarDatos() }, [])

  const cargarDatos = async function() {
    const hoy = new Date().toISOString().split('T')[0]
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
    const { data: dataHoy } = await supabase.from('ventas').select('*').gte('created_at', hoy)
    const { data: dataMes } = await supabase.from('ventas').select('*').gte('created_at', inicioMes)
    if (dataHoy) setVentasHoy(dataHoy)
    if (dataMes) setVentasMes(dataMes)
  }

  const totalHoy = ventasHoy.reduce(function(acc, v) { return acc + v.total }, 0)
  const totalMes = ventasMes.reduce(function(acc, v) { return acc + v.total }, 0)
  const efectivoHoy = ventasHoy.filter(function(v) { return v.metodo_pago === 'efectivo' }).reduce(function(acc, v) { return acc + v.total }, 0)
  const tarjetaHoy = ventasHoy.filter(function(v) { return v.metodo_pago === 'tarjeta' }).reduce(function(acc, v) { return acc + v.total }, 0)
  const transferenciaHoy = ventasHoy.filter(function(v) { return v.metodo_pago === 'transferencia' }).reduce(function(acc, v) { return acc + v.total }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-950 px-6 py-4 flex items-center justify-between">
        <Link to="/"><h1 className="text-xl font-bold text-white">Blondie <span className="text-pink-300">Cosmetic</span></h1></Link>
        <span className="text-pink-300 text-sm">Reportes</span>
      </div>
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex gap-2 mb-4">
          <button onClick={function() { setTab('diario') }} className={tab === 'diario' ? 'flex-1 py-2 rounded-xl text-sm font-medium bg-pink-600 text-white' : 'flex-1 py-2 rounded-xl text-sm font-medium bg-white border border-pink-200 text-pink-700'}>Hoy</button>
          <button onClick={function() { setTab('mensual') }} className={tab === 'mensual' ? 'flex-1 py-2 rounded-xl text-sm font-medium bg-pink-600 text-white' : 'flex-1 py-2 rounded-xl text-sm font-medium bg-white border border-pink-200 text-pink-700'}>Este mes</button>
        </div>
        {tab === 'diario' && (
          <div className="flex flex-col gap-3">
            <div className="bg-pink-950 rounded-2xl p-4 grid grid-cols-2 gap-3">
              <div><p className="text-pink-400 text-xs">Total vendido</p><p className="text-white text-2xl font-bold">${totalHoy}</p></div>
              <div><p className="text-pink-400 text-xs">Transacciones</p><p className="text-white text-2xl font-bold">{ventasHoy.length}</p></div>
              <div><p className="text-pink-400 text-xs">Ticket promedio</p><p className="text-white text-2xl font-bold">${ventasHoy.length > 0 ? (totalHoy / ventasHoy.length).toFixed(0) : 0}</p></div>
              <div><p className="text-pink-400 text-xs">Mejor hora</p><p className="text-white text-2xl font-bold">--</p></div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-pink-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Metodo de pago</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Efectivo</span>
                  <span className="text-sm font-bold text-gray-800">${efectivoHoy}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tarjeta</span>
                  <span className="text-sm font-bold text-gray-800">${tarjetaHoy}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Transferencia</span>
                  <span className="text-sm font-bold text-gray-800">${transferenciaHoy}</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-pink-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Ventas del dia</p>
              {ventasHoy.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No hay ventas hoy</p>}
              {ventasHoy.map(function(v) {
                return (
                  <div key={v.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm text-gray-800">{v.metodo_pago}</p>
                      <p className="text-xs text-gray-400">{new Date(v.created_at).toLocaleTimeString()}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800">${v.total}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {tab === 'mensual' && (
          <div className="flex flex-col gap-3">
            <div className="bg-pink-950 rounded-2xl p-4 grid grid-cols-2 gap-3">
              <div><p className="text-pink-400 text-xs">Total del mes</p><p className="text-white text-2xl font-bold">${totalMes}</p></div>
              <div><p className="text-pink-400 text-xs">Transacciones</p><p className="text-white text-2xl font-bold">{ventasMes.length}</p></div>
              <div><p className="text-pink-400 text-xs">Promedio diario</p><p className="text-white text-2xl font-bold">${ventasMes.length > 0 ? (totalMes / new Date().getDate()).toFixed(0) : 0}</p></div>
              <div><p className="text-pink-400 text-xs">Ticket promedio</p><p className="text-white text-2xl font-bold">${ventasMes.length > 0 ? (totalMes / ventasMes.length).toFixed(0) : 0}</p></div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-pink-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Todas las ventas del mes</p>
              {ventasMes.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No hay ventas este mes</p>}
              {ventasMes.map(function(v) {
                return (
                  <div key={v.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm text-gray-800">{v.metodo_pago}</p>
                      <p className="text-xs text-gray-400">{new Date(v.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800">${v.total}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
