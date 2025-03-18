"use client";
import { useState, useEffect } from "react";
import { ShoppingBag, X, ArrowRight, ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      // Ensure price is a number for each item
      const normalizedCart = storedCart.map((item) => ({
        ...item,
        price: Number(item.price), // Convert to number
      }));
      setCart(normalizedCart);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    );
    
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const total = cart.length > 0
    ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-400">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
          <h2 className="text-3xl font-bold text-white flex items-center justify-center">
            <ShoppingBag className="mr-3" />
            Your Shopping Cart
          </h2>
        </div>

        {cart.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <p className="text-xl text-gray-500 mb-8">Your cart is empty.</p>
            <a 
              href="/products" 
              className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all transform hover:scale-105"
            >
              Continue Shopping
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-6 flex items-center hover:bg-gray-50 transition-colors"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-6">
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      width={80} 
                      height={80} 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingBag />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-500 text-sm">${Number(item.price).toFixed(2)} each</p>
                </div>
                
                <div className="flex items-center">
                  <div className="flex items-center border border-gray-200 rounded-md">
                    <button 
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100" 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x border-gray-200">
                      {item.quantity}
                    </span>
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
                    aria-label="Remove item"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">FREE</span>
              </div>
              <div className="flex justify-between items-center mb-6 text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <button className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-md transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                Proceed to Checkout
              </button>
              
              <div className="mt-4 text-center">
                <a href="/products" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
                  <ArrowRight className="mr-2 w-4 h-4 transform rotate-180" />
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}