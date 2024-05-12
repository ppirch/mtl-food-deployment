import { useContext, useState } from 'react';
import { Container, Typography, Box, Button, FormControl, Stepper, Step, StepLabel, Dialog, DialogTitle, DialogContent, Alert } from '@mui/material';

import { CalculateCalories, GetResults, UploadImage } from './component/Form';
import { grey } from '@mui/material/colors';
import { ImageContext, ImageContextType } from './context/ImageContext';

async function CallAPI(
  ImageContext: ImageContextType,
  setLoading: (isLoading: boolean) => void,
  setResults: (results: any) => void
) {
  const { beforeImage, afterImage } = ImageContext;
  const formData = new FormData();
  formData.append('before_image', beforeImage || '');
  formData.append('after_image', afterImage || '');

  setLoading(true);
  try {
    const response = await fetch('http://localhost:8765/predict', {
      method: 'POST',
      headers: {
        'accept': 'application/json'
      },
      body: formData
    });
    const data = await response.json();
    setResults(data);
    setLoading(false);
  }
  catch (error) {
    console.log('error', error);
    setLoading(false);
  }
}

function handleNext(
  setActiveStep: (step: number) => void,
  activeStep: number,
  ImageContext: ImageContextType,
  setError: (isError: boolean) => void,
  setLoading: (isLoading: boolean) => void,
  setResults: (results: any) => void
) {
  if (activeStep === 0) {
    if (!ImageContext.beforeImage || !ImageContext.afterImage) {
      setError(true);
      return;
    }
    setError(false);
    CallAPI(ImageContext, setLoading, setResults);
  }
  setActiveStep(activeStep + 1);
}

const getStepContent = (step: number, isLoading: boolean, results: any) => {
  switch (step) {
    case 0:
      return <UploadImage />;
    case 1:
      return <CalculateCalories isLoading={isLoading} />;
    case 2:
      return <GetResults results={results} />;
  }
}

const steps = ['Upload Image', 'Calculate Calories', 'Get Results'];

export default function App() {
  const ImgContextValue = useContext(ImageContext);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [results, setResults] = useState<any>({});
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Container sx={{ minHeight: '100vh', bgcolor: grey[100], display: 'flex', justifyContent: 'center' }}>
      <Container maxWidth="sm" sx={{ bgcolor: 'white' }}>

        <Box sx={{ my: 4 }}>
          <Typography sx={{ mb: 2 }}>
            Food2Calories
          </Typography>
          <Box sx={{ padding: 2 }}>
            <Stepper
              id="desktop-stepper"
              activeStep={activeStep}
              sx={{
                width: '100%',
                height: 40,
              }}
            >
              {steps.map((label) => (
                <Step
                  sx={{
                    ':first-child': { pl: 0 },
                    ':last-child': { pr: 0 },
                  }}
                  key={label}
                >
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {isError && <Alert severity="error">Please upload both images</Alert>}
            <FormControl fullWidth>
              {getStepContent(activeStep, isLoading, results)}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setActiveStep(activeStep - 1)}
                  sx={{ visibility: activeStep > 0 ? 'visible' : 'hidden' }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleNext(
                    setActiveStep,
                    activeStep,
                    ImgContextValue,
                    setIsError,
                    setIsLoading,
                    setResults
                  )}
                  disabled={isLoading}
                  sx={{ visibility: activeStep < 2 ? 'visible' : 'hidden' }}
                >
                  Next
                </Button>
              </Box>
            </FormControl>
          </Box>
        </Box >
      </Container >
    </Container>
  );
}
