import { useEffect, useMemo, useState } from 'react'
import './styles.css'
import { supabase } from './supabase'

function money(value) {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value || 0))
}

export default function App() {
  const [tab, setTab] = useState('ventas')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    sku: '',
    price: '',
    stock: '',
  })

  async function loadProducts() {
    setLoading(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      setErrorMessage(error.message)
      setProducts([])
    } else {
      setProducts(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return products

    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
    )
  }, [search, products])

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)

      if (existing) {
        if (existing.qty >= product.stock) return prev
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }

      return [...prev, { ...product, qty: 1 }]
    })
  }

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    )
  }

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        if (item.qty >= item.stock) return item
        return { ...item, qty: item.qty + 1 }
      })
    )
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const resetDemo = () => {
    setCart([])
    setSearch('')
    setTab('dashboard')
  }

  async function addProduct(e) {
    e.preventDefault()
    setErrorMessage('')

    const payload = {
      name: newProduct.name.trim(),
      category: newProduct.category.trim(),
      sku: newProduct.sku.trim(),
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
    }

    const { error } = await supabase.from('products').insert(payload)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setNewProduct({
      name: '',
      category: '',
      sku: '',
      price: '',
      stock: '',
    })

    await loadProducts()
    setTab('inventario')
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0)
  const cost = cart.reduce((acc, item) => acc + item.qty * (item.price * 0.55), 0)
  const profit = subtotal - cost
  const stockLow = products.filter((p) => Number(p.stock) <= 10).length
  const totalProducts = products.length
  const averageTicket = 0
  const margin = subtotal > 0 ? ((profit / subtotal) * 100).toFixed(0) : 0

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <h1>Blondie Cosmetic</h1>
          <p>Sistema de ventas</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={tab === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setTab('dashboard')}
          >
            Dashboard
          </button>

          <button
            className={tab === 'ventas' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setTab('ventas')}
          >
            Ventas
          </button>

          <button
            className={tab === 'inventario' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setTab('inventario')}
          >
            Inventario
          </button>

          <button
            className={tab === 'reportes' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setTab('reportes')}
          >
            Reportes
          </button>
        </nav>

        <button className="reset-btn" onClick={resetDemo}>
          Reiniciar vista
        </button>
      </aside>

      <main className="main-content">
        {errorMessage && (
          <div className="panel" style={{ marginBottom: 20, border: '1px solid rgba(248,113,113,.35)' }}>
            <h3>Error</h3>
            <p>{errorMessage}</p>
          </div>
        )}

        {tab === 'dashboard' && (
          <section>
            <div className="page-header">
              <div>
                <span className="eyebrow">Resumen general</span>
                <h2>Dashboard</h2>
                <p>{loading ? 'Cargando productos...' : 'Inventario conectado con Supabase'}</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span>Productos</span>
                <strong>{totalProducts}</strong>
                <small>En base de datos</small>
              </div>

              <div className="stat-card">
                <span>Venta actual</span>
                <strong>{money(subtotal)}</strong>
                <small>Carrito en curso</small>
              </div>

              <div className="stat-card">
                <span>Ganancia estimada</span>
                <strong>{money(profit)}</strong>
                <small>Con costo simulado</small>
              </div>

              <div className="stat-card">
                <span>Stock bajo</span>
                <strong>{stockLow}</strong>
                <small>Productos por reponer</small>
              </div>
            </div>
          </section>
        )}

        {tab === 'ventas' && (
          <section>
            <div className="page-header">
              <div>
                <span className="eyebrow">Punto de venta</span>
                <h2>Ventas</h2>
                <p>Productos traídos desde la base de datos.</p>
              </div>
            </div>

            <div className="sales-layout">
              <div className="panel">
                <div className="panel-header">
                  <h3>Productos</h3>
                </div>

                <input
                  className="search-input"
                  type="text"
                  placeholder="Buscar producto, categoría o SKU"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {loading ? (
                  <p className="empty-text">Cargando productos...</p>
                ) : (
                  <div className="product-grid">
                    {filteredProducts.map((product) => (
                      <div className="product-card" key={product.id}>
                        <div className="product-top">
                          <div>
                            <h4>{product.name}</h4>
                            <p>{product.category}</p>
                          </div>
                          <span className="stock-badge">Stock {product.stock}</span>
                        </div>

                        <div className="product-meta">
                          <span>{product.sku}</span>
                          <strong>{money(product.price)}</strong>
                        </div>

                        <button
                          className="primary-btn"
                          onClick={() => addToCart(product)}
                        >
                          Agregar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="panel cart-panel">
                <div className="panel-header">
                  <h3>Carrito</h3>
                </div>

                {cart.length === 0 ? (
                  <p className="empty-text">No hay productos en el carrito.</p>
                ) : (
                  <div className="cart-list">
                    {cart.map((item) => (
                      <div className="cart-item" key={item.id}>
                        <div className="cart-info">
                          <strong>{item.name}</strong>
                          <span>{money(item.price)} c/u</span>
                        </div>

                        <div className="cart-actions">
                          <button className="qty-btn" onClick={() => decreaseQty(item.id)}>
                            -
                          </button>
                          <span className="qty">{item.qty}</span>
                          <button className="qty-btn" onClick={() => increaseQty(item.id)}>
                            +
                          </button>
                        </div>

                        <div className="cart-total">{money(item.price * item.qty)}</div>

                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>{money(subtotal)}</strong>
                  </div>
                  <div>
                    <span>Costo</span>
                    <strong>{money(cost)}</strong>
                  </div>
                  <div>
                    <span>Ganancia</span>
                    <strong>{money(profit)}</strong>
                  </div>
                </div>

                <button className="checkout-btn">Finalizar venta</button>
              </div>
            </div>
          </section>
        )}

        {tab === 'inventario' && (
          <section>
            <div className="page-header">
              <div>
                <span className="eyebrow">Inventario real</span>
                <h2>Inventario</h2>
                <p>Aquí ya puedes agregar productos a Supabase.</p>
              </div>
            </div>

            <div className="panel" style={{ marginBottom: 20 }}>
              <h3>Nuevo producto</h3>

              <form onSubmit={addProduct} className="summary-grid">
                <input
                  className="search-input"
                  placeholder="Nombre"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <input
                  className="search-input"
                  placeholder="Categoría"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                />
                <input
                  className="search-input"
                  placeholder="SKU"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                />
                <input
                  className="search-input"
                  placeholder="Precio"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <input
                  className="search-input"
                  placeholder="Stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                />
                <button className="primary-btn" type="submit">
                  Guardar producto
                </button>
              </form>
            </div>

            <div className="panel">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>SKU</th>
                      <th>Precio</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{product.sku}</td>
                        <td>{money(product.price)}</td>
                        <td>{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {tab === 'reportes' && (
          <section>
            <div className="page-header">
              <div>
                <span className="eyebrow">Vista gerencial</span>
                <h2>Reportes</h2>
                <p>Resumen del inventario y del carrito actual.</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span>Productos en carrito</span>
                <strong>{cart.length}</strong>
                <small>Artículos distintos</small>
              </div>

              <div className="stat-card">
                <span>Total actual</span>
                <strong>{money(subtotal)}</strong>
                <small>Venta en curso</small>
              </div>

              <div className="stat-card">
                <span>Ganancia estimada</span>
                <strong>{money(profit)}</strong>
                <small>Con costo simulado</small>
              </div>

              <div className="stat-card">
                <span>Productos cargados</span>
                <strong>{products.length}</strong>
                <small>Desde Supabase</small>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
