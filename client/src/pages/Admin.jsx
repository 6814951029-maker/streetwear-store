import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";
import "./ProductAdmin.css";

const API_URL = "/api";
const blankProduct = {
  name: "",
  nameTh: "",
  category: "clothing",
  price: "",
  stock: "0",
  badge: "ALL BLACK",
  style: "BLACK COTTON / BAGGY FIT",
  image: "",
  colors: ["#050505", "#242424", "#444444"],
};

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState(blankProduct);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = useMemo(
    () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token}` }),
    [token]
  );

  const loadProducts = () =>
    fetch(`${API_URL}/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data.products || []));

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/auth/me`, { headers })
      .then(async (response) => ({ ok: response.ok, data: await response.json() }))
      .then(({ ok, data }) => {
        if (!ok || data.user.role !== "admin") {
          throw new Error("????????????????????????????????");
        }

        setUser(data.user);
        return loadProducts();
      })
      .catch((requestError) => setError(requestError.message));
  }, [navigate, token, headers]);

  const uploadImageToBlob = async (file) => {
    if (!file) return "";

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/uploads/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "??????????????????????");
      }

      setForm((current) => ({ ...current, image: data.url }));
      return data.url;
    } finally {
      setUploading(false);
    }
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      let imageUrl = form.image;
      const fileInput = document.getElementById("product-image-file");
      const selectedFile = fileInput && fileInput.files && fileInput.files[0];

      if (selectedFile) {
        imageUrl = await uploadImageToBlob(selectedFile);
      }

      const endpoint = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
      const response = await fetch(endpoint, {
        method: editingId ? "PUT" : "POST",
        headers,
        body: JSON.stringify({
          ...form,
          image: imageUrl || form.image,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "?????????????????????");
      }

      setForm(blankProduct);
      setEditingId(null);
      if (fileInput) fileInput.value = "";
      await loadProducts();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("??????????????????????")) return;

    const response = await fetch(`${API_URL}/products/${id}`, { method: "DELETE", headers });
    if (!response.ok) {
      const data = await response.json();
      setError(data.message || "?????????????????");
      return;
    }

    await loadProducts();
  };

  const editProduct = (product) => {
    setForm({ ...product, price: String(product.price), stock: String(product.stock ?? 0) });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (error && !user) {
    return (
      <main className="admin-page">
        <section className="admin-error">
          <p>ACCESS DENIED</p>
          <h1>{error}</h1>
          <Link to="/">????????????</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <Link className="brand" to="/">
          STREETWEAR <span>STORE</span>
        </Link>
        <div>
          <span>{user?.fullName || "Loading..."}</span>
          <button onClick={logout}>LOG OUT</button>
        </div>
      </header>

      <section className="admin-content">
        <p className="section-kicker">ADMIN CONTROL ROOM</p>
        <h1>
          STORE
          <br />
          MANAGER.
        </h1>

        <div className="admin-stats">
          <article>
            <b>{products.length}</b>
            <span>?????????????????</span>
          </article>
          <article>
            <b>{products.reduce((sum, product) => sum + Number(product.stock || 0), 0)}</b>
            <span>?????????????</span>
          </article>
          <article>
            <b>{products.filter((product) => product.category === "bags").length}</b>
            <span>?????????????</span>
          </article>
        </div>

        <form className="product-form" onSubmit={saveProduct}>
          <h2>{editingId ? "EDIT PRODUCT" : "ADD PRODUCT"}</h2>
          {error && <p className="error-message">{error}</p>}

          <div>
            <input
              placeholder="Product name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
            <input
              placeholder="?????????????"
              value={form.nameTh}
              onChange={(event) => setForm({ ...form, nameTh: event.target.value })}
              required
            />
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              <option value="clothing">????????</option>
              <option value="bags">???????</option>
            </select>
            <input
              type="number"
              min="0"
              placeholder="????"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
              required
            />
            <input
              type="number"
              min="0"
              placeholder="??????????"
              value={form.stock}
              onChange={(event) => setForm({ ...form, stock: event.target.value })}
              required
            />
            <input
              id="product-image-file"
              type="file"
              accept="image/*"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;

                const nextUrl = await uploadImageToBlob(file);
                if (nextUrl) {
                  setForm((current) => ({ ...current, image: nextUrl }));
                }
              }}
            />
            <input
              placeholder="Image URL"
              value={form.image}
              onChange={(event) => setForm({ ...form, image: event.target.value })}
              required
            />
            <input
              placeholder="Style detail"
              value={form.style}
              onChange={(event) => setForm({ ...form, style: event.target.value })}
            />
            <input
              placeholder="Badge"
              value={form.badge}
              onChange={(event) => setForm({ ...form, badge: event.target.value })}
            />

            <button type="submit" disabled={saving || uploading}>
              {saving ? "Saving..." : editingId ? "Update" : "Save"}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setForm(blankProduct);
                setEditingId(null);
                const fileInput = document.getElementById("product-image-file");
                if (fileInput) fileInput.value = "";
              }}
            >
              Clear
            </button>
          </div>
        </form>

        <div className="product-grid">
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <div>
                <h3>{product.name}</h3>
                <p>{product.nameTh}</p>
                <span>{product.category}</span>
                <div className="card-row">
                  <b>{product.price} THB</b>
                  <button onClick={() => editProduct(product)}>Edit</button>
                  <button className="danger" onClick={() => removeProduct(product.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}