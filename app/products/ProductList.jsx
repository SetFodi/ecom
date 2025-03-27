// app/products/ProductList.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Eye, 
  ZoomIn, 
  Heart, 
  Search, 
  Filter, 
  Sliders, 
  X, 
  ChevronDown, 
  Tag, 
  Check, 
  AlertTriangle,
  Info 
} from "lucide-react";
import SafeImage from "./SafeImage";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      delay: index * 0.08,
      ease: [0.25, 0.1, 0.25, 1.0]
    } 
  }),
  hover: { 
    y: -10, 
    transition: { duration: 0.3, ease: "easeOut" },
    boxShadow: "0 20px 30px rgba(0, 0, 0, 0.08)"
  },
};

export default function ProductList({ products: initialProducts, categories, initialCategory }) {
  const [products] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [modalProduct, setModalProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [notification, setNotification] = useState(null);
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

  // Clear notification after timeout
  useEffect(() => {
    if (!notification) return;
    
    const timer = setTimeout(() => {
      setNotification(null);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [notification]);

  const toggleFavorite = (product) => {
    const isFavorited = favorites.includes(product.id);
    const newFavorites = isFavorited
      ? favorites.filter((id) => id !== product.id)
      : [...favorites, product.id];
    
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    
    setNotification({
      type: isFavorited ? "info" : "success",
      message: isFavorited 
        ? `${product.name} removed from favorites` 
        : `${product.name} added to favorites`
    });
  };

  const filteredProducts = products
    .filter((product) => selectedCategory === "All" || product.category.name === selectedCategory)
    .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      return a.name.localeCompare(b.name); // default: name
    });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const addToCart = (product, e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    if (product.stock <= 0) {
      setNotification({
        type: "error",
        message: "Product is out of stock!"
      });
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);
    
    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        setNotification({
          type: "warning",
          message: `Only ${product.stock} items available in stock!`
        });
        return;
      }
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    
    setNotification({
      type: "success",
      message: `${product.name} added to cart!`
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortBy("name");
    setPriceRange([0, 500]);
    setCurrentPage(1);
  };

  return (
    <div className="container-custom py-12">
      <motion.h1 
        className="text-5xl font-bold mb-10 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Explore Our Products
      </motion.h1>

      {/* Filter Bar - Desktop */}
      <motion.div 
        className="hidden md:flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative w-full lg:w-1/3 flex-shrink-0">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 hover:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
          <div className="relative group">
            <select
              className="appearance-none p-4 pl-10 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 hover:bg-white"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          </div>
          
          <div className="relative group">
            <select
              className="appearance-none p-4 pl-10 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 hover:bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            <Sliders className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          </div>
          
          <motion.button
            className="bg-indigo-600 text-white py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
            onClick={() => setFiltersOpen(!filtersOpen)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </motion.button>
        </div>
      </motion.div>
      
      {/* Filter Bar - Mobile */}
      <motion.div 
        className="md:hidden flex flex-col gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <select
              className="appearance-none w-full p-3 pl-9 pr-8 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          
          <div className="relative">
            <select
              className="appearance-none w-full p-3 pl-9 pr-8 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort: Name</option>
              <option value="price-asc">Price: Low-High</option>
              <option value="price-desc">Price: High-Low</option>
              <option value="newest">Newest First</option>
            </select>
            <Sliders className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </motion.div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <motion.button
          onClick={() => {
            setSelectedCategory("All");
            setCurrentPage(1);
          }}
          className={`category-pill ${selectedCategory === "All" ? "active" : ""}`}
          whileHover={{ y: -3 }}
          whileTap={{ y: 0 }}
        >
          All Products
        </motion.button>
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.name);
              setCurrentPage(1);
            }}
            className={`category-pill ${selectedCategory === cat.name ? "active" : ""}`}
            whileHover={{ y: -3 }}
            whileTap={{ y: 0 }}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div 
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              <button 
                onClick={() => setFiltersOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseFloat(e.target.value || 0), priceRange[1]])}
                      className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg"
                      min="0"
                      max={priceRange[1]}
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value || priceRange[0])])}
                      className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg"
                      min={priceRange[0]}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={resetFilters}
                  className="py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginatedProducts.length === 0 ? (
          <motion.div 
            className="col-span-full text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="text-6xl mb-4 inline-block"
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 1.5, 
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              🔍
            </motion.div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">We couldn't find any products matching your current filters.</p>
            <motion.button
              onClick={resetFilters}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset All Filters
            </motion.button>
          </motion.div>
        ) : (
          paginatedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="group"
            >
              <Link 
                href={`/products/${product.id}`} 
                className="block h-full rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative">
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(product);
                    }}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition-all ${
                      favorites.includes(product.id)
                        ? "bg-pink-500 text-white rotate-0 scale-100"
                        : "bg-white/90 backdrop-blur-sm text-gray-400 hover:text-pink-500 rotate-0 scale-90 opacity-70 group-hover:opacity-100"
                    }`}
                    aria-label={favorites.includes(product.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <motion.div
                      animate={favorites.includes(product.id) ? {
                        scale: [1, 1.35, 1],
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.5 }
                      } : {}}
                    >
                      <Heart className="w-4 h-4" fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                    </motion.div>
                  </button>

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {product.stock < 5 && product.stock > 0 && (
                      <div className="bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-pulse"></span>
                        Only {product.stock} left
                      </div>
                    )}
                    
                    {product.stock === 0 && (
                      <div className="bg-gray-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-md">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-50 p-2">
                    <SafeImage
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain scale-90 group-hover:scale-95 transition-all duration-700 ease-out filter drop-shadow-sm"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    
                    {/* Image hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <motion.button
                          className="p-2 mx-1 rounded-full bg-white/90 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors backdrop-blur-sm"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setModalProduct(product);
                          }}
                        >
                          <ZoomIn className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <div className="mb-2">
                      <span className="text-xs py-1 px-2 bg-indigo-50 text-indigo-700 rounded-full inline-block">
                        {product.category.name}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                      {product.description || "High-quality product crafted with premium materials."}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold text-indigo-600">${product.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <motion.button
                        className={`flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-3 rounded-lg transition-colors ${
                          product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={(e) => product.stock > 0 && addToCart(product, e)}
                        disabled={product.stock === 0}
                        whileHover={product.stock > 0 ? { scale: 1.03 } : {}}
                        whileTap={product.stock > 0 ? { scale: 0.97 } : {}}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-sm font-medium">Add to Cart</span>
                      </motion.button>
                      
                      <motion.button
                        className="flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 px-3 rounded-lg transition-colors"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Details</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                currentPage === page
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ 
                scale: currentPage === page ? [1, 1.1, 1] : 1,
                transition: { 
                  duration: currentPage === page ? 0.3 : 0.2
                }
              }}
            >
              {page}
            </motion.button>
          ))}
        </div>
      )}

      {/* Product Quick View Modal */}
      <AnimatePresence>
        {modalProduct && (
          <motion.div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalProduct(null)}
          >
            <motion.div
              className="bg-white rounded-2xl overflow-hidden max-w-xl w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-72 bg-gray-50">
                <SafeImage
                  src={modalProduct.image}
                  alt={modalProduct.name}
                  fill
                  className="object-contain p-4"
                />
                
                {/* Status badges */}
                {modalProduct.stock < 5 && modalProduct.stock > 0 && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-pulse"></span>
                    Only {modalProduct.stock} left
                  </div>
                )}
                
                {modalProduct.stock === 0 && (
                  <div className="absolute top-3 left-3 bg-gray-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-md">
                    Out of Stock
                  </div>
                )}
                
                {/* Close button */}
                <motion.button
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white hover:text-indigo-600 transition-colors shadow-md backdrop-blur-sm"
                  onClick={() => setModalProduct(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs py-1 px-2 bg-indigo-50 text-indigo-700 rounded-full inline-block">
                    {modalProduct.category.name}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{modalProduct.name}</h3>
                
                <p className="text-gray-600 mb-6">
                  {modalProduct.description || "This premium product is designed with quality materials to provide the best experience."}
                </p>
                
                <div className="flex justify-between items-center mb-6">
                  <p className="text-2xl font-bold text-indigo-600">
                    ${modalProduct.price.toFixed(2)}
                  </p>
                  <div className="text-sm text-gray-500 flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${modalProduct.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>
                      {modalProduct.stock > 0 ? `${modalProduct.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    className={`flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl transition-colors ${
                      modalProduct.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      modalProduct.stock > 0 && addToCart(modalProduct, e);
                    }}
                    disabled={modalProduct.stock === 0}
                    whileHover={modalProduct.stock > 0 ? { scale: 1.03 } : {}}
                    whileTap={modalProduct.stock > 0 ? { scale: 0.97 } : {}}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </motion.button>
                  
                  <Link
                    href={`/products/${modalProduct.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl transition-colors"
                    onClick={() => setModalProduct(null)}
                  >
                    <motion.div
                      className="w-full h-full flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            className={`fixed bottom-6 right-6 max-w-md px-6 py-4 rounded-xl shadow-xl z-50 flex items-start gap-3 ${
              notification.type === "success" 
                ? "bg-green-600 text-white"
                : notification.type === "warning"
                ? "bg-amber-500 text-white"
                : notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-indigo-500 text-white"
            }`}
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {notification.type === "success" ? (
              <Check className="w-5 h-5 mt-0.5" />
            ) : notification.type === "warning" ? (
              <AlertTriangle className="w-5 h-5 mt-0.5" />
            ) : notification.type === "error" ? (
              <X className="w-5 h-5 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 mt-0.5" />
            )}
            <div>
              <p className="font-medium">{notification.message}</p>
            </div>
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
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .category-pill:hover {
          box-shadow: 0 6px 15px rgba(79, 70, 229, 0.15);
          transform: translateY(-2px);
        }
        
        .category-pill.active {
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          color: white;
          border-color: transparent;
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.25);
        }
      `}</style>
    </div>
  );
}