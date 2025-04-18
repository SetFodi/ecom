// app/products/[id]/AddToCartButton.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Minus, Plus, Check, AlertTriangle, X } from "lucide-react";

export default function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [notification, setNotification] = useState(null);

  // Reset isAdded status after animation completes
  const resetAddedState = () => {
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  // Clear notification after timeout
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      showNotification("warning", `Only ${product.stock} items available in stock`);
    }
  };

  const addToCart = () => {
    if (product.stock < 1) {
      showNotification("error", "This product is out of stock");
      return;
    }

    setIsAdding(true);

    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((item) => item.id === product.id);
      
      if (existing) {
        const newQuantity = existing.quantity + quantity;
        if (newQuantity > product.stock) {
          showNotification("warning", `Sorry, only ${product.stock} items available in stock`);
          setIsAdding(false);
          return;
        }
        existing.quantity = newQuantity;
      } else {
        cart.push({ ...product, quantity });
      }
      
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
      
      setIsAdding(false);
      setIsAdded(true);
      showNotification("success", `${product.name} added to your cart!`);
      resetAddedState();
    }, 600);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="text-gray-700 font-medium">Quantity:</span>
        <div className="flex items-center gap-3 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className={`w-10 h-10 flex items-center justify-center transition-colors ${
              quantity <= 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="w-10 text-center font-medium">{quantity}</span>
          
          <button
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
            className={`w-10 h-10 flex items-center justify-center transition-colors ${
              quantity >= product.stock
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <button
        className={`w-full py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-medium relative overflow-hidden ${
          product.stock === 0
            ? "bg-gray-400 text-white cursor-not-allowed"
            : isAdded
            ? "bg-green-600 text-white"
            : "bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        }`}
        disabled={product.stock === 0 || isAdding || isAdded}
        onClick={addToCart}
      >
        {isAdding ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adding to Cart...
          </>
        ) : isAdded ? (
          <>
            <Check className="w-5 h-5 mr-1" />
            Added to Cart!
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>
              {product.stock > 0 ? `Add to Cart - $${(product.price * quantity).toFixed(2)}` : "Out of Stock"}
            </span>
          </>
        )}
      </button>
      
      <div className="text-sm text-center text-gray-500">
        <svg className="w-4 h-4 mr-1 text-indigo-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
        </svg>
        Free shipping on orders over $50
      </div>
      
      {notification && (
        <div 
          className={`fixed bottom-6 right-6 max-w-md px-6 py-4 rounded-xl shadow-xl z-50 flex items-start gap-3 ${
            notification.type === "success" 
              ? "bg-green-600 text-white"
              : notification.type === "warning"
              ? "bg-amber-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-5 h-5 mt-0.5" />
          ) : notification.type === "warning" ? (
            <AlertTriangle className="w-5 h-5 mt-0.5" />
          ) : (
            <X className="w-5 h-5 mt-0.5" />
          )}
          <div>
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}