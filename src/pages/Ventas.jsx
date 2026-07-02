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
      setCarrito(carrito.map(function(i) { return i.id === producto.id ? {...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * i.precio_unitario} : i }))
    } else {
      setCarrito([...carrito, { id: producto.id, nombre: producto.nombre, codigo: producto.codigo, precio_unitario: producto.precio_unitario, cantidad: 1, subtotal: producto.precio_unitario, stock_disponible: producto.stock }])
    }
  }

  const quitarDelCarrito = function(id) {
    setCarrito(carrito.filter(function(i) { return i.id !== id }))
  }

  const cambiarCantidad = function(id, nuevaCantidad) {
    if (nuevaCantidad < 1) {
      quitarDelCarrito(id)
      return
    }
    setCarrito(carrito.map(function(i) { return i.id === id ? {...i, cantidad: nuevaCantidad, subtotal: nuevaCantidad * i.precio_unitario} : i }))
  }

  const total = carrito.reduce(function(acc, i) { return acc + i.subtotal }, 0)

  const productosFiltrados = productos.filter(function(p) {
    const texto = busqueda.toLowerCase()
    return p.nombre.toLowerCase().includes(texto) || (p.codigo && p.codigo.toLowerCase().includes(texto))
  })

  const procesarVenta = async function() {
    if (carrito.length === 0) return
    setLoading(true)

    const { data: venta, error: errorVenta } = await supabase
      .from('ventas')
      .insert({ total: total, metodo_pago: metodo, fecha: new Date().toISOString() })
      .select()
      .single()

    if (errorVenta || !venta) {
      alert('Error al crear la venta: ' + (errorVenta ? errorVenta.message : 'sin datos'))
      setLoading(false)
      return
    }

    const items = carrito.map(function(i) {
      return {
        venta_id: venta.id,
        producto_id: i.id,
        cantidad: i.cantidad,
        precio_unitario: i.precio_unitario,
        subtotal: i.subtotal
      }
    })

    const { error: errorItems } = await supabase.from('venta_items').insert(items)

    if (errorItems) {
      alert('Error al guardar los productos de la venta: ' + errorItems.message)
      setLoading(false)
      return
    }

    for (const item of carrito) {
      const nuevoStock = item.stock_disponible - item.cantidad
      await supabase.from('productos').update({ stock: nuevoStock }).eq('id', item.id)
    }

    setCarrito([])
    setExito(true)
    setLoading(false)
    cargarProductos()
    setTimeout(function() { setExito(false) }, 3000)
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Ventas</h1>
        <Link to="/">Volver al inicio</Link>
      </div>

      {exito && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
          Venta procesada correctamente.
        </div>
      )}

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2', minWidth: '320px' }}>
          <input
            type="text"
            placeholder="Buscar producto por nombre o codigo..."
            value={busqueda}
            onChange={function(e) { setBusqueda(e.target.value) }}
            style={{ width: '100%', padding: '10px', marginBottom: '16px', boxSizing: 'border-box' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {productosFiltrados.map(function(producto) {
              return (
                <div key={producto.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontWeight: 'bold' }}>{producto.nombre}</div>
                  <div style={{ color: '#666', fontSize: '13px' }}>{producto.codigo}</div>
                  <div style={{ margin: '6px 0' }}>${producto.precio_unitario.toFixed(2)}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Stock: {producto.stock}</div>
                  <button onClick={function() { agregarAlCarrito(producto) }} style={{ marginTop: '8px', width: '100%' }}>
                    Agregar
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ flex: '1', minWidth: '280px', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', height: 'fit-content' }}>
          <h3>Carrito</h3>
          {carrito.length === 0 && <p style={{ color: '#888' }}>Sin productos agregados.</p>}

          {carrito.map(function(item) {
            return (
              <div key={item.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.nombre}</span>
                  <button onClick={function() { quitarDelCarrito(item.id) }} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>x</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <button onClick={function() { cambiarCantidad(item.id, item.cantidad - 1) }}>-</button>
                  <span>{item.cantidad}</span>
                  <button onClick={function() { cambiarCantidad(item.id, item.cantidad + 1) }}>+</button>
                  <span style={{ marginLeft: 'auto' }}>${item.subtotal.toFixed(2)}</span>
                </div>
              </div>
            )
          })}

          <div style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '12px' }}>
            Total: ${total.toFixed(2)}
          </div>

          <select value={metodo} onChange={function(e) { setMetodo(e.target.value) }} style={{ width: '100%', padding: '8px', marginTop: '12px' }}>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>

          <button
            onClick={procesarVenta}
            disabled={loading || carrito.length === 0}
            style={{ width: '100%', padding: '12px', marginTop: '12px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            {loading ? 'Procesando...' : 'Procesar venta'}
          </button>
        </div>
      </div>
    </div>
  )
}
