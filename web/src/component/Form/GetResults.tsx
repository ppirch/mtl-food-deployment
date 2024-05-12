import { FC } from "react";

type GetResultsProps = {
  results: any;
};

export const GetResults: FC<GetResultsProps> = (props: GetResultsProps) => {
  return (
    <div>
      <h1>Get Results</h1>
      <pre>{JSON.stringify(props.results, null, 4)}</pre>
    </div>
  );
}
