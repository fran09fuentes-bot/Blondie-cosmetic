import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const categorias = ['Facial', 'Labiales', 'Skincare', 'Ojos', 'Contorno', 'Unas', 'Herramientas', 'Otro']

export default function Inventario() {
  const [productos, setProductos] = useState([])
  const [vista, setVista] = useState('lista')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nombre: '', marca: '', categoria: 'Facial', codigo: '',
    precio_costo: '', precio_venta: '', stock: '', stock_minimo: '5',
    fecha_vencimiento: '', notas: ''
  })

  useEffect(() => { cargarProductos() }, [])

  const cargarProductos = async () => {
    const { data } = await supabase.from('productos').select('*').eq('activo', true).order('nombre')
    if (data) setProductos(data)
  }

  const guardarProducto = async () => {
    setLoading(true)
    const { error } = await supabase.from('productos').insert([{
      ...form,
      precio_costo: parseFloat(form.precio_costo) || 0,
      precio_venta: parseFloat(form.precio_venta) || 0,
      stock: parseInt(form.stock) || 0,
      stock_minimo: parseInt(form.stock_minimo) || 5,
    }])
    if (!error) {
      await cargarProductos()
      setVista('lista')
      setForm({ nombre: '', marca: '', categoria: 'Facial', codigo: '', precio_costo: '', precio_venta: '', stock: '', stock_minimo: '5', fecha_vencimiento: '', notas: '' })
    }
    setLoading(false)
  }

  const productosFiltrados = productos.filter(function(p) {
    return p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.marca && p.marca.toLowerCase().includes(busqueda.toLowerCase()))
  })

  const stockBajo = productos.filter(function(p) { return p.stock <= p.stock_minimo }).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-950 px-6 py-4 flex items-center justify-between">
        <Link to="/"><h1 className="text-xl font-bold text-white">Blondie <span className="text-pink-300">Cosmetic</span></h1></Link>
        <span className="text-pink-300 text-sm">Inventario</span>
      </div>
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setVista('lista')} className={vista === 'lista' ? 'flex-1 py-2 rounded-xl text-sm font-medium bg-pink-600 text-white' : 'flex-1 py-2 rounded-xl text-sm font-medium bg-white border border-pink-200 text-pink-700'}>Ver productos</button>
          <button onClick={() => setVista('agregar')} className={vista === 'agregar' ? 'flex-1 py-2 rounded-xl text-sm font-medium bg-pink-600 text-white' : 'flex-1 py-2 rounded-xl text-sm font-medium bg-white border border-pink-200 text-pink-700'}>+ Agregar</button>
        </div>

        {vista === 'lista' && (
          <div>
            {stockBajo > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700">
                Alerta: {stockBajo} producto con stock bajo
              </div>
            )}
            <input value={busqueda} onChange={function(e){ setBusqueda(e.target.value) }} placeholder="Buscar producto..." className="w-full bg-white border border-pink-100 rounded-xl px-4 py-2.5 text-sm mb-4 outline-none" />
            <div className="flex flex-col gap-3">
              {productosFiltrados.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-pink-100">No hay productos aun</div>
              )}
              {productosFiltrados.map(function(p) {
                return (
                  <div key={p.id} className="bg-white rounded-2xl p-4 border border-pink-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">💄</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{p.nombre}</p>
                      <p className="text-xs text-gray-400">{p.marca} - {p.categoria} - ${p.precio_venta}</p>
                    </div>
                    <div className="text-right">
                      <p className={p.stock === 0 ? 'text-lg font-bold text-red-500' : p.stock <= p.stock_minimo ? 'text-lg font-bold text-amber-500' : 'text-lg font-bold text-green-600'}>{p.stock}</p>
                      <p className="text-xs text-gray-400">unidades</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {vista === 'agregar' && (
          <div className="bg-white rounded-2xl p-4 border border-pink-100 flex flex-col gap-4">
            <h2 className="font-bold text-pink-900">Nuevo producto</h2>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nombre</label>
              <input value={form.nombre} onChange={function(e){ setForm({...form, nombre: e.target.value}) }} placeholder="Base liquida Mac Studio" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Marca</label>
                <input value={form.marca} onChange={function(e){ setForm({...form, marca: e.target.value}) }} placeholder="MAC, NYX..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Codigo</label>
                <input value={form.codigo} onChange={function(e){ setForm({...form, codigo: e.target.value}) }} placeholder="MAC-001" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Categoria</label>
              <select value={form.categoria} onChange={function(e){ setForm({...form, categoria: e.target.value}) }} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                {categorias.map(function(c){ return <option key={c}>{c}</option> })}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Precio costo</label>
                <input type="number" value={form.precio_costo} onChange={function(e){ setForm({...form, precio_costo: e.target.value}) }} placeholder="0" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Precio venta</label>
                <input type="number" value={form.precio_venta} onChange={function(e){ setForm({...form, precio_venta: e.target.value}) }} placeholder="0" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Stock inicial</label>
                <input type="number" value={form.stock} onChange={function(e){ setForm({...form, stock: e.target.value}) }} placeholder="0" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Alerta stock bajo</label>
                <input type="number" value={form.stock_minimo} onChange={function(e){ setForm({...form, stock_minimo: e.target.value}) }} placeholder="5" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Fecha vencimiento</label>
              <input type="date" value={form.fecha_vencimiento} onChange={function(e){ setForm({...form, fecha_vencimiento: e.target.value}) }} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
            </div>
            <button onClick={guardarProducto} disabled={loading || !form.nombre} className="w-full bg-pink-600 text-white font-medium py-3 rounded-xl text-sm">
              {loading ? 'Guardando...' : 'Guardar producto'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
