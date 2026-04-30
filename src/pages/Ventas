import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Ventas() {
  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [metodo, setMetodo] = useState('efectivo')
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)

  useEffect(function() { cargarProductos() }, [])

  const cargarProductos = async function() {
    const { data } = await supabase.from('productos').select('*').eq('activo', true).gt('stock', 0).order('nombre')
    if (data) setProductos(data)
  }

  const agregarAlCarrito = function(producto) {
    const existe = carrito.find(function(i) { return i.id === producto.id })
    if (existe) {
      setCarrito(carrito.map(function(i) {
        return i.id === producto.id ? {...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * i.precio_unitario} : i
      }))
    } else {
      setCarrito([...carrito, {
        id: producto.id,
        nombre: producto.nombre,
        precio_unitario: producto.precio_venta,
        cantidad: 1,
        subtotal: producto.precio_venta
      }])
    }
  }

  const quitarDelCarrito = function(id) {
    setCarrito(carrito.filter(function(i) { return i.id !== id }))
  }

  const total = carrito.reduce(function(acc, i) { return acc + i.subtotal }, 0)

  const cobrar = async function() {
    if (carrito.length === 0) return
    setLoading(true)
    const { data: venta, error } = await supabase.from('ventas').insert([{
      total: total,
      metodo_pago: metodo,
    }]).select().single()

    if (!error && venta) {
      const items = carrito.map(function(i) {
        return {
          venta_id: venta.id,
          producto_id: i.id,
          cantidad: i.cantidad,
          precio_unitario: i.precio_unitario,
          subtotal: i.subtotal
        }
      })
      await supabase.from('venta_items').insert(items)
      for (const item of carrito) {
        const prod = productos.find(function(p) { return p.id === item.id })
        if (prod) {
          await supabase.from('productos').update({ stock: prod.stock - item.cantidad }).eq('id', item.id)
        }
      }
      setCarrito([])
      setExito(true)
      await cargarProductos()
      setTimeout(function() { setExito(false) }, 3000)
    }
    setLoading(false)
  }

  const productosFiltrados = productos.filter(function(p) {
    return p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.marca && p.marca.toLowerCase().includes(busqueda.toLowerCase()))
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-950 px-6 py-4 flex items-center justify-between">
        <Link to="/"><h1 className="text-xl font-bold text-white">Blondie <span className="text-pink-300">Cosmetic</span></h1></Link>
        <span className="text-pink-300 text-sm">Nueva venta</span>
      </div>
      <div className="p-4 max-w-2xl mx-auto">
        {exito && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-700 text-center font-medium">
            Venta registrada exitosamente
          </div>
        )}
        <input value={busqueda} onChange={function(e) { setBusqueda(e.target.value) }} placeholder="Buscar producto..." className="w-full bg-white border border-pink-100 rounded-xl px-4 py-2.5 text-sm mb-4 outline-none" />
        <div className="flex flex-col gap-2 mb-4">
          {productosFiltrados.map(function(p) {
            return (
              <div key={p.id} className="bg-white rounded-xl p-3 border border-pink-100 flex items-center gap-3">
                <div className="w-9 h-9 bg-pink-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">💄</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{p.nombre}</p>
                  <p className="text-xs text-gray-400">${p.precio_venta} · Stock: {p.stock}</p>
                </div>
                <button onClick={function() { agregarAlCarrito(p) }} className="bg-pink-600 text-white rounded-lg w-8 h-8 text-lg font-bold flex items-center justify-center">+</button>
              </div>
            )
          })}
        </div>
        {carrito.length > 0 && (
          <div className="bg-pink-950 rounded-2xl p-4">
            <p className="text-pink-300 text-xs
