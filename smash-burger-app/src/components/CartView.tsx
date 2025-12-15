import React, { useState } from "react";
import { Trash2 } from "lucide-react";

// Imports from your library
import { type MenuItem, type OrderItem, type UserInfo } from "../library/types";
import { generatePickupTime } from "../library/timeUtils";

// Import the sub-component
import { PickupSelector } from "./PickupSelector";

interface CartViewProps {
  cart: OrderItem[];
  menuItems: MenuItem[]; // Note: variable name changed to menuItems to match App.tsx
  totalPrice: number;
  onRemove: (id: string) => void;
  onSubmit: (user: UserInfo, time: string) => void;
  onBack: () => void;
}

export function CartView({ cart, menuItems, totalPrice, onRemove, onSubmit, onBack }: CartViewProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", phone: "", email: "" });
  const [pickupTime, setPickupTime] = useState<string>("");
  
  // Generate times on render
  const timeSlots = generatePickupTime();

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

          return (
            <div key={cartItem.itemId} className="cart-row">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-math">
                  ${item.price.toFixed(2)} x {cartItem.quantity}
                </span>
              </div>
              <div className="cart-row-total">
                <span>${itemTotal.toFixed(2)}</span>
                <button onClick={() => onRemove(cartItem.itemId)} className="trash-btn">
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