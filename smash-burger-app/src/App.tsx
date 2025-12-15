import React, { useState } from "react";
import { ShoppingCart, Plus, Minus, X, CheckCircle, Store, Clock, Trash2 } from "lucide-react";

// --- Custom Imports ---
// (Ensure these files exist in your project as we discussed)
import { type OrderItem, type UserInfo } from "./library/types";
import { menuItems } from "./library/menu";
import { getMenuCategories } from "./library/getMenuCategories"; 
import { submitOrderToAWS } from "./aws/orders";
import { CartView } from "./components/CartView";

// Import styles
import "./App.css";

export default function App() {
  const categories = getMenuCategories(menuItems);
  
  // --- STATE ---
  const [currentView, setCurrentView] = useState<'menu' | 'cart'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] ?? "burger");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- HELPERS ---
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

  // --- HANDLERS ---
  const handleAddToCart = (itemId: string) => {
    const item = menuItems.find((m) => m.id === itemId);
    if (!item) return;
    const inCart = getQuantityInCart(itemId);
    
    // Check inventory
    if (item.availableQty - inCart <= 0) return;

    setCart((prev) => {
      const existing = prev.find((c) => c.itemId === itemId);
      if (!existing) return [...prev, { itemId, quantity: 1 }];
      return prev.map((c) => c.itemId === itemId ? { ...c, quantity: c.quantity + 1 } : c);
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) =>
      prev.map((c) => c.itemId === itemId ? { ...c, quantity: c.quantity - 1 } : c)
          .filter((c) => c.quantity > 0)
    );
  };

  // Completely remove an item row (trash can icon)
  const handleRemoveLineItem = (itemId: string) => {
     setCart((prev) => prev.filter((c) => c.itemId !== itemId));
  };

  // Called when user hits "Place Order" in the CartView
  const handlePlaceOrder = async (user: UserInfo, pickupTime: string) => {
    setIsLoading(true);
    
    // This calls your mock AWS function
    const success = await submitOrderToAWS({
        user: user,
        cart: cart,
        total: cartTotalPrice,
        paymentStatus: "PAY_AT_COUNTER",
        timestamp: new Date().toISOString()
    });

    setIsLoading(false);

    if (success) {
        setOrderPlaced(true);
        // Reset after 4 seconds and go back to menu
        setTimeout(() => {
            setCart([]);
            setOrderPlaced(false);
            setCurrentView('menu');
        }, 4000);
    }
  };

  const itemsForCategory = menuItems.filter((item) => item.category === selectedCategory);

  // --- RENDER ---
  return (
    <div className="app-container">
      <div className="main-content">
        
        {/* HEADER */}
        <div className="header">
          <h1 
            className="header-title" 
            onClick={() => setCurrentView('menu')}
            title="Go to Menu"
          >
            Randy&apos;s Smash Burgers
          </h1>
          
          <button 
            onClick={() => setCurrentView('cart')}
            className={`cart-btn ${currentView === 'cart' ? "active" : ""}`}
          >
            <ShoppingCart size={18} />
            <span>{totalItemsInCart > 0 ? totalItemsInCart : ""}</span>
          </button>
        </div>

        {/* --- VIEW SWITCHER --- */}
        
        {/* VIEW 1: ORDER SUCCESS */}
        {orderPlaced ? (
             <div style={{ textAlign: "center", padding: "4rem 1rem", animation: "fadeIn 0.5s" }}>
                <CheckCircle size={80} color="#4ade80" style={{ marginBottom: "1rem" }} />
                <h2 style={{ fontSize: "2rem", margin: "0.5rem 0" }}>Order Confirmed!</h2>
                <p style={{ color: "#bbb", fontSize: "1.2rem" }}>We'll see you at the counter.</p>
                <button onClick={() => setOrderPlaced(false)} className="submit-btn" style={{marginTop: "2rem", width: "auto", padding: "0.5rem 2rem"}}>
                    Start New Order
                </button>
            </div>

        /* VIEW 2: CART / CHECKOUT */
        ) : currentView === 'cart' ? (
            <CartView 
                cart={cart}
                menuItems={menuItems} // Pass menuItems prop
                totalPrice={cartTotalPrice}
                onRemove={handleRemoveLineItem}
                onSubmit={handlePlaceOrder}
                onBack={() => setCurrentView('menu')}
            />

        /* VIEW 3: MENU (Default) */
        ) : (
            <>
                {/* Categories */}
                <div className="category-container">
                {categories.map((cat) => (
                    <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`category-btn ${cat === selectedCategory ? "active" : ""}`}
                    >
                    {cat}
                    </button>
                ))}
                </div>

                {/* Menu Grid */}
                <div className="menu-grid">
                {itemsForCategory.map((item) => {
                    const inCart = getQuantityInCart(item.id);
                    const remaining = item.availableQty - inCart;
                    
                    return (
                    <div key={item.id} className="menu-item">
                        <div style={{ flex: 1 }}>
                        <h3 className="item-title">{item.name}</h3>
                        <p className="item-desc">{item.description}</p>
                        <div className="item-price">
                            <span>${item.price.toFixed(2)}</span>
                            <span>{remaining} left</span>
                        </div>
                        </div>

                        <div className="item-controls">
                            {inCart > 0 && (
                                <>
                                <button 
                                    onClick={() => handleRemoveFromCart(item.id)} 
                                    className="circle-btn"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "26px",
                                        height: "26px",
                                        borderRadius: "50%",
                                        backgroundColor: "#ef4444", // Explicit Red background
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer"
                                    }}
                                >
                                    {/* Added strokeWidth and explicit fill="none" */}
                                    <Minus size={18} color="#ffffff" strokeWidth={3} fill="none" />
                                </button>
                                <span style={{ fontWeight: "bold", width: "1.5rem", textAlign: "center" }}>{inCart}</span>
                                </>
                            )}
                            <button 
                                onClick={() => handleAddToCart(item.id)} 
                                disabled={remaining === 0}
                                className="circle-btn"
                                style={{ 
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "26px",
                                    height: "26px",
                                    borderRadius: "50%",
                                    backgroundColor: "transparent", // Transparent background
                                    padding: 0,
                                    cursor: remaining === 0 ? "not-allowed" : "pointer",
                                    borderColor: remaining === 0 ? "#444" : "#ffc857", 
                                    borderWidth: "2px",
                                    borderStyle: "solid",
                                    opacity: remaining === 0 ? 0.5 : 1 
                                }}
                            >
                                {/* Added strokeWidth and explicit fill="none" */}
                                <Plus size={18} color={remaining === 0 ? "#888888" : "#ffc857"} strokeWidth={3} fill="none" />
                            </button>
                        </div>
                    </div>
                    );
                })}
                </div>
            </>
        )}
      </div>
    </div>
  );
}