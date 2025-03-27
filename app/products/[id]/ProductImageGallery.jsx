// app/products/[id]/ProductImageGallery.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SafeImage from "../SafeImage";
import { ZoomIn, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export default function ProductImageGallery({ product, images, productName }) {
  // Handle different ways the component might be called
  const imageArray = images || 
    (product?.extraImages ? 
      JSON.parse(product.extraImages) : 
      product?.image ? [product.image] : ["/placeholder-image.jpg"]);
  
  const name = productName || product?.name || "Product";
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageArray.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
  };

  // Auto advance images on timer
  useEffect(() => {
    if (isHovering) return; // Don't auto-advance if user is hovering
    
    const timer = setTimeout(() => {
      if (imageArray.length > 1) {
        nextImage();
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentIndex, isHovering, imageArray.length]);

  const slides = imageArray.map((src) => ({ src }));

  return (
    <div 
      className="h-full w-full bg-gradient-to-b from-gray-50 to-white"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative h-[500px] lg:h-full w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-full h-full overflow-hidden">
              <SafeImage
                src={imageArray[currentIndex]}
                alt={`${name} - Image ${currentIndex + 1}`}
                fill
                className="object-contain scale-[0.95] hover:scale-100 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50/30 to-transparent opacity-60 pointer-events-none" />
            </div>
          </motion.div>
        </AnimatePresence>

        {imageArray.length > 1 && (
          <>
            <motion.button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 rounded-full text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-lg backdrop-blur-sm"
              onClick={prevImage}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovering ? 1 : 0.7, x: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 rounded-full text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-lg backdrop-blur-sm"
              onClick={nextImage}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovering ? 1 : 0.7, x: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </>
        )}
        
        <motion.button
          className="absolute right-4 bottom-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all backdrop-blur-sm"
          onClick={() => setLightboxOpen(true)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovering ? 1 : 0.9, y: 0 }}
          whileHover={{ scale: 1.1, boxShadow: "0 8px 25px rgba(79, 70, 229, 0.4)" }}
          whileTap={{ scale: 0.9 }}
        >
          <Maximize2 className="w-5 h-5" />
        </motion.button>
      </div>
      
      {imageArray.length > 1 && (
        <div className="grid grid-cols-4 gap-3 p-5 bg-white rounded-b-xl">
          {imageArray.map((image, index) => (
            <motion.button
              key={index}
              className={`relative rounded-lg overflow-hidden aspect-square cursor-pointer transform transition-all duration-300 ${
                currentIndex === index
                  ? "ring-2 ring-offset-2 ring-indigo-500 shadow-md scale-105"
                  : "opacity-70 hover:opacity-100 hover:shadow-sm"
              }`}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ y: -4, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeImage
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                className="object-cover transition-all duration-500 hover:scale-110"
                sizes="100px"
              />
              {currentIndex === index && (
                <motion.div 
                  className="absolute inset-0 bg-indigo-500/10" 
                  layoutId="selectedThumb"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
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
          padding: 8,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
        }}
        controller={{ closeOnBackdropClick: true }}
        carousel={{ finite: false, padding: 10 }}
        animation={{ swipe: 350 }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.92)" },
          thumbnailsContainer: { 
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
          },
          thumbnail: {
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          },
          thumbnailsTrack: { padding: "12px 0" },
        }}
        render={{
          iconPrev: () => <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}><ChevronLeft className="w-8 h-8" /></motion.div>,
          iconNext: () => <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}><ChevronRight className="w-8 h-8" /></motion.div>,
          iconClose: () => <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}><X className="w-8 h-8" /></motion.div>,
          iconZoomIn: () => <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}><ZoomIn className="w-8 h-8" /></motion.div>,
        }}
      />
    </div>
  );
}