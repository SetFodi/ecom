"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, ShoppingCart, User, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="bg-indigo-600 text-white text-center text-sm py-2 px-4">
          Free shipping on all orders over $50 | 30-day money-back guarantee
        </div>
        <div className="px-4 py-4 md:py-6 flex flex-wrap items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <ShoppingBag className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              ShopifyLite
            </span>
          </a>
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="absolute right-0 top-0 h-full px-3 flex items-center text-gray-400 hover:text-indigo-600">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Home</a>
            <a href="/products" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Products</a>
            <a href="/collections" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Collections</a>
            <a href="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">About</a>
            <div className="flex items-center space-x-4">
              <a href="/account" className="text-gray-600 hover:text-indigo-600 transition-colors p-2">
                <User className="w-6 h-6" />
              </a>
              <a href="/cart" className="text-gray-600 hover:text-indigo-600 transition-colors p-2 relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </a>
            </div>
          </nav>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden bg-white px-4 py-4 border-t border-gray-200">
            <div className="space-y-4">
              <a href="/" className="block text-gray-600 hover:text-indigo-600 font-medium transition-colors">Home</a>
              <a href="/products" className="block text-gray-600 hover:text-indigo-600 font-medium transition-colors">Products</a>
              <a href="/collections" className="block text-gray-600 hover:text-indigo-600 font-medium transition-colors">Collections</a>
              <a href="/about" className="block text-gray-600 hover:text-indigo-600 font-medium transition-colors">About</a>
              <div className="flex items-center space-x-4">
                <a href="/account" className="text-gray-600 hover:text-indigo-600 transition-colors p-2">
                  <User className="w-6 h-6" />
                </a>
                <a href="/cart" className="text-gray-600 hover:text-indigo-600 transition-colors p-2 relative">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}