import { useState } from "react";
import type { MenuItem, OrderItem } from "./library/types";
import { menuItems, getMenuCategories } from "./library/menu";

function App() {
  const categories = getMenuCategories();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0] ?? "burger"
  );

  // Cart: array of { itemId, quantity }
  const [cart, setCart] = useState<OrderItem[]>([]);

  // --- Helpers ---

  const getQuantityInCart = (itemId: string): number => {
    const entry = cart.find((c) => c.itemId === itemId);
    return entry?.quantity ?? 0;
  };

  const totalItemsInCart = cart.reduce((sum, e) => sum + e.quantity, 0);

  const cartTotalPrice = cart.reduce((sum, entry) => {
    const item = menuItems.find((m) => m.id === entry.itemId);
    if (!item) return sum;
    return sum + item.price * entry.quantity;
  }, 0);

  const handleAddToCart = (itemId: string) => {
    const item = menuItems.find((m) => m.id === itemId);
    if (!item) return;

    const inCart = getQuantityInCart(itemId);
    const remaining = item.availableQty - inCart;
    if (remaining <= 0) return;

    setCart((prev) => {
      const existing = prev.find((c) => c.itemId === itemId);
      if (!existing) return [...prev, { itemId, quantity: 1 }];
      return prev.map((c) =>
        c.itemId === itemId ? { ...c, quantity: c.quantity + 1 } : c
      );
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    const inCart = getQuantityInCart(itemId);
    if (inCart === 0) return;

    setCart((prev) =>
      prev
        .map((c) =>
          c.itemId === itemId ? { ...c, quantity: c.quantity - 1 } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const itemsForCategory = menuItems.filter(
    (item) => item.category === selectedCategory
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: "2rem 1rem",
        backgroundColor: "#111", // chalkboard vibe
        color: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "800px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "2rem", letterSpacing: "0.04em" }}>
            Randy&apos;s Smash Burgers
          </h1>

          {/* Cart Icon + Total */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.4rem 0.8rem",
              borderRadius: "999px",
              border: "1px solid #f5f5f5",
              backgroundColor: "#222",
              cursor: "pointer",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
              fontWeight: "bold",
              fontSize: "0.95rem",
            }}
          >
            <span role="img" aria-label="cart">
              🛒
            </span>
            <span>{totalItemsInCart}</span>
            <span>— ${cartTotalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Categories */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "0.45rem 0.9rem",
                borderRadius: "999px",
                border:
                  cat === selectedCategory
                    ? "2px solid #ffc857"
                    : "1px solid #555",
                backgroundColor:
                  cat === selectedCategory ? "#333" : "transparent",
                color: "#f5f5f5",
                fontWeight: cat === selectedCategory ? "bold" : "normal",
                cursor: "pointer",
                fontSize: "0.95rem",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items */}
        {itemsForCategory.map((item) => {
          const inCart = getQuantityInCart(item.id);
          const remaining = item.availableQty - inCart;

          return (
            <div
              key={item.id}
              style={{
                borderRadius: "12px",
                border: "1px solid #555",
                background:
                  "linear-gradient(135deg, rgba(40,40,40,0.95), rgba(25,25,25,0.95))",
                marginTop: "1rem",
                padding: "1rem 1.25rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.3rem",
                  marginBottom: "0.25rem",
                }}
              >
                {item.name} — ${item.price.toFixed(2)}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  color: "#bbbbbb",
                  marginBottom: "0.4rem",
                }}
              >
                {item.description}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "#888888",
                }}
              >
                {remaining} left today
              </p>

              {/* Buttons Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginTop: "0.7rem",
                }}
              >
                {/* Minus */}
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  disabled={inCart === 0}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "2px solid #f5f5f5",
                    backgroundColor: inCart === 0 ? "#444" : "#111",
                    color: "#f5f5f5",
                    cursor: inCart === 0 ? "not-allowed" : "pointer",
                    fontSize: "1.6rem",
                    lineHeight: "1rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  -
                </button>

                {/* Qty */}
                <span
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    minWidth: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  {inCart}
                </span>

                {/* Plus */}
                <button
                  onClick={() => handleAddToCart(item.id)}
                  disabled={remaining === 0}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "2px solid #ffc857",
                    backgroundColor: remaining === 0 ? "#444" : "#ffc857",
                    color: remaining === 0 ? "#222" : "#111",
                    cursor: remaining === 0 ? "not-allowed" : "pointer",
                    fontSize: "1.6rem",
                    lineHeight: "1rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
