import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'blondie_cosmetic_data_v1'

const seedProducts = [
  { id: 1, name: 'Shampoo', category: 'Cabello', price: 5, cost: 3, stock: 20, sku: 'BLD-001' },
  { id: 2, name: 'Perfume', category: 'Fragancias', price: 12, cost: 7, stock: 10, sku: 'BLD-002' },
  { id: 3, name: 'Crema Facial', category: 'Skin Care', price: 9, cost: 5, stock: 15, sku: 'BLD-003' },
  { id: 4, name: 'Labial Mate', category: 'Maquillaje', price: 6, cost: 3.5, stock: 18, sku: 'BLD-004' },
]

const seedSales = []

function money(value) {
  return new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(Number(value || 0))
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function StatCard({ title, value, subtext }) {
  return (
    <div className="card stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-subtext">{subtext}</div>
    </div>
  )
}

function TabButton({ active, children, onClick }) {
  return (
    <button className={`tab-button ${active ? 'active' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState(seedProducts)
  const [sales, setSales] = useState(seedSales)
  const [cart, setCart] = useState([])
  const [query, setQuery] = useState('')
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', cost: '', stock: '', sku: '' })

  useEffect(() => {
    const saved = loadData()
    if (saved) {
      setProducts(saved.products || seedProducts)
      setSales(saved.sales || seedSales)
    }
  }, [])

  useEffect(() => {
    saveData({ products, sales })
  }, [products, sales])

  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q),
    )
  }, [products, query])

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
  const totalCost = sales.reduce((sum, sale) => sum + sale.cost, 0)
  const totalProfit = totalSales - totalCost
  const avgTicket = sales.length ? totalSales / sales.length : 0
  const lowStock = products.filter((p) => p.stock <= 5).length

  const addToCart = (product) => {
    if (product.stock <= 0) return

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        if (existing.qty >= product.stock) return prev
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item))
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const updateCartQty = (id, nextQty) => {
    const product = products.find((item) => item.id === id)
    if (!product) return
    if (nextQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id))
      return
    }
    const safeQty = Math.min(nextQty, product.stock)
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty: safeQty } : item)))
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0)
  const cartCost = cart.reduce((sum, item) => sum + item.qty * item.cost, 0)
  const cartProfit = cartTotal - cartCost

  const completeSale = () => {
    if (!cart.length) return

    const newSale = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      total: cartTotal,
      cost: cartCost,
      items: cart.map((item) => ({ name: item.name, qty: item.qty, price: item.price })),
    }

    setSales((prev) => [newSale, ...prev])
    setProducts((prev) =>
      prev.map((product) => {
        const sold = cart.find((item) => item.id === product.id)
        return sold ? { ...product, stock: product.stock - sold.qty } : product
      }),
    )
    setCart([])
    setActiveTab('reportes')
  }

  const addProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.cost || !newProduct.stock) return

    const product = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      cost: Number(newProduct.cost),
      stock: Number(newProduct.stock),
      sku: newProduct.sku || `BLD-${String(Date.now()).slice(-4)}`,
    }

    setProducts((prev) => [product, ...prev])
    setNewProduct({ name: '', category: '', price: '', cost: '', stock: '', sku: '' })
  }

  const resetAll = () => {
    setProducts(seedProducts)
    setSales(seedSales)
    setCart([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">Blondie Cosmetic</div>
          <div className="brand-subtitle">Sistema de ventas</div>
        </div>

        <div className="nav-group">
          <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </TabButton>
          <TabButton active={activeTab === 'ventas'} onClick={() => setActiveTab('ventas')}>
            Ventas
          </TabButton>
          <TabButton active={activeTab === 'inventario'} onClick={() => setActiveTab('inventario')}>
            Inventario
          </TabButton>
          <TabButton active={activeTab === 'reportes'} onClick={() => setActiveTab('reportes')}>
            Reportes
          </TabButton>
        </div>

        <button className="secondary-button" onClick={resetAll}>
          Reiniciar demo
        </button>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p>Blondie Cosmetic · listo para GitHub y Vercel</p>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <section className="content-grid">
            <div className="stats-grid">
              <StatCard title="Ventas totales" value={money(totalSales)} subtext="Ingresos acumulados" />
              <StatCard title="Ganancia" value={money(totalProfit)} subtext="Ventas - costo" />
              <StatCard title="Ticket promedio" value={money(avgTicket)} subtext="Promedio por venta" />
              <StatCard title="Stock bajo" value={String(lowStock)} subtext="Productos por reponer" />
            </div>

            <div className="card dashboard-panel">
              <h2>Resumen rápido</h2>
              <div className="summary-row"><span>Productos</span><strong>{products.length}</strong></div>
              <div className="summary-row"><span>Ventas realizadas</span><strong>{sales.length}</strong></div>
              <div className="summary-row"><span>Costo total</span><strong>{money(totalCost)}</strong></div>
              <div className="summary-row"><span>Margen</span><strong>{totalSales ? `${((totalProfit / totalSales) * 100).toFixed(1)}%` : '0%'}</strong></div>
            </div>
          </section>
        )}

        {activeTab === 'ventas' && (
          <section className="sales-layout">
            <div className="card">
              <div className="section-title-row">
                <h2>Productos</h2>
                <input
                  className="app-input"
                  placeholder="Buscar producto, categoría o SKU"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="product-list">
                {filteredProducts.map((product) => (
                  <div className="product-item" key={product.id}>
                    <div>
                      <div className="product-name">{product.name}</div>
                      <div className="product-meta">{product.category} · {product.sku}</div>
                      <div className="product-meta">Precio {money(product.price)} · Stock {product.stock}</div>
                    </div>
                    <button className="primary-button" onClick={() => addToCart(product)}>
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2>Carrito</h2>
              <div className="cart-list">
                {cart.length === 0 && <div className="empty-text">No hay productos en el carrito.</div>}
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div>
                      <div className="product-name">{item.name}</div>
                      <div className="product-meta">{money(item.price)} c/u</div>
                    </div>
                    <div className="cart-actions">
                      <button className="qty-button" onClick={() => updateCartQty(item.id, item.qty - 1)}>-</button>
                      <span>{item.qty}</span>
                      <button className="qty-button" onClick={() => updateCartQty(item.id, item.qty + 1)}>+</button>
                      <button className="danger-button" onClick={() => removeFromCart(item.id)}>Quitar</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="totals-box">
                <div className="summary-row"><span>Subtotal</span><strong>{money(cartTotal)}</strong></div>
                <div className="summary-row"><span>Costo</span><strong>{money(cartCost)}</strong></div>
                <div className="summary-row"><span>Ganancia</span><strong>{money(cartProfit)}</strong></div>
              </div>

              <button className="success-button" onClick={completeSale} disabled={!cart.length}>
                Finalizar venta
              </button>
            </div>
          </section>
        )}

        {activeTab === 'inventario' && (
          <section className="inventory-layout">
            <div className="card">
              <h2>Inventario actual</h2>
              <div className="table-wrap">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Costo</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.sku}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{money(product.price)}</td>
                        <td>{money(product.cost)}</td>
                        <td>{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card form-card">
              <h2>Nuevo producto</h2>
              <input className="app-input" placeholder="Nombre" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              <input className="app-input" placeholder="Categoría" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
              <input className="app-input" placeholder="SKU (opcional)" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} />
              <input className="app-input" type="number" placeholder="Precio" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
              <input className="app-input" type="number" placeholder="Costo" value={newProduct.cost} onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })} />
              <input className="app-input" type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
              <button className="primary-button" onClick={addProduct}>Guardar producto</button>
            </div>
          </section>
        )}

        {activeTab === 'reportes' && (
          <section className="card">
            <h2>Historial de ventas</h2>
            <div className="table-wrap">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Costo</th>
                    <th>Ganancia</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td>#{sale.id}</td>
                      <td>{sale.date}</td>
                      <td>{money(sale.total)}</td>
                      <td>{money(sale.cost)}</td>
                      <td>{money(sale.total - sale.cost)}</td>
                    </tr>
                  ))}
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-cell">Aún no hay ventas registradas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
