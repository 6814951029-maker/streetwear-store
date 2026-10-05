import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import "./allBlack.css";
import "./summary-styles.css";
import "./text-contrast.css";

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
        <nav aria-label="เมนูหลัก">
          <NavLink to="/" end aria-label="หน้าแรก" title="หน้าแรก">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 10 9-7 9 7" />
              <path d="M5 9v12h14V9M9 21v-7h6v7" />
            </svg>
          </NavLink>
          <NavLink to="/shop" aria-label="หน้าสินค้า" title="หน้าสินค้า">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8h14l1 13H4L5 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
          </NavLink>
          <NavLink to="/checkout" aria-label="หน้าสรุป" title="หน้าสรุป">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
              <path d="M9 8h6M9 12h6M9 16h3" />
            </svg>
          </NavLink>
        </nav>
        <div className="header-actions">
          <Link to="/orders" className="orders-link">{"\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d"}</Link>
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
          <h1>MOVE YOUR<br /><em>WAY.</em></h1>
          <p>เสื้อผ้าและกระเป๋าสำหรับทุกจังหวะของเมือง<br />ทรงชัด ใส่สบาย พร้อมลุยในแบบของคุณ</p>
          <Link className="dark-cta" to="/shop">ดูสินค้าทั้งหมด <Icon>→</Icon></Link>
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

const ORDER_STATUSES = [
  { id: "pending", label: "\u0e23\u0e31\u0e1a \u0e2d\u0e2d\u0e40\u0e14\u0e2d\u0e23\u0e4c" },
  { id: "packing", label: "\u0e40\u0e15\u0e23\u0e35\u0e22\u0e21\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32" },
  { id: "shipped", label: "\u0e08\u0e31\u0e14\u0e2a\u0e48\u0e07\u0e41\u0e25\u0e49\u0e27" },
  { id: "completed", label: "\u0e16\u0e36\u0e07\u0e41\u0e25\u0e49\u0e27" },
  { id: "paid", label: "\u0e0a\u0e33\u0e23\u0e30\u0e40\u0e07\u0e34\u0e19\u0e41\u0e25\u0e49\u0e27" },
];

const formatOrderNumber = (id) => String(id || "PENDING").replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase();

function OrderStatus({ status }) {
  const currentIndex = ORDER_STATUSES.findIndex((item) => item.id === status);
  const cancelled = status === "cancelled";
  return (
    <div className="order-status-block">
      <strong className={`order-status-badge ${cancelled ? "is-cancelled" : ""}`}>{cancelled ? "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01" : (ORDER_STATUSES[currentIndex]?.label || ORDER_STATUSES[0].label)}</strong>
      {!cancelled && <ol className="order-status-steps">{ORDER_STATUSES.map((item, index) => (
        <li className={index <= currentIndex ? "is-complete" : ""} key={item.id}><span>{index + 1}</span><small>{item.label}</small></li>
      ))}</ol>}
    </div>
  );
}

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("\u0e01\u0e23\u0e38\u0e13\u0e32\u0e40\u0e02\u0e49\u0e32\u0e2a\u0e39\u0e48\u0e23\u0e30\u0e1a\u0e1a\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e14\u0e39\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d");
      setLoading(false);
      return;
    }
    fetch("/api/orders/my", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "\u0e44\u0e21\u0e48\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e42\u0e2b\u0e25\u0e14\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d\u0e44\u0e14\u0e49");
        setOrders(data.orders || []);
      })
      .catch((requestError) => setError(requestError.message || "\u0e44\u0e21\u0e48\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e42\u0e2b\u0e25\u0e14\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d\u0e44\u0e14\u0e49"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="summary-page order-history-page">
      <div className="order-history-header"><div><p className="section-kicker">{"\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d\u0e02\u0e2d\u0e07\u0e09\u0e31\u0e19"}</p><h1>{"\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d"}</h1></div><Link to="/" className="secondary-link">{"\u0e01\u0e25\u0e31\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e41\u0e23\u0e01"}</Link></div>
      {loading && <p className="checkout-notice">{"\u0e01\u0e33\u0e25\u0e31\u0e07\u0e42\u0e2b\u0e25\u0e14\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d..."}</p>}
      {error && <p className="checkout-notice" role="alert">{error} <Link to="/login">{"\u0e40\u0e02\u0e49\u0e32\u0e2a\u0e39\u0e48\u0e23\u0e30\u0e1a\u0e1a"}</Link></p>}
      {!loading && !error && !orders.length && <section className="summary-card order-history-empty"><h2>{"\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d"}</h2><Link to="/shop" className="button primary-button">{"\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e0a\u0e21\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32"}</Link></section>}
      <div className="order-history-list">{orders.map((order) => (
        <article className="summary-card order-history-card" key={order._id}>
          <header className="order-history-top"><div><span>{"\u0e2b\u0e21\u0e32\u0e22\u0e40\u0e25\u0e02\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07"}</span><strong>{formatOrderNumber(order._id)}</strong></div><time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleDateString("th-TH")}</time></header>
          <OrderStatus status={order.status} />
          <div className="summary-row payment-method"><span>{"\u0e27\u0e34\u0e18\u0e35\u0e0a\u0e33\u0e23\u0e30\u0e40\u0e07\u0e34\u0e19"}</span><strong>{"\u0e40\u0e01\u0e47\u0e1a\u0e40\u0e07\u0e34\u0e19\u0e1b\u0e25\u0e32\u0e22\u0e17\u0e32\u0e07"}</strong></div>
          <div className="order-history-items">{order.items.map((item, index) => <div className="order-history-item" key={`${item.productId}-${index}`}><span>{item.name} × {item.quantity}</span><strong>{money.format(item.price * item.quantity)}</strong></div>)}</div>
          {order.shippingAddress && <address className="order-history-address">{order.shippingAddress.recipientName} · {order.shippingAddress.phone}<br />{order.shippingAddress.addressLine}, {order.shippingAddress.subdistrict}, {order.shippingAddress.district}, {order.shippingAddress.province} {order.shippingAddress.postalCode}</address>}
          <div className="summary-row total-row"><span>{"\u0e22\u0e2d\u0e14\u0e2a\u0e38\u0e17\u0e18\u0e34"}</span><strong>{money.format(order.total)}</strong></div>
        </article>
      ))}</div>
    </main>
  );
}

