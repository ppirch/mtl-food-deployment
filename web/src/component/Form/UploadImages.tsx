import { Box, Typography } from "@mui/material";
import { ChangeEvent, useContext, useState } from "react";
import { ImageContext } from "../../context/ImageContext";

export const UploadImage = () => {
  const { beforeImage, afterImage, setBeforeImage, setAfterImage } = useContext(ImageContext);
  function handleChange(e: ChangeEvent<HTMLInputElement>, type: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'before') {
      setBeforeImage(file);
    } else {
      setAfterImage(file);
    }
  }
  return (
    <Box>
      <h1>Upload Images</h1>
      <Typography>
        Before eating
      </Typography>
      <input type="file" onChange={e => handleChange(e, 'before')} />
      <img src={beforeImage ? URL.createObjectURL(beforeImage) : ''} width={100} />
      <Typography>
        After eating
      </Typography>
      <input type="file" onChange={e => handleChange(e, 'after')} />
      <img src={afterImage ? URL.createObjectURL(afterImage) : ''} width={100} />
    </Box>
  );
}