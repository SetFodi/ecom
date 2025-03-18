export default function Home() {
  return (
    <div className="text-center">
      <h2 className="text-4xl mb-4">Welcome to ShopifyLite</h2>
      <p className="text-lg text-muted mb-6">Discover amazing products with a seamless shopping experience.</p>
      <a href="/products" className="btn-primary inline-block">
        Shop Now
      </a>
    </div>
  );
}