function CheckoutSummary({ cart, setCart }) {
  const navigate = useNavigate();
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [checkoutNotice, setCheckoutNotice] = useState("");
  const [address, setAddress] = useState({ recipientName: "", phone: "", addressLine: "", subdistrict: "", district: "", province: "", postalCode: "" });
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 1500 ? 0 : 120;
  const total = subtotal + shipping;
  const updateAddress = (event) => setAddress((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submitOrder = async () => {
    if (!cart.length) return setCheckoutNotice("\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e43\u0e19\u0e15\u0e30\u0e01\u0e23\u0e49\u0e32");
    if (Object.values(address).some((value) => !value.trim())) return setCheckoutNotice("\u0e01\u0e23\u0e38\u0e13\u0e32\u0e01\u0e23\u0e2d\u0e01\u0e17\u0e35\u0e48\u0e2d\u0e22\u0e39\u0e48\u0e08\u0e31\u0e14\u0e2a\u0e48\u0e07\u0e43\u0e2b\u0e49\u0e04\u0e23\u0e1a\u0e17\u0e38\u0e01\u0e0a\u0e48\u0e2d\u0e07");
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setCheckoutNotice("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: cart.map(({ id, quantity }) => ({ id, quantity })), shippingAddress: address }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d\u0e44\u0e21\u0e48\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08 \u0e01\u0e23\u0e38\u0e13\u0e32\u0e25\u0e2d\u0e07\u0e43\u0e2b\u0e21\u0e48");
      setCart([]);
      localStorage.removeItem("cart");
      setConfirmedOrder(data);
    } catch (error) {
      setCheckoutNotice(error.message || "\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d\u0e44\u0e21\u0e48\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08 \u0e01\u0e23\u0e38\u0e13\u0e32\u0e25\u0e2d\u0e07\u0e43\u0e2b\u0e21\u0e48");
    }
  };

  if (confirmedOrder) return (
    <main className="summary-page confirmation-page">
      <section className="summary-card confirmation-card" role="status" aria-live="polite">
        <span className="confirmation-mark" aria-hidden="true">&#10003;</span>
        <p className="section-kicker">ORDER CONFIRMED</p>
        <h1>Thank you for your order.</h1>
        <div className="order-number"><span>ORDER NUMBER</span><strong>{formatOrderNumber(confirmedOrder._id)}</strong></div>
        <div className="summary-row payment-method"><span>{"\u0e27\u0e34\u0e18\u0e35\u0e0a\u0e33\u0e23\u0e30\u0e40\u0e07\u0e34\u0e19"}</span><strong>{"\u0e40\u0e01\u0e47\u0e1a\u0e40\u0e07\u0e34\u0e19\u0e1b\u0e25\u0e32\u0e22\u0e17\u0e32\u0e07"}</strong></div>
        <OrderStatus status={confirmedOrder.status} />
        <address className="shipping-address-preview">{confirmedOrder.shippingAddress.recipientName} · {confirmedOrder.shippingAddress.phone}<br />{confirmedOrder.shippingAddress.addressLine}, {confirmedOrder.shippingAddress.subdistrict}, {confirmedOrder.shippingAddress.district}, {confirmedOrder.shippingAddress.province} {confirmedOrder.shippingAddress.postalCode}</address>
        <Link to="/orders" className="button primary-button">{"\u0e15\u0e34\u0e14\u0e15\u0e32\u0e21\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d"}</Link>
        <button type="button" className="secondary-link confirmation-home" onClick={() => navigate("/")}>{"\u0e01\u0e25\u0e31\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e41\u0e23\u0e01"}</button>
      </section>
    </main>
  );

  if (!cart.length) return (
    <main className="summary-page empty-summary"><div className="summary-card"><p className="section-kicker">ORDER SUMMARY</p><h1>ตะกร้าของคุณยังว่าง</h1><p>เลือกสินค้าเพิ่มก่อนยืนยันคำสั่งซื้อ</p><Link to="/" className="button primary-button">กลับไปเลือกสินค้า</Link></div></main>
  );

  const addressFields = [
    ["recipientName", "\u0e0a\u0e37\u0e48\u0e2d\u0e1c\u0e39\u0e49\u0e23\u0e31\u0e1a", "text"],
    ["phone", "\u0e40\u0e1a\u0e2d\u0e23\u0e4c\u0e42\u0e17\u0e23\u0e28\u0e31\u0e1e\u0e17\u0e4c", "tel"],
    ["addressLine", "\u0e1a\u0e49\u0e32\u0e19\u0e40\u0e25\u0e02\u0e17\u0e35\u0e48 / \u0e16\u0e19\u0e19 / \u0e2d\u0e32\u0e04\u0e32\u0e23", "text"],
    ["subdistrict", "\u0e41\u0e02\u0e27\u0e07 / \u0e15\u0e33\u0e1a\u0e25", "text"],
    ["district", "\u0e40\u0e02\u0e15 / \u0e2d\u0e33\u0e40\u0e20\u0e2d", "text"],
    ["province", "\u0e08\u0e31\u0e07\u0e2b\u0e27\u0e31\u0e14", "text"],
    ["postalCode", "\u0e23\u0e2b\u0e31\u0e2a\u0e44\u0e1b\u0e23\u0e29\u0e13\u0e35\u0e22\u0e4c", "text"],
  ];
  return (
    <main className="summary-page">
      <div className="summary-layout">
        <section className="summary-card summary-product-panel">
          <p className="section-kicker">{"\u0e2a\u0e23\u0e38\u0e1b\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d"}</p>
          <h1>{"\u0e2a\u0e23\u0e38\u0e1b\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d"}</h1>
          {checkoutNotice && <div className="checkout-notice" role="alert">{checkoutNotice}</div>}
          <div className="shipping-form">
            <h2>{"\u0e17\u0e35\u0e48\u0e2d\u0e22\u0e39\u0e48\u0e08\u0e31\u0e14\u0e2a\u0e48\u0e07"}</h2>
            <div className="shipping-fields">
              {addressFields.map(([name, label, type]) => (
                <label key={name}>
                  {label}
                  <input name={name} type={type} autoComplete={name === "recipientName" ? "name" : name === "phone" ? "tel" : "off"} value={address[name]} onChange={updateAddress} placeholder={label} required />
                </label>
              ))}
            </div>
          </div>
          <h2 className="checkout-items-title">{"\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32"}</h2>
          <div className="summary-items">
            {cart.map((item) => (
              <div className="summary-item" key={item.id}>
                <div className="summary-thumb-wrap"><img src={item.image} alt={item.name} className="summary-thumb" /></div>
                <div className="summary-item-meta">
                  <div className="summary-item-header"><h2>{item.name}</h2><strong>{money.format(item.price * item.quantity)}</strong></div>
                  <p>{item.nameTh}</p>
                  <div className="summary-item-footer"><span>{item.quantity} ชิ้น</span><span>{money.format(item.price)} ต่อชิ้น</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <aside className="summary-card summary-side">
          <h2>{"\u0e22\u0e2d\u0e14\u0e0a\u0e33\u0e23\u0e30"}</h2>
          <div className="summary-row payment-method"><span>{"\u0e27\u0e34\u0e18\u0e35\u0e0a\u0e33\u0e23\u0e30\u0e40\u0e07\u0e34\u0e19"}</span><strong>{"\u0e40\u0e01\u0e47\u0e1a\u0e40\u0e07\u0e34\u0e19\u0e1b\u0e25\u0e32\u0e22\u0e17\u0e32\u0e07"}</strong></div>
          <div className="summary-row"><span>{"\u0e23\u0e27\u0e21\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32"}</span><strong>{money.format(subtotal)}</strong></div>
          <div className="summary-row"><span>{"\u0e04\u0e48\u0e32\u0e08\u0e31\u0e14\u0e2a\u0e48\u0e07"}</span><strong>{shipping === 0 ? "\u0e1f\u0e23\u0e35" : money.format(shipping)}</strong></div>
          <div className="summary-row total-row"><span>{"\u0e22\u0e2d\u0e14\u0e2a\u0e38\u0e17\u0e18\u0e34"}</span><strong>{money.format(total)}</strong></div>
          <button className="button primary-button" onClick={submitOrder}>{"\u0e22\u0e37\u0e19\u0e22\u0e31\u0e19\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d"}</button>
          <Link to="/" className="secondary-link">{"\u0e01\u0e25\u0e31\u0e1a\u0e44\u0e1b\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32"}</Link>
        </aside>
      </div>
    </main>
  );}
export default function App() {
  const [products, setProducts] = useState(sampleProducts);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState(loadSavedCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    fetch("/api/products")
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
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="*" element={<Home cartCount={cartCount} cartOpen={cartOpen} setCartOpen={setCartOpen} cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} subtotal={subtotal} navigateToCheckout={navigateToCheckout} />} />
    </Routes>
  );
}

