"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import SafeImage from "../products/SafeImage.jsx";

export default function CollectionsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-16 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-indigo-600 font-medium">Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom py-16">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Explore Our Collections
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated collections, designed with quality and style in mind.
            Each collection represents our commitment to exceptional craftsmanship.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="flex flex-col h-full"
            >
              <Link
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group h-full bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-full h-64 overflow-hidden">
                  <SafeImage
                    src={category.image}
                    alt={`${category.name} Collection`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-xl font-bold mb-1 group-hover:text-indigo-300 transition-colors duration-300">
                      {category.name}
                    </h2>
                    <div className="w-12 h-1 bg-indigo-500 rounded mb-2 transform origin-left group-hover:w-24 transition-all duration-300" />
                    <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore {category.name} Collection
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-medium">View Products</span>
                    <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {categories.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25-2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Collections Found</h3>
            <p className="text-gray-500">We couldn't find any collections at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
