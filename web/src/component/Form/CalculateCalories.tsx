import { Box, CircularProgress, Typography } from "@mui/material";
import { FC } from "react";

type CalculateCaloriesProps = {
  isLoading: boolean;
};

export const CalculateCalories: FC<CalculateCaloriesProps> = (props: CalculateCaloriesProps) => {
  return (
    <Box >
      <Typography variant="h4">
        Calculate Calories
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {props.isLoading ?
          (
            <>
              <CircularProgress color="secondary" size={50} thickness={4} />
              <Box sx={{ display: 'block' }}>
                <Typography variant="h6">
                  Calculating...
                </Typography>
              </Box>

            </>
          ) :
          (
            <>
              <Typography variant="h6">
                Done
              </Typography>
            </>
          )}
      </Box>
    </Box>
  );
}
