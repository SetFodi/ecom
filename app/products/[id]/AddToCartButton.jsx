// app/products/[id]/AddToCartButton.jsx
"use client";

import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({ product }) {
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        alert(`Only ${product.stock} items available!`);
        return;
      }
      existing.quantity += 1;
    } else {
      if (product.stock < 1) {
        alert("Out of stock!");
        return;
      }
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    alert(`${product.name} added to cart!`);
  };

  return (
    <button
      className={`btn-primary w-full flex items-center justify-center gap-2 ${
        product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={product.stock === 0}
      onClick={addToCart}
    >
      <ShoppingCart className="w-5 h-5" />
      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
    </button>
  );
}