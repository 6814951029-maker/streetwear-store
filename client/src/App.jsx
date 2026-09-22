import React, { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import "./allBlack.css";
import "./summary-styles.css";

const sampleProducts = [
  { id: "noir-crop-street-set", name: "Noir Crop Street Set", nameTh: "เสื้อครอปและกางเกงทรงหลวม สีดำ", style: "BLACK COTTON / BAGGY FIT", category: "clothing", price: 1290, colors: ["#050505", "#161616", "#303030"], badge: "ALL BLACK", image: "https://images.shafastatic.net/2172376388" },
  { id: "shadow-wide-leg-set", name: "Shadow Wide Leg Set", nameTh: "เสื้อครอปและกางเกงขากว้าง สีดำ", style: "BLACK JERSEY / WIDE LEG", category: "clothing", price: 1890, colors: ["#080808", "#242424", "#3c3c3c"], badge: "NIGHT DROP", image: "https://image.made-in-china.com/365f3j00YMOWCheECFuU/Pantaloni-larghi-in-stile-hip-hop-grigi-pantaloni-da-jogging-jazz-hip-hop-abbigliamento-sportivo-pantaloni-casual-larghi-da-strada.webp" },
  { id: "phantom-tech-sling", name: "Phantom Tech Sling", nameTh: "กระเป๋าสะพาย Techwear สีดำ", style: "MATTE BLACK / TECHWEAR", category: "bags", price: 1690, colors: ["#050505", "#1c1c1c", "#404040"], badge: "ALL BLACK", image: "https://blackout-techwear.co.uk/cdn/shop/files/japanese-techwear-crossbody-bag-uk.jpg?v=1729065715&width=1920" },
  { id: "midnight-canvas-tote", name: "Midnight Canvas Tote", nameTh: "กระเป๋าโท้ทแคนวาส สีดำ", style: "BLACK CANVAS / OVERSIZED", category: "bags", price: 1190, colors: ["#0a0a0a", "#282828", "#555555"], badge: "CORE BLACK", image: "https://theshopyohjiyamamoto.jp/img/goods/HA-I32-665/HA-I32-665_1-1.jpg" },
];
const money = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });
const Icon = ({ children }) => <span aria-hidden="true">{children}</span>;

