// app/products/ProductList.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Eye, ZoomIn, Heart, Search, Filter } from "lucide-react";
import SafeImage from "./SafeImage";
import { motion, AnimatePresence } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  hover: { y: -8, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" },
};

export default function ProductList({ products: initialProducts, categories, initialCategory }) {
  const [products] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [modalProduct, setModalProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const productsPerPage = 8;

  // Sync selectedCategory with initialCategory on mount
  useEffect(() => {
    setSelectedCategory(initialCategory || "All");
  }, [initialCategory]);

  // Load favorites from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(storedFavorites);
    }
  }, []);

  const toggleFavorite = (product) => {
    const newFavorites = favorites.includes(product.id)
      ? favorites.filter((id) => id !== product.id)
      : [...favorites, product.id];
    
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const filteredProducts = products
    .filter((product) => selectedCategory === "All" || product.category.name === selectedCategory)
    .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (sortBy === "price" ? a.price - b.price : a.name.localeCompare(b.name)));

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert("Product is out of stock!");
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);
    
    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        alert(`Only ${product.stock} items available in stock!`);
        return;
      }
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="container-custom py-12">
      <motion.h1 
        className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Explore Our Products
      </motion.h1>

      <motion.div 
        className="mb-10 flex flex-col sm:flex-row gap-6 items-center justify-between bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <select
            className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <select
            className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
      </motion.div>

      <div className="mb-8 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`category-pill ${selectedCategory === "All" ? "active" : ""}`}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`category-pill ${selectedCategory === cat.name ? "active" : ""}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginatedProducts.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-500 mb-6">No products found. Try adjusting your filters!</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          paginatedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="product-card relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all border border-gray-100"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => toggleFavorite(product)}
                  className={`p-2 rounded-full ${
                    favorites.includes(product.id)
                      ? "bg-pink-500 text-white"
                      : "bg-white/80 text-gray-400 hover:text-pink-500"
                  }`}
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {product.stock < 5 && product.stock > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                  Only {product.stock} left
                </span>
              )}
              
              {product.stock === 0 && (
                <span className="absolute top-3 left-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-full z-10">
                  Out of Stock
                </span>
              )}

              <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform hover:scale-110 duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                  <button
                    className="p-2 rounded-full bg-white text-indigo-600 mx-1"
                    onClick={() => setModalProduct(product)}
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xl font-bold text-indigo-600">${product.price.toFixed(2)}</p>
                  <span className="text-xs py-1 px-2 bg-indigo-50 text-indigo-700 rounded-full">
                    {product.category.name}
                  </span>
                </div>
                
                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    className={`flex items-center justify-center gap-2 flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors ${
                      product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => product.stock > 0 && addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  
                  <Link
                    href={`/products/${product.id}`}
                    className="flex items-center justify-center gap-2 flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                currentPage === page
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalProduct && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalProduct(null)}
          >
            <motion.div
              className="bg-white rounded-xl overflow-hidden max-w-xl w-full"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 bg-gray-100">
                <SafeImage
                  src={modalProduct.image}
                  alt={modalProduct.name}
                  fill
                  className="object-cover"
                />
                {modalProduct.stock < 5 && modalProduct.stock > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Only {modalProduct.stock} left
                  </span>
                )}
                {modalProduct.stock === 0 && (
                  <span className="absolute top-3 left-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
                <button
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-gray-700"
                  onClick={() => setModalProduct(null)}
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs mb-3">
                  {modalProduct.category.name}
                </span>
                <h3 className="text-2xl font-bold mb-2">{modalProduct.name}</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {modalProduct.description || "This premium product is designed with quality materials to provide the best experience."}
                </p>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-2xl font-bold text-indigo-600">
                    ${modalProduct.price.toFixed(2)}
                  </p>
                  <span className="text-sm text-gray-500">
                    {modalProduct.stock > 0 ? `${modalProduct.stock} in stock` : "Out of stock"}
                  </span>
                </div>
                <div className="flex gap-4">
                  <button
                    className={`flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors ${
                      modalProduct.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => modalProduct.stock > 0 && addToCart(modalProduct)}
                    disabled={modalProduct.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <Link
                    href={`/products/${modalProduct.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition-colors"
                    onClick={() => setModalProduct(null)}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .container-custom {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        
        .category-pill {
          background: white;
          color: #4F46E5;
          border: 1px solid rgba(79, 70, 229, 0.2);
          padding: 0.5rem 1.25rem;
          border-radius: 9999px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .category-pill:hover {
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
          transform: translateY(-2px);
        }
        
        .category-pill.active {
          background: linear-gradient(to right, #4F46E5, #7C3AED);
          color: white;
          border-color: transparent;
        }
      `}</style>
    </div>
  );
}
