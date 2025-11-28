import { useState } from "react";
import type { MenuItem } from "./library/types";
import { getMenuCategories, getItemsByCategory } from "./library/menu";

function App() {
  const categories = getMenuCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0] ?? "burger"
  );

  const items: MenuItem[] = getItemsByCategory(selectedCategory);

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Today&apos;s Smash Menu</h1>

      {/* Category buttons */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              border:
                cat === selectedCategory ? "2px solid black" : "1px solid #ccc",
              fontWeight: cat === selectedCategory ? "bold" : "normal",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items for selected category */}
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            marginBottom: "1rem",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <h2>
            {item.name} — ${item.price.toFixed(2)}
          </h2>
          <p>{item.description}</p>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            Category: {item.category}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
