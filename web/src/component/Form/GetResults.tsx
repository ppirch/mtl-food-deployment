import { Box, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { FC } from "react";

type GetResultsProps = {
  results: any;
};

const DisplayTable = (props: any) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '160px' }}>Food</TableCell>
            <TableCell>Weight</TableCell>
            <TableCell>Calories</TableCell>
            <TableCell>Protein</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.foods.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.food}</TableCell>
              <TableCell>{item.weight.toFixed(2)}</TableCell>
              <TableCell>{item.calories.toFixed(2)}</TableCell>
              <TableCell>{item.protein.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export const GetResults: FC<GetResultsProps> = (props: GetResultsProps) => {
  const results = props.results;
  return (
    <Box>
      <Typography variant="h4">
        Get Results
      </Typography>
      <Typography variant="h5" gutterBottom>
        Before
      </Typography>
      <DisplayTable foods={results.before} />
      <Typography variant="h5" gutterBottom>
        After
      </Typography>
      <DisplayTable foods={results.after} />
      <Typography variant="h5" gutterBottom>
        Consume
      </Typography>
      <Typography variant="body1">
        {`Consume: ${props.results.consume.toFixed(2)} calories.`}
      </Typography>
    </Box >
  );
}