const loadSavedCart = () => {
  try {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
};

function LayoutShell({ children, cartCount, cartOpen, setCartOpen, cart, removeFromCart, updateQuantity, subtotal, navigateToCheckout }) {
  return (
    <main className="storefront">
      <div className="announcement">FREE SHIPPING เมื่อช้อปครบ 1,500 บาท <span>•</span> NEW DROP AVAILABLE NOW</div>
      <header className="site-header">
        <button className="mobile-menu" aria-label="เมนู">☰</button>
        <Link className="brand" to="/">STREETWEAR <span>STORE</span></Link>
        <nav>
          <Link to="/">หน้าแรก</Link>
          <Link to="/shop">หน้าสินค้า</Link>
          <Link to="/checkout">หน้าสรุป</Link>
        </nav>
        <div className="header-actions">
          <Link to="/login" className="account-link">บัญชี</Link>
          <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="ตะกร้าสินค้า">
            ♧<b>{cartCount}</b>
          </button>
        </div>
      </header>

      {children}

      {cartOpen && (
        <>
          <button className="cart-backdrop" onClick={() => setCartOpen(false)} aria-label="ปิดตะกร้า" />
          <aside className="cart-panel">
            <div className="cart-title">
              <h2>YOUR BAG <small>({cartCount})</small></h2>
              <button onClick={() => setCartOpen(false)} aria-label="ปิด">×</button>
            </div>

            {cart.length ? (
              <>
                <div className="cart-list">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-copy">
                        <b>{item.name}</b>
                        <p>{money.format(item.price)} / ชิ้น</p>
                        <div className="quantity-stepper">
                          <button type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                      </div>
                      <button type="button" className="remove-cart-item" onClick={() => removeFromCart(item.id)}>×</button>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <span>รวม</span>
                  <b>{money.format(subtotal)}</b>
                </div>
                <button className="checkout" onClick={navigateToCheckout}>สรุปคำสั่งซื้อ</button>
              </>
            ) : (
              <p className="empty-cart">ยังไม่มีสินค้าในตะกร้า</p>
            )}
          </aside>
        </>
      )}
    </main>
  );
}

function Home({ cartCount, cartOpen, setCartOpen, cart, removeFromCart, updateQuantity, subtotal, navigateToCheckout }) {
  return (
    <LayoutShell
      cartCount={cartCount}
      cartOpen={cartOpen}
      setCartOpen={setCartOpen}
      cart={cart}
      removeFromCart={removeFromCart}
      updateQuantity={updateQuantity}
      subtotal={subtotal}
      navigateToCheckout={navigateToCheckout}
    >
      <section className="hero" id="top">
        <div className="hero-image">
          <img src="https://cdn.shopify.com/s/files/1/0755/5897/7837/files/streetwear-oversized-tee.webp?v=1784664440" alt="Streetwear oversized tee" />
        </div>
        <div className="hero-copy">
          <p className="section-kicker">BANGKOK STREET DIVISION / 2026</p>
          <h1>OWN THE<br /><em>BLOCK.</em></h1>
          <p>เสื้อผ้าและกระเป๋าสำหรับทุกจังหวะของเมือง<br />ทรงชัด ใส่สบาย พร้อมลุยในแบบของคุณ</p>
          <Link className="dark-cta" to="/shop">SHOP THE DROP <Icon>→</Icon></Link>
        </div>
      </section>

      <footer>
        <a className="brand" href="#top">STREETWEAR <span>STORE</span></a>
        <p>Designed in Bangkok. Worn everywhere.</p>
        <div>
          <a href="#top">Instagram</a>
          <a href="#top">Line</a>
          <a href="#top">Contact</a>
        </div>
      </footer>
    </LayoutShell>
  );
}

function ShopPage({ products, category, setCategory, query, setQuery, cartCount, cartOpen, setCartOpen, cart, addToCart, removeFromCart, updateQuantity, subtotal, navigateToCheckout }) {
  const visible = useMemo(
    () => products.filter((item) => (category === "all" || item.category === category) && `${item.name} ${item.nameTh}`.toLowerCase().includes(query.toLowerCase())),
    [products, category, query]
  );

  return (
    <LayoutShell
      cartCount={cartCount}
      cartOpen={cartOpen}
      setCartOpen={setCartOpen}
      cart={cart}
      removeFromCart={removeFromCart}
      updateQuantity={updateQuantity}
      subtotal={subtotal}
      navigateToCheckout={navigateToCheckout}
    >
      <section className="collection" id="shop">
        <div className="section-heading">
          <div>
            <p className="section-kicker">THE ALL-BLACK DROP</p>
            <h2>BUILT FOR<br />THE CONCRETE.</h2>
          </div>
          <Link to="/checkout">VIEW ALL <Icon>→</Icon></Link>
        </div>
        <div className="category-bar">
          {[['all', 'ทั้งหมด'], ['clothing', 'เสื้อผ้า'], ['bags', 'กระเป๋า']].map(([key, text]) => (
            <button key={key} className={category === key ? "active" : ""} onClick={() => setCategory(key)}>{text}</button>
          ))}
        </div>
        <label className="shop-search">
          <Icon>⌕</Icon>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาสินค้า" aria-label="ค้นหาสินค้า" />
        </label>
        <div className="product-grid">
          {visible.map((item) => (
            <article className="product-card" key={item.id}>
              <div className="product-image">
                {item.badge && <span className="badge">{item.badge}</span>}
                <img src={item.image} alt={item.nameTh} />
                <button onClick={() => addToCart(item)} aria-label={`เพิ่ม ${item.nameTh} ลงตะกร้า`}>+</button>
              </div>
              <div className="product-details">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.nameTh}</p>
                  <small>{item.style}</small>
                </div>
                <strong>{money.format(item.price)}</strong>
              </div>
              <div className="swatches">
                {item.colors.map((color) => <i key={color} style={{ background: color }} />)}
              </div>
            </article>
          ))}
        </div>
        {!visible.length && <p className="empty-state">ไม่พบสินค้าที่ค้นหา ลองใช้คำค้นอื่นดูนะ</p>}
      </section>
    </LayoutShell>
  );
}

