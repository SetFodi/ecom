import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./Header"; // New client component for header

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "ShopifyLite | Premium Shopping Experience",
  description: "A sleek and premium e-commerce experience with the best products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-gray-50 text-gray-900`}>
        <Header />
        <main className="max-w-7xl mx-auto py-8 px-4 min-h-[calc(100vh-300px)]">
          {children}
        </main>
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">ShopifyLite</h3>
                <p className="text-gray-400 mb-4">
                  Premium shopping experience with the best products curated just for you.
                </p>
                {/* Social icons remain the same */}
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Shop</h4>
                <ul className="space-y-2">
                  <li><a href="/products" className="text-gray-400 hover:text-white transition-colors">All Products</a></li>
                  <li><a href="/collections" className="text-gray-400 hover:text-white transition-colors">Collections</a></li>
                  <li><a href="/featured" className="text-gray-400 hover:text-white transition-colors">Featured</a></li>
                  <li><a href="/sale" className="text-gray-400 hover:text-white transition-colors">Sale</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Customer Service</h4>
                <ul className="space-y-2">
                  <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</a></li>
                  <li><a href="/warranty" className="text-gray-400 hover:text-white transition-colors">Warranty</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Subscribe</h4>
                <p className="text-gray-400 mb-4">Sign up for our newsletter.</p>
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none"
                  />
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg transition-colors">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2025 ShopifyLite. All rights reserved.</p>
              <div className="mt-4 md:mt-0 flex space-x-4 text-sm">
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="/sitemap" className="text-gray-400 hover:text-white transition-colors">Sitemap</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}