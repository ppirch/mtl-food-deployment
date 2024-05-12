import { FC, createContext, useState } from "react";

export type ImageContextType = {
  beforeImage: File | undefined;
  afterImage: File | undefined;
  setBeforeImage: (image: File) => void;
  setAfterImage: (image: File) => void;
}

const defaultImageContext: ImageContextType = {
  beforeImage: undefined,
  afterImage: undefined,
  setBeforeImage: () => { },
  setAfterImage: () => { },
}

export const ImageContext = createContext<ImageContextType>(defaultImageContext);

const ImageProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [beforeImage, setBeforeImage] = useState<File | undefined>(undefined);
  const [afterImage, setAfterImage] = useState<File | undefined>(undefined);

  return (
    <ImageContext.Provider value={{ beforeImage, afterImage, setBeforeImage, setAfterImage }}>
      {children}
    </ImageContext.Provider>
  );
}

export default ImageProvider;