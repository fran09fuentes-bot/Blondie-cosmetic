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
    if (!error) {
      await cargarClientes()
      setVista('lista')
      setForm({ nombre: '', telefono: '', correo: '' })
    }
    setLoading(false)
  }

  const clientesFiltrados = clientes.filter(function(c) {
    return c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.telefono && c.telefono.includes(busqueda))
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-950 px-6 py-4 flex items-center justify-between">
        <L
