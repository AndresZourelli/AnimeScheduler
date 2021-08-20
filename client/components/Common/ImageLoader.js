import { useState } from "react";
import NextImage from "next/image";
import { Skeleton } from "@chakra-ui/react";

const ImageLoader = ({ image_url, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  return (
    <Skeleton width="full" height="full" isLoaded={isLoaded}>
      <NextImage
        src={
          image_url ?? "https://cdn.myanimelist.net/images/questionmark_23.gif"
        }
        alt={alt}
        layout="fill"
        onLoad={handleImageLoad}
      />
    </Skeleton>
  );
};

export default ImageLoader;
