import React, { useState } from 'react'
import Seo from '../components/Seo'
import { PAGES, breadcrumbSchema } from '../seo/seoConfig'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import SectionLabel from '../components/common/SectionLabel'
import samagriData from '../data/samagri.json'
import { ShoppingCart, Plus, Minus, X, CheckCircle2 } from 'lucide-react'

const CATEGORIES = ['All', 'Kits', 'Individual Items', 'Ingredients']

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const filtered = activeCategory === 'All' ? samagriData : samagriData.filter(i => i.category === activeCategory)
  const cartTotal = cart.reduce((sum, ci) => sum + ci.price * ci.qty, 0)
  const cartCount = cart.reduce((sum, ci) => sum + ci.qty, 0)

  const addToCart = (item) => {
    setCart(c => {
      const existing = c.find(ci => ci.id === item.id)
      if (existing) return c.map(ci => ci.id === item.id ? { ...ci, qty: ci.qty + 1 } : ci)
      return [...c, { ...item, qty: 1 }]
    })
  }

  const removeFromCart = (id) => setCart(c => c.filter(ci => ci.id !== id))
  const changeQty = (id, delta) => setCart(c => c.map(ci => ci.id === id ? { ...ci, qty: Math.max(1, ci.qty + delta) } : ci))

  const handleOrder = () => {
    console.log('Order placed:', cart)
    setOrderPlaced(true)
    setCart([])
    setCartOpen(false)
    setTimeout(() => setOrderPlaced(false), 4000)
  }

  return (
    <>
      <Seo
        {...PAGES.shop}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Shop', path: '/shop' },
        ])}
      />
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-h)', backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
        {/* Success toast */}
        {orderPlaced && (
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '1.5rem',
            zIndex: 1001,
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid var(--gold)',
            borderRadius: '8px',
            padding: '1rem 1.5rem',
            boxShadow: 'var(--shadow-hover)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            animation: 'fadeIn 0.3s ease',
          }}>
            <CheckCircle2 size={22} color="var(--gold)" />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Order placed! We'll confirm via WhatsApp.
            </p>
          </div>
        )}

        {/* Cart Sidebar */}
        {cartOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
            <div onClick={() => setCartOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(44,21,3,0.5)' }} />
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '360px',
              backgroundColor: 'var(--bg-page)',
              padding: '1.5rem',
              overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Your Cart ({cartCount})
                </h3>
                <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              {cart.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', textAlign: 'center', marginTop: '3rem' }}>
                  Your cart is empty
                </p>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {cart.map(item => (
                      <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</p>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--saffron)' }}>₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button onClick={() => changeQty(item.id, -1)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Minus size={12} />
                          </button>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                          <button onClick={() => changeQty(item.id, 1)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Plus size={12} />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>Total</span>
                    <span style={{ fontFamily: 'var(--font-cinzel-dec)', color: 'var(--saffron)', fontSize: '1.2rem' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <button onClick={handleOrder} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    🔒 Pay with Razorpay
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container-max" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <SectionLabel>PUJA SAMAGRI</SectionLabel>
              <h1 className="section-heading">Shop Sacred Items</h1>
            </div>
            <button className="btn-secondary" onClick={() => setCartOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingCart size={18} />
              Cart {cartCount > 0 && `(${cartCount})`}
            </button>
          </div>
        </div>

        {/* Products */}
        <div className="container-max" style={{ padding: '3rem 2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  padding: '0.4rem 1rem',
                  borderRadius: '999px',
                  border: activeCategory === cat ? 'none' : '1px solid var(--border)',
                  backgroundColor: activeCategory === cat ? 'var(--saffron)' : 'var(--gold-bg)',
                  color: activeCategory === cat ? 'white' : 'var(--maroon)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="card-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {filtered.map(item => (
              <div key={item.id} className="card-base" style={{ padding: '1.25rem', opacity: item.inStock ? 1 : 0.65 }}>
                {/* Image placeholder */}
                <div style={{
                  width: '100%',
                  aspectRatio: '1',
                  backgroundColor: 'var(--gold-bg)',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  border: '1px solid var(--border)',
                }}>
                  {item.category === 'Kits' ? '🪔' : item.category === 'Ingredients' ? '🌿' : '✨'}
                </div>
                <span className="service-badge" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>{item.category}</span>
                <h3 className="card-title" style={{ fontSize: '0.88rem', marginBottom: '0.15rem' }}>{item.name}</h3>
                <p className="devanagari-sub" style={{ marginBottom: '0.5rem' }}>{item.hindiName}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {item.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-cinzel-dec)', fontSize: '1.1rem', color: 'var(--saffron)' }}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => item.inStock && addToCart(item)}
                    disabled={!item.inStock}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      padding: '0.35rem 0.75rem',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: item.inStock ? 'var(--saffron)' : 'var(--border)',
                      color: item.inStock ? 'white' : 'var(--text-muted)',
                      cursor: item.inStock ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
