// app/HomeClient.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SafeImage from "./products/SafeImage";

export default function HomeClient({ heroProduct, featuredProducts }) {
  return (
    <div className="bg-gray-50 relative overflow-hidden">
      {/* Subtle Background Pattern with Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 opacity-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 animate-subtle-pulse" />
      </motion.div>

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Parallax Background with Glow Effect */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <SafeImage
            src={heroProduct.image}
            alt={`${heroProduct.name || "Featured Product"} Background`}
            fill
            className="object-cover"
            style={{ zIndex: -1 }}
          />
          {/* Gradient Overlay with Animated Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-purple-900/70"
            animate={{
              background: [
                "linear-gradient(to right, rgba(55, 48, 163, 0.7), rgba(88, 28, 135, 0.7))",
                "linear-gradient(to right, rgba(88, 28, 135, 0.7), rgba(55, 48, 163, 0.7))",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        </motion.div>

        {/* Hero Content with Enhanced Animations */}
        <motion.div
          className="relative z-10 text-center text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 gradient-text-hero relative"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Welcome to ShopifyLite
            <span className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-500 group-hover:w-1/2" />
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            Discover amazing products with a seamless shopping experience tailored just for you.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(79, 70, 229, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          >
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-lg text-lg font-semibold transition-all shadow-lg relative overflow-hidden group"
            >
              <span className="relative z-10">Shop Now</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="container-custom py-16">
        <motion.h2
          className="text-4xl font-bold text-center mb-12 gradient-text relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Featured Products
          <span className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-500 group-hover:w-1/2" />
        </motion.h2>
      </section>
    </div>
  );
}