// app/about/page.js
export default function AboutPage() {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="text-center mb-16 animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About ShopifyLite
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We’re passionate about delivering a premium shopping experience with curated, high-quality products designed to elevate your lifestyle.
        </p>
      </section>

      {/* Mission Section */}
      <section className="mb-16 flex flex-col md:flex-row items-center gap-8 animate-fade-in">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600">
            At ShopifyLite, our mission is to redefine online shopping by offering a seamless, enjoyable experience. We carefully curate our collections to ensure every product meets our high standards of quality, style, and functionality.
          </p>
        </div>
        <div className="md:w-1/2 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 font-medium">Mission Image</span>
        </div>
      </section>

      {/* Vision Section */}
      <section className="mb-16 flex flex-col md:flex-row-reverse items-center gap-8 animate-fade-in">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-600">
            We envision a world where shopping is not just a necessity but a delightful journey. ShopifyLite aims to be the go-to destination for premium products, blending innovation with elegance.
          </p>
        </div>
        <div className="md:w-1/2 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 font-medium">Vision Image</span>
        </div>
      </section>

      {/* Team Section */}
      <section className="text-center animate-fade-in">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Jane Doe", role: "Founder & CEO" },
            { name: "John Smith", role: "Head of Design" },
            { name: "Emily Johnson", role: "Marketing Lead" },
          ].map((member) => (
            <div
              key={member.name}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-full h-48 bg-gray-200 rounded-t-xl flex items-center justify-center">
                <span className="text-gray-500 font-medium">Team Image</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
