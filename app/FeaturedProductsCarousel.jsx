"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SafeImage from "./products/SafeImage";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedProductsCarousel({ products }) {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Triple the product array for infinite scrolling effect
  const tripleProducts = [...products, ...products, ...products];
  const startIndex = products.length; // Start from the middle set
  
  useEffect(() => {
    // Initialize to middle set without animation
    if (containerRef.current) {
      const cardWidth = containerRef.current.querySelector('.product-card').offsetWidth;
      const margin = parseInt(window.getComputedStyle(containerRef.current.querySelector('.product-card')).marginRight);
      const scrollAmount = startIndex * (cardWidth + margin);
      
      containerRef.current.scrollLeft = scrollAmount;
      setCurrentIndex(startIndex);
    }
  }, []);
  
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    
    // If we're approaching the end of the tripled set, reset to middle set
    if (newIndex >= products.length * 2 + Math.floor(products.length / 2)) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.scrollBehavior = 'auto';
          const cardWidth = containerRef.current.querySelector('.product-card').offsetWidth;
          const margin = parseInt(window.getComputedStyle(containerRef.current.querySelector('.product-card')).marginRight);
          const resetIndex = newIndex - products.length;
          const scrollAmount = resetIndex * (cardWidth + margin);
          
          containerRef.current.scrollLeft = scrollAmount;
          setCurrentIndex(resetIndex);
          
          // Re-enable smooth scrolling after reset
          setTimeout(() => {
            containerRef.current.style.scrollBehavior = 'smooth';
          }, 50);
        }
      }, 500); // Wait for animation to complete
    }
    
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    
    // If we're approaching the start of the tripled set, reset to middle set
    if (newIndex <= products.length - Math.floor(products.length / 2)) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.scrollBehavior = 'auto';
          const cardWidth = containerRef.current.querySelector('.product-card').offsetWidth;
          const margin = parseInt(window.getComputedStyle(containerRef.current.querySelector('.product-card')).marginRight);
          const resetIndex = newIndex + products.length;
          const scrollAmount = resetIndex * (cardWidth + margin);
          
          containerRef.current.scrollLeft = scrollAmount;
          setCurrentIndex(resetIndex);
          
          // Re-enable smooth scrolling after reset
          setTimeout(() => {
            containerRef.current.style.scrollBehavior = 'smooth';
          }, 50);
        }
      }, 500); // Wait for animation to complete
    }
    
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  useEffect(() => {
    if (containerRef.current && currentIndex !== startIndex) {
      const cardWidth = containerRef.current.querySelector('.product-card').offsetWidth;
      const margin = parseInt(window.getComputedStyle(containerRef.current.querySelector('.product-card')).marginRight);
      const scrollAmount = currentIndex * (cardWidth + margin);
      
      containerRef.current.style.scrollBehavior = 'smooth';
      containerRef.current.scrollLeft = scrollAmount;
    }
  }, [currentIndex]);
  
  // Auto scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]);

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8">
      {/* Title with gradient */}
      <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Featured Products
      </h2>
      
      {/* Navigation Buttons with improved styling */}
      <motion.button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-indigo-600 rounded-full p-3 shadow-lg z-10 border border-indigo-200"
        aria-label="Previous products"
        whileHover={{
          scale: 1.15,
          backgroundColor: "rgba(238, 242, 255, 0.9)",
          boxShadow: "0 0 20px rgba(79, 70, 229, 0.3)",
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>
      
      <motion.button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-indigo-600 rounded-full p-3 shadow-lg z-10 border border-indigo-200"
        aria-label="Next products"
        whileHover={{
          scale: 1.15,
          backgroundColor: "rgba(238, 242, 255, 0.9)",
          boxShadow: "0 0 20px rgba(79, 70, 229, 0.3)",
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>

      {/* Carousel Container with multiple visible products */}
      <div
        ref={containerRef}
        className="flex overflow-x-hidden space-x-6 py-6 px-2"
        style={{ 
          scrollbarWidth: "none", 
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch"
        }}
      >
        {tripleProducts.map((product, index) => (
          <motion.div
            key={`${product.id}-${index}`}
            className="product-card flex-shrink-0 w-72 bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: (index % products.length) * 0.05,
              ease: [0.4, 0, 0.2, 1],
            }}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.2 },
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
          >
            <div className="relative w-full h-52 bg-gray-50 overflow-hidden">
              <SafeImage
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/40"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Quick view button that appears on hover */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="bg-white/90 backdrop-blur-sm text-indigo-600 px-4 py-2 rounded-full font-medium shadow-md hover:bg-white hover:text-purple-600 transition-colors duration-200"
                  >
                    Quick View
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
                {product.name}
              </h3>
              
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-700 text-base font-semibold">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex space-x-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={`/products/${product.id}`}
                  className="inline-block w-full text-center py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <span className="relative z-10">View Details</span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-4">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setCurrentIndex(startIndex + idx - (currentIndex % products.length));
                setTimeout(() => setIsAnimating(false), 500);
              }
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex % products.length 
                ? "bg-purple-600 w-6" 
                : "bg-gray-300 hover:bg-purple-400"
            }`}
            aria-label={`Go to product set ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}