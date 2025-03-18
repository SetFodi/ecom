// app/checkout/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, CreditCard, Truck, Check, ChevronRight, Lock, Calendar, CreditCardIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.08; // 8% tax example
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
    } else {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        localStorage.setItem("cart", JSON.stringify([]));
        window.dispatchEvent(new Event("storage"));
        setIsSubmitting(false);
        setIsComplete(true);
      }, 1500);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/cart");
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // If the order is complete, show a success message
  if (isComplete) {
    return (
      <motion.div 
        className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Order Complete!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We've received your payment and will process your items shortly.
          </p>
          <p className="text-gray-500 mb-6 text-sm">
            A confirmation email has been sent to {formData.email || "your email address"}.
          </p>
          <div className="flex flex-col space-y-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link 
                href="/" 
                className="block w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Return to Home
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link 
                href="/products" 
                className="block w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <motion.div 
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-8">
          <Link href="/cart" className="text-indigo-600 hover:text-indigo-800 flex items-center">
            <motion.span 
              className="mr-2" 
              animate={{ x: [0, -5, 0] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ←
            </motion.span>
            Back to Cart
          </Link>
          
          <div className="flex items-center">
            <div className={`flex items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="hidden sm:inline">Shipping</span>
            </div>
            <div className={`w-10 sm:w-16 h-1 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'} mx-2`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="hidden sm:inline">Payment</span>
            </div>
          </div>
          
          <div className="w-10"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <motion.div 
              className="bg-white shadow-lg rounded-xl overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {step === 1 ? 'Shipping Information' : 'Payment Details'}
                </h2>
              </div>
              
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.form 
                      key="shipping"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input 
                            type="text" 
                            name="fullName" 
                            value={formData.fullName} 
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                            placeholder="John Doe" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                            placeholder="john@example.com" 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input 
                          type="text" 
                          name="address" 
                          value={formData.address} 
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                          placeholder="123 Main St" 
                          required 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input 
                            type="text" 
                            name="city" 
                            value={formData.city} 
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                            placeholder="New York" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                          <input 
                            type="text" 
                            name="postalCode" 
                            value={formData.postalCode} 
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                            placeholder="10001" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <select 
                            name="country" 
                            value={formData.country} 
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                            required
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <motion.button 
                          type="submit"
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Continue to Payment
                          <ChevronRight className="ml-2 w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.form 
                      key="payment"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium">Payment Method</h3>
                          <div className="flex items-center">
                            <Lock className="w-4 h-4 text-gray-500 mr-1" />
                            <span className="text-sm text-gray-500">Secure Server</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 flex items-center gap-3">
                            <div className="h-5 w-5 rounded-full border border-indigo-600 flex items-center justify-center">
                              <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                            </div>
                            <div className="flex items-center flex-grow">
                              <span className="ml-1">Credit Card</span>
                              <div className="ml-auto flex gap-2">
                                <Image src="/visa.svg" alt="Visa" width={30} height={20} />
                                <Image src="/mastercard.svg" alt="Mastercard" width={30} height={20} />
                                <Image src="/amex.svg" alt="American Express" width={30} height={20} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                        <input 
                          type="text" 
                          name="cardName" 
                          value={formData.cardName} 
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                          placeholder="John Doe" 
                          required 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            name="cardNumber" 
                            value={formData.cardNumber} 
                            onChange={(e) => {
                              const formattedValue = formatCardNumber(e.target.value);
                              setFormData({ ...formData, cardNumber: formattedValue });
                            }}
                            className="w-full p-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                            placeholder="4111 1111 1111 1111" 
                            maxLength="19"
                            required 
                          />
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              name="expiry" 
                              value={formData.expiry} 
                              onChange={handleInputChange}
                              className="w-full p-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                              placeholder="MM/YY" 
                              required 
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              name="cvv" 
                              value={formData.cvv} 
                              onChange={handleInputChange}
                              className="w-full p-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                              placeholder="123" 
                              maxLength="4"
                              required 
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex items-center justify-between">
                        <button 
                          type="button" 
                          onClick={goBack}
                          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                        >
                          <ChevronRight className="w-5 h-5 mr-1 transform rotate-180" />
                          Back
                        </button>
                        
                        <motion.button 
                          type="submit"
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              Complete Order
                              <Check className="ml-2 w-5 h-5" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white shadow-lg rounded-xl overflow-hidden sticky top-6">
              <div className="bg-gray-800 p-6">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <ShoppingBag className="mr-2 w-5 h-5" />
                  Order Summary
                </h3>
              </div>
              
              <div className="p-6">
                <div className="max-h-60 overflow-y-auto mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex py-3 border-b border-gray-100 last:border-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                        {item.image && typeof item.image === "string" ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 my-3 pt-3"></div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                {step === 1 && (
                  <div className="mt-6 bg-blue-50 p-3 rounded-lg text-sm text-blue-800 flex items-start">
                    <Truck className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                    <p>
                      {shipping === 0 ? 
                        "Your order qualifies for FREE shipping!" :
                        `Add $${(50 - subtotal).toFixed(2)} more to qualify for FREE shipping.`
                      }
                    </p>
                  </div>
                )}
                
                {step === 2 && (
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg text-sm">
                    <p className="font-medium text-gray-800 mb-2">Will be shipped to:</p>
                    <p className="text-gray-600">{formData.fullName}</p>
                    <p className="text-gray-600">{formData.address}</p>
                    <p className="text-gray-600">{formData.city}, {formData.postalCode}</p>
                    <p className="text-gray-600">{formData.country}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
