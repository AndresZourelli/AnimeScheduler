import { useState } from "react";
import NextImage from "next/image";
import { Skeleton, AspectRatio, Box } from "@chakra-ui/react";
import { isStringNullOrEmpty } from "@/utilities/helperFunctions";

const ImageLoader = ({ image_url: imageUrl, alt, maxW, ...props }) => {
  const [loading, setLoading] = useState(true);
  return (
    <AspectRatio ratio={2 / 3} maxW={maxW}>
      <>
        <Skeleton isLoaded={!loading}>
          <Box display={loading ? "none" : undefined}>
            <NextImage
              layout="fill"
              src={
                !isStringNullOrEmpty(imageUrl)
                  ? imageUrl
                  : "https://cdn.myanimelist.net/images/questionmark_23.gif"
              }
              onLoad={() => {
                setLoading(false);
              }}
            />
          </Box>
        </Skeleton>
      </>
    </AspectRatio>
  );
};

export default ImageLoader;
