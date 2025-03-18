"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, X, ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        // Sync with localStorage initially; later replace with API
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const normalizedCart = storedCart.map((item) => ({
          ...item,
          price: Number(item.price),
          image: item.image || null,
        }));
        setCart(normalizedCart);
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    window.dispatchEvent(new Event("storage")); // Update header cart count
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    const item = cart.find((i) => i.id === id);
    if (newQuantity > item.stock) {
      alert(`Only ${item.stock} items available in stock!`);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    window.dispatchEvent(new Event("storage"));
  };

  const clearCart = () => {
    localStorage.setItem("cart", JSON.stringify([]));
    setCart([]);
    window.dispatchEvent(new Event("storage"));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-4xl">
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white flex items-center gradient-text">
            <ShoppingBag className="mr-3" />
            Your Shopping Cart
          </h2>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-white hover:text-red-200 transition-colors flex items-center"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Clear Cart
            </button>
          )}
        </div>
        {cart.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <p className="text-xl text-muted mb-8">Your cart is empty.</p>
            <Link href="/products" className="btn-primary inline-flex items-center">
              Continue Shopping
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {cart.map((item) => (
              <div key={item.id} className="p-6 flex items-center hover:bg-gray-50 transition-colors">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-6">
                  {item.image && typeof item.image === "string" ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingBag />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-muted text-sm">${item.price.toFixed(2)} each</p>
                  <p className="text-muted text-sm">Stock: {item.stock}</p>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center border border-gray-200 rounded-md">
                    <button
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x border-gray-200">{item.quantity}</span>
                    <button
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="ml-6 text-right w-24">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button
                    className="ml-6 p-2 text-gray-400 hover:text-red-600 transition-colors"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            <div className="p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted">Shipping</span>
                <span className="font-medium">{total > 50 ? "FREE" : "$5.00"}</span>
              </div>
              <div className="flex justify-between items-center mb-6 text-lg font-bold">
                <span>Total</span>
                <span>${(total + (total > 50 ? 0 : 5)).toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="btn-primary w-full text-center">
                Proceed to Checkout
              </Link>
              <div className="mt-4 text-center">
                <Link href="/products" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
                  <ArrowRight className="mr-2 w-4 h-4 transform rotate-180" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}