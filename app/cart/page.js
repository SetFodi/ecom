"use client";

import { useState, useEffect } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    // Ensure price is a number for each item
    const normalizedCart = storedCart.map((item) => ({
      ...item,
      price: Number(item.price), // Convert to number
    }));
    setCart(normalizedCart);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const total = cart.length > 0
    ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  return (
    <div className="min-h-screen">
      <h2 className="text-3xl mb-6 text-center">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-muted text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="card flex justify-between items-center p-4"
            >
              <div>
                <h3 className="text-xl">{item.name}</h3>
                <p className="text-muted">
                  ${Number(item.price).toFixed(2)} x {item.quantity}
                </p>
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-right p-4">
            <p className="text-xl">Total: ${total.toFixed(2)}</p>
            <button className="btn-primary mt-4">Checkout (Demo)</button>
          </div>
        </div>
      )}
    </div>
  );
}