"use client";

import { useState } from "react";
import Image from "next/image";

const SafeImage = ({ src, alt, ...props }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      src={hasError ? "/placeholder-image.jpg" : src}
      alt={alt}
      onError={() => setHasError(true)}
      onLoadingComplete={(img) => {
        if (img.naturalWidth === 0) setHasError(true);
      }}
      {...props}
    />
  );
};

export default SafeImage;