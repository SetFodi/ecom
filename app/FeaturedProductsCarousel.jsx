"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SafeImage from "./products/SafeImage";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function FeaturedProductsCarousel({ products = [] }) {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [visibleItems, setVisibleItems] = useState(4);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Guard against empty product array
  if (!products || products.length === 0) {
    return null;
  }

  // Calculate how many items to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleItems(1);
      } else if (width < 768) {
        setVisibleItems(2);
      } else if (width < 1024) {
        setVisibleItems(3);
      } else {
        setVisibleItems(4);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, autoPlay]);

  // Functions to control the carousel
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= products.length ? 0 : nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      return nextIndex < 0 ? products.length - 1 : nextIndex;
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Touch controls for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Calculate visible products
  const totalItems = products.length;
  const maxIndex = Math.max(0, totalItems - visibleItems);
  const normalizedIndex = Math.min(currentIndex, maxIndex);
  
  // Percentage to move based on current index
  const translateX = -(normalizedIndex * (100 / visibleItems));

  // Prepare products with placeholders if needed
  const displayProducts = [...products];

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header with better styling */}
      <div className="flex justify-between items-center mb-8">
        <motion.h2 
          className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Featured Products
        </motion.h2>
        
        <div className="flex space-x-3">
          <motion.button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white text-indigo-600 border border-indigo-100 shadow-sm hover:shadow-md transition-all"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(238, 242, 255, 0.9)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white text-indigo-600 border border-indigo-100 shadow-sm hover:shadow-md transition-all"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(238, 242, 255, 0.9)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      {/* Carousel container with touch support */}
      <div 
        className="relative overflow-hidden"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        <motion.div 
          className="flex gap-6"
          animate={{ x: `${translateX}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          style={{ width: `${(100 * totalItems) / visibleItems}%` }}
        >
          {displayProducts.map((product, index) => (
            <motion.div
              key={`product-${product.id}`}
              className="relative flex-shrink-0"
              style={{ width: `${100 / totalItems}%` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -10 }}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-full flex flex-col transform transition-all duration-300 hover:shadow-xl mx-1">
                <div className="relative h-60 overflow-hidden">
                  <SafeImage
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Product badges */}
                  {product.stock < 5 && product.stock > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                      Only {product.stock} left
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full z-10">
                      Out of Stock
                    </span>
                  )}
                  
                  {/* Quick view button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <Link
                      href={`/products/${product.id}`}
                      className="bg-white/90 backdrop-blur-sm text-indigo-600 px-4 py-2 rounded-full font-medium shadow-md hover:bg-white hover:text-purple-600 transition-colors duration-200 transform hover:scale-105 active:scale-95"
                    >
                      Quick View
                    </Link>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <Link href={`/products/${product.id}`} className="block">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                    {product.description || "Premium quality product with exceptional design and functionality."}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-bold text-indigo-600">
                      ${product.price.toFixed(2)}
                    </p>
                    <span className="text-xs py-1 px-2 bg-indigo-50 text-indigo-700 rounded-full">
                      {product.category?.name || "Product"}
                    </span>
                  </div>
                  
                  <Link
                    href={`/products/${product.id}`}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Improved pagination indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {products.map((_, idx) => (
          <button
            key={`indicator-${idx}`}
            onClick={() => goToSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? "bg-indigo-600 w-8" 
                : "bg-gray-300 w-2 hover:bg-indigo-300"
            }`}
            aria-label={`Go to product ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}