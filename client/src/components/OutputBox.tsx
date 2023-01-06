import { FC } from "react";
import { IOutputBox } from "../constants/interfaces";

const OutputBox: FC<IOutputBox> = ({ description, memory, stdout, time }) => {
  return (
    <div>
      <div>{description}</div>
      <div>{memory}</div>
      <div>{stdout}</div>
      <div>{time}</div>
    </div>
  );
};

export default OutputBox;
