// app/products/[id]/AddToCartButton.jsx
"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";

export default function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      alert(`Sorry, only ${product.stock} items available in stock`);
    }
  };

  const addToCart = () => {
    if (product.stock < 1) {
      alert("This product is out of stock");
      return;
    }

    setIsAdding(true);

    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((item) => item.id === product.id);
      
      if (existing) {
        const newQuantity = existing.quantity + quantity;
        if (newQuantity > product.stock) {
          alert(`Sorry, only ${product.stock} items available in stock`);
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
      alert(`${product.name} added to your cart!`);
    }, 600);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="text-gray-700 font-medium">Quantity:</span>
        <div className="flex items-center gap-3 border border-gray-200 rounded-lg overflow-hidden">
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
            : "bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        }`}
        disabled={product.stock === 0 || isAdding}
        onClick={addToCart}
      >
        {isAdding ? (
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
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>
              {product.stock > 0 ? `Add to Cart - $${(product.price * quantity).toFixed(2)}` : "Out of Stock"}
            </span>
          </>
        )}
      </button>
    </div>
  );
}
