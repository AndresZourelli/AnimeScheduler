import { useState } from "react";
import NextImage from "next/image";
import { Skeleton, AspectRatio } from "@chakra-ui/react";

const ImageLoader = ({ image_url, alt, maxW, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  return (
    <Skeleton isLoaded={isLoaded}>
      <AspectRatio ratio={2 / 3} maxW={maxW}>
        <NextImage
          layout="fill"
          src={
            image_url ??
            "https://cdn.myanimelist.net/images/questionmark_23.gif"
          }
          onLoadingComplete={handleImageLoad}
        />
      </AspectRatio>
    </Skeleton>
  );
};

export default ImageLoader;
