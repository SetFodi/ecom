// app/Header.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Search, ShoppingCart, User, Menu, X, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

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
            <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
            <Link href="/products" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Products</Link>
            <Link href="/collections" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Collections</Link>
            <Link href="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">About</Link>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="text-gray-600 hover:text-indigo-600 transition-colors p-2 relative"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <User className="w-6 h-6" />
                  {user && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </button>
                
                {userMenuOpen && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name || user.email}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {user.email}
                          </p>
                        </div>
                        <Link 
                          href="/account" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link 
                          href="/account/orders" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <Link 
                          href="/account/settings" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          href="/login" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </Link>
                        <Link 
                          href="/register" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Create Account
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
              
              <Link href="/cart" className="text-gray-600 hover:text-indigo-600 transition-colors p-2 relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>
            </div>
          </nav>
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="text-gray-600 hover:text-indigo-600 transition-colors p-2 relative mr-2">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden bg-white px-4 py-4 border-t border-gray-200">
            <div className="space-y-4">
              <Link href="/" className="block text-gray-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
              <Link href="/products" className="block text-gray-600 hover:text-indigo-600 font-medium transition-colors">Products</Link>
              <Link href="/collections" className="block text-gray-600 hover:text-indigo-600 font-medium transition-colors">Collections</Link>
              <Link href="/about" className="block text-gray-600 hover:text-indigo-600 font-medium transition-colors">About</Link>
              
              <div className="border-t border-gray-100 pt-4 mt-4">
                {user ? (
                  <>
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm mr-3">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name || user.email}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Link href="/account" className="block py-2 text-gray-600 hover:text-indigo-600 transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/account/orders" className="block py-2 text-gray-600 hover:text-indigo-600 transition-colors">
                      Orders
                    </Link>
                    <Link href="/account/settings" className="block py-2 text-gray-600 hover:text-indigo-600 transition-colors">
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center py-2 text-red-600 hover:text-red-800 transition-colors w-full"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="flex items-center py-2 text-gray-600 hover:text-indigo-600 transition-colors">
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                    </Link>
                    <Link href="/register" className="flex items-center py-2 text-gray-600 hover:text-indigo-600 transition-colors">
                      <User className="w-5 h-5 mr-2" />
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}