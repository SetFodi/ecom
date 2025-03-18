"use client";

import React from "react";

export default function ProductPageLayout({ children }) {
  return (
    <div className="container-custom py-12">
      {children}
      <style jsx global>{`
        .container-custom {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
      `}</style>
    </div>
  );
}