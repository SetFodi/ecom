// app/products/[id]/ProductImageGallery.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SafeImage from "../SafeImage";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export default function ProductImageGallery({ product, images, productName }) {
  // Handle different ways the component might be called
  const imageArray = images || (product?.image ? [product.image] : ["/placeholder-image.jpg"]);
  const name = productName || product?.name || "Product";
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageArray.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
  };

  const slides = imageArray.map((src) => ({ src }));

  return (
    <div className="h-full w-full bg-gray-50">
      <div className="relative h-[500px] lg:h-full w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <SafeImage
              src={imageArray[currentIndex]}
              alt={`${name} - Image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {imageArray.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full text-gray-700 hover:bg-white hover:text-indigo-600 transition-all shadow-md backdrop-blur-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full text-gray-700 hover:bg-white hover:text-indigo-600 transition-all shadow-md backdrop-blur-sm"
              onClick={nextImage}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        
        <button
          className="absolute right-4 bottom-4 bg-white/80 p-2 rounded-full text-gray-700 hover:bg-white hover:text-indigo-600 transition-all shadow-md backdrop-blur-sm"
          onClick={() => setLightboxOpen(true)}
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>
      
      {imageArray.length > 1 && (
        <div className="grid grid-cols-4 gap-2 p-4 bg-white border-t border-gray-100">
          {imageArray.map((image, index) => (
            <button
              key={index}
              className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index
                  ? "border-indigo-500 shadow-sm"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <SafeImage
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="50px"
              />
            </button>
          ))}
        </div>
      )}
      
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        plugins={[Zoom, Thumbnails]}
        index={currentIndex}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          gap: 16,
          border: 0,
          borderRadius: 8,
          padding: 4,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
        }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
          thumbnailsContainer: { backgroundColor: "rgba(0, 0, 0, 0.6)" },
        }}
        render={{
          iconPrev: () => <ChevronLeft className="w-6 h-6" />,
          iconNext: () => <ChevronRight className="w-6 h-6" />,
        }}
      />
    </div>
  );
}