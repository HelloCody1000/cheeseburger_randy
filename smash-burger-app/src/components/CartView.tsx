import React, { useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react"; // Added Plus/Minus

// Imports from your library
import { type MenuItem, type OrderItem, type UserInfo } from "../library/types";
import { generatePickupTime } from "../library/timeUtils";

// Import the sub-component
import { PickupSelector } from "./PickupSelector";

interface CartViewProps {
  cart: OrderItem[];
  menuItems: MenuItem[];
  totalPrice: number;
  onRemove: (id: string) => void;
  onSubmit: (user: UserInfo, time: string) => void;
  onBack: () => void;
  // --- NEW PROPS ---
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export function CartView({ 
  cart, 
  menuItems, 
  totalPrice, 
  onRemove, 
  onSubmit, 
  onBack,
  onIncrement, // Destructure new prop
  onDecrement  // Destructure new prop
}: CartViewProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", phone: "", email: "" });
  const [pickupTime, setPickupTime] = useState<string>("");
  
  // Generate times on initial render
  const [timeSlots] = useState(() => generatePickupTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupTime) {
      alert("Please select a pickup time");
      return;
    }
    onSubmit(userInfo, pickupTime);
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2 style={{color: '#888'}}>Your cart is empty</h2>
        <button onClick={onBack} className="submit-btn" style={{ width: "auto", padding: "0.5rem 2rem", marginTop: '1rem' }}>
          Go to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="cart-view-container">
      <h2 className="section-title">Review Order</h2>

      {/* Cart Items List */}
      <div className="cart-list">
        {cart.map((cartItem) => {
          const item = menuItems.find((m) => m.id === cartItem.itemId);
          if (!item) return null;
          
          const itemTotal = item.price * cartItem.quantity;
          const remaining = item.availableQty - cartItem.quantity;

          return (
            <div key={cartItem.itemId} className="cart-row">
              {/* Left Side: Name & Info */}
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-math" style={{ fontSize: "0.85rem", color: "#888" }}>
                  ${item.price.toFixed(2)} each
                </span>
              </div>

              {/* Middle: Quantity Controls (NEW) */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0 1rem" }}>
                  {/* Decrement Button */}
                  <button 
                    onClick={() => onDecrement(cartItem.itemId)}
                    type="button"
                    style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: "26px", height: "26px", borderRadius: "50%",
                        backgroundColor: "#ef4444", border: "none", padding: 0, cursor: "pointer"
                    }}
                  >
                     <Minus size={16} color="#ffffff" strokeWidth={3} />
                  </button>

                  <span style={{ fontWeight: "bold", width: "1.2rem", textAlign: "center" }}>
                    {cartItem.quantity}
                  </span>

                  {/* Increment Button */}
                  <button 
                    onClick={() => onIncrement(cartItem.itemId)}
                    disabled={remaining === 0}
                    type="button"
                    style={{ 
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: "26px", height: "26px", borderRadius: "50%",
                        backgroundColor: "transparent", padding: 0,
                        cursor: remaining === 0 ? "not-allowed" : "pointer",
                        borderColor: remaining === 0 ? "#444" : "#ffc857", 
                        borderWidth: "2px", borderStyle: "solid",
                        opacity: remaining === 0 ? 0.5 : 1 
                    }}
                  >
                     <Plus size={16} color={remaining === 0 ? "#888888" : "#ffc857"} strokeWidth={3} />
                  </button>
              </div>

              {/* Right Side: Total Price & Trash */}
              <div className="cart-row-total" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontWeight: "bold", minWidth: "60px", textAlign: "right" }}>
                    ${itemTotal.toFixed(2)}
                </span>
                
                <button 
                    onClick={() => onRemove(cartItem.itemId)} 
                    className="trash-btn"
                    title="Remove item completely"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grand Total */}
      <div className="grand-total-row">
        <span>Grand Total</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      {/* Pickup Selector */}
      <PickupSelector 
        times={timeSlots} 
        selectedTime={pickupTime} 
        onSelect={setPickupTime} 
      />

      {/* User Details Form */}
      <form onSubmit={handleSubmit} className="checkout-form">
        <h3 style={{marginTop: 0, marginBottom: '1rem', color: '#bbb'}}>Contact Info</h3>
        <div className="form-grid">
          <input required type="text" placeholder="Name" value={userInfo.name}
            onChange={e => setUserInfo({...userInfo, name: e.target.value})} className="input-field" />
          <input required type="tel" placeholder="Phone" value={userInfo.phone}
            onChange={e => setUserInfo({...userInfo, phone: e.target.value})} className="input-field" />
          <input required type="email" placeholder="Email" value={userInfo.email}
            onChange={e => setUserInfo({...userInfo, email: e.target.value})} className="input-field" />
        </div>

        <button type="submit" className="submit-btn">
          Place Pickup Order
        </button>
      </form>
    </div>
  );
}