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
  {/* Parallax Background with Enhanced Smoothness */}
  <motion.div
    className="absolute inset-0"
    initial={{ scale: 1.05, opacity: 0.7 }}
    animate={{ scale: 1.15, opacity: 1 }}
    transition={{
      duration: 12,
      repeat: Infinity,
      repeatType: "reverse",
      ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for buttery smoothness
    }}
  >
    <SafeImage
      src={heroProduct.image}
      alt={`${heroProduct.name || "Featured Product"} Background`}
      fill
      className="object-cover brightness-90"
      style={{ zIndex: -1 }}
    />
    {/* Gradient Overlay with Smoother Animation */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-indigo-900/60"
      animate={{
        background: [
          "linear-gradient(to right, rgba(55, 48, 163, 0.6), rgba(88, 28, 135, 0.6), rgba(55, 48, 163, 0.6))",
          "linear-gradient(to right, rgba(88, 28, 135, 0.6), rgba(55, 48, 163, 0.6), rgba(88, 28, 135, 0.6))",
        ],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    />
    {/* Subtle Glow Overlay */}
    <motion.div
      className="absolute inset-0"
      animate={{
        boxShadow: [
          "inset 0 0 50px rgba(147, 51, 234, 0.2)",
          "inset 0 0 100px rgba(79, 70, 229, 0.3)",
          "inset 0 0 50px rgba(147, 51, 234, 0.2)",
        ],
      }}
      transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    />
  </motion.div>

  {/* Hero Content with Refined Animations */}
  <motion.div
    className="relative z-10 text-center text-white px-6"
    initial={{ opacity: 0, y: 60 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 1.4,
      ease: [0.25, 0.8, 0.25, 1], // Smooth spring-like easing
      delay: 0.4,
    }}
  >
    <motion.h1
      className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 relative"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1], // Smooth overshoot effect
        delay: 0.6,
      }}
    >
      Welcome to ShopifyLite
      <motion.span
        className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: "60%" }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
      />
    </motion.h1>
    <motion.p
      className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light tracking-wide drop-shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut", delay: 1 }}
    >
      Discover amazing products with a seamless shopping experience tailored just for you.
    </motion.p>
    <motion.div
      whileHover={{
        scale: 1.08,
        boxShadow: "0 0 25px rgba(147, 51, 234, 0.6)",
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.97 }}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: "easeOut", delay: 1.2 }}
    >
      <Link
        href="/products"
        className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 px-10 rounded-full text-lg font-semibold shadow-lg relative overflow-hidden group t"
      >
        <span className="relative z-10">Shop Now</span>
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-pink-600 via-indigo-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 ransition-all ease-in-out duration-300" 
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
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