import { FC } from "react";

type CalculateCaloriesProps = {
  isLoading: boolean;
};

export const CalculateCalories: FC<CalculateCaloriesProps> = (props: CalculateCaloriesProps) => {
  return (
    <div>
      <h1>Calculate Calories</h1>
      {props.isLoading ? <h1>Loading...</h1> : <h1>Done</h1>}
    </div>
  );
}
