// app/FeaturedProductsCarousel.jsx
"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SafeImage from "./products/SafeImage";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedProductsCarousel({ products }) {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(products.length); // Start in the middle set
  const extendedProducts = [...products, ...products, ...products]; // Duplicate for infinite loop

  useEffect(() => {
    if (scrollContainerRef.current) {
      const cardWidth = 300; // Adjust based on card width
      const scrollPosition = currentIndex * cardWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });

      // Infinite loop logic
      if (currentIndex >= products.length * 2) {
        setTimeout(() => setCurrentIndex(products.length), 500); // Delay to match scroll animation
      } else if (currentIndex < products.length) {
        setTimeout(() => setCurrentIndex(products.length), 500);
      }
    }
  }, [currentIndex, products.length]);

  const scrollLeft = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const scrollRight = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <motion.button
        onClick={scrollLeft}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-10 border border-indigo-400/50"
        aria-label="Scroll left"
        whileHover={{ scale: 1.2, rotate: -15, boxShadow: "0 0 20px rgba(79, 70, 229, 0.5)" }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ChevronLeft className="w-6 h-6 animate-pulse" />
      </motion.button>
      <motion.button
        onClick={scrollRight}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-10 border border-indigo-400/50"
        aria-label="Scroll right"
        whileHover={{ scale: 1.2, rotate: 15, boxShadow: "0 0 20px rgba(79, 70, 229, 0.5)" }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ChevronRight className="w-6 h-6 animate-pulse" />
      </motion.button>

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-hidden scroll-smooth space-x-6 py-4 px-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <AnimatePresence>
          {extendedProducts.map((product, index) => (
            <motion.div
              key={`${product.id}-${index}`}
              className="card bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transition-all hover:shadow-xl min-w-[280px] snap-center group"
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.6, delay: (index % products.length) * 0.1, ease: "easeOut" }}
            >
              <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-muted text-sm mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <Link
                  href={`/products/${product.id}`}
                  className="btn-secondary w-full text-center py-2 relative group overflow-hidden"
                >
                  <span className="relative z-10">View Details</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}