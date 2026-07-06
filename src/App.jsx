import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-950 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Blondie <span className="text-pink-300">Cosmetic</span></h1>
          <p className="text-pink-400 text-xs">Sistema de ventas</p>
        </div>
        <p className="text-pink-300 text-sm">Martes 22 abril</p>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3 max-w-2xl mx-auto">
        <div className="bg-pink-950 rounded-2xl p-4 col-span-2 grid grid-cols-2 gap-3">
          <div>
            <p className="text-pink-400 text-xs">Ventas hoy</p>
            <p className="text-white text-2xl font-bold">$0</p>
          </div>
          <div>
            <p className="text-pink-400 text-xs">Meta diaria</p>
            <p className="text-white text-2xl font-bold">$0</p>
          </div>
          <div>
            <p className="text-pink-400 text-xs">Transacciones</p>
            <p className="text-white text-2xl font-bold">0</p>
          </div>
          <div>
            <p className="text-pink-400 text-xs">Ganancia</p>
            <p className="text-white text-2xl font-bold">$0</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-pink-100 col-span-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Módulos</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '💰', label: 'Ventas' },
              { icon: '📦', label: 'Inventario' },
              { icon: '👤', label: 'Clientes' },
              { icon: '📅', label: 'Reporte' },
              { icon: '🎯', label: 'Metas' },
              { icon: '🏧', label: 'Caja' },
              { icon: '💵', label: 'Caja chica' },
              { icon: '🚚', label: 'Proveedores' },
              { icon: '⭐', label: 'Puntos' },
            ].map((m) => (
              <button key={m.label} className="bg-pink-50 hover:bg-pink-100 border border-pink-100 rounded-xl p-3 flex flex-col items-center gap-1 transition-colors">
                <span className="text-2xl">{m.icon}</span>
                <span className="text-xs font-medium text-pink-900">{m.label}</span>
              </button>
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
      </Routes>
    </BrowserRouter>
  )
}

export default App