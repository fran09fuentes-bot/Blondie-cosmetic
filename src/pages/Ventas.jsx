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
      setCarrito([...carrito, { id
