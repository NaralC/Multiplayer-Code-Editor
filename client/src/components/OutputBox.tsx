import { FC, useEffect, useRef } from "react";
import { IOutputBox } from "../constants/interfaces";

const OutputBox: FC<IOutputBox> = ({
  description,
  memory,
  stdout,
  time,
}) => {

  return (
    <div className="mockup-code w-full bg-slate-800 rounded-md duration-150 text-white font-normal text-xs md:text-xl lg:text-2xl overflow-y-auto p-5 h-full">
      <div className="mb-5">
        <pre data-prefix="$">
          <code>Status: {description}</code>
        </pre>
        <pre data-prefix=">" className="text-yellow-500">
          <code>Memory: {memory}</code>
        </pre>
        <pre data-prefix=">" className="text-red-500">
          <code>Time: {time}</code>
        </pre>
      </div>
      <div className="text-green-500">
        {stdout ? window.atob(stdout) : "No output"}
      </div>
    </div>
  );
};

export default OutputBox;