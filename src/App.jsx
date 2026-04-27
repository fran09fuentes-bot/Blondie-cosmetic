import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Inventario from './pages/Inventario'

function Pagina({ titulo }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-950 px-6 py-4 flex items-center justify-between">
        <Link to="/"><h1 className="text-xl font-bold text-white">Blondie <span className="text-pink-300">Cosmetic</span></h1></Link>
      </div>
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-pink-900 mb-4">{titulo}</h2>
        <div className="bg-white rounded-2xl p-8 border border-pink-100 text-center text-gray-400">Módulo en construcción 🌸</div>
      </div>
    </div>
  )
}

function Dashboard() {
  const modulos = [
    { icon: '💰', label: 'Ventas', path: '/ventas' },
    { icon: '📦', label: 'Inventario', path: '/inventario' },
    { icon: '👤', label: 'Clientes', path: '/clientes' },
    { icon: '📅', label: 'Reporte', path: '/reporte' },
    { icon: '🎯', label: 'Metas', path: '/metas' },
    { icon: '🏧', label: 'Caja', path: '/caja' },
    { icon: '💵', label: 'Caja chica', path: '/caja-chica' },
    { icon: '🚚', label: 'Proveedores', path: '/proveedores' },
    { icon: '⭐', label: 'Puntos', path: '/puntos' },
  ]
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-950 px-6 py-4">
        <h1 className="text-xl font-bold text-white">Blondie <span className="text-pink-300">Cosmetic</span></h1>
        <p className="text-pink-400 text-xs">Sistema de ventas</p>
      </div>
      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-pink-950 rounded-2xl p-4 mb-4 grid grid-cols-2 gap-3">
          <div><p className="text-pink-400 text-xs">Ventas hoy</p><p className="text-white text-2xl font-bold">$0</p></div>
          <div><p className="text-pink-400 text-xs">Meta diaria</p><p className="text-white text-2xl font-bold">$0</p></div>
          <div><p className="text-pink-400 text-xs">Transacciones</p><p className="text-white text-2xl font-bold">0</p></div>
          <div><p className="text-pink-400 text-xs">Ganancia</p><p className="text-white text-2xl font-bold">$0</p></div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-pink-100">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Módulos</p>
          <div className="grid grid-cols-3 gap-3">
            {modulos.map((m) => (
              <Link key={m.label} to={m.path} className="bg-pink-50 hover:bg-pink-100 border border-pink-100 rounded-xl p-3 flex flex-col items-center gap-1 transition-colors">
                <span className="text-2xl">{m.icon}</span>
                <span className="text-xs font-medium text-pink-900">{m.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/ventas" element={<Pagina titulo="💰 Ventas" />} />
        <Route path="/clientes" element={<Pagina titulo="👤 Clientes" />} />
        <Route path="/reporte" element={<Pagina titulo="📅 Reportes" />} />
        <Route path="/metas" element={<Pagina titulo="🎯 Metas" />} />
        <Route path="/caja" element={<Pagina titulo="🏧 Caja del día" />} />
        <Route path="/caja-chica" element={<Pagina titulo="💵 Caja chica" />} />
        <Route path="/proveedores" element={<Pagina titulo="🚚 Proveedores" />} />
        <Route path="/puntos" element={<Pagina titulo="⭐ Puntos" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
