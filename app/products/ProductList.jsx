"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" },
};

export default function ProductList({ products: initialProducts, categories }) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [modalProduct, setModalProduct] = useState(null);

  // Filter and sort products
  const filteredProducts = products
    .filter((product) =>
      selectedCategory === "All" ? true : product.category.name === selectedCategory
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full sm:w-1/3 p-2 rounded-lg border border-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <select
            className="p-2 rounded-lg border border-gray-300"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <select
            className="p-2 rounded-lg border border-gray-300"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="text-muted col-span-full text-center">No products found.</p>
        ) : (
          filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="card relative"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {product.stock < 5 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Low Stock
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4 cursor-pointer"
                onClick={() => setModalProduct(product)}
              />
              <h3 className="text-xl">{product.name}</h3>
              <p className="text-muted">${product.price.toFixed(2)}</p>
              <button
                className="btn-primary mt-2 w-full"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[var(--card-bg)] p-6 rounded-xl max-w-lg w-full">
            <h3 className="text-2xl mb-4">{modalProduct.name}</h3>
            <img src={modalProduct.image} alt={modalProduct.name} className="w-full h-64 object-cover rounded-md mb-4" />
            <p className="text-muted mb-4">{modalProduct.description}</p>
            <p className="text-xl text-[var(--primary)]">${modalProduct.price.toFixed(2)}</p>
            <div className="flex gap-2 mt-4">
              <button className="btn-primary flex-1" onClick={() => addToCart(modalProduct)}>
                Add to Cart
              </button>
              <button className="btn-primary flex-1" onClick={() => setModalProduct(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Cart functionality (client-side for now)
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} added to cart!`);
}