import { useState } from "react";
import NextImage from "next/image";
import { Skeleton } from "@chakra-ui/react";

const ImageLoader = ({ image_url, alt, minH, w, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  return (
    <Skeleton isLoaded={isLoaded} h={minH} w={w} position="relative">
      <NextImage
        src={
          image_url ?? "https://cdn.myanimelist.net/images/questionmark_23.gif"
        }
        alt={alt}
        layout="fill"
        onLoad={handleImageLoad}
        {...props}
      />
    </Skeleton>
  );
};

export default ImageLoader;
