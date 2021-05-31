import { useState } from "react";
import NextImage from "next/image";
import { Skeleton } from "@chakra-ui/react";

const ImageLoader = ({ image_url, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  return (
    <Skeleton width="100%" height="100%" isLoaded={isLoaded}>
      <NextImage
        src={image_url}
        alt={alt}
        layout="fill"
        onLoad={handleImageLoad}
      />
    </Skeleton>
  );
};

export default ImageLoader;
