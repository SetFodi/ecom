"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Eye, ZoomIn } from "lucide-react";
import SafeImage from "./SafeImage";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" },
};

export default function ProductList({ products: initialProducts, categories }) {
  const [products] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [modalProduct, setModalProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const filteredProducts = products
    .filter((product) => selectedCategory === "All" || product.category.name === selectedCategory)
    .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (sortBy === "price" ? a.price - b.price : a.name.localeCompare(b.name)));

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
        Explore Our Products
      </h1>

      <div className="mb-10 flex flex-col sm:flex-row gap-6 items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Eye className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div className="flex gap-4">
          <select
            className="p-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <select
            className="p-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginatedProducts.length === 0 ? (
          <p className="text-muted col-span-full text-center text-lg">
            No products found. Try adjusting your filters!
          </p>
        ) : (
          paginatedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="product-card card relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all border border-gray-100"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              {product.stock < 5 && product.stock > 0 && (
                <span className="badge badge-sale">Low Stock</span>
              )}
              {product.stock === 0 && (
                <span className="badge badge-featured">Out of Stock</span>
              )}

              <div className="relative w-full h-64 bg-gray-100">
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="product-img object-cover rounded-t-xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-t-xl">
                  <button
                    className="text-white p-3 rounded-full hover:bg-indigo-600 transition-all"
                    onClick={() => setModalProduct(product)}
                  >
                    <ZoomIn className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-muted text-sm mt-1">${product.price.toFixed(2)}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    className={`btn-primary flex items-center gap-2 flex-1 justify-center text-sm ${
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
                    className="btn-secondary flex items-center gap-2 flex-1 justify-center text-sm"
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
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
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

      {modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <motion.div
            className="card p-8 rounded-2xl max-w-md w-full bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold gradient-text mb-4">{modalProduct.name}</h3>
            <div className="relative w-full h-72">
              <SafeImage
                src={modalProduct.image}
                alt={modalProduct.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <p className="text-muted mt-4 mb-6 line-clamp-3">{modalProduct.description}</p>
            <p className="text-xl font-semibold text-indigo-600 mb-6">
              ${modalProduct.price.toFixed(2)}
            </p>
            <div className="flex gap-4">
              <button
                className={`btn-primary flex-1 flex items-center justify-center gap-2 ${
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
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
                onClick={() => setModalProduct(null)}
              >
                <Eye className="w-4 h-4" />
                View Details
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    if (existing.quantity + 1 > product.stock) {
      alert(`Only ${product.stock} items available in stock!`);
      return;
    }
    existing.quantity += 1;
  } else {
    if (product.stock < 1) {
      alert("Out of stock!");
      return;
    }
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("storage"));
  alert(`${product.name} added to cart!`);
}