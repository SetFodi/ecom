import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "ShopifyLite",
  description: "A sleek e-commerce experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <header className="bg-[var(--card-bg)] shadow">
          <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[var(--primary)]">ShopifyLite</h1>
            <div className="space-x-4 flex items-center">
              <a href="/" className="text-muted hover:text-[var(--primary)] transition">Home</a>
              <a href="/products" className="text-muted hover:text-[var(--primary)] transition">Products</a>
              <a href="/cart" className="text-muted hover:text-[var(--primary)] transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </a>
            </div>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto py-8">{children}</main>
        <footer className="bg-[var(--foreground)] text-[var(--background)] text-center p-4">
          © 2025 ShopifyLite
        </footer>
      </body>
    </html>
  );
}