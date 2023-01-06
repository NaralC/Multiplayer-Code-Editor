import { FC } from "react";
import { IOutputBox } from "../constants/interfaces";

const OutputBox: FC<IOutputBox> = ({ description, memory, stdout, time }) => {
  return (
    <div className="mockup-code w-full h-56 bg-slate-800 rounded-md text-white font-normal text-xs md:text-xl lg:text-2xl overflow-y-auto p-5">
      <div className="mb-5">
        <pre data-prefix="$">
          <code>{description}</code>
        </pre>
        <pre data-prefix=">" className="text-yellow-500">
          <code>{memory}</code>
        </pre>
        <pre data-prefix=">" className="text-red-500">
          <code>{time}</code>
        </pre>
      </div>
      <div className="text-green-500">{stdout}</div>
    </div>
  );
};

export default OutputBox;
