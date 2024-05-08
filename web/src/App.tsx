import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, FormControl } from '@mui/material';
import { CalculateCalories, GetResults, UploadImage } from './components/Form';

const getStepContent = (step: number) => {
  switch (step) {
    case 0:
      return <CalculateCalories />;
    case 1:
      return <GetResults />;
    case 2:
      return <UploadImage />;
  }
}

export default function App() {
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Food2Calories
        </Typography>
        <Box sx={{ bgcolor: 'gray', padding: 2 }}>
          <FormControl fullWidth>
            {getStepContent(activeStep)}
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
                onClick={() => setActiveStep(activeStep + 1)}
                sx={{ visibility: activeStep < 2 ? 'visible' : 'hidden' }}
              >
                Next
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Box >
    </Container >
  );
}
