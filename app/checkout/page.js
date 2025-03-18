"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    localStorage.setItem("cart", JSON.stringify([]));
    alert("Order placed successfully! (Demo)");
    router.push("/products");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-6 gradient-text">Checkout</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
            <form className="space-y-4">
              <input className="w-full p-2 border rounded-lg" placeholder="Full Name" required />
              <input className="w-full p-2 border rounded-lg" placeholder="Address" required />
              <input className="w-full p-2 border rounded-lg" placeholder="City" required />
              <input className="w-full p-2 border rounded-lg" placeholder="Postal Code" required />
            </form>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-4">
              <span>Total</span>
              <span>${(total + (total > 50 ? 0 : 5)).toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="btn-primary w-full mt-6">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}