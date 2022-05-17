import { useState } from "react";
import NextImage from "next/image";
import { Skeleton, AspectRatio, Box } from "@chakra-ui/react";
import { isStringNullOrEmpty } from "@/utilities/helperFunctions";

const ImageLoader = ({ image_url: imageUrl, alt, maxW, ...props }) => {
  const [loading, setLoading] = useState(true);
  return (
    <AspectRatio ratio={2 / 3} maxW={maxW} {...props}>
      <Skeleton isLoaded={!loading}>
        <NextImage
          height="337.5px"
          width={"225px"}
          src={
            !isStringNullOrEmpty(imageUrl)
              ? imageUrl
              : "https://cdn.myanimelist.net/images/questionmark_23.gif"
          }
          onLoad={() => {
            setLoading(false);
          }}
        />
      </Skeleton>
    </AspectRatio>
  );
};

export default ImageLoader;
