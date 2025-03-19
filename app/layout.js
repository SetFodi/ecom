// app/layout.js
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
        <footer className="bg-gray-900 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in">
            {/* Left: Logo and Copyright */}
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-bold text-white hover:text-indigo-400 transition-colors duration-300">
                ShopifyLite
              </h3>
              <p className="text-gray-400 text-sm">
                © 2025 ShopifyLite. All rights reserved.
              </p>
            </div>

            {/* Center: Links */}
            <div className="flex space-x-6 text-sm">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/sitemap", label: "Sitemap" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-indigo-400 hover:scale-105 transform transition-all duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Right: Social Icons */}
            <div className="flex space-x-4">
              {["facebook", "twitter", "instagram"].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  className="text-gray-400 hover:text-indigo-400 hover:scale-110 transform transition-all duration-300"
                >
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}