function CheckoutSummary({ cart, setCart }) {
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 1500 ? 0 : 120;
  const total = subtotal + shipping;

  const submitOrder = async () => {
    if (!cart.length) {
      window.alert("ยังไม่มีสินค้าในตะกร้า");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cart.map(({ id, quantity }) => ({ id, quantity })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "สั่งซื้อไม่สำเร็จ");
      }

      setCart([]);
      localStorage.removeItem("cart");
      navigate("/");
      window.alert(`สั่งซื้อสำเร็จ เลขที่ ${data._id}`);
    } catch (error) {
      window.alert(error.message || "สั่งซื้อไม่สำเร็จ");
    }
  };

  if (!cart.length) {
    return (
      <main className="summary-page empty-summary">
        <div className="summary-card">
          <p className="section-kicker">ORDER SUMMARY</p>
          <h1>ตะกร้าของคุณยังว่าง</h1>
          <p>เลือกสินค้าเพิ่มก่อนยืนยันคำสั่งซื้อ</p>
          <Link to="/" className="button primary-button">กลับไปเลือกสินค้า</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="summary-page">
      <div className="summary-layout">
        <section className="summary-card summary-product-panel">
          <p className="section-kicker">ORDER SUMMARY</p>
          <h1>สรุปคำสั่งซื้อ</h1>

          <div className="summary-items">
            {cart.map((item) => (
              <div className="summary-item" key={item.id}>
                <div className="summary-thumb-wrap">
                  <img src={item.image} alt={item.name} className="summary-thumb" />
                </div>

                <div className="summary-item-meta">
                  <div className="summary-item-header">
                    <h2>{item.name}</h2>
                    <strong>{money.format(item.price * item.quantity)}</strong>
                  </div>
                  <p>{item.nameTh}</p>
                  <div className="summary-item-footer">
                    <span>{item.quantity} ชิ้น</span>
                    <span>{money.format(item.price)} ต่อชิ้น</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="summary-card summary-side">
          <h2>ยอดชำระ</h2>
          <div className="summary-row"><span>รวมสินค้า</span><strong>{money.format(subtotal)}</strong></div>
          <div className="summary-row"><span>ค่าจัดส่ง</span><strong>{shipping === 0 ? "ฟรี" : money.format(shipping)}</strong></div>
          <div className="summary-row total-row"><span>ยอดสุทธิ</span><strong>{money.format(total)}</strong></div>
          <button className="button primary-button" onClick={submitOrder}>ยืนยันคำสั่งซื้อ</button>
          <Link to="/" className="secondary-link">กลับไปเลือกสินค้า</Link>
        </aside>
      </div>
    </main>
  );
}

export default function App() {
  const [products, setProducts] = useState(sampleProducts);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState(loadSavedCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => setProducts(data.products || sampleProducts))
      .catch(() => setOffline(true));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) {
        return current.map((entry) =>
          entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }

      return [
        ...current,
        {
          id: item.id,
          name: item.name,
          nameTh: item.nameTh,
          price: Number(item.price) || 0,
          image: item.image,
          quantity: 1,
        },
      ];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((current) =>
      current.flatMap((item) => {
        if (item.id !== productId) return [item];
        const nextQuantity = item.quantity + delta;
        return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
      })
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const navigateToCheckout = () => {
    setCartOpen(false);
    window.location.assign("/checkout");
  };

  return (
    <Routes>
      <Route path="/" element={<Home cartCount={cartCount} cartOpen={cartOpen} setCartOpen={setCartOpen} cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} subtotal={subtotal} navigateToCheckout={navigateToCheckout} />} />
      <Route path="/shop" element={<ShopPage products={products} category={category} setCategory={setCategory} query={query} setQuery={setQuery} cartCount={cartCount} cartOpen={cartOpen} setCartOpen={setCartOpen} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} subtotal={subtotal} navigateToCheckout={navigateToCheckout} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/checkout" element={<CheckoutSummary cart={cart} setCart={setCart} />} />
      <Route path="*" element={<Home cartCount={cartCount} cartOpen={cartOpen} setCartOpen={setCartOpen} cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} subtotal={subtotal} navigateToCheckout={navigateToCheckout} />} />
    </Routes>
  );
}

