import { useState } from "react";
import NextImage from "next/image";
import { Skeleton, AspectRatio, Image } from "@chakra-ui/react";

const ImageLoader = ({ image_url, alt, maxW, ...props }) => {
  return (
    <AspectRatio ratio={2 / 3} maxW={maxW}>
      <NextImage
        layout="fill"
        src={
          image_url ?? "https://cdn.myanimelist.net/images/questionmark_23.gif"
        }
      />
    </AspectRatio>
  );
};

export default ImageLoader;
