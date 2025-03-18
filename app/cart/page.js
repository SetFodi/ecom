// app/cart/page.jsx
"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, X, ArrowRight, ShoppingCart, Trash2, Package, CreditCard, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemRemoving, setItemRemoving] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        // Add a small delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 500));
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

    // Listen for storage events to sync cart across tabs
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(updatedCart);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const removeFromCart = (id) => {
    setItemRemoving(id);
    setTimeout(() => {
      const updatedCart = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      window.dispatchEvent(new Event("storage")); // Update header cart count
      setItemRemoving(null);
    }, 300); // Match animation duration
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    const item = cart.find((i) => i.id === id);
    if (newQuantity > item.stock) {
      alert(`Only ${item.stock} items available in stock!`);
      return;
    }
    
    // Create updated cart
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    // Update state with animation
    setCart(updatedCart);
    
    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  const clearCart = () => {
    const confirmClear = window.confirm("Are you sure you want to clear your cart?");
    if (confirmClear) {
      localStorage.setItem("cart", JSON.stringify([]));
      setCart([]);
      window.dispatchEvent(new Event("storage"));
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + shipping;

  // Skeleton loading component
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="h-8 bg-white/20 rounded-lg w-48 animate-pulse"></div>
          </div>
          <div className="p-6 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="w-24 h-10 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50 animate-pulse">
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-24"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-24"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg w-full mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <motion.div 
        className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <ShoppingBag className="mr-3" />
            Your Shopping Cart
          </h2>
          {cart.length > 0 && (
            <motion.button
              onClick={clearCart}
              className="text-white hover:text-red-200 transition-colors flex items-center bg-white/10 px-3 py-2 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Clear Cart
            </motion.button>
          )}
        </div>
        
        <AnimatePresence>
          {cart.length === 0 ? (
            <motion.div 
              className="py-16 px-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              >
                <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-16 h-16 text-indigo-300" />
                </div>
                <h3 className="text-2xl font-medium text-gray-800 mb-3">Your cart is empty</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Looks like you haven't added anything to your cart yet. Browse our products and find something you'll love!
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/products" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg inline-flex items-center font-medium shadow-md hover:shadow-lg transition-all">
                    Continue Shopping
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <div>
              <div className="divide-y divide-gray-100">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div 
                      key={item.id} 
                      className={`p-6 flex items-center hover:bg-gray-50 transition-colors ${itemRemoving === item.id ? 'opacity-50' : ''}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      layout
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-6 relative">
                        {item.image && typeof item.image === "string" ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full transition-transform hover:scale-110 duration-500"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                          <Link href={`/products/${item.id}`}>{item.name}</Link>
                        </h3>
                        <p className="text-gray-500 text-sm">${item.price.toFixed(2)} each</p>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${item.stock < 5 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${item.stock < 5 ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                            {item.stock < 5 ? `Only ${item.stock} left` : 'In Stock'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                          <motion.button
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            whileTap={{ scale: 0.9 }}
                            disabled={item.quantity <= 1}
                          >
                            <span className="text-lg font-medium">-</span>
                          </motion.button>
                          <div className="w-10 h-8 flex items-center justify-center border-x border-gray-200 bg-white">
                            <span className="font-medium text-gray-800">{item.quantity}</span>
                          </div>
                          <motion.button
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            whileTap={{ scale: 0.9 }}
                            disabled={item.quantity >= item.stock}
                          >
                            <span className="text-lg font-medium">+</span>
                          </motion.button>
                        </div>
                        <div className="ml-6 text-right w-24">
                          <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <motion.button
                          className="ml-5 p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                          onClick={() => removeFromCart(item.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <motion.div 
                className="p-6 bg-gray-50 border-t border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="max-w-md ml-auto">
                  <div className="flex justify-between items-center mb-3 text-gray-600">
                    <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3 text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 my-4"></div>
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-6">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  {shipping > 0 && (
                    <div className="mb-4 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg flex items-start">
                      <span className="text-blue-500 mr-2 mt-0.5">
                        <Package className="w-4 h-4" />
                      </span>
                      <span>Add ${(50 - subtotal).toFixed(2)} more to get <strong>FREE shipping</strong></span>
                    </div>
                  )}
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link 
                      href="/checkout" 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg w-full flex items-center justify-center font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      <CreditCard className="mr-2 w-5 h-5" />
                      Proceed to Checkout
                    </Link>
                  </motion.div>
                  
                  <div className="mt-4 text-center">
                    <Link 
                      href="/products" 
                      className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center hover:underline"
                    >
                      <ArrowRight className="mr-2 w-4 h-4 transform rotate-180" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
