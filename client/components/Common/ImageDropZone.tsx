import { Box, Image, Input, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";

type File = {
  preview: string;
  width: number;
  height: number;
  name?: string;
};

const ImageDropZone = ({ file, setFile }) => {
  const [error, setError] = useState({ code: "", message: "" });
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.map((files) => {
        let uploadedImage: File = {
          preview: URL.createObjectURL(files),
          width: 0,
          height: 0,
        };

        let combinedImage = Object.assign(files, uploadedImage);
        setFile(combinedImage);
        setError({ code: "", message: "" });
      });
    },
    [setFile]
  );
  const addImageProcess = (src) => {
    return new Promise((resolve, reject) => {
      let img = document.createElement("img");
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject;
      img.src = src;
    });
  };
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "image/jpeg": [".jpeg", ".png"] },
    validator: (files) => {
      if (files.size > 8000000) {
        return {
          code: "File Too Large",
          message: "File size is too large. Max limit is 8MB.",
        };
      }
    },
  });

  useEffect(() => {
    const validateImageSize = async (src) => {
      let image: any = await addImageProcess(src);
      let error;
      if (image.width < 230 || image.height < 345) {
        error = {
          code: "Incorrect Dimensions",
          message: "Images must be greater than or equal to 230x345px",
        };
      } else if (Math.abs(image.width / image.height - 2 / 3) > 0.01) {
        error = {
          code: "Incorrect Dimensions",
          message: "Images must have correct aspect ratio of 2:3",
        };
      }
      if (error) {
        setError(error);
      }
    };
    if (acceptedFiles) {
      acceptedFiles.forEach(async (files) => {
        await validateImageSize(file.preview);
      });
    }
  }, [acceptedFiles, file]);

  useEffect(() => {
    if (fileRejections.length > 0) {
      fileRejections.forEach((file) => {
        setError({
          code: file.errors[0].code,
          message: file.errors[0].message,
        });
      });
    }
  }, [fileRejections]);

  return (
    <Box w="full">
      <Text fontSize="md" mb={2}>
        Upload Image
      </Text>

      <Box
        {...getRootProps()}
        border="3px dashed"
        p={3}
        borderRadius="xl"
        alignItems="center"
        cursor="pointer"
        mb={3}
      >
        {/* @ts-ignore */}
        <Input {...getInputProps()} />
        <Text>
          Drag &apos;n&apos; drop some files here, or click to select files
        </Text>
      </Box>
      {fileRejections.length == 0 && file && error.message == "" ? (
        <Box display="flex" alignItems="center" flexDirection="column">
          <Text p={3}>{file.name}</Text>
          <Image
            src={file.preview}
            alt={file.name}
            minW={file.width}
            minH={file.height}
          />
        </Box>
      ) : (
        <Text>{error.message}</Text>
      )}
    </Box>
  );
};

export default ImageDropZone;
